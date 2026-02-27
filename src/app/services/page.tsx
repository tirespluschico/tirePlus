import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Auto repair and tire services in Chico, CA including tire installation, flat repair, alignments, brakes, oil changes, AC service, and more.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Auto Repair & Tire Services in Chico, CA",
    description:
      "Browse tire and auto repair services from Tires+ in Chico, CA, including brakes, alignments, oil changes, AC service, and more.",
    url: "/services",
    images: [
      {
        url: "/images/sidebuilding.jpg",
        alt: "Tires+ service bays and building exterior",
      },
    ],
  },
};

const services = [
  { icon: "🛞", title: "Tire Installation", desc: "We mount and balance tires for all vehicle types. We carry Michelin, General Tire, and all major brands." },
  { icon: "🔄", title: "Tire Rotation", desc: "Extend the life of your tires with regular rotation following manufacturer recommendations." },
  { icon: "🩹", title: "Flat Tire Repair", desc: "Puncture repair for repairable tires. Quick service to get you back on the road safely." },
  { icon: "⚖️", title: "Wheel Alignment", desc: "Proper alignment prevents uneven tire wear and improves handling and fuel efficiency." },
  { icon: "🛑", title: "Brake Service", desc: "Brake pad replacement, rotor resurfacing or replacement, and full brake system inspection." },
  { icon: "🛢️", title: "Oil Change", desc: "Conventional, synthetic blend, or full synthetic oil change with a multi-point inspection." },
  { icon: "🔋", title: "Battery Replacement", desc: "Free battery test. We carry batteries for all makes and models and install while you wait." },
  { icon: "🔩", title: "Tune Up", desc: "Spark plugs, filters, and ignition system check to restore performance and fuel economy." },
  { icon: "⏱️", title: "Timing Belt", desc: "Timing belt inspection and replacement to protect your engine from costly damage." },
  { icon: "🚗", title: "Struts & Shocks", desc: "Worn struts or shocks affect handling and ride comfort. We diagnose and replace them fast." },
  { icon: "❄️", title: "AC Service", desc: "AC inspection, refrigerant recharge, and component repair to keep your cabin cool." },
  { icon: "🔍", title: "Multi-Point Inspection", desc: "Full vehicle inspection — tires, brakes, fluids, lights, belts, and more." },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="relative py-24 overflow-hidden">
        <Image src="/images/sidebuilding.jpg" alt="Shop bays" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-brand-dark/85" />
        <div className="relative max-w-6xl mx-auto px-4">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">What We Do</span>
          <h1 className="text-4xl font-black mt-2 mb-3 text-white">Our Services</h1>
          <p className="text-brand-muted max-w-xl text-lg">
            From routine maintenance to complex repairs, our certified technicians handle it all.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-brand-blue/18 border-y border-brand-blue/20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-brand-surface/80 rounded-2xl border border-brand-dark/20 hover:shadow-xl hover:border-brand-red/30 transition-all p-6 flex flex-col gap-3"
            >
              <span className="text-3xl">{icon}</span>
              <h3 className="font-bold text-lg text-brand-ink">{title}</h3>
              <p className="text-brand-dark/75 text-sm leading-relaxed flex-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-dark text-white border-t border-brand-red/20">
        <div className="max-w-3xl mx-auto px-4 text-center flex flex-col items-center gap-4">
          <h2 className="text-2xl font-black text-white">Don&apos;t see what you need?</h2>
          <p className="text-brand-muted">
            Call{" "}
            <a href="tel:5303428338" className="text-brand-red font-bold hover:underline">530-342-8338</a>
            {" "}or send us a message — we handle many more services.
          </p>
          <Link
            href="/contact"
            className="bg-brand-red hover:bg-brand-red-hover transition-colors text-white font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wide shadow"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
