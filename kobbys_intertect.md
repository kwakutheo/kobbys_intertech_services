# Kobby’s Intertech Services — Implementation-Ready Website Specification

Project brief · Version 1.0 · 16 October 2026

## 1. Project overview

The objective is to build a complete, professional website and business management system for Kobby’s Intertech Services, an Accra-based technology, security, and communications service provider.

The system must do more than advertise services. It should enable customers to discover services, submit enquiries, book appointments, track service requests, receive updates, and communicate with the company. Authorised staff must be able to manage the entire workflow from a secure administration dashboard.

## Project objectives

Establish a professional, mobile-friendly online presence using the company's red, black, and white branding.

Generate qualified leads and service quotations through structured online forms and WhatsApp.

Manage appointments, technicians, job assignments, customer communication, and service completion.

Give customers secure access to their service requests and booking progress.

Provide management with operational reports, customer records, service history, and audit logs.

### Confirmed scope

- Business website and full customer booking and management system.
- Vehicle rentals are excluded.
- Customer tracking must cover the complete service-request lifecycle.
- A business email address already exists.
- Domain selection and availability still need to be established.
- The complete system is to be built as one planned solution, with internal development milestones and testing gates.

### Services in scope

1. CCTV security camera installation, configuration, and maintenance.
2. Fibre-optic installation and internet connectivity.
3. Network design, installation, and troubleshooting.
4. Satellite installation and signal support.
5. Electrical works within the company's qualifications and authorisations.
6. GPS vehicle tracking installation and support.
7. Master of ceremonies (MC) and event-hosting services.

Only services the company actually provides should be published. The supplied flyers also mention reliable, secure, professional service and 24/7 support; these claims must be confirmed before publication.

## 2. Recommended technical architecture

I recommend a modern TypeScript-based web application with a separate logical API layer, a relational database, secure media storage, and managed deployment.

Customer-facing website

Public pages · Customer portal · Booking forms

HTTPS / authenticated API requests

Application backend

Authentication · Bookings · Jobs · Quotations · Notifications · Permissions

PostgreSQL

Business and operational data

Object storage

Project photos and job attachments

Email / messaging

Booking confirmations and updates

Monitoring

Errors, uptime and audit records

Logical architecture; components may be deployed separately or together depending on the final hosting configuration.

### Proposed technology stack

| Component      | Recommendation                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| Frontend       | Next.js, React, TypeScript                                                                             |
| Styling        | Tailwind CSS and reusable accessible components                                                        |
| Backend        | NestJS with TypeScript                                                                                 |
| Database       | PostgreSQL                                                                                             |
| Data access    | Prisma ORM with version-controlled migrations                                                          |
| Authentication | Secure session-based authentication or short-lived access tokens with secure refresh handling          |
| File storage   | Managed S3-compatible object storage                                                                   |
| Email          | Existing business email through a supported transactional email provider or authenticated SMTP service |
| Messaging      | WhatsApp click-to-chat initially; approved WhatsApp Business API integration if automation is required |
| Hosting        | Managed Next.js hosting plus managed API hosting and PostgreSQL                                        |
| Source control | Private Git repository with protected production branch                                                |
| Monitoring     | Application error monitoring, uptime checks, structured logs and database backup monitoring            |

These are recommendations, not prerequisites to use every technology independently. The developer should verify provider compatibility, costs, regional performance, and support before committing to a deployment configuration.

## 3. Sitemap and page requirements

The website should have three distinct areas: the public website, the customer portal, and the internal management system.

## A. Public website

- Home — `/`
- About Us — `/about`
- All Services — `/services`
- Service details — `/services/[slug]`
- Projects and case studies — `/projects` and `/projects/[slug]`
- Request a quotation — `/request-quote`
- Book a service — `/book-service`
- Frequently asked questions — `/faq`
- Contact — `/contact`
- Privacy policy — `/privacy`
- Terms of service — `/terms`
- Booking terms — `/booking-terms`

## B. Customer portal

- Register — `/register`
- Sign in — `/login`
- Verify email — `/verify-email`
- Forgot/reset password — `/forgot-password`, `/reset-password`
- Customer dashboard — `/portal`
- My service requests — `/portal/requests`
- Request details and tracking — `/portal/requests/[reference]`
- Appointments — `/portal/appointments`
- Quotations — `/portal/quotes`
- Messages and notifications — `/portal/notifications`
- Profile and privacy — `/portal/profile`

