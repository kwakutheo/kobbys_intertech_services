import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AdminActivationForm } from './admin-activation-form';

export const metadata: Metadata = {
  title: "Set Staff Password | Kobby's Intertech Services",
  robots: { index: false, follow: false },
};

export default function AdminActivatePage() {
  return <Suspense fallback={null}><AdminActivationForm /></Suspense>;
}
