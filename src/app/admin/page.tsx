import type { Metadata } from "next";
import { hasAdmin, isAuthenticated } from "@/lib/auth";
import { AdminGate } from "@/components/admin/gate";
import { AdminDashboard } from "@/components/admin/dashboard";

export const metadata: Metadata = {
  title: "Painel Administrativo",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const adminExists = await hasAdmin();

  if (!adminExists) {
    return <AdminGate mode="setup" />;
  }

  const authed = await isAuthenticated();
  if (!authed) {
    return <AdminGate mode="login" />;
  }

  return <AdminDashboard />;
}
