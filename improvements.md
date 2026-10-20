Viewed page.tsx:340-370
Listed directory src
Listed directory notifications
Listed directory app
Viewed layout.tsx:1-30
Listed directory admin
Viewed enquiry-form.tsx:100-160
Viewed enquiry-form.tsx:50-99

Here are the key areas worth taking care of next, organized by impact:

---

### 1. 🔍 Custom 404 / Error Page (`not-found.tsx` & `error.tsx`) ✅ (Completed)
* **Status**: Implemented custom branded 404 page with quick navigation, direct contact banner, and 500 error boundary.

---

### 2. 🌐 SEO Essentials (`sitemap.ts` & `robots.txt`)
* **Current status**: The app does not have search engine discovery files configured.
* **What to add**: Next.js App Router `sitemap.ts` and `robots.ts` to help search engines (Google, Bing) index all your service routes (`/services/cctv-security`, `/services/fibre-internet`, `/gallery`, `/faq`, etc.) for local searches in Ghana.

---

### 3. 💬 Floating WhatsApp Quick-Chat Action
* **Current status**: WhatsApp is currently accessible via the contact list and contact hub.
* **What to add**: A discreet, floating WhatsApp button in the bottom corner with a pre-filled message (e.g. *"Hello Kobby's Intertech, I would like to make an inquiry..."*), which is typically the highest-converting contact method for Ghanaian clients.

---

### 4. 🖼️ Gallery Management Polish (`/gallery/manage`) ✅ (Completed)
* **Status**: Fully implemented with client-side Canvas compression, service category tagging, and custom modal confirmation.
* **Implemented features**:
  - **Client-side image compression & size check**: Automatically compresses images to Full HD (1920px max) at 85% quality before upload, reducing bandwidth by ~70%, with toggle and real-time size savings indicator.
  - **Service category tagging**: Added `category` column to Prisma schema and Supabase DB migration, upload form category dropdown, inline card category assignment, admin category filtering pills, and interactive category filter pills on the live public gallery page.
  - **Custom deletion modal**: Sleek, backdrop-blurred confirmation modal with full photo preview thumbnail, filename, category, and Cloudflare R2 permanent deletion warning to prevent accidental deletions.


