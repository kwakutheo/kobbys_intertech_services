import type { Metadata } from 'next';
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
  return <BookingsManager />;
}