## C. Administration and staff portal

- Dashboard — `/admin`
- Enquiries and leads — `/admin/enquiries`
- Customers — `/admin/customers`
- Service requests — `/admin/requests`
- Bookings and calendar — `/admin/bookings`
- Quotations — `/admin/quotes`
- Work orders — `/admin/jobs`
- Technicians and staff — `/admin/staff`
- Service catalogue — `/admin/services`
- Projects and testimonials — `/admin/content`
- Customer communications — `/admin/communications`
- Reports — `/admin/reports`
- User permissions and audit logs — `/admin/settings/users`, `/admin/settings/audit-logs`
- Business settings — `/admin/settings`

The public service catalogue, contact information and project gallery should be accessible without an account. Customers should be encouraged to register or sign in for convenient ongoing tracking, but an initial enquiry should not be blocked by mandatory registration.

### Page-level requirements

| Page               | Required functionality                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| Home               | Service highlights, prominent quote and booking CTAs, real project photos, contact details, reviews |
| Services           | Searchable or categorised service list, descriptions, service-area information                      |
| Service detail     | Inclusions, exclusions, process, FAQs, related projects and booking CTA                             |
| Projects           | Filterable gallery with approved photographs and project details                                    |
| Request a quote    | Service-specific questions, location, contact details, attachments and consent notice               |
| Book a service     | Service selection, site details, preferred date/time and confirmation of request receipt            |
| Customer dashboard | Active requests, upcoming appointments, quotations awaiting action and recent updates               |
| Request tracking   | Status timeline, appointments, quotation information, authorised messages and job history           |
| Admin dashboard    | Operational KPIs, overdue follow-ups, pending requests, upcoming jobs and workload                  |
| Reports            | Date-filtered operational reports with CSV export and appropriate access restrictions               |

## 4. Complete booking and service-management workflow

The core of this system is the workflow that takes a potential customer from first contact to a completed job.

#### 01

### Customer submits enquiry

Website form, phone-assisted staff entry or WhatsApp lead entered by staff.

#### 02

### Enquiry is reviewed

Staff validate the request, contact the customer and determine the service requirements.

#### 03

### Assessment and quotation

Collect additional details or arrange a site visit, then prepare a quotation.

#### 04

### Customer accepts quotation

Record acceptance and any agreed deposit or payment terms.

#### 05

### Appointment is confirmed

Check technician availability and confirm the date and time.

#### 06

### Work order is assigned

Assign a technician or team, record the job scope and required equipment.

#### 07

### Installation or service

Record progress, findings, approved changes, photographs and completion evidence.

#### 08

### Completion and closure

Customer confirms completion, final documentation is recorded, and feedback is requested.

This is the normal path, not a rigid sequence for every service. A customer may request a straightforward installation without a formal site survey, or an enquiry may be closed without a booking.

### 4.1 Booking status model

Implement explicit, validated status transitions rather than allowing staff to set any arbitrary status.

| Status                | Meaning                                                    |
| --------------------- | ---------------------------------------------------------- |
| `REQUESTED`           | Customer has submitted a service request                   |
| `UNDER_REVIEW`        | Staff are assessing the requirements                       |
| `AWAITING_CUSTOMER`   | More information is required                               |
| `SITE_VISIT_REQUIRED` | An assessment appointment is needed                        |
| `QUOTATION_PENDING`   | Quotation is being prepared                                |
| `AWAITING_ACCEPTANCE` | Quotation has been sent to the customer                    |
| `AWAITING_PAYMENT`    | An agreed deposit or payment condition remains outstanding |
| `CONFIRMED`           | The booking has been confirmed                             |
| `ASSIGNED`            | A technician or team has been assigned                     |
| `IN_PROGRESS`         | Work has started                                           |
| `COMPLETED`           | Work has been marked complete                              |
| `CLOSED`              | The job has been administratively closed                   |
| `CANCELLED`           | The request or booking was cancelled                       |
| `DECLINED`            | The company cannot accept the request                      |

