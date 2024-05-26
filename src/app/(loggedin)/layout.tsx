import { type ReactNode } from "react";

import { verifyAuthentication } from "@/auth/middleware";
import { LoggedinHeader } from "@/components/ui/Header/LoggedinHeader";

interface Props {
  children: ReactNode;
}

const LoggedinLayout = async ({ children }: Props) => {
  await verifyAuthentication();
  return (
    <main className="relative flex max-h-screen min-h-screen flex-col bg-white">
      <LoggedinHeader />
      {children}
    </main>
  );
};

export default LoggedinLayout;
