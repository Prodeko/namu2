import { cva } from "class-variance-authority";
import { headers } from "next/headers";
import { type ReactNode } from "react";

import { verifyAuthentication } from "@/auth/middleware";
import { LoggedinHeader } from "@/components/ui/Header/LoggedinHeader";

const styles = cva("relative flex min-h-screen flex-col bg-white", {
  variants: {
    maxHeightViewPort: {
      true: "max-h-screen",
    },
  },
});

interface Props {
  children: ReactNode;
}

const LoggedinLayout = async ({ children }: Props) => {
  await verifyAuthentication();
  const currentUrl = headers().get("next-url");
  return (
    <main
      className={styles({ maxHeightViewPort: currentUrl?.startsWith("/wish") })}
    >
      <LoggedinHeader />
      {children}
    </main>
  );
};

export default LoggedinLayout;
