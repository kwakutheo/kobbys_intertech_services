-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public._prisma_migrations (
  id character varying NOT NULL,
  checksum character varying NOT NULL,
  finished_at timestamp with time zone,
  migration_name character varying NOT NULL,
  logs text,
  rolled_back_at timestamp with time zone,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  applied_steps_count integer NOT NULL DEFAULT 0,
  CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.User (
  id uuid NOT NULL,
  email text NOT NULL,
  passwordHash text NOT NULL,
  accountStatus USER-DEFINED NOT NULL DEFAULT 'INVITED'::"AccountStatus",
  emailVerifiedAt timestamp without time zone,
  lastLoginAt timestamp without time zone,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  displayName text,
  CONSTRAINT User_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Role (
  id uuid NOT NULL,
  name text NOT NULL,
  description text,
  CONSTRAINT Role_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Permission (
  id uuid NOT NULL,
  key text NOT NULL,
  description text,
  CONSTRAINT Permission_pkey PRIMARY KEY (id)
);
CREATE TABLE public.UserRole (
  userId uuid NOT NULL,
  roleId uuid NOT NULL,
  CONSTRAINT UserRole_pkey PRIMARY KEY (userId, roleId),
  CONSTRAINT UserRole_userId_fkey FOREIGN KEY (userId) REFERENCES public.User(id),
  CONSTRAINT UserRole_roleId_fkey FOREIGN KEY (roleId) REFERENCES public.Role(id)
);
CREATE TABLE public.RolePermission (
  roleId uuid NOT NULL,
  permissionId uuid NOT NULL,
  CONSTRAINT RolePermission_pkey PRIMARY KEY (roleId, permissionId),
  CONSTRAINT RolePermission_roleId_fkey FOREIGN KEY (roleId) REFERENCES public.Role(id),
  CONSTRAINT RolePermission_permissionId_fkey FOREIGN KEY (permissionId) REFERENCES public.Permission(id)
);
CREATE TABLE public.Customer (
  id uuid NOT NULL,
  userId uuid,
  fullName text NOT NULL,
  organisationName text,
  phone text NOT NULL,
  email text,
  preferredContactMethod text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Customer_pkey PRIMARY KEY (id),
  CONSTRAINT Customer_userId_fkey FOREIGN KEY (userId) REFERENCES public.User(id)
);
CREATE TABLE public.Service (
  id uuid NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL,
  formSchema jsonb,
  displayOrder integer NOT NULL DEFAULT 0,
  isActive boolean NOT NULL DEFAULT true,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Service_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ServiceRequest (
  id uuid NOT NULL,
  reference text NOT NULL,
  customerId uuid NOT NULL,
  serviceId uuid NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  gpsAddress text,
  status USER-DEFINED NOT NULL DEFAULT 'REQUESTED'::"ServiceRequestStatus",
  source text NOT NULL DEFAULT 'WEBSITE'::text,
  preferredDate timestamp without time zone,
  timeWindow text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  idempotencyKey text,
  CONSTRAINT ServiceRequest_pkey PRIMARY KEY (id),
  CONSTRAINT ServiceRequest_customerId_fkey FOREIGN KEY (customerId) REFERENCES public.Customer(id),
  CONSTRAINT ServiceRequest_serviceId_fkey FOREIGN KEY (serviceId) REFERENCES public.Service(id)
);
CREATE TABLE public.RequestEvent (
  id uuid NOT NULL,
  requestId uuid NOT NULL,
  actorUserId uuid,
  eventType text NOT NULL,
  oldStatus USER-DEFINED,
  newStatus USER-DEFINED,
  customerVisible boolean NOT NULL DEFAULT false,
  detail jsonb,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT RequestEvent_pkey PRIMARY KEY (id),
  CONSTRAINT RequestEvent_requestId_fkey FOREIGN KEY (requestId) REFERENCES public.ServiceRequest(id),
  CONSTRAINT RequestEvent_actorUserId_fkey FOREIGN KEY (actorUserId) REFERENCES public.User(id)
);
CREATE TABLE public.Appointment (
  id uuid NOT NULL,
  requestId uuid NOT NULL,
  startAt timestamp without time zone NOT NULL,
  endAt timestamp without time zone NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'REQUESTED'::"AppointmentStatus",
  location text NOT NULL,
  rescheduledFromId uuid,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Appointment_pkey PRIMARY KEY (id),
  CONSTRAINT Appointment_rescheduledFromId_fkey FOREIGN KEY (rescheduledFromId) REFERENCES public.Appointment(id),
  CONSTRAINT Appointment_requestId_fkey FOREIGN KEY (requestId) REFERENCES public.ServiceRequest(id)
);
CREATE TABLE public.AppointmentAssignment (
  appointmentId uuid NOT NULL,
  staffUserId uuid NOT NULL,
  CONSTRAINT AppointmentAssignment_pkey PRIMARY KEY (appointmentId, staffUserId),
  CONSTRAINT AppointmentAssignment_appointmentId_fkey FOREIGN KEY (appointmentId) REFERENCES public.Appointment(id),
  CONSTRAINT AppointmentAssignment_staffUserId_fkey FOREIGN KEY (staffUserId) REFERENCES public.User(id)
);
CREATE TABLE public.Quote (
  id uuid NOT NULL,
  requestId uuid NOT NULL,
  quoteNumber text NOT NULL,
  version integer NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'DRAFT'::"QuoteStatus",
  currency text NOT NULL DEFAULT 'GHS'::text,
  subtotal numeric NOT NULL,
  taxAmount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL,
  validUntil timestamp without time zone,
  scope text,
  exclusions text,
  paymentTerms text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Quote_pkey PRIMARY KEY (id),
  CONSTRAINT Quote_requestId_fkey FOREIGN KEY (requestId) REFERENCES public.ServiceRequest(id)
);
CREATE TABLE public.QuoteItem (
  id uuid NOT NULL,
  quoteId uuid NOT NULL,
  description text NOT NULL,
  quantity numeric NOT NULL,
  unitPrice numeric NOT NULL,
  lineTotal numeric NOT NULL,
  CONSTRAINT QuoteItem_pkey PRIMARY KEY (id),
  CONSTRAINT QuoteItem_quoteId_fkey FOREIGN KEY (quoteId) REFERENCES public.Quote(id)
);
CREATE TABLE public.QuoteEvent (
  id uuid NOT NULL,
  quoteId uuid NOT NULL,
  eventType text NOT NULL,
  actorUserId uuid,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT QuoteEvent_pkey PRIMARY KEY (id),
  CONSTRAINT QuoteEvent_quoteId_fkey FOREIGN KEY (quoteId) REFERENCES public.Quote(id),
  CONSTRAINT QuoteEvent_actorUserId_fkey FOREIGN KEY (actorUserId) REFERENCES public.User(id)
);
CREATE TABLE public.WorkOrder (
  id uuid NOT NULL,
  requestId uuid NOT NULL,
  appointmentId uuid,
  quoteId uuid,
  status USER-DEFINED NOT NULL DEFAULT 'DRAFT'::"WorkOrderStatus",
  scope text NOT NULL,
  startedAt timestamp without time zone,
  completedAt timestamp without time zone,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT WorkOrder_pkey PRIMARY KEY (id),
  CONSTRAINT WorkOrder_requestId_fkey FOREIGN KEY (requestId) REFERENCES public.ServiceRequest(id),
  CONSTRAINT WorkOrder_appointmentId_fkey FOREIGN KEY (appointmentId) REFERENCES public.Appointment(id),
  CONSTRAINT WorkOrder_quoteId_fkey FOREIGN KEY (quoteId) REFERENCES public.Quote(id)
);
CREATE TABLE public.WorkOrderAssignment (
  workOrderId uuid NOT NULL,
  staffUserId uuid NOT NULL,
  assignmentRole text NOT NULL,
  CONSTRAINT WorkOrderAssignment_pkey PRIMARY KEY (workOrderId, staffUserId),
  CONSTRAINT WorkOrderAssignment_workOrderId_fkey FOREIGN KEY (workOrderId) REFERENCES public.WorkOrder(id),
  CONSTRAINT WorkOrderAssignment_staffUserId_fkey FOREIGN KEY (staffUserId) REFERENCES public.User(id)
);
CREATE TABLE public.WorkLog (
  id uuid NOT NULL,
  workOrderId uuid NOT NULL,
  staffUserId uuid NOT NULL,
  note text NOT NULL,
  visibility USER-DEFINED NOT NULL DEFAULT 'INTERNAL'::"RecordVisibility",
  loggedAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT WorkLog_pkey PRIMARY KEY (id),
  CONSTRAINT WorkLog_workOrderId_fkey FOREIGN KEY (workOrderId) REFERENCES public.WorkOrder(id),
  CONSTRAINT WorkLog_staffUserId_fkey FOREIGN KEY (staffUserId) REFERENCES public.User(id)
);
CREATE TABLE public.Attachment (
  id uuid NOT NULL,
  requestId uuid,
  workOrderId uuid,
  storageKey text NOT NULL,
  mimeType text NOT NULL,
  visibility USER-DEFINED NOT NULL DEFAULT 'INTERNAL'::"RecordVisibility",
  uploadedBy uuid,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Attachment_pkey PRIMARY KEY (id),
  CONSTRAINT Attachment_requestId_fkey FOREIGN KEY (requestId) REFERENCES public.ServiceRequest(id),
  CONSTRAINT Attachment_workOrderId_fkey FOREIGN KEY (workOrderId) REFERENCES public.WorkOrder(id),
  CONSTRAINT Attachment_uploadedBy_fkey FOREIGN KEY (uploadedBy) REFERENCES public.User(id)
);
CREATE TABLE public.Notification (
  id uuid NOT NULL,
  userId uuid,
  channel USER-DEFINED NOT NULL,
  templateKey text NOT NULL,
  deliveryStatus USER-DEFINED NOT NULL DEFAULT 'PENDING'::"DeliveryStatus",
  attemptCount integer NOT NULL DEFAULT 0,
  sentAt timestamp without time zone,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Notification_pkey PRIMARY KEY (id),
  CONSTRAINT Notification_userId_fkey FOREIGN KEY (userId) REFERENCES public.User(id)
);
CREATE TABLE public.NotificationJob (
  id uuid NOT NULL,
  eventKey text NOT NULL,
  payload jsonb NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'PENDING'::"DeliveryStatus",
  nextAttemptAt timestamp without time zone,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT NotificationJob_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Review (
  id uuid NOT NULL,
  requestId uuid NOT NULL,
  customerId uuid NOT NULL,
  rating integer NOT NULL,
  comment text,
  moderationStatus text NOT NULL DEFAULT 'PENDING'::text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Review_pkey PRIMARY KEY (id),
  CONSTRAINT Review_requestId_fkey FOREIGN KEY (requestId) REFERENCES public.ServiceRequest(id),
  CONSTRAINT Review_customerId_fkey FOREIGN KEY (customerId) REFERENCES public.Customer(id)
);
CREATE TABLE public.Project (
  id uuid NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  serviceId uuid,
  description text NOT NULL,
  publishedAt timestamp without time zone,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Project_pkey PRIMARY KEY (id),
  CONSTRAINT Project_serviceId_fkey FOREIGN KEY (serviceId) REFERENCES public.Service(id)
);
CREATE TABLE public.ProjectMedia (
  id uuid NOT NULL,
  projectId uuid NOT NULL,
  storageKey text NOT NULL,
  altText text NOT NULL,
  displayOrder integer NOT NULL DEFAULT 0,
  CONSTRAINT ProjectMedia_pkey PRIMARY KEY (id),
  CONSTRAINT ProjectMedia_projectId_fkey FOREIGN KEY (projectId) REFERENCES public.Project(id)
);
CREATE TABLE public.AuditLog (
  id uuid NOT NULL,
  actorUserId uuid,
  action text NOT NULL,
  entityType text NOT NULL,
  entityId text NOT NULL,
  metadata jsonb,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT AuditLog_pkey PRIMARY KEY (id),
  CONSTRAINT AuditLog_actorUserId_fkey FOREIGN KEY (actorUserId) REFERENCES public.User(id)
);
CREATE TABLE public.ConsentRecord (
  id uuid NOT NULL,
  customerId uuid NOT NULL,
  purpose text NOT NULL,
  policyVersion text NOT NULL,
  recordedAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  withdrawnAt timestamp without time zone,
  CONSTRAINT ConsentRecord_pkey PRIMARY KEY (id),
  CONSTRAINT ConsentRecord_customerId_fkey FOREIGN KEY (customerId) REFERENCES public.Customer(id)
);
CREATE TABLE public.GalleryPhoto (
  id uuid NOT NULL,
  filename text NOT NULL,
  caption text,
  takenAt timestamp without time zone,
  uploadedAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sortOrder integer NOT NULL DEFAULT 0,
  url text,
  r2Key text,
  category text,
  CONSTRAINT GalleryPhoto_pkey PRIMARY KEY (id)
);
CREATE TABLE public.StaffAccessToken (
  id uuid NOT NULL,
  userId uuid NOT NULL,
  tokenHash text NOT NULL,
  purpose USER-DEFINED NOT NULL,
  expiresAt timestamp without time zone NOT NULL,
  consumedAt timestamp without time zone,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT StaffAccessToken_pkey PRIMARY KEY (id),
  CONSTRAINT StaffAccessToken_userId_fkey FOREIGN KEY (userId) REFERENCES public.User(id)
);