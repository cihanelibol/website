"use client";

import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import GirisForm from "@/app/giris/GirisForm";
import KayitForm from "@/app/kayit/KayitForm";
import AccountRecovery from "./AccountRecovery";
import styles from "./AuthShell.module.css";

export type AuthScreen = "login" | "register" | "recovery" | "verify";
const screens = {
  login: { title: "Giriş Yap", description: "Tekrar hoş geldiniz! Hesabınıza giriş yapın." },
  register: { title: "Kayıt Ol", description: "Ücretsiz hesap oluşturun. Üyelik olmadan da sipariş verebilirsiniz." },
  recovery: { title: "Parolamı unuttum", description: "E-posta adresinizi yazın, parola yenileme bağlantısını gönderelim." },
  verify: { title: "Hesap doğrulama", description: "E-postanızdaki bağlantıyla hesabınızı doğrulayın veya parolanızı yenileyin." },
};
const paths: Record<string, AuthScreen> = { "/giris": "login", "/kayit": "register", "/parola-yenile": "recovery", "/kimlik": "verify" };

export default function AuthPanel({ initialScreen, googleButton, error }: { initialScreen: AuthScreen; googleButton: ReactNode; error?: string }) {
  const [screen, setScreen] = useState(initialScreen);
  const heading = useRef<HTMLHeadingElement>(null);
  const changed = useRef(false);
  useEffect(() => {
    const onBack = () => { changed.current = true; setScreen(paths[window.location.pathname] ?? initialScreen); };
    window.addEventListener("popstate", onBack);
    return () => window.removeEventListener("popstate", onBack);
  }, [initialScreen]);
  useEffect(() => {
    if (!changed.current) return;
    heading.current?.focus({ preventScroll: true });
    const bounds = heading.current?.getBoundingClientRect();
    const visibleTop = document.querySelector(".store-header")?.getBoundingClientRect().bottom ?? 0;
    if (bounds && (bounds.top < visibleTop || bounds.bottom > window.innerHeight)) {
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    }
    document.title = `${screens[screen].title} | Gri Akvaryum`;
  }, [screen]);

  function navigate(event: MouseEvent<HTMLDivElement>) {
    // Keep native links for no-JS, new tabs and modified clicks. Ordinary auth
    // navigation changes only this panel, preserving the living aquarium.
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
    if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
    const url = new URL(anchor.href);
    const next = paths[url.pathname];
    if (url.origin !== window.location.origin || !next || url.hash || url.search || next === "verify") return;
    event.preventDefault();
    if (screen === next) return;
    window.history.pushState(null, "", url.pathname);
    changed.current = true;
    setScreen(next);
  }

  return <div onClickCapture={navigate} data-auth-screen={screen}>
    <div key={screen} className={styles.panel}>
      <h1 ref={heading} tabIndex={-1} id="auth-heading" className={styles.heading}>{screens[screen].title}</h1>
      <p className={styles.description}>{screens[screen].description}</p>
      {screen === "login" && error && <p role="alert" className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm text-amber-300">{error}</p>}
      {(screen === "login" || screen === "register") && googleButton}
      {screen === "login" ? <GirisForm /> : screen === "register" ? <KayitForm /> : <AccountRecovery consume={screen === "verify"} />}
    </div>
  </div>;
}
