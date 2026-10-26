import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { CreateEnquiryDto } from './dto/create-enquiry.dto.js';
import { createPublicRequestReference } from './request-status.js';
import { ServiceRequestStatus, type Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class ServiceRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createPublicEnquiry(input: CreateEnquiryDto, idempotencyKey?: string) {
    const normalizedIdempotencyKey = idempotencyKey?.trim();
    if (normalizedIdempotencyKey && normalizedIdempotencyKey.length > 128) {
      throw new BadRequestException('Idempotency-Key must be 128 characters or fewer.');
    }

    if (normalizedIdempotencyKey) {
      const existing = await this.prisma.serviceRequest.findUnique({
        where: { idempotencyKey: normalizedIdempotencyKey },
      });
      if (existing) return this.toPublicResponse(existing);
    }

    const service = await this.prisma.service.findFirst({
      where: { slug: input.serviceSlug, isActive: true },
    });
    if (!service) throw new NotFoundException('The selected service is unavailable.');

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const request = await this.prisma.$transaction(async (tx) => {
          // Look up existing customer by email (if provided) else by phone
          const existingCustomer = await tx.customer.findFirst({
            where: input.email
              ? { email: input.email.toLowerCase() }
              : { phone: input.phone.trim() },
            orderBy: { createdAt: 'asc' },
          });
          const customer = existingCustomer
            ? await tx.customer.update({
                where: { id: existingCustomer.id },
                data: {
                  fullName: input.fullName.trim(),
                  organisationName: input.organisationName?.trim(),
                  phone: input.phone.trim(),
                  // Only update email if newly provided (don't wipe an existing one)
                  ...(input.email ? { email: input.email.toLowerCase() } : {}),
                  preferredContactMethod: input.preferredContactMethod,
                },
              })
            : await tx.customer.create({
                data: {
                  fullName: input.fullName.trim(),
                  organisationName: input.organisationName?.trim(),
                  email: input.email?.toLowerCase() ?? null,
                  phone: input.phone.trim(),
                  preferredContactMethod: input.preferredContactMethod,
                },
              });

          const created = await tx.serviceRequest.create({
            data: {
              reference: createPublicRequestReference(),
              idempotencyKey: normalizedIdempotencyKey,
              customerId: customer.id,
              serviceId: service.id,
              description: input.description.trim(),
              address: input.address.trim(),
              gpsAddress: input.gpsAddress?.trim(),
              preferredDate: input.preferredDate ? new Date(input.preferredDate) : undefined,
              timeWindow: input.timeWindow?.trim(),
              events: {
                create: {
                  eventType: 'ENQUIRY_RECEIVED',
                  newStatus: 'REQUESTED',
                  customerVisible: true,
                  detail: { source: 'WEBSITE', privacyAccepted: input.privacyAccepted },
                },
              },
            },
          });

          return created;
        });

        // Trigger instant admin email alert via Resend asynchronously (non-blocking)
        void this.notificationsService.sendNewBookingNotification({
          id: request.id,
          reference: request.reference,
          description: request.description,
          address: request.address,
          gpsAddress: request.gpsAddress,
          preferredDate: request.preferredDate,
          timeWindow: request.timeWindow,
          createdAt: request.createdAt,
          customer: {
            fullName: input.fullName.trim(),
            email: input.email?.toLowerCase(),
            phone: input.phone.trim(),
            organisationName: input.organisationName?.trim(),
            preferredContactMethod: input.preferredContactMethod,
          },
          service: {
            name: service.name,
            slug: service.slug,
          },
        });


        return this.toPublicResponse(request);
      } catch (error) {
        if (this.isUniqueViolation(error) && normalizedIdempotencyKey) {
          const existing = await this.prisma.serviceRequest.findUnique({
            where: { idempotencyKey: normalizedIdempotencyKey },
          });
          if (existing) return this.toPublicResponse(existing);
        }
        if (this.isUniqueViolation(error) && attempt < 2) continue;
        throw error;
      }
    }

    throw new BadRequestException('Unable to create the enquiry. Please try again.');
  }

  async findAll(status?: ServiceRequestStatus, search?: string) {
    const where: Prisma.ServiceRequestWhereInput = {};

    if (status && Object.values(ServiceRequestStatus).includes(status)) {
      where.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { reference: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
        { gpsAddress: { contains: q, mode: 'insensitive' } },
        { customer: { fullName: { contains: q, mode: 'insensitive' } } },
        { customer: { email: { contains: q, mode: 'insensitive' } } },
        { customer: { phone: { contains: q, mode: 'insensitive' } } },
        { customer: { organisationName: { contains: q, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.serviceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        service: true,
        events: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.serviceRequest.findFirst({
      where: {
        OR: [{ id }, { reference: id }],
      },
      include: {
        customer: true,
        service: true,
        events: {
          orderBy: { createdAt: 'desc' },
        },
        appointments: true,
        quotes: true,
        workOrders: true,
      },
    });
    if (!request) throw new NotFoundException('Service request not found.');
    return request;
  }

  async updateStatus(id: string, newStatus: ServiceRequestStatus, note?: string, actorUserId?: string) {
    const existing = await this.prisma.serviceRequest.findFirst({
      where: { OR: [{ id }, { reference: id }] },
    });
    if (!existing) throw new NotFoundException('Service request not found.');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.serviceRequest.update({
        where: { id: existing.id },
        data: { status: newStatus },
      });

      await tx.requestEvent.create({
        data: {
          requestId: existing.id,
          eventType: 'STATUS_UPDATED',
          oldStatus: existing.status,
          newStatus,
          actorUserId,
          customerVisible: true,
          detail: note ? { note } : undefined,
        },
      });

      if (actorUserId) {
        await tx.auditLog.create({
          data: {
            actorUserId,
            action: 'SERVICE_REQUEST_STATUS_UPDATED',
            entityType: 'ServiceRequest',
            entityId: existing.id,
            metadata: { oldStatus: existing.status, newStatus, ...(note ? { note } : {}) },
          },
        });
      }

      return updated;
    });
  }

  async remove(id: string, actorUserId?: string) {
    const existing = await this.prisma.serviceRequest.findFirst({
      where: { OR: [{ id }, { reference: id }] },
    });
    if (!existing) throw new NotFoundException('Service request not found.');

    await this.prisma.$transaction(async (tx) => {
      if (actorUserId) {
        await tx.auditLog.create({
          data: {
            actorUserId,
            action: 'SERVICE_REQUEST_DELETED',
            entityType: 'ServiceRequest',
            entityId: existing.id,
            metadata: { reference: existing.reference },
          },
        });
      }
      await tx.serviceRequest.delete({ where: { id: existing.id } });
    });
    return { success: true, id: existing.id, reference: existing.reference };
  }

  private toPublicResponse(request: { reference: string; status: string; createdAt: Date }) {
    return {
      reference: request.reference,
      status: request.status,
      receivedAt: request.createdAt.toISOString(),
    };
  }

  private isUniqueViolation(error: unknown) {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
  }
}
