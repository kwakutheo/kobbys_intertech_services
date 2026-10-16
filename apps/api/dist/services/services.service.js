var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let ServicesService = class ServicesService {
    listActiveServices() {
        return [
            { slug: 'cctv-security', name: 'CCTV & security' },
            { slug: 'fibre-internet', name: 'Fibre & internet' },
            { slug: 'networking', name: 'Networks' },
            { slug: 'satellite', name: 'Satellite support' },
            { slug: 'electrical-works', name: 'Electrical works' },
            { slug: 'gps-tracking', name: 'GPS tracking' },
            { slug: 'mc-event-hosting', name: 'MC & event hosting' },
        ];
    }
};
ServicesService = __decorate([
    Injectable()
], ServicesService);
export { ServicesService };
//# sourceMappingURL=services.service.js.map