The developer must define which transitions are permitted. For example, a request should not be marked `COMPLETED` before it has been assigned and work has begun, except through a documented administrative override.

Maintain a separate appointment status and quotation status. A quotation can expire while an enquiry remains open; an appointment can be rescheduled without reopening a completed quotation.

### 4.2 Booking form fields

The booking form should dynamically adapt to the selected service.

Common fields:

- Customer name and organisation, if applicable.
- Email address and telephone number.
- Service category and requested service.
- Property or installation location, including town and GhanaPost GPS address where available.
- Description of the issue or requested installation.
- Preferred date and time window.
- Site contact person, if different.
- Optional photos, diagrams or supporting documents.
- Preferred communication method.
- Acknowledgement of the privacy notice and booking terms.

Service-specific fields should be configured by administrators or implemented as typed, validated form schemas. Avoid collecting unnecessary personal information.

### 4.3 Customer tracking

Every request should have a unique, non-sequential public reference, for example `KIS-SRV-7F4K2P`.

The customer portal should display:

- Reference number and service type.
- Current status and last updated time.
- A chronological timeline of customer-visible events.
- Upcoming appointments and rescheduling requests.
- Quotation amount, scope, validity and acceptance status.
- Messages and requests for additional information.
- Job completion summary and downloadable documents, when authorised.
- Contact options for follow-up.

Customers must only access their own records. A reference number alone must never grant access to private job information.

For customers who do not want an account, provide a secure tracking link sent to their verified email or phone. Such links must use high-entropy, expiring tokens, be revocable, and expose only a limited set of customer-visible details.

### 4.4 Notifications

Send notifications for meaningful events, including:

- Enquiry received.
- More information required.
- Site visit requested or confirmed.
- Quotation issued or nearing expiry.
- Booking confirmed, rescheduled or cancelled.
- Technician assignment, where appropriate.
- Work started or delayed.
- Work completed.
- Feedback requested.

Email should be the initial automated channel. WhatsApp or SMS automation can be added through an approved provider after the company confirms its messaging preferences and budget.

Notifications must be queued and retried safely. A failed email must not undo a valid booking, and duplicate event processing must not send repeated messages.

## 5. Quotation, work-order and field-service management

A full management system should include more than booking forms.

### Quotation management

Authorised staff should be able to:

- Create quotations from service requests.
- Add labour, materials, call-out fees, discounts and applicable taxes.
- Specify inclusions, exclusions, validity and payment terms.
- Generate a branded PDF.
- Send a secure link to the customer.
- Record acceptance, rejection or expiry.
- Maintain revisions and a history of changes.

The company must confirm its pricing and tax rules. The system should not assume all services have fixed prices.

### Work orders

Once a booking is confirmed, staff should be able to create a work order containing:

- Linked customer, request, quotation and appointment.
- Job address and customer contact.
- Job description and agreed scope.
- Assigned technician or team.
- Planned start time and estimated duration.
- Materials or equipment checklist.
- Internal notes and customer-visible updates.
- Start, pause and completion timestamps.
- Work performed, test results and completion photos.
- Customer acceptance or documented reason why acceptance was unavailable.

Internal technician notes must remain separate from customer-visible updates.

### Technician management

The system should support:

- Staff accounts and role assignments.
- Skills or service specialisations.
- Working hours, leave and availability.
- Job assignment and reassignment.
- Daily and weekly schedules.
- Workload views and overdue tasks.
- Technician completion records.

For the first release, manual assignment with a calendar is sufficient. Automatic scheduling and route optimisation should be considered only after actual staff capacity and service-area rules are understood.

### Customer feedback

After a job is completed, invite the customer to rate the service and optionally leave a comment. Reviews should be moderated before publication, and a public testimonial must not reveal a customer's address, security installation layout or other sensitive details.

## 6. Administration dashboard specification

The dashboard should be a functional operational tool, not a decorative analytics page.

## Management overview

Example dashboard structure

New enquiries

# —

Selected date range

Pending bookings

# —

Awaiting action

Active work orders

# —

Not yet closed

Overdue follow-ups

# —

Require attention

Today's operational queue

Upcoming appointments

Filter by technician, date and status

New and unassigned requests

