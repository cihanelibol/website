-- Run transactionally with the migration owner, never the application role.
CREATE SCHEMA IF NOT EXISTS app_security;
REVOKE ALL ON SCHEMA app_security FROM PUBLIC;

CREATE TABLE app_security.revisions (
  key text PRIMARY KEY CHECK (key IN ('users.json', 'orders.json')),
  revision bigint NOT NULL DEFAULT 0 CHECK (revision >= 0)
);
INSERT INTO app_security.revisions(key) VALUES ('users.json'), ('orders.json');
CREATE TABLE app_security.settings (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  active boolean NOT NULL DEFAULT false,
  schema_version integer NOT NULL DEFAULT 1 CHECK (schema_version = 1)
);
INSERT INTO app_security.settings DEFAULT VALUES;

CREATE TABLE app_security.users (
  data jsonb NOT NULL CHECK (jsonb_typeof(data) = 'object'),
  id text GENERATED ALWAYS AS (data->>'id') STORED PRIMARY KEY CHECK (id ~ '^[a-f0-9]{24}$'),
  email text GENERATED ALWAYS AS (data->>'email') STORED NOT NULL UNIQUE
    CHECK (email = lower(btrim(email)) AND length(email) BETWEEN 3 AND 254 AND position('@' in email) > 1),
  role text GENERATED ALWAYS AS (coalesce(data->>'role', 'customer')) STORED NOT NULL CHECK (role IN ('customer','admin')),
  CHECK (NOT (data ?| ARRAY['sessions','tokens','googleSub'])),
  CHECK (data ? 'passwordHash' AND jsonb_typeof(data->'passwordHash') = 'string'),
  CHECK (coalesce((data->>'authVersion')::bigint, 0) >= 0)
);
CREATE TABLE app_security.identities (
  user_id text PRIMARY KEY REFERENCES app_security.users(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'google' CHECK (provider = 'google'),
  subject text NOT NULL CHECK (length(subject) BETWEEN 1 AND 255),
  UNIQUE(provider, subject)
);
CREATE TABLE app_security.sessions (
  user_id text NOT NULL REFERENCES app_security.users(id) ON DELETE CASCADE,
  data jsonb NOT NULL CHECK (jsonb_typeof(data) = 'object'),
  hash text GENERATED ALWAYS AS (data->>'hash') STORED PRIMARY KEY CHECK (hash ~ '^[a-f0-9]{64}$'),
  expires bigint GENERATED ALWAYS AS ((data->>'expires')::bigint) STORED NOT NULL CHECK (expires > 0),
  created bigint GENERATED ALWAYS AS ((data->>'created')::bigint) STORED NOT NULL,
  CHECK ((data->>'created')::bigint > 0 AND (data->>'created')::bigint < (data->>'expires')::bigint)
);
CREATE INDEX ON app_security.sessions(user_id);
CREATE INDEX ON app_security.sessions(expires);
CREATE TABLE app_security.account_tokens (
  user_id text NOT NULL REFERENCES app_security.users(id) ON DELETE CASCADE,
  data jsonb NOT NULL CHECK (jsonb_typeof(data) = 'object'),
  hash text GENERATED ALWAYS AS (data->>'hash') STORED PRIMARY KEY CHECK (hash ~ '^[a-f0-9]{64}$'),
  purpose text GENERATED ALWAYS AS (data->>'purpose') STORED NOT NULL CHECK (purpose IN ('verify','reset')),
  expires bigint GENERATED ALWAYS AS ((data->>'expires')::bigint) STORED NOT NULL CHECK (expires > 0)
);
CREATE INDEX ON app_security.account_tokens(user_id);
CREATE TABLE app_security.orders (
  data jsonb NOT NULL CHECK (jsonb_typeof(data) = 'object'),
  id text GENERATED ALWAYS AS (data->>'id') STORED PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 40),
  user_id text GENERATED ALWAYS AS (data->>'userId') STORED REFERENCES app_security.users(id) ON DELETE RESTRICT,
  request_key text GENERATED ALWAYS AS (data->>'requestKey') STORED UNIQUE,
  amount numeric(12,2) GENERATED ALWAYS AS ((data->>'total')::numeric) STORED NOT NULL CHECK (amount > 0 AND amount <= 1000000),
  status text GENERATED ALWAYS AS (coalesce(data->>'status', 'yeni')) STORED NOT NULL
    CHECK (status IN ('yeni','onaylandi','hazirlaniyor','kargoda','teslim-edildi','iptal')),
  payment_status text GENERATED ALWAYS AS (data->>'paymentStatus') STORED NOT NULL CHECK (payment_status IN ('beklemede','odendi')),
  CHECK (data ? 'items' AND jsonb_typeof(data->'items') = 'array'),
  CHECK (NOT data ? 'submission' OR data->>'submission' IN ('pending','sent','unknown'))
);
CREATE INDEX ON app_security.orders(user_id);

CREATE FUNCTION app_security.user_document(uid text) RETURNS jsonb
LANGUAGE sql STABLE SET search_path = pg_catalog, app_security, pg_temp AS $$
  SELECT u.data || jsonb_build_object(
    'sessions', coalesce((SELECT jsonb_agg(s.data ORDER BY s.created, s.hash) FROM app_security.sessions s WHERE s.user_id=u.id), '[]'::jsonb),
    'tokens', coalesce((SELECT jsonb_agg(t.data ORDER BY t.hash) FROM app_security.account_tokens t WHERE t.user_id=u.id), '[]'::jsonb)
  ) || coalesce((SELECT jsonb_build_object('googleSub', i.subject) FROM app_security.identities i WHERE i.user_id=u.id), '{}'::jsonb)
  FROM app_security.users u WHERE u.id=uid
