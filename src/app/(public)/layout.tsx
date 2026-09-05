import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = "Tires+ Complete Auto Service";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tires Plus Chico, CA | Best Tire Shop & Mechanic in Chico",
    template: "%s | Tires Plus Chico, CA",
  },
  description:
    "Tires Plus (Tires+) Complete Auto Service in Chico, CA — one of the best tire shops and mechanic shops in town. Tires, brakes, alignments, oil changes, car A/C repair, and full auto repair. Call 530-342-8338.",
  keywords: [
    "tire shop Chico CA",
    "best tire shop Chico",
    "best mechanic shop Chico",
    "auto repair Chico CA",
    "tire repair Chico",
    "brake service Chico",
    "wheel alignment Chico",
    "ADAS calibration Chico",
    "ADAS calibration Chico CA",
    "windshield camera calibration Chico",
    "blind spot sensor calibration Chico",
    "lane departure camera recalibration Chico",
    "oil change Chico",
    "car AC repair Chico",
    "car air conditioning repair Chico",
    "Tires Plus Chico",
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
    title: "Tires Plus Chico, CA | Best Tire Shop & Mechanic in Chico",
    description:
      "One of the best tire shops and mechanic shops in Chico, CA. Tires, brakes, alignments, oil changes, and car A/C repair. Call 530-342-8338.",
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
    title: "Tires Plus Chico, CA | Best Tire Shop & Mechanic in Chico",
    description:
      "Best tire shop and mechanic in Chico, CA. Tires, brakes, alignments, car A/C repair. Call 530-342-8338.",
    images: ["/images/tireplusfront.jpg"],
  },
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
