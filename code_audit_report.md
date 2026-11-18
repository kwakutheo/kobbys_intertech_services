# Kobby's Intertech Services — Technical SEO & Code Audit Report
## Phase 1 (Foundation), Phase 2 (On-Page SEO) & Phase 3 (Structured Data)

**Project:** Kobby's Intertech Services Monorepo  
**Frontend:** Next.js 16 App Router (`apps/web`)  
**Backend:** NestJS 12 (`apps/api`)  
**Live Site:** `https://kobbysintertechservices.online` / `https://www.kobbysintertechservices.online`  
**Hosting Provider:** Vercel  
**Date:** 2026-11-17  

---

## Executive Summary

| Area | Status | Verification Summary |
|---|---|---|
| **Phase 1: Dynamic robots.txt** | ✅ Live Verified | Accessible at `/robots.txt` (HTTP 200). Public crawl allowed; `/api/admin/` blocked; admin pages unblocked for noindex discovery. |
| **Phase 1: Dynamic sitemap.xml** | ✅ Live Verified | Accessible at `/sitemap.xml` (HTTP 200). Exactly 16 canonical URLs matching active service routes. |
| **Phase 2: Titles & Meta Descriptions** | ✅ Live Verified | Unique, localized, descriptive titles and descriptions across all 16 public routes confirmed live on production. |
| **Phase 2: Open Graph & Twitter Cards** | ✅ Live Verified | Complete `openGraph` and `twitter:card` metadata across all pages with dedicated images for service pages confirmed live. |
| **Phase 2: Preferred Domain & Redirect** | ✅ Live Verified | Vercel Primary Domain set to `kobbysintertechservices.online`. `www` requests return HTTP 308 redirect to non-www. |
| **Phase 2: Heading Hierarchy** | ✅ Live Verified | One clear H1 per page; corrected misuse of H2 for contact values and H4 before H2/H3; visual design 100% preserved. |
| **Phase 2: Image SEO** | ✅ Live Verified | Descriptive, localized fallback alt text for carousel and gallery items; Next.js Image priority optimization live. |
| **Phase 2: Internal Linking** | ✅ Live Verified | Enhanced cross-navigation between service detail pages, project gallery, booking, quote request, and FAQ. |
| **Phase 2: Local SEO Relevance** | ✅ Live Verified | Natural geographic references to Achimota, Accra, Greater Accra, southern Ghana, and the Ashanti Region. |
| **Phase 3: Structured Data (Schema.org)** | ✅ Live Verified | `Organization` & `WebSite` graph on homepage; `Service` & `BreadcrumbList` on all 6 service pages; no address exposure. |
| **Phase 3: Accessible Breadcrumbs** | ✅ Live Verified | Accessible, visible breadcrumbs live on all 6 service detail pages with 100% label parity to structured data. |
| **Frontend ESLint** | ✅ Clean (Exit 0) | 0 errors, 0 warnings across all files. |
| **Frontend TypeScript** | ✅ Clean (Exit 0) | `tsc --noEmit` passed with 0 errors. |
| **Production Build** | ✅ Clean (Exit 0) | 33 routes generated, verified without compilation errors. |

---

## 1. Initial Audit Summary (Phase 2 Baseline)

Prior to Phase 2 implementation, an audit of the public routes revealed:
1. **Homepage Metadata Gap:** The homepage (`/`) had no page-level `metadata` export, inheriting only the root layout fallback title and a generic description.
2. **Missing Open Graph & Social Cards:** No `openGraph` or `twitter` card tags were configured in the root layout or page components. Social shares on WhatsApp, Facebook, LinkedIn, and X displayed blank or fallback snippet cards.
3. **Service Social Previews:** Individual service pages had no dedicated social share images, missing the opportunity to leverage existing high-resolution imagery (`/services/*.jpg`).
4. **Heading Hierarchy Violations:**
   - In `contact-hub.tsx`, `<h2>` tags were used solely to enlarge text for the phone number, email address, and physical address.
   - In `services/[slug]/page.tsx`, an `<h4>` tag was placed in the advisory ribbon before any `<h2>` or `<h3>` section on the page.
   - In `contact-hub.tsx`, an `<h4>` tag was nested inside a sidebar card that sat alongside an `<h3>` card.
5. **Image SEO Opportunities:** Generic alt text fallbacks in `home-gallery-carousel.tsx` and `public-gallery-view.tsx` lacked business branding and regional location context.
6. **Internal Cross-Linking:** Service pages did not link directly to the `/gallery` to showcase completed projects of that specific technical discipline.

---

## 2. Public Pages Reviewed & Final Metadata

