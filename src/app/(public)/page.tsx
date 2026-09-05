import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import HeroSlideshow from "@/components/HeroSlideshow";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import AdasPopup from "@/components/AdasPopup";

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

const adasTriggers = [
  "Wheel alignment",
  "Windshield replacement",
  "Suspension or steering work",
  "Any collision repair",
  "New tires that change ride height",
];

const adasSystems = [
  "Automatic emergency braking",
  "Lane keep assist",
  "Blind spot monitoring",
  "Adaptive cruise control",
  "Backup & surround cameras",
  "Parking sensors",
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "Tires+ Complete Auto Service",
  alternateName: ["Tires Plus Chico", "Tires Plus Complete Auto Service"],
  description:
    "Best tire shop and mechanic shop in Chico, CA. Tire sales and installation, brakes, alignments, oil changes, car A/C repair, and full auto repair.",
  image: ["/images/tireplusfront.jpg"],
  telephone: "+1-530-342-8338",
  email: "contact@tirespluschico.com",
  sameAs: [
    "https://www.instagram.com/tirespluschico_/",
    "https://www.facebook.com/profile.php?id=61578532622757",
  ],
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
      opens: "08:30",
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
  title: "Best Tire Shop & Mechanic in Chico, CA",
  description:
    "Tires Plus (Tires+) in Chico, CA — one of the best tire shops and mechanic shops in town. Tire installation, brakes, alignments, oil changes, and car A/C repair. Call 530-342-8338.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tires Plus Chico, CA | Best Tire Shop & Mechanic in Chico",
    description:
      "Best tire shop and mechanic in Chico, CA. Fast turnaround, honest pricing, major tire brands, and car A/C repair.",
    url: "/",
    images: [
      {
        url: "/images/tireplusfront.jpg",
        alt: "Tires Plus shop exterior in Chico, CA",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <AdasPopup />
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
            One of the best tire shops and mechanic shops in Chico, CA. From tire replacement
            and wheel services to brakes, alignments, car A/C repair, and complete engine and
            transmission work — we handle it all. Quality service at prices you can trust. Call{" "}
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
          <span>Mon–Fri: 8:30am – 5pm</span>
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

      {/* ADAS Calibration */}
      <section className="relative overflow-hidden bg-brand-ink py-20 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-32 h-[34rem] w-[34rem] rounded-full bg-brand-red/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-48 -left-40 h-[30rem] w-[30rem] rounded-full bg-brand-blue/30 blur-3xl"
        />

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-start">
            {/* Left: the pitch */}
            <div className="flex flex-col items-start gap-6">
              <span className="inline-flex items-center gap-2 bg-brand-red text-white text-[11px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-brand-red/30">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                New in Chico
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.12] text-white">
                An alignment or a new windshield can throw off{" "}
                <span className="text-brand-red">your car&apos;s safety cameras.</span>
              </h2>

              <p className="text-brand-muted text-lg leading-relaxed max-w-xl">
                Lane keep, blind spot warning, and automatic braking all run on cameras and radar
                sensors. When those sensors get knocked out of aim, they don&apos;t shut off — they
                keep working off the wrong picture, usually without a warning light. Most shops send
                you to a dealership to get them recalibrated.{" "}
                <strong className="text-white font-semibold">We&apos;re one of the few shops in Chico that does it in-house.</strong>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl">
                {[
                  { big: "1 visit", small: "Done with your alignment" },
                  { big: "No dealer", small: "Skip the markup and the wait" },
                  { big: "On paper", small: "Documented to OEM spec" },
                ].map(({ big, small }) => (
                  <div
                    key={big}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4"
                  >
                    <div className="text-white font-black text-xl">{big}</div>
                    <div className="text-brand-muted text-xs leading-snug mt-1">{small}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <Link
                  href="/services/adas"
                  className="bg-brand-red hover:bg-brand-red-hover transition-colors text-white font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide shadow-lg"
                >
                  See How It Works
                </Link>
                <a
                  href="tel:5303428338"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-colors text-white font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide"
                >
                  Call 530-342-8338
                </a>
              </div>
            </div>

            {/* Right: the specifics */}
            <div className="w-full flex flex-col gap-5">
              <div className="rounded-2xl border border-brand-red/30 bg-brand-dark/60 p-6">
                <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4">
                  You need it after
                </h3>
                <ul className="flex flex-col gap-3">
                  {adasTriggers.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-brand-muted text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-brand-dark/40 p-6">
                <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4">
                  Systems we calibrate
                </h3>
                <div className="flex flex-wrap gap-2">
                  {adasSystems.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-brand-muted text-xs font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-brand-muted/70 text-xs leading-relaxed mt-5">
                  Not sure if your vehicle has these? Give us a call with your year, make, and
                  model — we&apos;ll tell you straight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-8 items-start lg:items-stretch lg:auto-rows-fr">
          <div className="order-1 min-h-[50px] lg:min-h-[420px]">
            <ReviewsCarousel />
          </div>
          <div className="order-2 min-h-[50px] lg:min-h-[420px]">
            <div className="relative aspect-[16/10] lg:h-full lg:aspect-auto overflow-hidden rounded-[2rem] border border-white/15 bg-brand-dark shadow-xl">
              <HeroSlideshow />
            </div>
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
