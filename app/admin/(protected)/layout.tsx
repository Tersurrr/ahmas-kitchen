import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.app_metadata?.role !== "admin") {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
