import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ADAS Calibration",
  description:
    "ADAS calibration in Chico, CA. Lane keep, blind spot, and automatic braking sensors recalibrated in-house — no dealership trip. Call 530-342-8338.",
  alternates: {
    canonical: "/services/adas",
  },
  openGraph: {
    title: "ADAS Calibration in Chico, CA | Tires Plus",
    description:
      "One of the few shops in Chico calibrating ADAS safety systems in-house. Done in the same visit as your alignment, documented to manufacturer spec.",
    url: "/services/adas",
    images: [
      {
        url: "/images/sidebuilding.jpg",
        alt: "Tires+ service bays in Chico, CA",
      },
    ],
  },
};

const systems = [
  {
    icon: "🛑",
    title: "Automatic Emergency Braking",
    desc: "Forward-facing radar and camera that stop the car when you don't.",
  },
  {
    icon: "🛣️",
    title: "Lane Keep & Lane Departure",
    desc: "The windshield camera that reads lane lines and nudges you back.",
  },
  {
    icon: "👁️",
    title: "Blind Spot Monitoring",
    desc: "Rear corner radar behind the bumper that watches the lane beside you.",
  },
  {
    icon: "🎯",
    title: "Adaptive Cruise Control",
    desc: "Front radar that holds your following distance in traffic.",
  },
  {
    icon: "📹",
    title: "Backup & Surround Cameras",
    desc: "Rear and 360° cameras, including the guide lines you steer by.",
  },
  {
    icon: "📡",
    title: "Parking Sensors",
    desc: "The proximity sensors that judge distance when you're squeezing in.",
  },
];

const triggers = [
  {
    title: "Wheel alignment",
    desc: "Changing the thrust angle moves where the car thinks straight ahead is.",
  },
  {
    title: "Windshield replacement",
    desc: "The forward camera mounts to the glass. New glass means a new aim.",
  },
  {
    title: "Suspension or steering work",
    desc: "New struts, springs, or control arms change ride height and sensor angle.",
  },
  {
    title: "Collision repair",
    desc: "Bumper, grille, and mirror work disturbs the radar and cameras behind them.",
  },
  {
    title: "New tires or a lift/lowering kit",
    desc: "A different ride height points every sensor somewhere new.",
  },
];

const steps = [
  {
    n: "01",
    title: "We look up your vehicle",
    desc: "Year, make, and model tell us exactly which systems your car has and what the manufacturer requires.",
  },
  {
    n: "02",
    title: "We align first",
    desc: "Calibration is measured against the car's real thrust line, so the alignment has to be right before anything else.",
  },
  {
    n: "03",
    title: "Lasers place the targets",
    desc: "Our equipment projects each target position on the floor and confirms placement with cameras — no strings, no tape measures, no guessing.",
  },
  {
    n: "04",
    title: "You get the paperwork",
    desc: "A printout showing every calibration performed and confirmed to manufacturer spec — for your records, your insurer, and the next owner.",
  },
];

