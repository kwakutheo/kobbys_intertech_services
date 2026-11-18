'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Checks whether the current path belongs to staff-only administration or private API surfaces.
 */
function isAdministrativePath(pathname: string): boolean {
  return (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/gallery/manage' ||
    pathname.startsWith('/gallery/manage/') ||
    pathname.startsWith('/api/')
  );
}

/**
 * Client component that tracks page views on initial mount and on App Router client-side navigation.
 * Wrapped in Suspense because it consumes useSearchParams().
 */
export function AnalyticsNavigationTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // 1. Exclude administrative and private dashboard routes
    if (isAdministrativePath(pathname)) {
      return;
    }

    // 2. Include meaningful query-string changes (e.g. ?service=cctv-security on booking/quote)
    const serviceParam = searchParams.get('service');
    const queryString = serviceParam ? `?service=${encodeURIComponent(serviceParam)}` : '';
    const currentPath = `${pathname}${queryString}`;

    // 3. Prevent duplicate page_view events caused by React re-renders or StrictMode
    if (lastTrackedPath.current === currentPath) {
      return;
    }
    lastTrackedPath.current = currentPath;

    // 4. Yield execution to allow Next.js App Router to commit the new document.title
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        if (typeof window.gtag !== 'function') {
          window.gtag = function (...args: unknown[]) {
            window.dataLayer?.push(args);
          };
        }

        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: currentPath,
          send_to: gaId,
        });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname, searchParams, gaId]);

  return null;
}