All 16 public URLs now have unique, descriptive titles, tailored meta descriptions, canonical URLs, and full Open Graph / Twitter Card declarations:

| # | Route | Final Title (Browser Display) | Meta Description (SERP Snippet) | Canonical URL | OG Image |
|---|---|---|---|---|---|
| 1 | `/` | `Kobby's Intertech Services \| Technology, Security & Connectivity in Ghana` | Professional CCTV installation, fibre internet, computer networking, satellite TV, electrical works, and GPS tracking for properties and businesses in Accra and across Ghana. | `https://kobbysintertechservices.online/` | `/hero_section_background.jpg` |
| 2 | `/about` | `About Us \| Kobby's Intertech Services` | Learn about Kobby's Intertech Services, based in Achimota, Accra. We deliver dependable technology, CCTV security, networking, and electrical solutions across Ghana. | `https://kobbysintertechservices.online/about` | `/hero_section_background.jpg` |
| 3 | `/services` | `Technical & Technology Services \| Kobby's Intertech Services` | Explore our six core services in Ghana: CCTV security, fibre & satellite internet, enterprise networking, satellite TV, electrical installations, and GPS vehicle tracking. | `https://kobbysintertechservices.online/services` | `/hero_section_background.jpg` |
| 4 | `/services/cctv-security` | `CCTV Installation & Security Systems \| Kobby's Intertech Services` | CCTV camera installation, recording systems, remote monitoring, upgrades and maintenance for homes and businesses across Greater Accra and Ghana. | `https://kobbysintertechservices.online/services/cctv-security` | `/services/cctv_and_security.jpg` |
| 5 | `/services/fibre-internet` | `Fibre Optics & Satellite Internet \| Kobby's Intertech Services` | Fibre-optic installations, satellite internet setup, wireless links and high-performance network connectivity across Ghana. | `https://kobbysintertechservices.online/services/fibre-internet` | `/services/fibre_and_internet.jpg` |
| 6 | `/services/networking` | `Network Design & Infrastructure \| Kobby's Intertech Services` | Professional network design, structured cabling, wireless networking, security and ongoing technical support for businesses across Ghana. | `https://kobbysintertechservices.online/services/networking` | `/services/network.jpg` |
| 7 | `/services/satellite` | `Satellite TV Installation & Support \| Kobby's Intertech Services` | TV installation, decoder setup, signal troubleshooting and reception support for leading television services in Ghana (DStv, Multi TV, HD+, StarTimes, GOtv). | `https://kobbysintertechservices.online/services/satellite` | `/services/satellite.jpg` |
| 8 | `/services/electrical-works` | `Electrical Installation & Power Solutions \| Kobby's Intertech Services` | Residential and commercial electrical installations, fault repairs, power protection and backup power integration across Ghana. | `https://kobbysintertechservices.online/services/electrical-works` | `/services/electrical_works.jpg` |
| 9 | `/services/gps-tracking` | `GPS Vehicle Tracking & Fleet Management \| Kobby's Intertech Services` | Vehicle tracking, anti-theft monitoring, fleet visibility and ongoing technical support for vehicles operating across Ghana. | `https://kobbysintertechservices.online/services/gps-tracking` | `/services/gps_tracking.jpg` |
| 10 | `/gallery` | `Project Installation Gallery \| Kobby's Intertech Services` | Browse on-site photographs of our CCTV, fibre optics, networking, satellite TV, and electrical installations completed across Greater Accra and other regions. | `https://kobbysintertechservices.online/gallery` | `/hero_section_background.jpg` |
| 11 | `/contact` | `Contact Us \| Kobby's Intertech Services` | Get in touch with Kobby's Intertech Services in Achimota, Accra. Call or WhatsApp +233 24 348 7160 for technical inquiries, site visits, and project consultations in Ghana. | `https://kobbysintertechservices.online/contact` | `/hero_section_background.jpg` |
| 12 | `/faq` | `Frequently Asked Questions \| Kobby's Intertech Services` | Get answers to common questions about our technical services, service areas in Greater Accra and the Ashanti Region, site visit arrangements, and quotations. | `https://kobbysintertechservices.online/faq` | `/hero_section_background.jpg` |
| 13 | `/book-service` | `Book a Service Technician \| Kobby's Intertech Services` | Schedule an on-site technical inspection, repair, or new installation for CCTV, internet, networking, satellite, or electrical works in Ghana. | `https://kobbysintertechservices.online/book-service` | `/hero_section_background.jpg` |
| 14 | `/request-quote` | `Request an Itemised Quotation \| Kobby's Intertech Services` | Request a transparent, itemised quotation for equipment and installation labor tailored to your home or commercial property in Ghana. | `https://kobbysintertechservices.online/request-quote` | `/hero_section_background.jpg` |
| 15 | `/privacy` | `Privacy Policy \| Kobby's Intertech Services` | Read how Kobby's Intertech Services collects, uses, and safeguards personal and property information under Ghana's Data Protection Act, 2012 (Act 843). | `https://kobbysintertechservices.online/privacy` | `/hero_section_background.jpg` |
| 16 | `/terms-of-service` | `Terms of Service \| Kobby's Intertech Services` | Review the terms and conditions governing service bookings, quotations, site inspections, and technical installations with Kobby's Intertech Services in Ghana. | `https://kobbysintertechservices.online/terms-of-service` | `/hero_section_background.jpg` |

