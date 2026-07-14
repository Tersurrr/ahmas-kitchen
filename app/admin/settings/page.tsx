"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Settings } from "@/lib/types";
import { UploadCloud } from "lucide-react";
import Image from "next/image";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saved, setSaved] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
      setSettings(data as Settings);
      setLoading(false);
    })();
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  async function handleLogoUpload(file: File | null) {
    if (!file || !settings) return;
    setUploadingLogo(true);
    const path = `logo-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("menu-images").upload(path, file, { upsert: false });
    if (!error) {
      const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
      update("logo_url", data.publicUrl);
    }
    setUploadingLogo(false);
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    await supabase.from("settings").update(settings).eq("id", 1);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <p className="text-sm text-on-surface-variant">Loading…</p>;
  if (!settings) return <p className="text-sm text-on-surface-variant">Settings not found.</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-primary mb-6">Settings</h1>

      <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
        <Field label="Business Name" value={settings.business_name} onChange={(v) => update("business_name", v)} />

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2 block">Logo</label>
          {settings.logo_url && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden mb-2 border border-outline-variant/30">
              <Image src={settings.logo_url} alt="Logo" fill sizes="80px" className="object-contain" />
            </div>
          )}
          <label className="flex items-center gap-2 justify-center border-2 border-dashed border-outline-variant rounded-lg py-4 cursor-pointer hover:bg-surface-container-low transition-colors text-sm text-on-surface-variant w-fit px-6">
            <UploadCloud size={16} />
            {uploadingLogo ? "Uploading…" : "Upload logo"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e.target.files?.[0] || null)} />
          </label>
        </div>

        <Field label="WhatsApp Number (digits only, with country code)" value={settings.whatsapp_number} onChange={(v) => update("whatsapp_number", v)} />
        <Field label="Email Address" value={settings.email} onChange={(v) => update("email", v)} />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary Color" value={settings.theme_primary} onChange={(v) => update("theme_primary", v)} type="color" />
          <Field label="Secondary Color" value={settings.theme_secondary} onChange={(v) => update("theme_secondary", v)} type="color" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Pickup Hours" value={settings.pickup_hours || ""} onChange={(v) => update("pickup_hours", v)} />
          <Field label="Delivery Hours" value={settings.delivery_hours || ""} onChange={(v) => update("delivery_hours", v)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Facebook URL" value={settings.facebook_url || ""} onChange={(v) => update("facebook_url", v)} />
          <Field label="Instagram URL" value={settings.instagram_url || ""} onChange={(v) => update("instagram_url", v)} />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
      />
    </div>
  );
}
