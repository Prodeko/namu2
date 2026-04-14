import { type ReactNode } from "react";

import { getAppSession } from "@/auth/session";
import { LoggedinHeader } from "@/components/ui/Header/LoggedinHeader";

interface Props {
  children: ReactNode;
}

const LoggedinLayout = async ({ children }: Props) => {
  const session = await getAppSession();

  return (
    <main className="relative flex min-h-dvh flex-col items-center bg-neutral-50 ">
      <LoggedinHeader role={session?.user?.role} />
      {children}
    </main>
  );
};

export default LoggedinLayout;
