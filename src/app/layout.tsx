import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = "Tires+ Complete Auto Service";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tires+ Chico, CA | Tire & Auto Repair Shop",
    template: "%s | Tires+ Chico, CA",
  },
  description:
    "Tires+ Complete Auto Service in Chico, CA provides tire sales, tire repair, brakes, alignments, oil changes, and auto repair. Call 530-342-8338.",
  keywords: [
    "tire shop Chico CA",
    "auto repair Chico CA",
    "tire repair Chico",
    "brake service Chico",
    "wheel alignment Chico",
    "oil change Chico",
    "Tires+ Chico",
  ],
  applicationName: siteName,
  category: "Automotive",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: "Tires+ Chico, CA | Tire & Auto Repair Shop",
    description:
      "Local tire and auto repair in Chico, CA. Tires, flats, brakes, alignments, oil changes, and more. Call 530-342-8338.",
    images: [
      {
        url: "/images/tireplusfront.jpg",
        width: 1200,
        height: 900,
        alt: "Tires+ Complete Auto Service storefront in Chico, California",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tires+ Chico, CA | Tire & Auto Repair Shop",
    description:
      "Local tire and auto repair in Chico, CA. Call 530-342-8338 for service and estimates.",
    images: ["/images/tireplusfront.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
