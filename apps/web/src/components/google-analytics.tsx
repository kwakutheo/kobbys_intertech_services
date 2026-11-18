import React, { Suspense } from 'react';
import Script from 'next/script';
import { AnalyticsNavigationTracker } from './analytics-tracker';

/**
 * Native Next.js 16 Google Analytics 4 integration.
 *
 * Requirements:
 * - Uses NEXT_PUBLIC_GA_ID environment variable with NO hardcoded fallback.
 * - If NEXT_PUBLIC_GA_ID is absent, returns null and renders zero scripts.
 * - Uses strategy="afterInteractive" for gtag.js to safeguard Core Web Vitals (FCP/LCP).
 * - Inline initialization sets window.dataLayer and gtag('config', gaId, { send_page_view: false })
 *   so the AnalyticsNavigationTracker is the sole authority for pageviews,
 *   preventing duplicate hits and preventing tracking of /admin routes.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) {
    return null;
  }

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <script
        id="ga4-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              send_page_view: false
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsNavigationTracker gaId={gaId} />
      </Suspense>
    </>
  );
}
