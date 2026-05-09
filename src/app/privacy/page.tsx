import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Tires+ Complete Auto Service in Chico, CA.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-brand-ink py-16 border-b border-brand-red/20">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">Legal</span>
          <h1 className="text-4xl font-black mt-2 mb-2 text-white">Privacy Policy</h1>
          <p className="text-brand-muted text-sm">Effective date: March 14, 2026</p>
        </div>
      </section>

      {/* Body */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 prose prose-slate prose-sm sm:prose-base max-w-none">

          <p>
            Tires+ Complete Auto Service (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), located at 624
            Broadway St, Chico, CA, operates the website at this domain. This Privacy Policy explains
            what information we collect, how we use it, and your rights regarding that information.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We only collect information you voluntarily provide through our contact form:
          </p>
          <ul>
            <li><strong>Full name</strong></li>
            <li><strong>Email address</strong></li>
            <li><strong>Phone number</strong> (optional)</li>
            <li><strong>Service type</strong> you are inquiring about</li>
            <li><strong>Message</strong> content</li>
          </ul>
          <p>
            We do not use cookies, tracking pixels, or analytics services. We do not automatically
            collect IP addresses, device data, or browsing behavior.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>Information submitted through the contact form is used solely to:</p>
          <ul>
            <li>Respond to your inquiry or service request</li>
            <li>Schedule appointments or provide estimates</li>
            <li>Follow up on your message if needed</li>
          </ul>
          <p>We do not use your information for marketing without your consent.</p>

          <h2>3. How We Share Your Information</h2>
          <p>
            We do not sell, rent, or trade your personal information. We do not share it with third
            parties except where required by law or necessary to provide the requested service
            (e.g., a third-party appointment or email platform).
          </p>

          <h2>4. Third-Party Services</h2>
          <p>
            Our financing page links to Acima Leasing. If you click through and apply, any information
            you provide to Acima is governed by{" "}
            <a
              href="https://www.acima.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red hover:underline"
            >
              Acima&apos;s Privacy Policy
            </a>
            , not ours.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain contact form submissions only as long as necessary to respond to your inquiry
            and for reasonable record-keeping. You may request deletion at any time (see Section 7).
          </p>

          <h2>6. California Privacy Rights (CCPA)</h2>
          <p>
            If you are a California resident, you have the right to:
          </p>
          <ul>
            <li>Know what personal information we have collected about you</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of the sale of your personal information (we do not sell it)</li>
            <li>Non-discrimination for exercising your privacy rights</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at the email or phone number below.
          </p>

          <h2>7. Contact</h2>
          <p>
            For privacy questions or requests, reach us at:
          </p>
          <ul>
            <li>
              Email:{" "}
              <a href="mailto:contact@tirespluschico.com" className="text-brand-red hover:underline">
                contact@tirespluschico.com
              </a>
            </li>
            <li>
              Phone:{" "}
              <a href="tel:5303428338" className="text-brand-red hover:underline">
                530-342-8338
              </a>
            </li>
            <li>Address: 624 Broadway St, Chico, CA</li>
          </ul>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Changes will be posted on this page with
            an updated effective date. Continued use of the site after changes constitutes
            acceptance of the updated policy.
          </p>
        </div>
      </section>

      <section className="py-8 bg-brand-blue/10 border-t border-brand-panel">
        <div className="max-w-3xl mx-auto px-4 flex flex-wrap gap-4 text-sm text-brand-dark">
          <Link href="/terms" className="text-brand-red hover:underline font-semibold">Terms of Service</Link>
          <Link href="/contact" className="hover:text-brand-ink transition-colors">Contact Us</Link>
          <Link href="/" className="hover:text-brand-ink transition-colors">Home</Link>
        </div>
      </section>
    </>
  );
}
