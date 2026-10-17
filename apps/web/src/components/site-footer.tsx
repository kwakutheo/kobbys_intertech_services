import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return <footer>
    <div className="brand footer-brand">
      <Image src="/brand/logo.png" alt="" width={40} height={40} />
      <span className="brand-wordmark">
          <span className="brand-name">
            <span>K</span><span>O</span><span>B</span><span>B</span><span>Y</span><span>&apos;</span><span>S</span>
          </span>
          <span className="brand-sub">INTERTECH SERVICES</span>
        </span>
    </div>
    <div><p>Achimota, Accra–Ghana</p>
    <p>Digital address: E2-5656-7654</p>
    </div>
    <div className="footer-links"><Link href="/services">Services</Link><Link href="/gallery">Gallery</Link><Link href="/request-quote">Request a quotation</Link><Link href="/book-service">Book a service</Link><Link href="/contact">Contact</Link></div>
    <p className="copyright">© 2026 Kobby&apos;s Intertech Services.</p>
  </footer>;
}
