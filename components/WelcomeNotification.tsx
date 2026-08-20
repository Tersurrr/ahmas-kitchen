"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "amahs-kitchen-welcome-seen";

export default function WelcomeNotification() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let shouldOpen = false;
    try {
      shouldOpen = !window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage can be unavailable in private browsing; the notice still remains dismissible.
      shouldOpen = true;
    }

    if (!shouldOpen) return;

    setOpen(true);
    setVisible(true);

    const fadeTimer = window.setTimeout(() => setVisible(false), 4000);
    const closeTimer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // The notice can still close when storage is unavailable.
      }
      setOpen(false);
    }, 4400);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(closeTimer);
    };
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
      className={`fixed z-[60] bottom-24 right-4 w-[calc(100%-2rem)] max-w-sm rounded-xl border border-secondary/30 bg-white p-5 shadow-modal transition-all duration-[400ms] ease-out md:bottom-6 ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
    >
      <button onClick={dismiss} aria-label="Dismiss welcome message" className="absolute right-3 top-3 rounded-full p-1 text-lg leading-none text-on-surface-variant hover:bg-surface-container">
        ×
      </button>
      <h2 className="font-display pr-7 text-xl font-bold text-primary">Welcome to Amahs Kitchen</h2>
      <p className="mt-3 text-sm leading-6 text-on-surface-variant">Click Menu to view our full menu</p>
      <p className="mt-1 text-sm leading-6 text-on-surface-variant">For special orders or custom catering requests, please contact us on WhatsApp</p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={dismiss}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-dark"
        >
          Okay
        </button>
      </div>
    </aside>
  );
}
