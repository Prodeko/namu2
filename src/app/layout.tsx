import { Inter } from "next/font/google"
import { cookies } from "next/headers"

import "@/styles/globals.css"
import { TRPCReactProvider } from "@/trpc/react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Namukilke",
  description: "Find delicacies with industrial quantities of sugar",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} min-h-screen`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  )
}
