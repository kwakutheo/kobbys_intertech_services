'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { GALLERY_CATEGORIES, getCategoryLabel } from '@/lib/gallery-categories';

export type PublicPhoto = {
  id: string;
  filename: string;
  caption: string | null;
  category?: string | null;
  uploadedAt: string;
  url?: string | null;
};

interface PublicGalleryViewProps {
  initialPhotos: PublicPhoto[];
}

export function PublicGalleryView({ initialPhotos }: PublicGalleryViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Compute counts for each category
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: initialPhotos.length };
    for (const cat of GALLERY_CATEGORIES) {
      map[cat.id] = 0;
    }
    for (const p of initialPhotos) {
      if (p.category && map[p.category] !== undefined) {
        map[p.category]++;
      }
    }
    return map;
  }, [initialPhotos]);

  // Filter photos based on active category
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'all') return initialPhotos;
    return initialPhotos.filter((p) => p.category === activeCategory);
  }, [initialPhotos, activeCategory]);

  return (
    <div>
      {/* Grid of Photos */}
      {filteredPhotos.length === 0 ? (
        <div className="gallery-empty">
          <p style={{ marginBottom: 12 }}>
            No photos uploaded yet for{' '}
            <strong>{getCategoryLabel(activeCategory)}</strong>.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="gallery-filter-btn gallery-filter-btn--active"
              onClick={() => setActiveCategory('all')}
            >
              View All Photos ({initialPhotos.length})
            </button>
            <Link href="/book-service" className="gallery-filter-btn" style={{ background: 'rgba(255,255,255,0.08)' }}>
              Book this service &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="gallery-grid">
          {filteredPhotos.map((photo) => {
            const photoSrc =
              photo.url ||
              (photo.filename.startsWith('http')
                ? photo.filename
                : `/gallery/${photo.filename}`);

            const altText =
              photo.caption ||
              `${getCategoryLabel(photo.category)} installation by Kobby's Intertech`;

            return (
              <figure className="gallery-item" key={photo.id}>
                <div className="gallery-img-wrap">
                  {photo.category && (
                    <span className="gallery-item-category-tag">
                      {getCategoryLabel(photo.category)}
                    </span>
                  )}
                  <Image
                    src={photoSrc}
                    alt={altText}
                    fill
                    unoptimized={Boolean(photo.url)}
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    className="gallery-img"
                  />
                </div>
                {photo.caption && (
                  <figcaption className="gallery-caption">{photo.caption}</figcaption>
                )}
              </figure>
            );
          })}
        </div>
      )}
    </div>
  );
}
