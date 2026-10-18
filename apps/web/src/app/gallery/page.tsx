import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { HeroSection } from '@/components/hero-section';
import { getApiBaseUrl } from '@/lib/api-url';

export const metadata: Metadata = {
  title: "Gallery | Kobby's Intertech Services",
  description:
    "Photos of our installations, projects and work across Ghana — CCTV, networking, fibre, satellite and more.",
};

type Photo = {
  id: string;
  filename: string;
  caption: string | null;
  uploadedAt: string;
};

async function getPhotos(): Promise<Photo[]> {
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

async function GalleryGrid() {
  const photos = await getPhotos();

  if (photos.length === 0) {
    return <p className="gallery-empty">No photos yet. Check back soon.</p>;
  }

  return (
    <div className="gallery-grid">
      {photos.map((photo) => (
        <figure className="gallery-item" key={photo.id}>
          <div className="gallery-img-wrap">
            <Image
              src={`/gallery/${photo.filename}`}
              alt={photo.caption ?? "Kobby's Intertech Services project photo"}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              className="gallery-img"
            />
          </div>
          {photo.caption && (
            <figcaption className="gallery-caption">{photo.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
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
            icon: "camera",
            value: "Photo Gallery",
            label: "completed project photos",
          },
          {
            icon: "check",
            value: "Certified",
            label: "professional installations",
          },
        ]}
      />

      <section className="section gallery-section">
        <Suspense fallback={<p className="gallery-empty">Loading gallery photos…</p>}>
          <GalleryGrid />
        </Suspense>
      </section>
    </main>
  );
}
