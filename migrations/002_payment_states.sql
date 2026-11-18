-- Apply before deploying checkout changes to STORAGE_BACKEND=relational.
-- Compatible with existing rows; does not change payment or order evidence.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
ALTER TABLE app_security.orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE app_security.orders ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('beklemede', 'odendi', 'basarisiz', 'kontrol'));
COMMIT;
