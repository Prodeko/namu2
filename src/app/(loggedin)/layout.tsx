import { type ReactNode } from "react";

import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import { Logo } from "@/components/ui/Logo";
import { NavBar } from "@/components/ui/Navbar";

interface Props {
  children: ReactNode;
}

const LoggedinLayout = ({ children }: Props) => {
  return (
    <main className="bg-primary-200 relative flex min-h-screen flex-col">
      <Header LeftComponent={<Logo />} RightComponent={<NavBar />} />
      {children}
      <Footer />
    </main>
  );
};

export default LoggedinLayout;
