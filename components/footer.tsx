import Link from "next/link";
import { BotanicalArt } from "@/components/botanical-art";
import { ContactLinks } from "@/components/contact-links";
import { address, hours, nav } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-welcome">
            <h2 className="font-serif text-[2.7rem] leading-[1.05] tracking-[-0.035em] md:text-[3.6rem]">
              See you<br />in Stirling.
            </h2>
            <address className="mt-6 text-sm leading-relaxed not-italic text-paper/80">
              {address.line1}<br />{address.line2}
            </address>
            <ContactLinks className="mt-6" />
          </div>

          <nav aria-label="Footer" className="footer-nav">
            <h3 className="mb-5 text-sm font-medium">Explore</h3>
            <ul className="grid gap-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">{item.label}</Link>
                </li>
              ))}
              <li><Link href="/shop" className="footer-link">Shop online</Link></li>
              <li><Link href="/login" className="footer-link">My account</Link></li>
            </ul>
          </nav>

          <div className="footer-hours">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="font-serif text-3xl tracking-[-0.025em]">Make a little time.</h3>
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
                <circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" />
              </svg>
            </div>
            <table className="w-full border-collapse text-left text-[0.8rem] sm:text-sm">
              <caption className="sr-only">Shop and café opening hours</caption>
              <thead>
                <tr className="border-b border-paper/20 text-paper/80">
                  <th scope="col" className="pb-3 pr-3 font-normal">Day</th>
                  <th scope="col" className="pb-3 pr-3 font-normal">Shop</th>
                  <th scope="col" className="pb-3 font-normal">Café</th>
                </tr>
              </thead>
              <tbody>
                {hours.map((row) => (
                  <tr key={row.when} className="border-b border-paper/15 align-top">
                    <th scope="row" className="py-3 pr-3 font-normal">{row.when}</th>
                    <td className="whitespace-nowrap py-3 pr-3 tabular-nums">{row.shop}</td>
                    <td className="whitespace-nowrap py-3 tabular-nums">{row.cafe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 max-w-[36ch] text-xs leading-relaxed text-paper/80">
              On public holidays the kitchen closes at 3:00.
            </p>
          </div>
        </div>

        <div className="footer-signature" aria-hidden="true">
          <span>Organic Market</span>
          <BotanicalArt className="footer-sprig" />
        </div>
        <div className="footer-bottom">
          <p>Organic Market & Café</p>
          <p>Good food in the Adelaide Hills, since 1982.</p>
        </div>
      </div>
    </footer>
  );
}
