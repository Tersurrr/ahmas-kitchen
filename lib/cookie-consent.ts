// Simple US-style cookie notice: we just track whether the visitor has
// acknowledged the notice. This is informational, not a consent/preference
// management system.
export const COOKIE_NOTICE_STORAGE_KEY = "amahs-kitchen-cookie-notice-seen";

export function hasSeenCookieNotice(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(COOKIE_NOTICE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function dismissCookieNotice() {
  try {
    window.localStorage.setItem(COOKIE_NOTICE_STORAGE_KEY, "true");
  } catch {
    // Storage can be unavailable in private browsing; the notice simply won't persist.
  }
}
