"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      const retryAfter = Number(response.headers.get("Retry-After"));
      setError(
        response.status === 429 && Number.isFinite(retryAfter) && retryAfter > 0
          ? `Too many sign-in attempts. Please try again in ${Math.ceil(retryAfter / 60)} minute(s).`
          : result.error || "Unable to sign in. Please try again."
      );
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-container-low heritage-pattern">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-modal p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <ChefHat className="text-primary" size={26} />
          </div>
          <h1 className="font-display text-2xl font-bold text-primary">Admin Login</h1>
          <p className="text-sm text-on-surface-variant mt-1">Amahs kitchen Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
