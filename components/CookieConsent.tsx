"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { hasSeenCookieNotice, dismissCookieNotice } from "@/lib/cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasSeenCookieNotice()) setVisible(true);
  }, []);

  function dismiss() {
    dismissCookieNotice();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      role="status"
      aria-label="Cookie notice"
      aria-describedby="cookie-notice-description"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-outline-variant/30 bg-white p-5 shadow-modal md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-xl md:border"
    >
      <h2 className="font-display text-base font-bold text-primary">Cookie Notice</h2>
      <p id="cookie-notice-description" className="mt-2 text-sm leading-6 text-on-surface-variant">
        This site uses cookies and local storage to keep your cart working and to remember your
        site preferences. See our{" "}
        <Link href="/privacy" className="font-medium text-secondary hover:underline">
          Privacy Policy
        </Link>{" "}
        for details.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={dismiss}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-dark"
        >
          Got it
        </button>
      </div>
    </aside>
  );
}
