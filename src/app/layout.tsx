import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Realtor Editor Pro — Your footage in, scroll-stopping videos out.",
  description: "Upload your home footage, get 3 professionally edited videos back automatically. Built for realtors who want to post every single day.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
