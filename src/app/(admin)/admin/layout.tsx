import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/ui/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 w-full flex-1">
      <AdminSidebar />
      <div className="flex h-full min-h-0 w-full flex-1 justify-center pt-12">
        {children}
      </div>
    </div>
  );
}
