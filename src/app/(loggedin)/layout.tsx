import { type ReactNode } from "react";

import { LoggedinHeader } from "@/components/ui/Header/LoggedinHeader";

interface Props {
  children: ReactNode;
}

const LoggedinLayout = ({ children }: Props) => {
  return (
    <main className="relative flex min-h-screen flex-col bg-primary-200">
      <LoggedinHeader />
      {children}
    </main>
  );
};

export default LoggedinLayout;
