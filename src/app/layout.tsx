import type { Metadata } from "next";

import { LoggedoutHeader } from "@/components/ui/Header/LoggedoutHeader";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

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
        <main className="flex min-h-screen flex-col justify-between bg-primary-200">
          <LoggedoutHeader />
          {children}
        </main>
      </body>
    </html>
  );
}
