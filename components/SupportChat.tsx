"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AppIcon from "@/components/AppIcon";
import { containDialogFocus } from "@/components/dialog-focus";
import { CONTACT } from "@/lib/site";
import type { ChatMessage, ChatSource } from "@/lib/assistant";
import styles from "./SupportChat.module.css";

type Message = ChatMessage & { id: string; sources?: ChatSource[] };
const AUTO_OPEN_DELAY = 30_000;
const AUTO_OPEN_SESSION_KEY = "gri-assistant-shown";
const suggestions = ["İlk akvaryumumu nasıl kurarım?", "Akvaryum suyu neden bulanır?", "Filtre seçerken nelere bakmalıyım?"];
const welcome: Message = {
  id: "welcome", role: "assistant",
  content: "Merhaba, ben Gri Asistan. Akvaryum kurulumu, bakım ve ekipman seçimi hakkında yardımcı olabilirim. Neyi merak ediyorsunuz?",
};

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const shownRef = useRef(false);
  const manualOpenRef = useRef(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(AUTO_OPEN_SESSION_KEY)) return;
    } catch { /* Keep the widget usable when browser storage is unavailable. */ }
    let visibleTime = 0;
    const timer = window.setInterval(() => {
      if (shownRef.current) {
        window.clearInterval(timer);
        return;
      }
      if (document.hidden) return;
      visibleTime += 1000;
      if (visibleTime < AUTO_OPEN_DELAY) return;
      // Wait until another dialog or the visitor's typing has finished.
      if (document.querySelector("dialog[open]") || document.activeElement?.matches("input, textarea, select, [contenteditable='true']")) return;
      window.clearInterval(timer);
      setOpen(true);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    shownRef.current = true;
    try { sessionStorage.setItem(AUTO_OPEN_SESSION_KEY, "1"); } catch { /* In-memory protection still prevents reopening. */ }
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    // Automatic opening must not summon the mobile keyboard.
    if (manualOpenRef.current) inputRef.current?.focus();
    else dialog?.querySelector<HTMLButtonElement>("button")?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const latest = log.querySelector<HTMLElement>("[data-chat-message]:last-of-type");
    log.scrollTop = busy || error ? log.scrollHeight : messages.length === 1 ? 0 : Math.max(0, (latest?.offsetTop ?? 0) - 16);
  }, [messages, busy, error, open]);

  useEffect(() => () => requestRef.current?.abort(), []);

  function close() {
    dialogRef.current?.close();
    setOpen(false);
    launcherRef.current?.focus();
  }

  function reset() {
    requestRef.current?.abort();
    requestRef.current = null;
    setBusy(false);
    setError("");
    setMessages([welcome]);
    setDraft("");
    inputRef.current?.focus();
  }

  async function send(text: string, retry = false) {
    if (requestRef.current || (!retry && !text.trim())) return;
    const controller = new AbortController();
    requestRef.current = controller;
    const next: Message[] = retry ? messages : [
      // Replace a failed question when the visitor edits it instead of retrying.
      ...(messages.at(-1)?.role === "user" ? messages.slice(0, -1) : messages),
      { id: crypto.randomUUID(), role: "user", content: text.trim() },
    ];
    setMessages(next);
    setDraft("");
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/asistan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter(item => item.id !== "welcome").slice(-11).map(({ role, content }) => ({ role, content })) }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(35000)]),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Yanıt alınamadı. Lütfen tekrar deneyin.");
      if (typeof data.text !== "string" || !data.text.trim()) throw new Error("Yanıt alınamadı. Lütfen tekrar deneyin.");
      if (controller.signal.aborted) return;
      setMessages([...next, { id: crypto.randomUUID(), role: "assistant", content: data.text, sources: data.sources }]);
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error && cause.name !== "TimeoutError" ? cause.message : "Yanıt gecikti. Lütfen tekrar deneyin.");
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        setBusy(false);
      }
    }
  }

  return (
    <aside aria-label="Akvaryum asistanı">
      <button ref={launcherRef} type="button" className={styles.launcher} onClick={() => { manualOpenRef.current = true; setOpen(true); }} aria-haspopup="dialog" aria-expanded={open} aria-controls="store-assistant">
        <AppIcon name="message" size={21} /> Uzmana sor
      </button>
      <dialog ref={dialogRef} id="store-assistant" className={styles.panel} aria-labelledby="assistant-title" onCancel={(event) => { event.preventDefault(); close(); }} onClose={() => setOpen(false)} onKeyDown={containDialogFocus} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <span className={styles.avatar}><AppIcon name="fish" size={26} /></span>
            <div><h2 id="assistant-title">Gri Asistan</h2><p>Yapay zekâ destekli akvaryum rehberiniz</p></div>
            <button type="button" onClick={close} aria-label="Sohbeti kapat"><AppIcon name="close" size={20} /></button>
          </header>
          <div className={styles.toolbar}>
            <span>Akvaryumunuz için buradayız.</span>
            <button type="button" onClick={reset}>Yeni sohbet</button>
          </div>
          <div ref={logRef} className={styles.messages} role="log" aria-label="Sohbet mesajları" aria-live="polite" aria-relevant="additions">
            {messages.map(message => (
              <div key={message.id} data-chat-message className={message.role === "user" ? styles.userMessage : styles.assistantMessage}>
                <span className={styles.sender}>{message.role === "user" ? "Siz" : "Gri Asistan"}</span>
                <p>{message.content}</p>
                {!!message.sources?.length && (
                  <div className={styles.sources}>
                    <span>İlgili rehberler</span>
                    {message.sources.map(source => <Link key={source.href} href={source.href} onClick={close}><AppIcon name="book" size={15} />{source.title}</Link>)}
                  </div>
                )}
              </div>
            ))}
            {messages.length === 1 && <div className={styles.suggestions}>{suggestions.map(question => <button type="button" key={question} onClick={() => void send(question)}>{question}<span aria-hidden="true">↗</span></button>)}</div>}
            {busy && <p className={styles.status} role="status"><span className={styles.dots} aria-hidden="true">•••</span> Yanıt hazırlanıyor…</p>}
            {error && <div className={styles.error} role="alert"><p>{error}</p><button type="button" onClick={() => void send("", true)}>Tekrar dene</button></div>}
          </div>
          <div className={styles.handoff}><AppIcon name="message" size={16} /><span>Ekibimizle görüşmek ister misiniz?</span><a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></div>
          <form className={styles.composer} onSubmit={(event) => { event.preventDefault(); void send(draft); }}>
            <label className="sr-only" htmlFor="assistant-message">Mesajınız</label>
            <textarea ref={inputRef} id="assistant-message" value={draft} onChange={event => setDraft(event.target.value)} maxLength={1000} rows={2} placeholder="Akvaryumunuz hakkında bir soru sorun…" onKeyDown={event => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(draft); }
            }} />
            <button type="submit" disabled={busy || !draft.trim()} aria-label="Mesajı gönder"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 4 7 7M12 4l-7 7M12 4v16" /></svg></button>
          </form>
          <p className={styles.note}>Yanıtlar yapay zekâ tarafından oluşturulur. Kişisel bilgi paylaşmayın.</p>
        </div>
      </dialog>
    </aside>
  );
}
