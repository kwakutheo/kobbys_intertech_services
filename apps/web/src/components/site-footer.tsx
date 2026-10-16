import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return <footer>
    <div className="brand footer-brand"><Image src="/brand/logo.png" alt="" width={40} height={40} /><span><strong>Kobby&apos;s</strong><small>Intertech Services</small></span></div>
    <div><p>P.O. Box 20, Amasaman, Accra–Ghana</p><p>Digital address: E2-5656-7654</p></div>
    <div className="footer-links"><Link href="/services">Services</Link><Link href="/about">About us</Link><Link href="/faq">Frequently asked questions</Link><Link href="/contact">Contact</Link></div>
    <p className="copyright">© 2026 Kobby&apos;s Intertech Services.</p>
  </footer>;
}
