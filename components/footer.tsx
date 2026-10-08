import Link from "next/link";
import { ContactLinks } from "@/components/contact-links";
import { address, nav } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <span className="footer-watermark font-casa-leru" aria-hidden="true">Organic Market</span>
      <div className="footer-inner">
        
        <div className="footer-grid">
          <div className="footer-welcome">
            <h2 className="font-serif sm:block hidden text-4xl leading-[1.1] tracking-[-0.035em] md:text-5xl">
              See you<br />in Stirling.
            </h2>
            <address className="mt-6 sm:block hidden text-sm leading-relaxed not-italic text-paper/80">
              {address.line1}<br />{address.line2}
            </address>
            <ContactLinks className="mt-6" />
          </div>

          <nav aria-label="Footer" className="footer-nav">
            <ul className="grid gap-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">{item.label}</Link>
                </li>
              ))}
              <li><Link href="/shop" className="footer-link">Shop online</Link></li>
            </ul>
          </nav>

        </div>

        <div className="footer-bottom">
          <p>Organic Market & Café</p>
          <p>Good food in the Adelaide Hills, since 1982.</p>
        </div>
      </div>
    </footer>
  );
}
