import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-muted mt-auto border-t border-brand-red/20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-xl font-black text-white mb-1">
            TIRES<span className="text-brand-red">+</span>
          </p>
          <p className="text-xs text-brand-muted uppercase tracking-widest mb-3">Complete Auto Service</p>
          <p className="text-sm leading-relaxed">
            Your trusted local tire &amp; auto repair shop. Quality service, honest pricing.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 uppercase tracking-wide text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link href="/financing" className="hover:text-white transition-colors">Financing</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 uppercase tracking-wide text-sm">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>624 Broadway St, Chico, CA</li>
            <li>
              <a href="tel:5303428338" className="text-white font-semibold hover:text-brand-red transition-colors">
                530-342-8338
              </a>
            </li>
            <li>
              <a
                href="mailto:contact@tirespluschico.com"
                className="hover:text-white transition-colors break-all"
              >
                contact@tirespluschico.com
              </a>
            </li>
            <li className="pt-1">Mon–Fri: 8am – 5pm &nbsp;|&nbsp; Sat: 9am – 1pm &nbsp;|&nbsp; Sun: Closed</li>
            <li className="pt-2 flex flex-wrap gap-x-4 gap-y-2">
              <a
                href="https://www.instagram.com/tirespluschico_/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61578532622757"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-muted/70">
        <span>&copy; {new Date().getFullYear()} Tires+ Complete Auto Service. All rights reserved.</span>
        <span className="flex gap-4">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </span>
      </div>
    </footer>
  );
}
