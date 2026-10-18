import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BookingsManager } from './bookings-manager';

export const metadata: Metadata = {
  title: "Service Bookings & Quotes Manager | Kobby's Intertech Services",
  description: "Review and manage incoming customer service bookings and quotation inquiries.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', color: '#94a3b8' }}>Loading bookings...</div>}>
      <BookingsManager />
    </Suspense>
  );
}
