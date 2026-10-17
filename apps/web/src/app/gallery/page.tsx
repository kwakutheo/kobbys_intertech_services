import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
    const res = await fetch(`${apiUrl}/gallery`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const photos = await getPhotos();

  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">Our work</p>
        <h1>Photo Gallery</h1>
        <p>
          A look at some of our installations and projects across Ghana.
        </p>
      </section>

      <section className="section gallery-section">
        {photos.length === 0 ? (
          <p className="gallery-empty">No photos yet. Check back soon.</p>
        ) : (
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
        )}

        <div className="gallery-manage-hint">
          <Link href="/gallery/manage" className="text-link">
            Manage gallery <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
