import { ReactNode } from "react";

import { LoggedoutHeader } from "@/components/ui/Header/LoggedoutHeader";

interface Props {
  children: ReactNode;
}

const Home = ({ children }: Props) => {
  return (
    <main className="flex min-h-screen flex-col justify-between bg-primary-200">
      <LoggedoutHeader />
      {children}
    </main>
  );
};

export default Home;
