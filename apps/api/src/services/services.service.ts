import { Injectable } from '@nestjs/common';

@Injectable()
export class ServicesService {
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
}
