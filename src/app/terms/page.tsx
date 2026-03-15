import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Tires+ Complete Auto Service in Chico, CA.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-brand-ink py-16 border-b border-brand-red/20">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">Legal</span>
          <h1 className="text-4xl font-black mt-2 mb-2 text-white">Terms of Service</h1>
          <p className="text-brand-muted text-sm">Effective date: March 14, 2026</p>
        </div>
      </section>

      {/* Body */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 prose prose-slate prose-sm sm:prose-base max-w-none">

          <p>
            These Terms of Service govern your use of the Tires+ Complete Auto Service website
            (&quot;Site&quot;). By accessing or using this Site, you agree to these terms. If you do not
            agree, please do not use the Site.
          </p>

          <h2>1. Use of the Site</h2>
          <p>
            This Site is provided for informational purposes — to learn about our services, hours,
            location, and to contact us. You agree to use the Site only for lawful purposes and in
            a manner that does not infringe the rights of others.
          </p>
          <p>You agree not to:</p>
          <ul>
            <li>Submit false or misleading information through our contact form</li>
            <li>Attempt to interfere with or disrupt the Site&apos;s functionality</li>
            <li>Use automated tools to scrape or harvest content from the Site</li>
          </ul>

          <h2>2. Contact Form Submissions</h2>
          <p>
            When you submit a message through our contact form, you acknowledge that:
          </p>
          <ul>
            <li>The information you provide is accurate to the best of your knowledge</li>
            <li>Submitting the form does not constitute a confirmed appointment or binding agreement</li>
            <li>We will make reasonable efforts to respond within one business day</li>
          </ul>

          <h2>3. Accuracy of Information</h2>
          <p>
            We strive to keep pricing, hours, services, and other information on this Site
            up to date. However, we make no guarantees that all content is current or error-free.
            For confirmed pricing or availability, please call us at{" "}
            <a href="tel:5303428338" className="text-brand-red hover:underline">
              530-342-8338
            </a>
            .
          </p>

          <h2>4. Third-Party Links</h2>
          <p>
            This Site contains links to third-party websites, including Acima Leasing. We are
            not responsible for the content, privacy practices, or terms of those sites. Clicking
            a third-party link does not constitute an endorsement beyond our stated partnerships.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            All content on this Site — including text, images, and branding — is the property of
            Tires+ Complete Auto Service or its content suppliers. You may not reproduce, copy, or
            redistribute any content without our written permission.
          </p>

          <h2>6. Disclaimer of Warranties</h2>
          <p>
            This Site is provided &quot;as is&quot; without warranties of any kind, either express or
            implied. We do not warrant that the Site will be uninterrupted, error-free, or free
            of viruses or other harmful components.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Tires+ Complete Auto Service shall not be
            liable for any indirect, incidental, or consequential damages arising from your use of,
            or inability to use, this Site or its content.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of California, without regard to
            conflict of law provisions. Any disputes shall be resolved in the courts located in
            Butte County, California.
          </p>

          <h2>9. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Updated terms will be posted here with
            a new effective date. Continued use of the Site after changes are posted constitutes
            your acceptance of the revised Terms.
          </p>

          <h2>10. Contact</h2>
          <p>Questions about these Terms? Reach us at:</p>
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
        </div>
      </section>

      <section className="py-8 bg-brand-blue/10 border-t border-brand-panel">
        <div className="max-w-3xl mx-auto px-4 flex flex-wrap gap-4 text-sm text-brand-dark">
          <Link href="/privacy" className="text-brand-red hover:underline font-semibold">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-brand-ink transition-colors">Contact Us</Link>
          <Link href="/" className="hover:text-brand-ink transition-colors">Home</Link>
        </div>
      </section>
    </>
  );
}
