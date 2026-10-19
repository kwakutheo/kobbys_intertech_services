import Link from "next/link";
import { HeroSection } from "@/components/hero-section";

export const metadata = {
  title: "404 - Page Not Found | Kobby's Intertech Services",
  description: "The page you are looking for does not exist or may have been moved.",
};

const POPULAR_DESTINATIONS = [
  {
    title: "CCTV & Security",
    desc: "HD surveillance, DVR/NVR configuration, and remote mobile viewing.",
    href: "/services/cctv-security",
  },
  {
    title: "Fibre & Internet",
    desc: "High-speed fibre connectivity, WiFi routers, and structured cabling.",
    href: "/services/fibre-internet",
  },
  {
    title: "Book a Technician",
    desc: "Schedule an on-site technical inspection, repair, or new installation.",
    href: "/book-service",
  },
  {
    title: "Request a Quotation",
    desc: "Get an itemised equipment and labour quote tailored to your property.",
    href: "/request-quote",
  },
  {
    title: "Project Gallery",
    desc: "Browse authentic on-site photos of our completed work across Ghana.",
    href: "/gallery",
  },
  {
    title: "Help & FAQ",
    desc: "Answers to common questions regarding coverage, pricing, and timelines.",
    href: "/faq",
  },
];

export default function NotFound() {
  return (
    <main className="not-found-main">
      <HeroSection
        eyebrowParts={["404", "PAGE NOT FOUND", "SYSTEM NOTICE"]}
        title={
          <>
            We couldn’t find the page <br className="hero-br" />
            you’re looking for.
          </>
        }
        lead="The link you followed may be broken, outdated, or the address was mistyped. Use the links below to return to safety or explore our services."
        primaryAction={{
          href: "/",
          label: "Return to Homepage",
        }}
        secondaryAction={{
          href: "/contact",
          label: "Contact Support",
        }}
        cardRows={[
          {
            value: "Error 404",
          },
        ]}
      />

      <section className="not-found-content-section">
        <div className="not-found-container">
          <div className="not-found-header">
            <span className="eyebrow">Quick Navigation</span>
            <h2 className="not-found-heading">Where would you like to go?</h2>
            <p className="not-found-sub">
              Here are our most popular pages and direct technical services:
            </p>
          </div>

          <div className="not-found-grid">
            {POPULAR_DESTINATIONS.map((dest) => (
              <Link key={dest.href} href={dest.href} className="not-found-card">
                <div className="not-found-card-arrow" aria-hidden="true">→</div>
                <h3 className="not-found-card-title">{dest.title}</h3>
                <p className="not-found-card-desc">{dest.desc}</p>
              </Link>
            ))}
          </div>

          <div className="not-found-help-banner">
            <div className="not-found-help-info">
              <span className="not-found-help-badge">Need Direct Help?</span>
              <h3 className="not-found-help-title">Looking for urgent service or equipment support?</h3>
              <p className="not-found-help-desc">
                Our technicians are available Monday to Saturday, 7:30 am to 5:00 pm. Call us directly or message our support desk on WhatsApp.
              </p>
            </div>
            <div className="not-found-help-actions">
              <a href="https://wa.me/233243487160" target="_blank" rel="noopener noreferrer" className="not-found-wa-btn">
                <span>Chat on WhatsApp</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a href="tel:+233243487160" className="not-found-tel-btn">
                <span>+233 24 348 7160</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
