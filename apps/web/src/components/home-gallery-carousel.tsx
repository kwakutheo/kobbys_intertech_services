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

  const isProgrammaticScroll = useRef(false);

  // Scroll to slide placing it in the middle by default, unless at start (0, 1) or end (last, second-to-last)
  const scrollToSlide = useCallback((index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    if (!cards[index]) return;

    const total = cards.length;
    const maxScroll = el.scrollWidth - el.clientWidth;
    let targetScroll = 0;

    if (index <= 1) {
      // First and second ones: keep aligned near the start
      if (index === 0) {
        targetScroll = 0;
      } else {
        const isMobile = el.clientWidth < 720;
        targetScroll = isMobile
          ? cards[1].offsetLeft - (el.clientWidth - cards[1].offsetWidth) / 2
          : 0;
      }
    } else if (index >= total - 2) {
      // Last and second-to-last ones: align near the end
      if (index === total - 1) {
        targetScroll = maxScroll;
      } else {
        const isMobile = el.clientWidth < 720;
        targetScroll = isMobile
          ? cards[index].offsetLeft - (el.clientWidth - cards[index].offsetWidth) / 2
          : maxScroll;
      }
    } else {
      // Default: position the card right in the middle of the viewport
      targetScroll = cards[index].offsetLeft - (el.clientWidth - cards[index].offsetWidth) / 2;
    }

    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

    isProgrammaticScroll.current = true;
    setActiveIndex(index);

    el.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });

    // Reset programmatic scroll flag after animation completes
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 450);
  }, []);

  // Update active slide on user manual scroll (touch swipe or trackpad)
  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current) return;
    const el = containerRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    if (cards.length === 0) return;

    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const isMobile = el.clientWidth < 720;

    if (!isMobile && scrollLeft <= 25) {
      if (activeIndex !== 0 && activeIndex !== 1) {
        setActiveIndex(0);
      }
      return;
    }

    if (!isMobile && scrollLeft >= maxScroll - 25) {
      if (activeIndex !== cards.length - 1 && activeIndex !== cards.length - 2) {
        setActiveIndex(cards.length - 1);
      }
      return;
    }

    // Default: find the card whose center is closest to the middle of the viewport
    const viewportCenter = scrollLeft + el.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(viewportCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, [activeIndex]);

  const nextSlide = useCallback(() => {
    const total = carouselItems.length;
    const target = activeIndex >= total - 1 ? 0 : activeIndex + 1;
    scrollToSlide(target);
  }, [activeIndex, carouselItems.length, scrollToSlide]);

  const prevSlide = useCallback(() => {
    const total = carouselItems.length;
    const target = activeIndex <= 0 ? total - 1 : activeIndex - 1;
    scrollToSlide(target);
  }, [activeIndex, carouselItems.length, scrollToSlide]);

  // Autoplay loop every 3.5 seconds (pauses on hover or touch)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);



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
            const isActive = idx === activeIndex;
            return (
              <div
                key={item.id + idx}
                className={`home-carousel-card${isActive ? ' home-carousel-card--active' : ' home-carousel-card--inactive'}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${carouselItems.length}: ${item.caption || categoryLabel}`}
                onClick={() => scrollToSlide(idx)}
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
