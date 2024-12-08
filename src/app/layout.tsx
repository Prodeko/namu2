import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";

import Providers from "@/app/providers";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Namukilke",
  description: "Find delicacies with industrial quantities of sugar",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  themeColor: "#fbcfe8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Accept-CH" content="Model" />
      </head>
      <body
        className={cn(
          "h-dvh bg-neutral-50 font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers>
          {children}
          <Toaster toastOptions={{ duration: 3000, position: "top-center" }} />
        </Providers>
      </body>
    </html>
  );
}
