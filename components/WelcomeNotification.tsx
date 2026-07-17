"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

const STORAGE_KEY = "amahs-kitchen-welcome-seen";

export default function WelcomeNotification() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      // Storage can be unavailable in private browsing; the notice still remains dismissible.
      setOpen(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Do not prevent visitors from closing the notice when storage is unavailable.
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <aside
      role="status"
      aria-label="Welcome to Amahs Kitchen"
      className="fixed z-[60] bottom-24 right-4 w-[calc(100%-2rem)] max-w-sm rounded-xl border border-secondary/30 bg-white p-5 shadow-modal md:bottom-6"
    >
      <button onClick={dismiss} aria-label="Dismiss welcome message" className="absolute right-3 top-3 rounded-full p-1 text-lg leading-none text-on-surface-variant hover:bg-surface-container">
        ×
      </button>
      <h2 className="font-display pr-7 text-xl font-bold text-primary">Welcome to Amahs Kitchen</h2>
      <p className="mt-3 text-sm leading-6 text-on-surface-variant">Click Menu to view our full menu</p>
      <p className="mt-1 text-sm leading-6 text-on-surface-variant">For special orders or custom catering requests, please contact us on WhatsApp</p>
      <div className="mt-4 flex gap-3">
        <Link href="/menu" onClick={dismiss} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-dark">View menu</Link>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" onClick={dismiss} className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-surface-container-low">
          WhatsApp
        </a>
      </div>
    </aside>
  );
}
