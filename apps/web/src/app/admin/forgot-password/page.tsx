import type { Metadata } from 'next';
import { AdminForgotPasswordForm } from './admin-forgot-password-form';

export const metadata: Metadata = {
  title: "Forgot Staff Password | Kobby's Intertech Services",
  robots: { index: false, follow: false },
};

export default function AdminForgotPasswordPage() {
  return <AdminForgotPasswordForm />;
}