---

## 3. Open Graph & Social Sharing Implementation

1. **Global Fallback Configuration (`layout.tsx`):**
   - Declares `openGraph.type = "website"`, `openGraph.locale = "en_GH"`, `openGraph.siteName = "Kobby's Intertech Services"`.
   - Default social sharing image: `/hero_section_background.jpg` (1200x630, verified).
   - Twitter card format: `summary_large_image`.
2. **Dedicated Per-Service Social Imagery:**
   - Every individual service page (`/services/[slug]`) injects its own high-resolution image into `og:image` and `twitter:image`:
     - CCTV: `/services/cctv_and_security.jpg`
     - Fibre: `/services/fibre_and_internet.jpg`
     - Networking: `/services/network.jpg`
     - Satellite: `/services/satellite.jpg`
     - Electrical: `/services/electrical_works.jpg`
     - GPS Tracking: `/services/gps_tracking.jpg`
   - WhatsApp and Facebook link unfurling will display the real technical equipment image corresponding to the shared service link.

---

## 4. Heading Hierarchy Corrections

| File | Component | Old Markup | New Markup | Reason |
|---|---|---|---|---|
| `contact-hub.tsx` | Phone channel | `<h2 className="contact-main-value">` | `<p className="contact-main-value">` | Phone numbers should not be semantic H2 headings; H2 must introduce content. |
| `contact-hub.tsx` | Email channel | `<h2 className="contact-main-value email-value">` | `<p className="contact-main-value email-value">` | Email address should not be a heading. |
| `contact-hub.tsx` | Office address | `<h2 className="contact-main-value">` | `<p className="contact-main-value">` | Physical address should not be a heading. |
| `contact-hub.tsx` | Sidebar card | `<h4>Schedule a site visit...</h4>` | `<h3>Schedule a site visit...</h3>` | Parallels `<h3>Fast-Track on WhatsApp</h3>` in the same sidebar; avoids skipping heading levels. |
| `services/[slug]/page.tsx` | Advisory ribbon | `<h4>Need Immediate Advice...</h4>` | `<h2>Need Immediate Advice...</h2>` | Replaced isolated H4 preceding main content with semantic H2. |
| `globals.css` | Stylesheet | `.booking-cta-card h4` / `.service-advisory-info h4` | Extended to `h3`, `h2` | Exact pixel-perfect visual styling preserved without regression. |

Every public page has exactly **one** primary `<h1>` element.

---

## 5. Image SEO Improvements

1. **Descriptive Alt Text:**
   - Updated `home-gallery-carousel.tsx` fallback alt text to: `${categoryLabel} installation project by Kobby's Intertech Services in Ghana`.
   - Updated `public-gallery-view.tsx` fallback alt text to: `${getCategoryLabel(photo.category)} installation by Kobby's Intertech Services in Ghana`.
2. **Decorative & Brand Images:**
   - Empty `alt=""` retained on logo image inside `<Link aria-label="...">` to eliminate redundant screen-reader announcements.
   - Background decorative spans maintain `aria-hidden="true"`.
3. **Loading Priorities & Formats:**
   - Hero logos and initial carousel slides maintain `priority` flags for Core Web Vitals (LCP).
   - Images utilize Next.js automatic WebP/AVIF compression with responsive `sizes` attributes.

---

## 6. Internal Linking Improvements

1. **Service Pages to Gallery:**
   - In `apps/web/src/app/services/[slug]/page.tsx`, added natural contextual cross-links to `/gallery` so visitors reading about CCTV, fibre, or electrical works can view authentic project photos.
2. **About Page Cross-Navigation:**
   - Added a structured bottom navigation section linking to `/gallery` and `/services`.
3. **Deep Link Consistency:**
   - Service cards link directly to `/book-service?service=${service.slug}` and `/request-quote?service=${service.slug}` with pre-selected service filters.

