import { PrismaService } from '../database/prisma.service.js';
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listActiveServices(): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        description: string;
        slug: string;
    }[]>;
}
