import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HeroSection } from '@/components/hero-section';
import { getApiBaseUrl } from '@/lib/api-url';

export const metadata: Metadata = {
  title: "Project Installation Gallery",
  description:
    "Browse on-site photographs of our CCTV, fibre optics, networking, satellite TV, and electrical installations completed across Greater Accra and other regions.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Project Installation Gallery | Kobby's Intertech Services",
    description:
      "Browse on-site photographs of our CCTV, fibre optics, networking, satellite TV, and electrical installations completed across Greater Accra and other regions.",
    url: "/gallery",
    type: "website",
    locale: "en_GH",
    images: [
      {
        url: "/hero_section_background.jpg",
        width: 1200,
        height: 630,
        alt: "Kobby's Intertech Services Project Gallery Ghana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Installation Gallery | Kobby's Intertech Services",
    description:
      "Browse on-site photographs of our CCTV, fibre optics, networking, satellite TV, and electrical installations completed across Greater Accra and other regions.",
    images: ["/hero_section_background.jpg"],
  },
};

import { PublicGalleryView, type PublicPhoto } from '@/components/public-gallery-view';

async function getPhotos(): Promise<PublicPhoto[]> {
  try {
    const apiUrl = getApiBaseUrl();
    const res = await fetch(`${apiUrl}/gallery`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function GallerySection() {
  const photos = await getPhotos();

  if (photos.length === 0) {
    return <p className="gallery-empty">No photos yet. Check back soon.</p>;
  }

  return <PublicGalleryView initialPhotos={photos} />;
}

export default function GalleryPage() {
  return (
    <main>
      <HeroSection
        eyebrowParts={["PROJECT SHOWCASE", "INSTALLATIONS", "GALLERY"]}
        title={
          <>
            A look at our work in <br className="hero-br" />
            action across Ghana.
          </>
        }
        lead="Browse recent photos of our CCTV, fibre-optic cabling, networking, satellite, and technical installations completed for homes and businesses."
        primaryAction={{
          href: "/book-service",
          label: "Book a service",
        }}
        secondaryAction={{
          href: "/contact",
          label: "Discuss your project",
        }}
        cardRows={[
          {
            value: "Photo Gallery",
          },
        ]}
      />

      <section className="section gallery-section">
        <Suspense fallback={<p className="gallery-empty">Loading gallery photos…</p>}>
          <GallerySection />
        </Suspense>
      </section>
    </main>
  );
}
