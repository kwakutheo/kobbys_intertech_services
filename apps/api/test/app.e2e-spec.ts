import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApplication } from './../src/app.config.js';
import { AppModule } from './../src/app.module.js';

describe.sequential('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApplication(app);
    await app.init();
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ status: 'ok', service: 'kobbys-intertech-api' });
  });

  it('/api/v1/services (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/services')
      .expect(200)
      .expect([
        { slug: 'cctv-security', name: 'CCTV & security' },
        { slug: 'fibre-internet', name: 'Fibre & internet' },
        { slug: 'networking', name: 'Networks' },
        { slug: 'satellite', name: 'Satellite support' },
        { slug: 'electrical-works', name: 'Electrical works' },
        { slug: 'gps-tracking', name: 'GPS tracking' },
        { slug: 'mc-event-hosting', name: 'MC & event hosting' },
      ]);
  });

  afterEach(async () => {
    await app.close();
  });
});
