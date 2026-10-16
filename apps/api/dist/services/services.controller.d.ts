import { ServicesService } from './services.service.js';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    listActiveServices(): {
        slug: string;
        name: string;
    }[];
}