Prioritise enquiries awaiting a response

Jobs requiring completion

Track outstanding work and documentation

Illustrative layout only. The dashes are placeholders, not live business data.

### Required modules and acceptance criteria

| Module            | Minimum requirement                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------- |
| Enquiry CRM       | Search, filters, assignment, follow-up dates, notes, status history and duplicate detection |
| Customer records  | Contact information, consent records, linked requests, quotations and job history           |
| Booking calendar  | Day/week/month views, conflict checks, rescheduling and cancellation records                |
| Quotations        | Editable line items, PDF generation, version history and acceptance tracking                |
| Work orders       | Assignment, progress updates, attachments, checklists and completion records                |
| Staff management  | Create/deactivate accounts, roles, skills and working schedules                             |
| Service catalogue | Publish/unpublish services, descriptions, FAQs and service-specific form fields             |
| Website content   | Manage approved projects, testimonials, FAQs, contact details and homepage content          |
| Notifications     | Templates, delivery status, retry queue and failure visibility                              |
| Reports           | Date range, service, status, staff and lead-source filters; CSV export                      |
| Audit logs        | Record critical changes, actor, timestamp, entity and relevant change metadata              |
| Settings          | Company profile, business hours, appointment rules, email settings and retention settings   |

Reports should distinguish enquiries from confirmed jobs and completed jobs. Revenue, conversion and completion rates must be calculated from clearly defined data, not estimated from booking counts.

### User roles and permissions

Use role-based access control with server-side enforcement.

- Owner / Super Admin: full business configuration, user permissions and all business records.
- Operations Manager: manage enquiries, bookings, quotations, work orders, staff schedules and reports.
- Customer Service Staff: manage customer communication, enquiries, appointments and permitted quotations.
- Technician: view assigned jobs, record progress, upload completion evidence and submit job notes.
- Content Editor: manage public services, projects, FAQs and testimonials without accessing private operational records.
- Customer: access only their own profile, requests, appointments, quotations and authorised documents.

Avoid giving all employees administrator privileges. Access should be based on the minimum permissions needed for each job role.

## 7. Database design

Use PostgreSQL as the primary relational database. The schema should preserve the history of enquiries, quotations, appointments and jobs, rather than storing the entire workflow in one large table.

### 7.1 Core entities and relationships

users

Authentication identities, roles and account status

customers

Customer profile, contacts and preferences

service_requests

Service type, description, location, reference and lifecycle status

quotes

Versions, line items, acceptance

appointments

Dates, availability and rescheduling

work_orders

Job scope, assignment and progress

request_events

Status history and tracking timeline

Simplified relationship diagram. All four operational records link back to the service request; individual work orders also link to assigned staff.

### 7.2 Recommended tables

