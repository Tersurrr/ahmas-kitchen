import type { Metadata } from "next";

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
