import type { Metadata } from 'next';
import { AdminAccountManager } from './admin-account-manager';

export const metadata: Metadata = {
  title: "My Admin Account | Kobby's Intertech Services",
  robots: { index: false, follow: false },
};

export default function AdminAccountPage() {
  return <AdminAccountManager />;
}