| Table                     | Important fields                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `users`                   | `id`, `email`, `password_hash`, `account_status`, `email_verified_at`, `last_login_at`                                    |
| `roles`                   | `id`, `name`, `description`                                                                                               |
| `permissions`             | `id`, `key`, `description`                                                                                                |
| `user_roles`              | `user_id`, `role_id`                                                                                                      |
| `role_permissions`        | `role_id`, `permission_id`                                                                                                |
| `customers`               | `id`, `user_id`, `full_name`, `organisation_name`, `phone`, `email`, `preferred_contact_method`                           |
| `services`                | `id`, `name`, `slug`, `description`, `is_active`, `form_schema`, `display_order`                                          |
| `service_requests`        | `id`, `reference`, `customer_id`, `service_id`, `description`, `address`, `gps_address`, `status`, `source`, `created_at` |
| `request_events`          | `id`, `request_id`, `actor_user_id`, `event_type`, `old_status`, `new_status`, `customer_visible`, `created_at`           |
| `appointments`            | `id`, `request_id`, `start_at`, `end_at`, `status`, `location`, `rescheduled_from_id`                                     |
| `appointment_assignments` | `appointment_id`, `staff_user_id`                                                                                         |
| `quotes`                  | `id`, `request_id`, `quote_number`, `version`, `status`, `currency`, `subtotal`, `tax_amount`, `total`, `valid_until`     |
| `quote_items`             | `id`, `quote_id`, `description`, `quantity`, `unit_price`, `line_total`                                                   |
| `quote_events`            | `id`, `quote_id`, `event_type`, `actor_user_id`, `created_at`                                                             |
| `work_orders`             | `id`, `request_id`, `appointment_id`, `quote_id`, `status`, `scope`, `started_at`, `completed_at`                         |
| `work_order_assignments`  | `work_order_id`, `staff_user_id`, `assignment_role`                                                                       |
| `work_logs`               | `id`, `work_order_id`, `staff_user_id`, `note`, `visibility`, `logged_at`                                                 |
| `attachments`             | `id`, `request_id`, `work_order_id`, `storage_key`, `mime_type`, `uploaded_by`, `visibility`                              |
| `notifications`           | `id`, `user_id`, `channel`, `template_key`, `delivery_status`, `attempt_count`, `sent_at`                                 |
| `notification_jobs`       | `id`, `event_key`, `payload`, `status`, `next_attempt_at`                                                                 |
| `reviews`                 | `id`, `request_id`, `customer_id`, `rating`, `comment`, `moderation_status`                                               |
| `content_pages`           | `id`, `slug`, `title`, `body`, `published_at`, `updated_by`                                                               |
| `projects`                | `id`, `title`, `slug`, `service_id`, `description`, `published_at`                                                        |
| `project_media`           | `id`, `project_id`, `storage_key`, `alt_text`, `display_order`                                                            |
| `audit_logs`              | `id`, `actor_user_id`, `action`, `entity_type`, `entity_id`, `metadata`, `created_at`                                     |
| `consent_records`         | `id`, `customer_id`, `purpose`, `policy_version`, `recorded_at`, `withdrawn_at`                                           |

This is the recommended logical schema, not a requirement to create every table exactly as written. For example, the developer can use an existing job-event model instead of creating a second audit-like table if it maintains the required distinction between operational history and security auditing.

### 7.3 Database rules

The implementation must enforce these rules:

- Use UUIDs or another robust internal identifier. Never use sequential database IDs as public tracking references.
- Use foreign keys, unique constraints and indexes for relationships and frequent searches.
- Store timestamps in UTC and render them in the business's configured timezone, initially `Africa/Accra`.
- Store monetary values using fixed-precision decimal types, not floating-point numbers.
- Use database transactions when accepting a quote, confirming a booking, creating a work order, or performing other related multi-record operations.
- Maintain immutable history for quotation revisions, customer-visible status events and important administrative actions.
- Use soft deletion only where it is appropriate; implement retention and permanent-deletion procedures for personal information.
- Keep attachments in private object storage, not directly in publicly accessible application folders.
- Ensure appointment conflict checks are safe when two staff members attempt to book the same resource simultaneously.

For future growth, the schema should support multiple technicians per job, multiple appointments per request, repeat customers and multiple requests per customer without restructuring the system.

## 8. Backend API requirements

Use a versioned REST API, for example `/api/v1`, with OpenAPI/Swagger documentation generated from the backend.

Representative endpoints:

| Method  | Endpoint                                     | Purpose                                    |
| ------- | -------------------------------------------- | ------------------------------------------ |
| `GET`   | `/api/v1/services`                           | List active public services                |
| `POST`  | `/api/v1/enquiries`                          | Submit a public enquiry                    |
| `POST`  | `/api/v1/requests`                           | Create a customer service request          |
| `GET`   | `/api/v1/customer/requests`                  | List the authenticated customer's requests |
| `GET`   | `/api/v1/customer/requests/:id`              | View an authorised request                 |
| `POST`  | `/api/v1/customer/requests/:id/appointments` | Request an appointment                     |
| `POST`  | `/api/v1/customer/requests/:id/messages`     | Submit a customer message                  |
| `GET`   | `/api/v1/customer/quotes`                    | List the customer's quotations             |
| `POST`  | `/api/v1/customer/quotes/:id/accept`         | Accept a valid quotation                   |
| `GET`   | `/api/v1/admin/requests`                     | Search and filter requests                 |
| `PATCH` | `/api/v1/admin/requests/:id/status`          | Apply an authorised status transition      |
| `POST`  | `/api/v1/admin/requests/:id/quotes`          | Create a quotation                         |
| `POST`  | `/api/v1/admin/appointments`                 | Create or confirm an appointment           |
| `POST`  | `/api/v1/admin/work-orders`                  | Create a work order                        |
| `POST`  | `/api/v1/admin/work-orders/:id/assignments`  | Assign staff                               |
| `POST`  | `/api/v1/admin/work-orders/:id/completion`   | Record job completion                      |
| `GET`   | `/api/v1/admin/reports/operations`           | Generate operational report data           |

