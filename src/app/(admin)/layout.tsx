import { ReactNode } from "react";

import { AdminSidebar } from "@/components/ui/AdminSidebar";
import { AdminHeader } from "@/components/ui/Header/AdminHeader";

interface Props {
  children: ReactNode;
}

const Home = ({ children }: Props) => {
  return (
    <main className="flex min-h-screen flex-col justify-between bg-neutral-50">
      <AdminHeader />
      <div className="flex h-full w-full flex-1">
        <AdminSidebar />
        <div className="flex h-full w-full flex-1">
          <div className="md:px-18 flex w-full flex-1 items-center justify-center px-12 pt-10 lg:px-20">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
