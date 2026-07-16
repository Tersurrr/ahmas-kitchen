import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();

  // Only proxy.ts may designate the unprotected login route.
  if (requestHeaders.get("x-amahs-admin-login") === "1") return <>{children}</>;

  // Security remediation #3: independently revalidate identity and role in the server layout.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    requestHeaders.get("x-amahs-admin-protected") !== "1" ||
    user?.app_metadata?.role !== "admin"
  ) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
