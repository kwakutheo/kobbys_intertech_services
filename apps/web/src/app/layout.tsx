import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kobby's Intertech Services | Technology, Security & Communication",
  description: "Technology, security and communication solutions across Ghana.",
  icons: {
    icon: [
      { url: "/brand/footer_logo.png", type: "image/png" },
    ],
    shortcut: "/brand/footer_logo.png",
    apple: "/brand/footer_logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <PageTransition>{children}</PageTransition>
        <SiteFooter />
      </body>
    </html>
  );
}
