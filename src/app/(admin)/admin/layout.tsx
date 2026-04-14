import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getAppSession } from "@/auth/session";
import { AdminSidebar } from "@/components/ui/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAppSession();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    redirect("/login");
  }
  const isSuperadmin = role === "SUPERADMIN";

  return (
    <div className="relative flex w-full flex-1 flex-col-reverse overflow-hidden landscape:flex-row">
      <AdminSidebar superadmin={isSuperadmin} />
      <div className="flex h-full min-h-0 w-full flex-1 justify-center overflow-y-scroll py-6">
        {children}
      </div>
    </div>
  );
}
