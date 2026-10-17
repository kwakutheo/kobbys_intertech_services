import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroSection } from '@/components/hero-section';

export const metadata: Metadata = {
  title: "Admin Portal | Kobby's Intertech Services",
  description: "Management dashboard for Kobby's Intertech Services staff and administrators.",
};

export default function AdminDashboardPage() {
  return (
    <main>
      <HeroSection
        eyebrowParts={["ADMINISTRATION", "MANAGEMENT", "OPERATIONS"]}
        title={
          <>
            Admin Portal & <br className="hero-br" />
            Control Center.
          </>
        }
        lead="Central dashboard to manage services, gallery media, customer requests, and business operations."
        primaryAction={{
          href: "/admin/gallery",
          label: "Manage Gallery",
        }}
        secondaryAction={{
          href: "/",
          label: "View Live Site",
        }}
        cardRows={[
          {
            icon: "shield",
            value: "Staff Access",
            label: "authenticated portal",
          },
          {
            icon: "check",
            value: "Live API",
            label: "connected to PostgreSQL",
          },
        ]}
      />

      <section className="section" style={{ maxWidth: 1240, margin: '0 auto', padding: '48px 32px 80px' }}>
        <h2 style={{ fontSize: 24, marginBottom: 24 }}>Management Modules</h2>

        <div className="value-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <article style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span>MEDIA & SHOWCASE</span>
              <h3 style={{ margin: '16px 0 10px', fontSize: 21 }}>Photo Gallery CRUD</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>
                Add new installation photos, edit captions, reorder items, or delete outdated showcase images.
              </p>
            </div>
            <div style={{ marginTop: 24 }}>
              <Link href="/admin/gallery" className="button button-small">
                Manage Gallery
              </Link>
            </div>
          </article>

          <article style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span>OPERATIONS</span>
              <h3 style={{ margin: '16px 0 10px', fontSize: 21 }}>Service Requests & Bookings</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>
                Review incoming client bookings, site visit schedules, quotation requests, and job statuses.
              </p>
            </div>
            <div style={{ marginTop: 24 }}>
              <Link href="/book-service" className="text-link">
                View Booking Form ↗
              </Link>
            </div>
          </article>

          <article style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span>CUSTOMER SERVICE</span>
              <h3 style={{ margin: '16px 0 10px', fontSize: 21 }}>Enquiries & Quotes</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>
                Manage customer contact inquiries and tailored quotations for residential and corporate clients.
              </p>
            </div>
            <div style={{ marginTop: 24 }}>
              <Link href="/request-quote" className="text-link">
                Quotation Portal ↗
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