const faqs = [
  {
    q: "How do I know if my car has ADAS?",
    a: "If it warns you about cars in your blind spot, keeps you centered in your lane, brakes on its own, or holds distance on cruise control, it has ADAS. Most vehicles from roughly 2018 on have at least one of these. Call us with your year, make, and model and we'll tell you for certain.",
  },
  {
    q: "Why can't I just skip it?",
    a: "A sensor that's off by a fraction of a degree is aimed several feet wide of where it should be by the time it's looking down the road. The system still turns on, still shows no warning light in many vehicles, and still makes decisions — just based on the wrong picture.",
  },
  {
    q: "Do I have to go to the dealership?",
    a: "No. That's the point. Most shops in the area don't have the equipment and send you to a dealer for a separate appointment. We calibrate in-house, in the same visit as your alignment.",
  },
  {
    q: "How long does it take?",
    a: "Most calibrations add well under an hour to the job, depending on how many systems your vehicle has. We'll give you a straight answer before we start.",
  },
  {
    q: "Will I get proof it was done?",
    a: "Yes. Every calibration comes with a printed report showing the procedure followed and the placement confirmed, plus your before and after alignment results.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "ADAS Calibration",
  name: "ADAS Calibration in Chico, CA",
  description:
    "Advanced driver assistance system (ADAS) calibration for cameras and radar sensors, performed in-house alongside wheel alignment.",
  areaServed: "Chico, CA",
  provider: {
    "@type": "AutoRepair",
    name: "Tires+ Complete Auto Service",
    telephone: "+1-530-342-8338",
    address: {
      "@type": "PostalAddress",
      streetAddress: "624 Broadway St",
      addressLocality: "Chico",
      addressRegion: "CA",
      addressCountry: "US",
    },
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
    { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
    {
      "@type": "ListItem",
      position: 3,
      name: "ADAS Calibration",
      item: `${siteUrl}/services/adas`,
    },
  ],
};

export default function AdasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-ink py-24 sm:py-32">
        <Image
          src="/images/sidebuilding.jpg"
          alt="Tires+ service bays in Chico"
          fill
          priority
          className="object-cover object-center opacity-20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-32 h-[34rem] w-[34rem] rounded-full bg-brand-red/25 blur-3xl"
        />

        <div className="relative max-w-6xl mx-auto px-4 flex flex-col items-start gap-6">
          <nav aria-label="Breadcrumb" className="text-xs text-brand-muted/80">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2 opacity-50">/</span>
            <Link href="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <span className="mx-2 opacity-50">/</span>
            <span className="text-white">ADAS Calibration</span>
          </nav>

          <span className="inline-flex items-center gap-2 bg-brand-red text-white text-[11px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-brand-red/30">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            New in Chico
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.12] text-white max-w-3xl">
            An alignment or a new windshield can throw off{" "}
            <span className="text-brand-red">your car&apos;s safety cameras.</span>
          </h1>

          <p className="text-brand-muted text-lg leading-relaxed max-w-2xl">
            The cameras and radar behind your windshield and bumpers are what make lane keep, blind
            spot warning, and automatic braking work. They have to be aimed to the manufacturer&apos;s
            spec, and ordinary repair work moves them out of it. Most shops send you to a dealership
            to have them recalibrated. We&apos;re one of the few shops in Chico that does it in-house.
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              href="/contact"
              className="bg-brand-red hover:bg-brand-red-hover transition-colors text-white font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide shadow-lg"
            >
              Book an Appointment
            </Link>
            <a
              href="tel:5303428338"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-colors text-white font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide"
            >
              Call 530-342-8338
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mt-6">
            {[
              { big: "One visit", small: "Calibrated alongside your alignment" },
              { big: "No dealer trip", small: "No second appointment, no dealer markup" },
              { big: "On paper", small: "Documented to manufacturer spec" },
            ].map(({ big, small }) => (
              <div key={big} className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4">
                <div className="text-white font-black text-xl">{big}</div>
                <div className="text-brand-muted text-xs leading-snug mt-1">{small}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is ADAS */}
      <section className="py-20 bg-brand-blue/18 border-y border-brand-blue/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
              What We Calibrate
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 mb-4 text-brand-ink">
              You probably have more of these than you think
            </h2>
            <p className="text-brand-dark leading-relaxed">
              ADAS stands for Advanced Driver Assistance Systems. It&apos;s the catch-all name for
              the cameras and radar that help your car see. Most vehicles from about 2018 onward have
              at least one — and every one of them has to be aimed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {systems.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-brand-surface/80 rounded-2xl border border-brand-dark/20 hover:shadow-xl hover:border-brand-red/30 transition-all p-6 flex flex-col gap-3"
              >
                <span className="text-3xl">{icon}</span>
                <h3 className="font-bold text-lg text-brand-ink">{title}</h3>
                <p className="text-brand-dark text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When you need it */}
      <section className="py-20 bg-brand-dark border-b border-brand-red/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
              When You Need It
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 mb-4 text-white">
              Ordinary repairs knock them out of aim
            </h2>
            <p className="text-brand-muted leading-relaxed">
              It doesn&apos;t take a crash. Most of what puts a sensor out of spec is routine work
              you&apos;d never connect to a safety system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {triggers.map(({ title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-brand-blue/25 p-6 flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-brand-red" />
                  <h3 className="font-bold text-white">{title}</h3>
                </div>
                <p className="text-brand-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 mb-4 text-brand-ink">
              No strings. No guesswork. Just lasers.
            </h2>
            <p className="text-brand-dark leading-relaxed">
              The old way of aiming ADAS targets involved strings, plumb bobs, and tape measures.
              Ours projects the target position with lasers and confirms it with cameras before
              anything gets calibrated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map(({ n, title, desc }) => (
              <div
                key={n}
                className="relative rounded-2xl border border-brand-dark/20 bg-brand-surface/70 p-6 flex flex-col gap-3"
              >
                <span className="text-brand-red font-black text-3xl leading-none">{n}</span>
                <h3 className="font-bold text-brand-ink">{title}</h3>
                <p className="text-brand-dark text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-brand-blue/18 border-y border-brand-blue/20">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-2 mb-8 text-brand-ink">
            Straight answers
          </h2>

          <div className="flex flex-col gap-3">
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="group bg-brand-surface/80 rounded-2xl border border-brand-dark/20 open:border-brand-red/40 transition-colors"
              >
                <summary className="cursor-pointer list-none px-6 py-5 flex items-center justify-between gap-4 font-bold text-brand-ink">
                  {q}
                  <span className="text-brand-red text-xl leading-none shrink-0 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="px-6 pb-5 -mt-1 text-brand-dark text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-dark py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Not sure if your car needs it?
          </h2>
          <p className="text-brand-muted leading-relaxed max-w-xl">
            Call with your year, make, and model. We&apos;ll tell you which systems your vehicle has
            and whether anything you&apos;ve had done recently put them out of spec — no charge for
            the answer.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="tel:5303428338"
              className="bg-brand-red hover:bg-brand-red-hover transition-colors text-white font-bold px-10 py-3 rounded-full text-sm uppercase tracking-wide shadow-lg"
            >
              Call 530-342-8338
            </a>
            <Link
              href="/contact"
              className="bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-white font-bold px-10 py-3 rounded-full text-sm uppercase tracking-wide"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