These are representative endpoint contracts. The final API must include authentication, validation, pagination, error formats, permissions, rate limits and audit requirements for all applicable operations.

### Backend implementation rules

1. Validate all incoming requests using typed DTOs and server-side validation.
2. Enforce ownership and permissions on every protected resource.
3. Use idempotency keys or equivalent safeguards for operations that could otherwise create duplicate bookings, accept a quotation twice or send repeated messages.
4. Prevent conflicting appointments through database-backed concurrency controls.
5. Implement consistent error responses and request correlation IDs.
6. Generate quotation PDFs and process large file uploads asynchronously where appropriate.
7. Keep public API responses separate from internal records; never return internal staff notes, private contact details or audit metadata to customers.
8. Document API endpoints and maintain integration tests for all critical workflows.

## 9. Security, privacy and reliability

The application will hold names, telephone numbers, email addresses, addresses, service histories, and potentially photographs of customers' properties. Security and privacy must be built in from the beginning.

### Required controls

Authentication and account protection

Hash passwords with Argon2id or an appropriately configured bcrypt implementation. Support verified email, password reset, session revocation, login throttling and MFA for administrators.

Authorisation

Enforce role permissions and record ownership on the server. Use deny-by-default access and test for insecure direct object references.

Session and API security

Use HTTPS, secure HttpOnly cookies for browser sessions, appropriate SameSite settings, CSRF protection where applicable, and strict CORS rules. Never expose private secrets in frontend code.

File upload safety

Allow only necessary file types and sizes, inspect uploads, use generated storage keys, and serve private files through authorised short-lived download links.

Application protection

Validate inputs, use parameterised database access, rate-limit public endpoints, protect against XSS and injection, configure security headers and avoid leaking stack traces.

Data protection

Publish a privacy policy, minimise collected data, define retention periods, support appropriate access/correction/deletion requests, and document how third-party processors handle data.

Backups and recovery

Enable managed database backups and point-in-time recovery where supported, protect backups, and test restoration periodically.

Audit and monitoring

Record security-sensitive changes, failed login patterns, permission changes and operational failures. Alert on critical errors without putting passwords, tokens or sensitive customer data in logs.

### Ghana data-protection requirements

Before production, the business should assess its obligations under Ghana's Data Protection Act, 2012 (Act 843), including registration and organisational requirements applicable to its data-controller activities. The Data Protection Commission publishes guidance on registration, privacy policies, lawful processing, security safeguards and data-subject rights.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://dpc.gov.gh\&sz=32)

Data Protection Commission

+2



The developer should not treat a website checkbox as a substitute for the company's broader legal obligations. The business owner should approve the privacy notice, retention schedule, customer communication practices and any relevant data-processing agreements.

### Service-specific privacy risk

Because the company installs CCTV and tracking equipment, its project gallery and job records may expose sensitive information. Never publish live camera feeds, customer login credentials, exact private security layouts, tracking credentials, or unapproved property photographs. Use explicit authorisation before publishing identifiable customer projects.

## 10. Domain and business email strategy

A domain should be short, professional, easy to spell over the phone and consistent with the company's name.

I would shortlist the following names for availability checks, without treating any as confirmed available.

Option 1 — `kobbysintertech.com`

My first choice if available. Short, brand-specific and suitable for growth beyond Ghana.

Option 2 — `kobbysintertech.com.gh`

A Ghana-focused alternative, subject to registrar availability and registration requirements.

Option 3 — `kobbysintertechservices.com`

A closer match to the complete company name, but longer to type and communicate.

Check domain availability, trademark conflicts and social handles before purchasing. For Ghana-specific domain registration, the Ghana Domain Name Registry explains that registrations are handled through accredited registrars.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://moc.gov.gh\&sz=32)

Ministry of Communications