$$;

CREATE FUNCTION app_security.read_collection(collection text) RETURNS TABLE(data jsonb, revision text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, app_security, pg_temp AS $$
  SELECT CASE collection
    WHEN 'users.json' THEN coalesce((SELECT jsonb_agg(app_security.user_document(u.id) ORDER BY u.id) FROM app_security.users u), '[]'::jsonb)
    WHEN 'orders.json' THEN coalesce((SELECT jsonb_agg(o.data ORDER BY o.id) FROM app_security.orders o), '[]'::jsonb)
  END, r.revision::text FROM app_security.revisions r WHERE r.key=collection
$$;

CREATE FUNCTION app_security.write_collection(collection text, expected bigint, replacement jsonb, importing boolean)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, app_security, pg_temp AS $$
DECLARE current_revision bigint; item jsonb; uid text; old_role text; old_document jsonb;
BEGIN
  IF jsonb_typeof(replacement) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Collection must be an array'; END IF;
  SELECT r.revision INTO current_revision FROM app_security.revisions r WHERE r.key=collection FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Unsupported collection'; END IF;
  IF current_revision <> expected THEN RETURN false; END IF;
  IF (SELECT count(DISTINCT x->>'id') FROM jsonb_array_elements(replacement) x) <> jsonb_array_length(replacement)
    THEN RAISE EXCEPTION 'Missing or duplicate record ID'; END IF;
  IF collection='users.json' THEN
    IF EXISTS (SELECT 1 FROM app_security.users u WHERE NOT EXISTS (SELECT 1 FROM jsonb_array_elements(replacement) x WHERE x->>'id'=u.id))
      THEN RAISE EXCEPTION 'Account deletion requires an operator workflow'; END IF;
    FOR item IN SELECT value FROM jsonb_array_elements(replacement) LOOP
      uid := item->>'id';
      SELECT u.role, app_security.user_document(u.id) INTO old_role, old_document FROM app_security.users u WHERE u.id=uid;
      IF NOT importing AND coalesce(item->>'role','customer') IS DISTINCT FROM coalesce(old_role,'customer')
        THEN RAISE EXCEPTION 'Application cannot assign roles'; END IF;
      IF old_document IS NOT DISTINCT FROM item THEN CONTINUE; END IF;
      INSERT INTO app_security.users(data) VALUES (item - ARRAY['sessions','tokens','googleSub'])
        ON CONFLICT(id) DO UPDATE SET data=excluded.data;
      DELETE FROM app_security.identities WHERE user_id=uid;
      IF item->>'googleSub' IS NOT NULL THEN INSERT INTO app_security.identities(user_id,subject) VALUES(uid,item->>'googleSub'); END IF;
      DELETE FROM app_security.sessions WHERE user_id=uid;
      INSERT INTO app_security.sessions(user_id,data) SELECT uid,value FROM jsonb_array_elements(coalesce(item->'sessions','[]'::jsonb));
      DELETE FROM app_security.account_tokens WHERE user_id=uid;
      INSERT INTO app_security.account_tokens(user_id,data) SELECT uid,value FROM jsonb_array_elements(coalesce(item->'tokens','[]'::jsonb));
    END LOOP;
  ELSE
    IF EXISTS (SELECT 1 FROM app_security.orders o WHERE NOT EXISTS (SELECT 1 FROM jsonb_array_elements(replacement) x WHERE x->>'id'=o.id))
      THEN RAISE EXCEPTION 'Order deletion requires an operator workflow'; END IF;
    INSERT INTO app_security.orders(data) SELECT value FROM jsonb_array_elements(replacement)
      ON CONFLICT(id) DO UPDATE SET data=excluded.data WHERE app_security.orders.data IS DISTINCT FROM excluded.data;
  END IF;
  UPDATE app_security.revisions SET revision=revision+1 WHERE key=collection;
  RETURN true;
END $$;

CREATE FUNCTION app_security.replace_collection(collection text, expected bigint, replacement jsonb) RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = pg_catalog, app_security, pg_temp AS $$
  SELECT app_security.write_collection(collection,expected,replacement,false)
$$;

CREATE FUNCTION app_security.reject_legacy_core_write() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, app_security, pg_temp AS $$
BEGIN
  IF (NEW.key IN ('users.json','orders.json') OR OLD.key IN ('users.json','orders.json')) AND (SELECT active FROM app_security.settings)
    THEN RAISE EXCEPTION 'Legacy core writes are disabled after relational cutover'; END IF;
  RETURN coalesce(NEW,OLD);
END $$;
CREATE TRIGGER protect_migrated_core BEFORE INSERT OR UPDATE OR DELETE ON public.json_store
FOR EACH ROW EXECUTE FUNCTION app_security.reject_legacy_core_write();

REVOKE ALL ON ALL TABLES IN SCHEMA app_security FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA app_security FROM PUBLIC;
-- Runtime receives only USAGE plus read_collection/replace_collection EXECUTE.
-- write_collection(importing=true) and table access stay migration-owner-only.
