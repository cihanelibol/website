"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { registerAction, type AuthState } from "@/app/hesap/actions";

/* ---------------- Alan doğrulayıcıları ---------------- */

function normalizePhone(raw: string): string {
  const digits = raw.replace(/[\s()\-+]/g, "").replace(/^90(?=5)/, "");
  return digits.startsWith("5") ? `0${digits}` : digits;
}

const validators: Record<string, (v: string) => string | null> = {
  name: (v) => {
    const t = v.trim();
    if (!t) return "Ad Soyad zorunludur.";
    if (!/^\S{2,}(\s+\S{2,})+$/.test(t))
      return "Adınızı ve soyadınızı birlikte girin.";
    return null;
  },
  email: (v) => {
    const t = v.trim();
    if (!t) return "E-posta zorunludur.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t))
      return "Geçerli bir e-posta adresi girin.";
    return null;
  },
  phone: (v) => {
    if (!v.trim()) return "Cep telefonu zorunludur.";
    if (!/^05\d{9}$/.test(normalizePhone(v)))
      return "Geçerli bir cep telefonu girin (05XX XXX XX XX).";
    return null;
  },
  password: (v) => {
    if (!v) return "Parola zorunludur.";
    if (v.length < 6) return "Parola en az 6 karakter olmalı.";
    return null;
  },
};

const FIELDS = ["name", "email", "phone", "password"] as const;
type FieldName = (typeof FIELDS)[number];

const fieldMeta: Record<
  FieldName,
  { label: string; type: string; placeholder: string; autoComplete: string }
> = {
  name: {
    label: "Ad Soyad",
    type: "text",
    placeholder: "Adınız Soyadınız",
    autoComplete: "name",
  },
  email: {
    label: "E-posta",
    type: "email",
    placeholder: "ornek@eposta.com",
    autoComplete: "email",
  },
  phone: {
    label: "Cep Telefonu",
    type: "tel",
    placeholder: "05XX XXX XX XX",
    autoComplete: "tel",
  },
  password: {
    label: "Parola",
    type: "password",
    placeholder: "En az 6 karakter",
    autoComplete: "new-password",
  },
};

const baseInput =
  "w-full rounded-xl border bg-cyan-400/5 px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted";

export default function KayitForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    registerAction,
    {}
  );

  const [values, setValues] = useState<Record<FieldName, string>>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [legal, setLegal] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => {
    const e: Record<string, string | null> = {};
    for (const f of FIELDS) e[f] = validators[f](values[f]);
    e.legal = legal
      ? null
      : "Devam etmek için sözleşmeleri onaylamanız gerekir.";
    return e;
  }, [values, legal]);

  const hasErrors = Object.values(errors).some(Boolean);

  const onSubmit = (e: React.FormEvent) => {
    if (hasErrors) {
      e.preventDefault();
      // Tüm alanları "dokunulmuş" işaretle ki hatalar görünsün
      setTouched({ name: true, email: true, phone: true, password: true, legal: true });
    }
  };

  const inputClass = (field: FieldName) => {
    if (touched[field] && errors[field])
      return `${baseInput} border-red-400/60 focus:border-red-400`;
    if (touched[field] && !errors[field])
      return `${baseInput} border-teal-400/50 focus:border-teal-400`;
    return `${baseInput} border-cyan-400/15 focus:border-cyan-400/50`;
  };

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="space-y-4">
      {FIELDS.map((field) => {
        const meta = fieldMeta[field];
        const showError = touched[field] && errors[field];
        const showValid = touched[field] && !errors[field];
        return (
          <div key={field}>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              {meta.label} <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <input
                name={field}
                type={meta.type}
                inputMode={field === "phone" ? "tel" : undefined}
                autoComplete={meta.autoComplete}
                placeholder={meta.placeholder}
                value={values[field]}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [field]: e.target.value }))
                }
                onBlur={() => setTouched((t) => ({ ...t, [field]: true }))}
                aria-invalid={Boolean(showError)}
                className={inputClass(field)}
              />
              {showValid && (
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-teal-400">
                  ✓
                </span>
              )}
            </div>
            {showError && (
              <p className="mt-1.5 text-xs text-red-400">⚠ {errors[field]}</p>
            )}
          </div>
        );
      })}

      {/* Yasal onaylar */}
      <div className="space-y-3 border-t border-cyan-400/10 pt-4">
        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-muted">
            <input
              type="checkbox"
              name="legal"
              checked={legal}
              onChange={(e) => {
                setLegal(e.target.checked);
                setTouched((t) => ({ ...t, legal: true }));
              }}
              className={`mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-cyan-400 ${
                touched.legal && errors.legal ? "outline outline-1 outline-red-400" : ""
              }`}
            />
            <span>
              <Link
                href="/sozlesme/uyelik-sozlesmesi"
                target="_blank"
                className="font-semibold text-cyan-300 underline-offset-2 hover:underline"
              >
                Üyelik Sözleşmesi
              </Link>
              &apos;ni okudum ve kabul ediyorum;{" "}
              <Link
                href="/sozlesme/kvkk-aydinlatma"
                target="_blank"
                className="font-semibold text-cyan-300 underline-offset-2 hover:underline"
              >
                KVKK Aydınlatma Metni
              </Link>
              &apos;ni okudum. <span className="text-amber-400">*</span>
            </span>
          </label>
          {touched.legal && errors.legal && (
            <p className="mt-1.5 pl-6 text-xs text-red-400">⚠ {errors.legal}</p>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-muted">
          <input
            type="checkbox"
            name="marketing"
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-cyan-400"
          />
          <span>
            Kampanya ve indirimlerden e-posta, SMS ve telefon ile haberdar olmak
            istiyorum.{" "}
            <Link
              href="/sozlesme/ticari-ileti"
              target="_blank"
              className="font-semibold text-cyan-300 underline-offset-2 hover:underline"
            >
              Ticari Elektronik İleti Onay Metni
            </Link>{" "}
            (isteğe bağlı)
          </span>
        </label>
      </div>

      {state.error && <p className="text-sm text-amber-400">⚠ {state.error}</p>}

      <button
        disabled={pending}
        className="glow w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3.5 font-semibold text-slate-950 transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {pending ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
      </button>

      <p className="text-center text-sm text-muted">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="font-semibold text-cyan-300 hover:text-cyan-200">
          Giriş Yapın
        </Link>
      </p>
    </form>
  );
}