### Email setup

Use the existing business email if it is professionally configured. Confirm that the company controls the domain and has access to its DNS settings before changing anything.

Recommended addresses, if supported by the existing email service:

- `info@yourdomain` — general enquiries.
- `bookings@yourdomain` — booking notifications.
- `support@yourdomain` — customer service.
- `admin@yourdomain` — internal administration, not displayed publicly.

These are suggested mailbox names, not confirmed existing addresses.

Configure SPF, DKIM and DMARC where supported by the chosen email provider. Use a separate transactional email service if the current business mailbox is not suitable for automated notifications. Do not publish internal administrator addresses unnecessarily.

## 11. UI/UX and visual design specification

The supplied flyers should be treated as brand references, not copied directly into the website. The website needs a cleaner layout, consistent typography, better spacing, and a more coherent visual hierarchy.

Primary wine — `#9A001A` 

Brand identity, primary calls to action, selected navigation and important highlights.

Charcoal — `#111216`

Header, dark hero sections, footer and dashboard navigation.

White — `#FFFFFF`

Main content backgrounds, cards and text on dark surfaces.

Light grey — `#F3F4F6`

Section backgrounds, form areas, borders and secondary surfaces.

These are proposed starting colours. Confirm the exact brand palette against the original logo before implementation. Status indicators should use accessible colours with text labels, not colour alone.

### Design requirements

- Responsive layouts for mobile, tablet and desktop.
- Mobile navigation and persistent, unobtrusive contact actions.
- Consistent button, form, card, modal, table and notification components.
- Clear field labels, inline validation and helpful error messages.
- Skeletons or loading indicators for asynchronous actions.
- Empty states, success confirmations and recoverable error states.
- Keyboard accessibility, visible focus indicators and sufficient colour contrast.
- Optimised, authentic project photographs with appropriate alternative text.
- Accessible tables, pagination, filters and confirmation dialogs in the admin dashboard.

Use the current Next.js production guidance for performance, security, metadata and accessibility checks.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://nextjs.org\&sz=32)

Next.js

+1



## 12. Deployment and DevOps

### Recommended environments

Maintain three environments:

1. Development: local developer machines and test data.
2. Staging: production-like environment for acceptance testing, using non-production credentials and test email destinations.
3. Production: the live website, real customer data, live notifications and the approved domain.

Never use a production database as a general development database.

### Deployment workflow

1

Private Git repository

Version control, code review and protected production branch.

2

Automated checks

Linting, type checking, unit tests, integration tests and dependency checks.

3

Staging deployment

Build and deploy a release candidate; run migrations and acceptance tests.

4

Production release

Approved deployment, safe database migration and smoke tests.

5

Monitoring and recovery

Uptime checks, alerts, backups, error monitoring and rollback procedures.

### Deployment checklist

- Configure custom domain and HTTPS.
- Configure production secrets through the hosting provider.
- Separate frontend, API and database environment variables.
- Restrict database access to authorised application connections.
- Apply database migrations through a controlled release process.
- Set up managed backups and test restoration.
- Configure email sender authentication and notification delivery.
- Configure DNS, SPF, DKIM and DMARC where applicable.
- Enable uptime checks, application error alerts and structured logging.
- Set up rate limits and protection for public forms and login endpoints.
- Verify search indexing, sitemap, robots rules and social-sharing metadata.
- Test 404, 500, unavailable-service and expired-session scenarios.
- Confirm rollback and incident-response procedures.

Next.js supports several deployment models, including managed hosting, Node.js servers and Docker. Select the hosting option after confirming the requirements for the frontend, API, database and file storage.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://nextjs.org\&sz=32)

Next.js

+1



## 13. Development priorities and delivery milestones

The full system is the target, but it should still be developed and validated in stages. This reduces the risk of reaching the end with an attractive website whose bookings, permissions or notifications do not work.

