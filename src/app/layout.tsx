import type { Metadata } from "next";
import { cookies } from "next/headers";

import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Namukilke",
  description: "Find delicacies with industrial quantities of sugar",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "max-h-screen min-h-screen bg-neutral-50 font-sans antialiased",
          fontSans.variable,
        )}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
