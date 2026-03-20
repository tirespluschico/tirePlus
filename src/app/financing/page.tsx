import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Financing",
  description:
    "Apply for Acima lease-to-own at Tires+ in Chico, CA. No credit needed and quick approval for tires and auto repair.",
  alternates: {
    canonical: "/financing",
  },
  openGraph: {
    title: "Financing | Tires+ Chico, CA",
    description:
      "Apply for Acima lease-to-own at Tires+ in Chico, CA. No credit needed and quick approval.",
    url: "/financing",
    images: [
      {
        url: "/images/frontshot.jpg",
        alt: "Tires+ exterior in Chico, CA",
      },
    ],
  },
};

const ACIMA_URL =
  "https://apply.acima.com/?app_id=lo&location_guid=loca-6b0826ff-f9fd-4964-8d1e-9ac35886e1ce&utm_medium=merchant&utm_source=web";

const benefits = [
  {
    icon: "✓",
    title: "No Credit Needed",
    desc: "Acima uses a quick, non-traditional approval process — most customers are approved regardless of credit history.",
  },
  {
    icon: "⚡",
    title: "Fast Approval",
    desc: "Get a quick decision. Apply online, in-store, or on your phone and be on your way the same day.",
  },
  {
    icon: "🔄",
    title: "Flexible Payments",
    desc: "Choose a payment schedule that works for you — weekly, bi-weekly, or monthly options available.",
  },
  {
    icon: "🛞",
    title: "Use It Today",
    desc: "Once approved, get your tires or service the same visit. Drive out the same day.",
  },
  {
    icon: "📱",
    title: "Easy Application",
    desc: "Apply from your smartphone in minutes. Just a few pieces of information and you're done.",
  },
  {
    icon: "🔓",
    title: "Early Purchase Option",
    desc: "Acima offers early purchase options, including a 90-day option in many states and a 3-month option in California. Terms vary by agreement.",
  },
];

const steps = [
  { num: "1", label: "Apply Online", detail: "Click the Apply Now button and fill out the short application." },
  { num: "2", label: "Get Approved", detail: "Receive a quick decision with your available lease amount." },
  { num: "3", label: "Come In", detail: "Show your approval at Tires+ and select your tires or service." },
  { num: "4", label: "Drive Away", detail: "We complete the work and you leave on the road — same day." },
];

export default function FinancingPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative py-28 overflow-hidden">
        <Image
          src="/images/frontshot.jpg"
          alt="Tires+ front view"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-brand-ink/88" />
        <div className="relative max-w-6xl mx-auto px-4">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
            Payment Options
          </span>
          <h1 className="text-5xl font-black mt-2 mb-4 text-white leading-tight">
            Financing Through&nbsp;Acima
          </h1>
          <p className="text-brand-muted max-w-2xl text-lg leading-relaxed mb-8">
            Don&apos;t let the cost of new tires or a repair hold you back. We
            partner with&nbsp;<strong className="text-white">Acima Leasing</strong> to
            offer fast, flexible lease-to-own options with no credit needed.
          </p>
          <a
            href={ACIMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover transition-colors text-white font-black px-10 py-4 rounded-full text-base uppercase tracking-wide shadow-lg"
          >
            Apply Now — It&apos;s Free
          </a>
        </div>
      </section>

      {/* ── What is Acima ── */}
      <section className="py-16 bg-white border-b border-brand-panel">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
            About Acima
          </span>
          <h2 className="text-3xl font-black text-brand-ink mt-2 mb-4">
            What Is Acima Leasing?
          </h2>
          <p className="text-brand-dark/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Acima is a leasing program that lets you get the tires and
            services you need today and pay over time. Instead of a traditional
            loan, Acima leases the items to you — giving you flexible payment
            options with no credit needed.
          </p>
          <p className="text-brand-dark/70 text-sm leading-7 max-w-2xl mx-auto mt-5">
            Acima also offers early purchase options. In many states this includes
            a 90-day early purchase option, and in California a 3-month purchase
            option may apply. See your lease agreement for full terms.
          </p>
        </div>
      </section>

      {/* ── Benefits Grid ── */}
      <section className="py-16 bg-brand-blue/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
              Why Choose Acima
            </span>
            <h2 className="text-3xl font-black text-brand-ink mt-2">
              Built for Real People
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-white rounded-2xl border border-brand-panel shadow-sm p-6 flex gap-4 items-start"
              >
                <div className="text-2xl mt-0.5 shrink-0">{b.icon}</div>
                <div>
                  <h3 className="font-black text-brand-ink text-base mb-1">{b.title}</h3>
                  <p className="text-brand-dark/70 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 bg-white border-y border-brand-panel">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
              Simple Process
            </span>
            <h2 className="text-3xl font-black text-brand-ink mt-2">
              How It Works
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 rounded-full bg-brand-red text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow">
                  {s.num}
                </div>
                <h3 className="font-black text-brand-ink text-base mb-1">{s.label}</h3>
                <p className="text-brand-dark/70 text-sm leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-brand-ink">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
            Get Started
          </span>
          <h2 className="text-4xl font-black text-white mt-2 mb-4">
            Ready to Apply?
          </h2>
          <p className="text-brand-muted text-lg mb-8 max-w-xl mx-auto">
            The application takes just a few minutes and won&apos;t impact your
            credit. Questions? Give us a call first — we&apos;re happy to walk
            you through it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={ACIMA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover transition-colors text-white font-black px-10 py-4 rounded-full text-base uppercase tracking-wide shadow-lg"
            >
              Apply Now with Acima
            </a>
            <a
              href="tel:5303428338"
              className="inline-flex items-center gap-2 border-2 border-brand-surface hover:border-white text-white font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wide transition-colors"
            >
              Call 530-342-8338
            </a>
          </div>
          <p className="text-brand-blue-light text-xs mt-6">
            Acima is a lease-to-own option, not a traditional loan. Subject to approval.
            Early purchase options vary by state and agreement. See Acima&apos;s site for
            full terms and conditions.
          </p>
        </div>
      </section>

      {/* ── Questions ── */}
      <section className="py-12 bg-brand-blue/10 border-t border-brand-panel">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-brand-dark font-medium mb-4">
            Have questions about the application or what services qualify?
          </p>
          <Link
            href="/contact"
            className="inline-flex bg-brand-dark hover:bg-brand-ink transition-colors text-white font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide shadow"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