| Milestone                     | Deliverables                                                                | Exit criteria                                                      |
| ----------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1. Discovery and design       | Confirmed requirements, brand assets, sitemap, data model and UI designs    | Owner approves scope and workflows                                 |
| 2. Technical foundation       | Repository, environments, database, API, authentication and roles           | CI checks pass; protected routes work                              |
| 3. Public website             | Responsive pages, service catalogue, projects, SEO and contact forms        | Pages work on mobile and desktop; enquiries are stored correctly   |
| 4. Customer portal            | Registration, verification, request history and secure tracking             | Customers cannot access another customer's data                    |
| 5. Operations management      | Enquiries, quotations, appointments, staff assignments and work orders      | Full service lifecycle works end to end                            |
| 6. Communications and reports | Notifications, audit logs, exports and operational reporting                | Events trigger correct notifications and reports match source data |
| 7. Security and acceptance    | Permissions testing, recovery testing, accessibility and performance checks | All critical acceptance tests pass                                 |
| 8. Production launch          | Domain, email, backups, monitoring, staff training and handover             | Owner signs off and can operate the system                         |

A delivery schedule and budget should be agreed after the discovery milestone. It would be misleading to promise a fixed number of days or a fixed cost without knowing the developer's team size, existing assets, payment requirements and final operational rules.

### Testing requirements

The developer must implement automated tests for:

- Registration, email verification, login, password reset and session revocation.
- Customer ownership checks and role-based permissions.
- Enquiry submission and duplicate prevention.
- Booking availability and concurrent booking attempts.
- Quotation creation, revision, expiry and acceptance.
- Work-order assignment, progress and completion.
- Customer-visible status timelines.
- Notification failures, retries and duplicate-event handling.
- File upload restrictions and authorised file access.
- Database migrations, backup restoration and report accuracy.

Run end-to-end tests using separate customer, technician, operations-manager and administrator accounts.

## 14. Definition of done

The system is ready for production only when all of the following are true:

- Every agreed public page is complete and responsive.
- All approved services are manageable through the admin interface.
- Customers can submit requests and receive unique references.
- Customers can securely track requests and view authorised updates.
- Staff can create quotations, confirm appointments and manage work orders.
- Technicians can view assigned work and submit completion records.
- Status transitions are validated and recorded.
- Email notifications work and failed deliveries can be investigated.
- Role permissions are enforced on the backend.
- Private attachments and customer records cannot be accessed by unauthorised users.
- Audit logs capture critical administrative actions.
- Database backups and restoration have been tested.
- Legal notices, data handling procedures and business claims have been approved.
- The live domain, HTTPS, monitoring and production secrets are configured.
- The owner has received documentation, staff training and account handover.

## 15. Decisions that still need confirmation

These are genuine outstanding decisions. The developer should not invent answers for them.

## Outstanding decisions

0 of 10 reviewed

Domain and brand assets

Choose the final domain, confirm ownership of the logo and provide high-resolution brand files.

Contact information

Confirm business email address, WhatsApp number, telephone numbers, social links and official business address.

Service coverage

Confirm towns and regions served, travel charges, minimum call-out fees and any geographic restrictions.

Business hours and availability

Confirm opening hours, emergency service availability, appointment duration and booking lead times.

Pricing and quotations

Decide whether quotations include taxes, deposits, call-out fees, discounts, quotation validity and payment terms.

Payments

Decide whether the first release accepts online deposits or payments, and select a provider if required. No payment gateway is assumed in this specification.

Customer accounts

Confirm whether phone-based verification is required, whether guest tracking is offered, and which communication channels customers can choose.

Staff and scheduling

Confirm team size, technician skills, working schedules, leave, assignment rules and who can approve bookings.

Messaging providers

Confirm transactional email access, SMS or WhatsApp automation needs, budget and approved message templates.

Policies and compliance

Approve privacy notice, terms, cancellation and rescheduling rules, retention periods, warranties and data-protection responsibilities.

Copy decision checklist

## Final recommendation

Proceed with a single integrated service-management platform consisting of the public website, customer portal, and internal operations dashboard. Use a shared backend and database so customers, enquiries, quotations, appointments and work orders remain connected throughout their lifecycle.

Keep the first production release focused on reliable booking, secure tracking, staff operations, and customer communication. Online payments, automated WhatsApp messaging and advanced scheduling can be added to the same architecture when the business rules and provider credentials are confirmed.

The next practical step is to approve the outstanding business decisions, choose the domain, and have the developer turn this specification into a repository structure, UI designs, database migrations, API contracts and an implementation task list.