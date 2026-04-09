import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Financing",
  description:
    "Financing options for Tires+ in Chico, CA. Flexible payment solutions for tire and auto repair services.",
  alternates: {
    canonical: "/financing",
  },
  openGraph: {
    title: "Financing | Tires+ Chico, CA",
    description:
      "Explore financing options for tire service and auto repair at Tires+ in Chico, CA.",
    url: "/financing",
    images: [
      {
        url: "/images/frontshot.jpg",
        alt: "Tires+ exterior in Chico, CA",
      },
    ],
  },
};

export default function FinancingPage() {
  return (
    <>
      <section className="relative py-24 overflow-hidden">
        <Image src="/images/frontshot.jpg" alt="Tires+ front view" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-brand-dark/85" />
        <div className="relative max-w-6xl mx-auto px-4">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">Payment Options</span>
          <h1 className="text-4xl font-black mt-2 mb-3 text-white">Financing</h1>
          <p className="text-brand-muted max-w-xl text-lg">
            Financing details are coming soon. This page is ready and will be updated with your
            official links and terms.
          </p>
        </div>
      </section>

      <section className="py-16 bg-brand-blue/18 border-y border-brand-blue/20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-brand-surface/80 rounded-2xl border border-brand-dark/20 shadow-lg p-8">
            <h2 className="text-2xl font-black text-brand-ink mb-4">Financing Coming Soon</h2>
            <p className="text-brand-dark/80 leading-relaxed mb-4">
              We&apos;re preparing financing information for tire replacement, mechanic work, and
              larger repair jobs.
            </p>
            <p className="text-brand-dark/80 leading-relaxed">
              For now, call{" "}
              <a href="tel:5303428338" className="text-brand-red font-bold hover:underline">
                530-342-8338
              </a>{" "}
              and we can discuss current payment options.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-dark border-t border-brand-red/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Link
            href="/contact"
            className="inline-flex bg-brand-red hover:bg-brand-red-hover transition-colors text-white font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide shadow"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
