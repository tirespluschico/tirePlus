import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import HeroSlideshow from "@/components/HeroSlideshow";

const highlights = [
  {
    icon: "🔧",
    title: "Expert Mechanics",
    desc: "Certified technicians with years of hands-on experience on all makes and models.",
  },
  {
    icon: "🛞",
    title: "All Tire Brands",
    desc: "We carry Michelin, General Tire, and all major brands at competitive prices.",
  },
  {
    icon: "⚡",
    title: "Fast Turnaround",
    desc: "Most services completed same day. We respect your time.",
  },
  {
    icon: "💲",
    title: "Honest Pricing",
    desc: "Free estimates, no hidden fees. You approve before we work.",
  },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "Tires+ Complete Auto Service",
  image: ["/images/tireplusfront.jpg"],
  telephone: "+1-530-342-8338",
  email: "contact@tirespluschico.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "624 Broadway St",
    addressLocality: "Chico",
    addressRegion: "CA",
    addressCountry: "US",
  },
  areaServed: "Chico, CA",
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "13:00",
    },
  ],
};

export const metadata: Metadata = {
  title: "Tire & Auto Repair",
  description:
    "Tires+ in Chico, CA offers tire installation, flat repair, brakes, alignments, oil changes, and trusted auto repair. Call 530-342-8338.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tires+ Chico, CA | Tire & Auto Repair Shop",
    description:
      "Trusted local tire and auto repair in Chico, CA. Fast turnaround, honest pricing, and major tire brands.",
    url: "/",
    images: [
      {
        url: "/images/tireplusfront.jpg",
        alt: "Tires+ shop exterior in Chico, CA",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {/* Hero */}
      <section className="relative min-h-[620px] flex items-center">
        <Image
          src="/images/tireplusfront.jpg"
          alt="Tires+ shop exterior"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/70 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 py-28 flex flex-col items-start gap-6">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
            Tires+ Complete Auto Service
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight max-w-2xl text-white">
            Get Back on the Road —{" "}
            <span className="text-brand-red">Fast.</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-lg leading-relaxed">
            From simple tire replacement and wheel services to complete engine and transmission
            work, we handle both tires and full mechanic repairs. Quality service at prices you
            can trust. Call{" "}
            <a href="tel:5303428338" className="text-white font-semibold hover:text-brand-red transition-colors">
              530-342-8338
            </a>.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              href="/contact"
              className="bg-brand-red hover:bg-brand-red-hover transition-colors text-white font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide shadow-lg"
            >
              Book an Appointment
            </Link>
            <Link
              href="/services"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-colors text-white font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Hours Banner */}
      <section className="bg-brand-blue text-white py-3 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-sm font-semibold text-center">
          <span>Mon–Fri: 8am – 5pm</span>
          <span className="hidden sm:block opacity-40">|</span>
          <span>Saturday: 9am – 1pm</span>
          <span className="hidden sm:block opacity-40">|</span>
          <span>Sunday: Closed</span>
          <span className="hidden sm:block opacity-40">|</span>
          <a href="tel:5303428338" className="underline hover:no-underline">530-342-8338</a>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-brand-dark border-y border-brand-red/15">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">Why Us</span>
            <h2 className="text-3xl font-black mt-2 text-white">
              Why Choose <span className="text-brand-muted">Tires+</span>?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="group border border-white/10 bg-brand-blue/35 rounded-2xl p-6 hover:shadow-xl hover:border-brand-red/40 transition-all text-center flex flex-col items-center gap-3"
              >
                <span className="text-4xl">{icon}</span>
                <h3 className="font-bold text-lg text-white">{title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo strip */}
      <section className="py-8 sm:py-10">
        <div className="max-w-3xl mx-auto px-2 sm:px-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-brand-dark shadow-xl">
            <HeroSlideshow />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-dark py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white">Ready to Schedule?</h2>
          <p className="text-brand-muted leading-relaxed max-w-xl">
            Don&apos;t wait until a small problem becomes a big expense. Contact us for a free estimate.
          </p>
          <Link
            href="/contact"
            className="bg-brand-red hover:bg-brand-red-hover transition-colors text-white font-bold px-10 py-3 rounded-full text-sm uppercase tracking-wide shadow-lg"
          >
            Get a Free Estimate
          </Link>
        </div>
      </section>
    </>
  );
}
