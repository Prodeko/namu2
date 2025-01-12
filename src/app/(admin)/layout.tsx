import { ReactNode } from "react";

import { AdminHeader } from "@/components/ui/Header/AdminHeader";

interface Props {
  children: ReactNode;
}

const Home = ({ children }: Props) => {
  return (
    <main className="flex h-dvh flex-col bg-neutral-50">
      <AdminHeader />
      {children}
    </main>
  );
};

export default Home;
