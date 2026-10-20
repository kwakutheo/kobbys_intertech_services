'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCategoryLabel } from '@/lib/gallery-categories';

export interface GalleryCarouselItem {
  id: string;
  src: string;
  caption?: string | null;
  category?: string | null;
  isUploaded?: boolean;
}

interface HomeGalleryCarouselProps {
  photos: Array<{
    id: string;
    filename: string;
    caption?: string | null;
    category?: string | null;
    url?: string | null;
  }>;
}

// 10 Curated fallbacks representing core services across Ghana
const FALLBACK_PHOTOS: GalleryCarouselItem[] = [
  {
    id: 'fallback-1',
    src: '/services/cctv_and_security.jpg',
    caption: 'High-Definition CCTV & IP Camera Installation',
    category: 'cctv-security',
  },
  {
    id: 'fallback-2',
    src: '/services/fibre_and_internet.jpg',
    caption: 'High-Speed Fibre Optic Splicing & Terminations',
    category: 'fibre-internet',
  },
  {
    id: 'fallback-3',
    src: '/services/network.jpg',
    caption: 'Enterprise Rack & Structured Network Cabling',
    category: 'networking',
  },
  {
    id: 'fallback-4',
    src: '/services/satellite.jpg',
    caption: 'Satellite Dish Alignment & Digital TV Setup',
    category: 'satellite',
  },
  {
    id: 'fallback-5',
    src: '/services/electrical_works.jpg',
    caption: 'Residential & Commercial Electrical Wiring',
    category: 'electrical-works',
  },
  {
    id: 'fallback-6',
    src: '/services/gps_tracking.jpg',
    caption: 'Real-Time Vehicle GPS Tracking System Deployment',
    category: 'gps-tracking',
  },
  {
    id: 'fallback-7',
    src: '/hero_section_background.jpg',
    caption: 'Perimeter Smart Security & Night Vision Monitoring',
    category: 'cctv-security',
  },
  {
    id: 'fallback-8',
    src: '/services/network.jpg',
    caption: 'Patch Panel Termination & Server Cabinet Setup',
    category: 'networking',
  },
  {
    id: 'fallback-9',
    src: '/services/fibre_and_internet.jpg',
    caption: 'Broadband Wi-Fi Mesh & Access Point Coverage',
    category: 'fibre-internet',
  },
  {
    id: 'fallback-10',
    src: '/services/electrical_works.jpg',
    caption: 'Power Distribution & Surge Protection Setup',
    category: 'electrical-works',
  },
];

export function HomeGalleryCarousel({ photos }: HomeGalleryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryCarouselItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Take the first 10 photos, backfilling with fallback items if fewer than 10
  const carouselItems: GalleryCarouselItem[] = useMemo(() => {
    const uploadedItems: GalleryCarouselItem[] = (photos || []).slice(0, 10).map((p) => {
      const src =
        p.url ||
        (p.filename.startsWith('http') ? p.filename : `/gallery/${p.filename}`);
      return {
        id: p.id,
        src,
        caption: p.caption || 'Project Installation in Ghana',
        category: p.category || 'general',
        isUploaded: true,
      };
    });

    if (uploadedItems.length >= 10) {
      return uploadedItems;
    }

    // Backfill remaining slots from fallback pool
    const needed = 10 - uploadedItems.length;
    const backfill = FALLBACK_PHOTOS.slice(0, needed);
    return [...uploadedItems, ...backfill];
  }, [photos]);

  // Update active slide on scroll
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : el.offsetWidth;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(index, 0), carouselItems.length - 1));
  }, [carouselItems.length]);

  const scrollToSlide = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : el.offsetWidth;
    el.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  const nextSlide = () => {
    const target = activeIndex >= carouselItems.length - 1 ? 0 : activeIndex + 1;
    scrollToSlide(target);
  };

  const prevSlide = () => {
    const target = activeIndex <= 0 ? carouselItems.length - 1 : activeIndex - 1;
    scrollToSlide(target);
  };

  // Autoplay loop every 4.5 seconds (pauses on hover or when lightbox is open)
  useEffect(() => {
    if (isPaused || lightboxPhoto) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [activeIndex, isPaused, lightboxPhoto]);

  // Close lightbox on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxPhoto(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section
      className="home-carousel-section"
      aria-label="Recent Project Installations Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="home-carousel-container">
        {/* Section Header with Eyebrow, Title and Gallery Link */}
        <div className="home-carousel-header">
          <div className="home-carousel-titles">
            <span className="home-carousel-eyebrow">
              <span className="home-carousel-dot" aria-hidden="true" />
              PROJECT SHOWCASE
            </span>
          </div>

          <div className="home-carousel-header-action">
            <Link href="/gallery" className="home-carousel-view-all">
              <span>View full gallery</span>
              <span aria-hidden="true">→</span>
            </Link>

            {/* Navigation Buttons for Desktop & Tablet */}
            <div className="home-carousel-arrows">
              <button
                type="button"
                className="home-carousel-arrow-btn"
                onClick={prevSlide}
                aria-label="Previous photo"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                className="home-carousel-arrow-btn"
                onClick={nextSlide}
                aria-label="Next photo"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Viewport (CSS Scroll Snap, Touch Swipeable) */}
        <div
          ref={containerRef}
          className="home-carousel-viewport"
          onScroll={handleScroll}
        >
          {carouselItems.map((item, idx) => {
            const categoryLabel = getCategoryLabel(item.category);
            return (
              <div
                key={item.id + idx}
                className="home-carousel-card"
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${carouselItems.length}: ${item.caption || categoryLabel}`}
                onClick={() => setLightboxPhoto(item)}
              >
                {/* Image Container with Consistent Ratio & object-fit: cover */}
                <div className="home-carousel-img-wrap">
                  <Image
                    src={item.src}
                    alt={item.caption || `${categoryLabel} Installation`}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 32vw"
                    className="home-carousel-img"
                    unoptimized={item.src.startsWith('http')}
                    priority={idx < 3}
                  />


                  {/* Click to Zoom indicator icon */}
                  <span className="home-carousel-zoom-hint" title="Click to view full photo">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </span>

                  {/* Gradient Overlay & Caption */}
                  <div className="home-carousel-overlay">
                    <p className="home-carousel-caption">{item.caption}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot Indicators & Slide Counter */}
        <div className="home-carousel-footer">
          <div className="home-carousel-dots" role="tablist" aria-label="Slide indicators">
            {carouselItems.map((_, idx) => (
              <button
                type="button"
                key={idx}
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Go to slide ${idx + 1}`}
                className={`home-carousel-dot-btn${idx === activeIndex ? ' active' : ''}`}
                onClick={() => scrollToSlide(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
