import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return <header className="site-header">
    <Link className="brand" href="/" aria-label="Kobby's Intertech Services home">
      <Image src="/brand/logo.png" alt="" width={42} height={42} priority />
      <span className="brand-wordmark">
          <span className="brand-name">
            <span>K</span><span>O</span><span>B</span><span>B</span><span>Y</span><span>&apos;</span><span>S</span>
          </span>
          <span className="brand-sub">INTERTECH SERVICES</span>
        </span>
    </Link>
    <nav aria-label="Main navigation"><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/gallery">Gallery</Link><Link href="/about">About</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link></nav>
    <Link className="button button-small" href="/book-service">Book a service</Link>
  </header>;
}
