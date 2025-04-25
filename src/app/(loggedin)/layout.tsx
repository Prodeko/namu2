import { type ReactNode } from "react";

import { LoggedinHeader } from "@/components/ui/Header/LoggedinHeader";

interface Props {
  children: ReactNode;
}

const LoggedinLayout = async ({ children }: Props) => {
  return (
    <main className="relative flex min-h-dvh flex-col items-center bg-neutral-50 ">
      <LoggedinHeader />
      {children}
    </main>
  );
};

export default LoggedinLayout;
