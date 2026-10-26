import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { STAFF_ROLES } from '../auth/admin-roles.js';

@Injectable()
export class AdminDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalBookings,
      newRequested,
      inProgress,
      completedThisMonth,
      upcomingVisits,
      pendingAction,
      totalGalleryPhotos,
      totalStaff,
    ] = await Promise.all([
      // Total service requests ever
      this.prisma.serviceRequest.count(),

      // New / unread (status = REQUESTED)
      this.prisma.serviceRequest.count({ where: { status: 'REQUESTED' } }),

      // Currently in progress
      this.prisma.serviceRequest.count({ where: { status: 'IN_PROGRESS' } }),

      // Completed this calendar month
      this.prisma.serviceRequest.count({
        where: {
          status: 'COMPLETED',
          updatedAt: { gte: startOfMonth },
        },
      }),

      // Upcoming (confirmed or site visit required)
      this.prisma.serviceRequest.count({
        where: {
          status: { in: ['CONFIRMED', 'SITE_VISIT_REQUIRED'] },
        },
      }),

      // Pending action (REQUESTED + UNDER_REVIEW + QUOTATION_PENDING)
      this.prisma.serviceRequest.count({
        where: {
          status: { in: ['REQUESTED', 'UNDER_REVIEW', 'QUOTATION_PENDING'] },
        },
      }),

      // Total gallery photos
      this.prisma.galleryPhoto.count(),

      // Total active staff members (with staff portal roles)
      this.prisma.user.count({
        where: {
          accountStatus: 'ACTIVE',
          roles: {
            some: {
              role: {
                name: { in: [...STAFF_ROLES] },
              },
            },
          },
        },
      }),
    ]);

    return {
      totalBookings,
      newRequested,
      inProgress,
      completedThisMonth,
      upcomingVisits,
      pendingAction,
      totalGalleryPhotos,
      totalStaff,
      generatedAt: now.toISOString(),
    };
  }
}