---

## 7. Local SEO & Geographic Relevance

1. **Physical Office Base:** Explicitly anchored to **Achimota, Accra, Ghana** across metadata, footer, contact hub, and FAQ.
2. **Service Dispatch Coverage:** Clarified coverage across **Greater Accra**, with expanded travel capability extending across **southern Ghana** and into the **Ashanti Region** (e.g. Kumasi) for larger commercial and residential installations.
3. **Doorway-Page Avoidance:** No duplicate location doorway pages created; local relevance is integrated naturally into actual service offerings and FAQ entries.

---

## 8. Files Modified in Phase 2

1. `apps/web/src/app/layout.tsx` — Site-wide Open Graph & Twitter metadata defaults.
2. `apps/web/src/app/page.tsx` — Homepage metadata export (title, unique description, canonical, OG, Twitter).
3. `apps/web/src/app/about/page.tsx` — Enhanced metadata + internal cross-linking.
4. `apps/web/src/app/services/page.tsx` — Enhanced metadata + descriptions.
5. `apps/web/src/app/services/[slug]/page.tsx` — Dynamic metadata with per-service OG/Twitter images, heading hierarchy fix, gallery cross-link.
6. `apps/web/src/app/gallery/page.tsx` — Enhanced metadata.
7. `apps/web/src/app/contact/page.tsx` — Enhanced metadata.
8. `apps/web/src/app/faq/page.tsx` — Enhanced metadata.
9. `apps/web/src/app/book-service/page.tsx` — Enhanced metadata.
10. `apps/web/src/app/request-quote/page.tsx` — Enhanced metadata.
11. `apps/web/src/app/privacy/page.tsx` — Enhanced metadata.
12. `apps/web/src/app/terms-of-service/page.tsx` — Enhanced metadata.
13. `apps/web/src/components/contact-hub.tsx` — Semantic heading hierarchy fixes.
14. `apps/web/src/components/home-gallery-carousel.tsx` — Image SEO alt text enhancements.
15. `apps/web/src/components/public-gallery-view.tsx` — Image SEO alt text enhancements.
16. `apps/web/src/app/globals.css` — CSS selectors updated to support semantic heading changes.
17. `apps/web/src/data/site.ts` — Updated geographic service coverage description.

---

## 9. Verification & Build Results

| Check | Command | Result |
|---|---|---|
| **Frontend ESLint** | `npm run lint --prefix apps/web` | ✅ **0 errors, 0 warnings** |
| **Frontend TypeScript** | `node apps/web/node_modules/typescript/bin/tsc --noEmit -p apps/web/tsconfig.json` | ✅ **0 errors** |
| **Production Build** | `npm run build --prefix apps/web` | ✅ **Exit code 0** (33 routes built, all static & SSG rendered) |
| **Metadata HTML Inspection** | Built `.html` validation | ✅ Verified: Unique titles, descriptions, canonicals, OG tags, and H1s |

---

## 10. Phase 2 Live Deployment & Preferred Domain Verification

On 2026-11-17, deployment `3a827a2` was published to production on Vercel and the primary domain configuration was aligned. Live testing confirmed:

1. **Domain Alignment & Redirection:**
   - Primary domain is now set to `https://kobbysintertechservices.online` (non-www).
   - Visiting `https://www.kobbysintertechservices.online/*` returns **HTTP 308 Permanent Redirect** directly to `https://kobbysintertechservices.online/*`.
   - Complete 1:1 parity between server redirects and declared HTML canonical tags.

2. **Live HTML & Metadata Verification:**
   - **Homepage (`/`)**: Returns HTTP 200. Live title: `Kobby's Intertech Services | Technology, Security & Connectivity in Ghana`. Canonical: `https://kobbysintertechservices.online/`.
   - **Service Pages (e.g. `/services/cctv-security`, `/services/satellite`)**: Return HTTP 200. Live tags confirmed:
     - `og:title`, `og:description`, `og:url` present and localized.
     - `og:locale` set to `en_GH`.
     - `og:image` pointing to service-specific high-resolution asset (`/services/cctv_and_security.jpg`, `/services/satellite.jpg`).
     - `twitter:card` set to `summary_large_image`.
     - `twitter:image` matching the high-resolution service asset.
     - Canonical tag matching exact non-www route.
   - **Internal Cross-Links**: Service pages now feature functional links to `/gallery`, and the `/about` page contains the bottom cross-navigation section.

