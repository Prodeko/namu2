import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/ui/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-0 w-full flex-1 ">
      <AdminSidebar />
      <div className="flex h-full min-h-0 w-full flex-1 justify-center overflow-y-scroll pt-6">
        {children}
      </div>
    </div>
  );
}
