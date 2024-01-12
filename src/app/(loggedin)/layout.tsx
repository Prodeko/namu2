"use client";

import { cva } from "class-variance-authority";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

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

const LoggedinLayout = ({ children }: Props) => {
  const pathName = usePathname();
  return (
    <main
      className={styles({ maxHeightViewPort: pathName.startsWith("/wish") })}
    >
      <LoggedinHeader />
      {children}
    </main>
  );
};

export default LoggedinLayout;
