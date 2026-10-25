

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

### 1. Operations & Booking Flow (Highest Immediate Impact)

* **Live Dynamic Dashboard Counters:**
  * Replace the static stats on the dashboard (`/admin`) with real-time database counts:
    * **New Requests (Pending Action)**
    * **Upcoming Site Visits / Confirmed Jobs**
    * **Completed Jobs This Month**
    * **Total Active Gallery Photos**
* **Sidebar Notification Badges:**
  * Display a badge with the count of new/unreviewed bookings (e.g., `Bookings [3]`) directly in the navigation sidebar and topbar so staff never miss a new customer inquiry.
* **Internal Staff Notes & Activity History:**
  * Allow technicians/staff to leave private internal notes on any booking (e.g., *"Called client at 10 AM, rescheduled site visit to Friday afternoon"*, *"Needs 8-port PoE switch instead of 4-port"*).
* **Export to CSV / Excel:**
  * Add a 1-click **"Export Bookings"** button to download records (filtered by date, status, or service) for accounting, weekly team briefings, or client records.
* **Printable Job Sheet / Quote Summary:**
  * A "Print / Save PDF" view for any booking that generates a clean one-page job sheet with the customer's GPS address, requested service, and notes for technicians going into the field.

---

### 2. Client Communication & Automation

* **Automated Status Notifications (Email / SMS / WhatsApp Templates):**
  * When staff changes a booking status to `SITE_VISIT_REQUIRED` or `CONFIRMED`, automatically send a confirmation email or provide a 1-click formatted WhatsApp reply template (e.g. *"Hello [Name], your CCTV installation site visit has been scheduled for [Date]..."*).
* **Automated Follow-ups:**
  * When a job is marked `COMPLETED`, send a follow-up link asking the customer for a review or rating.

---

### 3. Website Content Management (No-Code Updates)

* **Testimonials & Client Reviews Manager:**
  * Add an admin section to approve, edit, and feature real customer reviews on the homepage.
* **FAQ Management:**
  * Enable staff to add or update FAQ items and categories directly from the admin panel without editing code or redeploying.
* **Site Announcement / Banner Toggle:**
  * An admin switch to display a top banner on the live website (e.g., holiday hours, emergency contact notice, or seasonal discounts).

---

### 4. Team & Field Management

* **Technician Assignment:**
  * Allow the Owner to assign specific bookings to individual team members, giving staff an "Assigned to Me" view.
* **Audit Trail / Activity Log:**
  * A simple log showing who did what (e.g., *"Staff A marked Booking #KIS-102 as Confirmed"*, *"Staff B uploaded 3 new photos to Network Infrastructure"*).
