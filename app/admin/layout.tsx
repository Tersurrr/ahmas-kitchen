import type { Metadata } from "next";

// Admin responses use a unique Content Security Policy nonce and therefore
// must never reuse statically cached HTML containing an older nonce.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Amahs Kitchen Admin Portal",
  },
  description: "Secure staff administration for Amahs Kitchen.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
