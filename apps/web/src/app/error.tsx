'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <main className="error-main">
      <div className="error-card-container">
        <div className="error-card">
          <div className="error-badge">
            <span className="error-dot" aria-hidden="true" />
            <span>SYSTEM NOTICE · ERROR 500</span>
          </div>

          <h1 className="error-title">Something unexpected went wrong.</h1>

          <p className="error-desc">
            We encountered a temporary technical glitch while loading this page. You can try refreshing the view or return to the homepage.
          </p>

          {error.digest && (
            <p className="error-digest">
              Reference code: <code>{error.digest}</code>
            </p>
          )}

          <div className="error-actions">
            <button
              type="button"
              onClick={() => reset()}
              className="error-btn-primary"
            >
              <span>Try again</span>
              <span aria-hidden="true">↻</span>
            </button>
            <Link href="/" className="error-btn-secondary">
              Return to Homepage →
            </Link>
          </div>

          <div className="error-footer-help">
            <p>
              Need immediate assistance? Call us directly at{" "}
              <a href="tel:+233243487160">+233 24 348 7160</a> or WhatsApp{" "}
              <a href="https://wa.me/233243487160" target="_blank" rel="noopener noreferrer">
                +233 24 348 7160
              </a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
