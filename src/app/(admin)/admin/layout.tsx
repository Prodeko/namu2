import type { ReactNode } from "react";

import { getSession } from "@/auth/ironsession";
import { AdminSidebar } from "@/components/ui/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  const isSuperadmin = session?.user?.role === "SUPERADMIN";

  return (
    <div className="relative flex min-h-0 w-full flex-1 ">
      <AdminSidebar superadmin={isSuperadmin} />
      <div className="flex h-full min-h-0 w-full flex-1 justify-center overflow-y-scroll pt-6">
        {children}
      </div>
    </div>
  );
}
