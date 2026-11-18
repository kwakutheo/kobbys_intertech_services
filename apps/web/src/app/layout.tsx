import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/components/google-analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kobbysintertechservices.online"),
  title: {
    default: "Kobby's Intertech Services | Technology, Security & Connectivity in Ghana",
    template: "%s | Kobby's Intertech Services",
  },
  description: "CCTV, fibre & satellite internet, networking, satellite TV, electrical works, and GPS tracking across Greater Accra and Ghana.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://kobbysintertechservices.online",
    siteName: "Kobby's Intertech Services",
    title: "Kobby's Intertech Services | Technology, Security & Connectivity in Ghana",
    description: "CCTV, fibre & satellite internet, networking, satellite TV, electrical works, and GPS tracking for properties and businesses across Greater Accra and Ghana.",
    images: [
      {
        url: "/hero_section_background.jpg",
        width: 1200,
        height: 630,
        alt: "Kobby's Intertech Services - Technology, Security and Connectivity in Ghana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kobby's Intertech Services | Technology, Security & Connectivity in Ghana",
    description: "CCTV, fibre & satellite internet, networking, satellite TV, electrical works, and GPS tracking for properties and businesses across Greater Accra and Ghana.",
    images: ["/hero_section_background.jpg"],
  },
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
        <GoogleAnalytics />
        <SiteHeader />
        <PageTransition>{children}</PageTransition>
        <SiteFooter />
      </body>
    </html>
  );
}
