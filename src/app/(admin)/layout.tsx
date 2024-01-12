import { ReactNode } from "react";

import { AdminSidebar } from "@/components/ui/AdminSidebar";
import { AdminHeader } from "@/components/ui/Header/AdminHeader";

interface Props {
  children: ReactNode;
}

const Home = ({ children }: Props) => {
  return (
    <main className="flex max-h-screen min-h-screen flex-col bg-neutral-50">
      <AdminHeader />
      <div className="flex min-h-0 w-full flex-1">
        <AdminSidebar />
        <div className="flex h-full min-h-0 w-full flex-1 justify-center pt-12">
          {children}
        </div>
      </div>
    </main>
  );
};

export default Home;
