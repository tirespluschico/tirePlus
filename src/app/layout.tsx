import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
