import { ServicesService } from './services.service.js';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    listActiveServices(): import("@prisma/client").Prisma.PrismaPromise<{
        description: string;
        name: string;
        slug: string;
    }[]>;
}
