import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return <header className="site-header">
    <Link className="brand" href="/" aria-label="Kobby's Intertech Services home">
      <Image src="/brand/logo.png" alt="" width={42} height={42} priority />
      <span><strong>Kobby&apos;s</strong><small>Intertech Services</small></span>
    </Link>
    <nav aria-label="Main navigation"><Link href="/services">Services</Link><Link href="/about">About</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link></nav>
    <Link className="button button-small" href="/book-service">Book a service</Link>
  </header>;
}
