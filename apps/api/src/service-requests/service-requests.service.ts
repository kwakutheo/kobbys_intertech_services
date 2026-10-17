import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { CreateEnquiryDto } from './dto/create-enquiry.dto.js';
import { createPublicRequestReference } from './request-status.js';

@Injectable()
export class ServiceRequestsService {
  constructor(private readonly prisma: PrismaService) {}

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
          const existingCustomer = await tx.customer.findFirst({
            where: { email: input.email.toLowerCase() },
            orderBy: { createdAt: 'asc' },
          });
          const customer = existingCustomer
            ? await tx.customer.update({
                where: { id: existingCustomer.id },
                data: {
                  fullName: input.fullName.trim(),
                  organisationName: input.organisationName?.trim(),
                  phone: input.phone.trim(),
                  preferredContactMethod: input.preferredContactMethod,
                },
              })
            : await tx.customer.create({
                data: {
                  fullName: input.fullName.trim(),
                  organisationName: input.organisationName?.trim(),
                  email: input.email.toLowerCase(),
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