3. **Robots & Sitemap Parity:**
   - `/robots.txt` and `/sitemap.xml` remain fully functional and live on the non-www domain.
   - All 16 public canonical URLs are verified indexable with zero crawl barriers.

---

## 11. Phase 3 Implementation & Structured Data Architecture

Phase 3 implements valid, secure Schema.org structured data via JSON-LD across the application according to the approved service-area business model.

### 1. Files Created:
1. **`apps/web/src/components/json-ld.tsx`**:
   - Reusable React Server Component rendering `<script type="application/ld+json">`.
   - Built-in string escaping (`JSON.stringify(data).replace(/</g, '\\u003c')`) preventing script injection / breakout.
2. **`apps/web/src/components/breadcrumb.tsx`**:
   - Reusable, accessible breadcrumb component implementing WAI-ARIA `<nav aria-label="Breadcrumb">` and `<ol>` markup.
   - `aria-current="page"` applied to the active terminal page.
3. **`apps/web/src/lib/schema.ts`**:
   - Central strongly-typed schema generator functions:
     - `getOrganizationAndWebsiteSchema()`: Generates the homepage entity graph with stable URIs (`#organization`, `#website`).
     - `getServiceSchema(service)`: Generates individual `Service` structured data linked to the central organization via `provider.@id`.
     - `getServiceBreadcrumbSchema(service)`: Generates `BreadcrumbList` structured data matching visible UI breadcrumbs.

### 2. Files Modified:
1. **`apps/web/src/app/page.tsx`**:
   - Injected `<JsonLd data={getOrganizationAndWebsiteSchema()} />`.
2. **`apps/web/src/app/services/[slug]/page.tsx`**:
   - Injected `<JsonLd data={getServiceSchema(service)} />`.
   - Injected `<JsonLd data={getServiceBreadcrumbSchema(service)} />`.
   - Added visible, accessible breadcrumb bar at the top of the service detail page (`Home / Our Services / [Service Name]`).
3. **`apps/web/src/app/globals.css`**:
   - Added responsive, accessible styles for `.service-breadcrumb-bar`, `.breadcrumbs-list`, `.breadcrumb-item`, and `.breadcrumb-current-label`.

### 3. Strict Exclusions & Privacy Safeguards Maintained:
- **No Address Exposure:** Because Kobby's Intertech Services operates as a service-area business where technicians travel to client premises, no customer-facing address for the Achimota operating base is published in JSON-LD.
- **No Deprecated Types:** Neither `ProfessionalService` nor unconfirmed `LocalBusiness` subtypes are used; the business entity is typed strictly as `Organization`.
- **No Discontinued Rich Result Schema:** `FAQPage` schema was excluded. Visible FAQ items remain clean semantic HTML.
- **No Artificial Breadcrumbs:** Flat top-level pages (`/about`, `/contact`, `/faq`, etc.) have no artificial parent-child breadcrumbs. Breadcrumbs are strictly limited to the 6 hierarchical service pages (`/services/[slug]`).
- **No Fabricated Data:** Zero fake reviews, zero invented GPS coordinates, zero artificial pricing, and zero `SearchAction` sitelinks markup.

---

## 12. Verification & Local Validation Results

| Check | Tool / Command | Result |
|---|---|---|
| **Frontend ESLint** | `npm run lint --prefix apps/web` | ✅ **0 errors, 0 warnings** |
| **Frontend TypeScript** | `tsc --noEmit -p apps/web/tsconfig.json` | ✅ **0 errors** |
| **Production Build** | `npm run build --prefix apps/web` | ✅ **Exit code 0** (33 routes built cleanly) |
| **HTML JSON-LD Extraction** | Built `.html` validation script | ✅ Verified on all 6 service pages: Valid JSON, correct `Service` & `BreadcrumbList` blocks |
| **Label Parity Check** | Breadcrumb UI vs JSON-LD | ✅ 100% parity (`Home` ➔ `Our Services` ➔ `[Service Name]`) |
| **Address Privacy Check** | JSON-LD inspection | ✅ Confirmed: 0 address properties present in JSON-LD |
| **Clean Non-Service Pages** | Static page check | ✅ Confirmed: 0 accidental JSON-LD on `/about`, `/contact`, `/faq`, etc. |

---

## 13. Current Status & Readiness for Review

1. **Phase 1 (Foundation):** ✅ **Complete & Live Verified.**
2. **Phase 2 (On-Page SEO):** ✅ **Complete & Live Verified.**
3. **Phase 3 (Structured Data & Breadcrumbs):** ✅ **Complete & Live Verified.**

All three SEO phases are now fully implemented, validated locally, and verified live on production at `https://kobbysintertechservices.online`.
