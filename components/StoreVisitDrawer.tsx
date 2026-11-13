"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AppIcon from "@/components/AppIcon";
import { containDialogFocus } from "@/components/dialog-focus";
import { CONTACT } from "@/lib/site";
import styles from "./StoreVisitDrawer.module.css";

export default function StoreVisitDrawer() {
  const [phase, setPhase] = useState<"closed" | "open" | "closing">("closed");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const visible = phase !== "closed";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !visible) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  function close() {
    setPhase("closing");
  }

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-controls="store-visit-dialog"
        aria-expanded={visible}
        onClick={() => setPhase("open")}
      >
        <AppIcon name="pin" size={20} />
        <span>Mağazamız</span>
        <span aria-hidden="true">›</span>
      </button>
      <dialog
        ref={dialogRef}
        id="store-visit-dialog"
        className={styles.drawer}
        data-closing={phase === "closing"}
        aria-labelledby="store-visit-title"
        onKeyDown={containDialogFocus}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => setPhase("closed")}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right ||
              event.clientY < bounds.top || event.clientY > bounds.bottom) close();
        }}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && phase === "closing") {
            setPhase("closed");
          }
        }}
      >
        <div className={styles.header}>
          <span><AppIcon name="pin" size={20} /> Gri Akvaryum</span>
          <button type="button" className={styles.close} onClick={close} aria-label="Mağaza panelini kapat">
            <AppIcon name="close" size={22} />
          </button>
        </div>
        <div className={styles.content}>
          <h2 id="store-visit-title">Eminönü’nde akvaryum, balık ve ekipman mağazası</h2>
          <address>{CONTACT.address}</address>
          <p className={styles.hours}><AppIcon name="clock" size={20} />{CONTACT.hours}</p>
          <Link href="/magaza/eminonu" className={styles.visit} onClick={close}>
            Gri Akvaryum’u ziyaret edin <span aria-hidden="true">→</span>
          </Link>
        </div>
      </dialog>
    </>
  );
}
