import { ReactNode } from "react";

import { rerouteLoggedInUser } from "@/auth/middleware";
import { LoggedoutHeader } from "@/components/ui/Header/LoggedoutHeader";

interface Props {
  children: ReactNode;
}

const Home = async ({ children }: Props) => {
  await rerouteLoggedInUser("/shop");
  return (
    <main className="flex min-h-screen flex-col justify-between bg-primary-200">
      <LoggedoutHeader />
      {children}
    </main>
  );
};

export default Home;
