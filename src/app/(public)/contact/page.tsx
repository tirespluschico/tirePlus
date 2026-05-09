import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Tires+ in Chico, CA for estimates and appointments. Call 530-342-8338, email contact@tirespluschico.com, or visit 624 Broadway St, Chico, CA.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Tires+ | Chico, CA Tire & Auto Repair",
    description:
      "Call, email, or visit Tires+ in Chico, CA for tire service and auto repair appointments.",
    url: "/contact",
    images: [
      {
        url: "/images/tireplusfront.jpg",
        alt: "Tires+ storefront in Chico, CA",
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="relative py-24 overflow-hidden">
        <Image src="/images/tireplusfront.jpg" alt="Tires+ front" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-brand-dark/85" />
        <div className="relative max-w-6xl mx-auto px-4">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">Get in Touch</span>
          <h1 className="text-4xl font-black mt-2 mb-3 text-white">Contact Us</h1>
          <p className="text-brand-muted max-w-xl text-lg">
            Book an appointment, request an estimate, or just ask a question.
          </p>
        </div>
      </section>

      <section className="py-16 bg-brand-blue/18 border-y border-brand-blue/20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-xl font-black text-brand-ink mb-5">Shop Information</h2>
              <ul className="space-y-4 text-brand-dark/75 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-brand-red text-lg mt-0.5">📍</span>
                  <span>624 Broadway St<br />Chico, CA</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-red text-lg mt-0.5">📞</span>
                  <a href="tel:5303428338" className="hover:text-brand-red transition-colors font-bold text-brand-ink text-base">
                    530-342-8338
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-red text-lg mt-0.5">✉️</span>
                  <a
                    href="mailto:contact@tirespluschico.com"
                    className="hover:text-brand-red transition-colors font-bold text-brand-ink text-base break-all"
                  >
                    contact@tirespluschico.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-red text-lg mt-0.5">📱</span>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 font-bold text-brand-ink text-base">
                    <a
                      href="https://www.instagram.com/tirespluschico_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-red transition-colors"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://www.facebook.com/profile.php?id=61578532622757"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-red transition-colors"
                    >
                      Facebook
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-brand-ink mb-4">Hours</h2>
              <table className="text-sm text-brand-dark/75 w-full max-w-xs">
                <tbody>
                  {[
                    ["Monday – Friday", "8:30 AM – 5:00 PM"],
                    ["Saturday", "9:00 AM – 1:00 PM"],
                    ["Sunday", "Closed"],
                  ].map(([day, hours]) => (
                    <tr key={day} className="border-b border-brand-blue/15">
                      <td className="py-2.5 font-semibold text-brand-ink">{day}</td>
                      <td className="py-2.5 text-right">{hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-2xl border border-brand-blue/20 bg-white/35 p-3 shadow-lg">
              <div className="overflow-hidden rounded-xl border border-white/60 shadow-sm">
                <div className="relative h-72 bg-brand-dark/10">
                  <iframe
                    title="Map to Tires+ at 624 Broadway St, Chico, CA"
                    src="https://www.google.com/maps?q=624+Broadway+St,+Chico,+CA&output=embed"
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-3">
                <p className="text-sm font-semibold text-brand-ink">624 Broadway St, Chico, CA</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=624+Broadway+St,+Chico,+CA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-brand-dark px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-blue"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-brand-surface/80 rounded-2xl border border-brand-dark/20 shadow-lg p-8">
            <h2 className="text-xl font-black text-brand-ink mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
