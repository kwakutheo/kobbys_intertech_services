import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from './../src/database/prisma.service.js';
import { configureApplication } from './../src/app.config.js';
import { AppModule } from './../src/app.module.js';

describe.sequential('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApplication(app);
    await app.init();
    prisma = app.get(PrismaService);
    await prisma.service.upsert({
      where: { slug: 'cctv-security' },
      update: { isActive: true },
      create: {
        name: 'CCTV & security',
        slug: 'cctv-security',
        description: 'Camera supply, installation, upgrades and support.',
        displayOrder: 1,
      },
    });
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
      .expect((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ slug: 'cctv-security', name: 'CCTV & security' }),
          ]),
        );
      });
  });

  it('/api/v1/enquiries (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/enquiries')
      .set('Idempotency-Key', 'e2e-enquiry-key')
      .send({
        fullName: 'Test Customer',
        email: 'test.customer@example.com',
        phone: '+233243487160',
        serviceSlug: 'cctv-security',
        description: 'Please assess and install security cameras at our office.',
        address: 'Achimota, Accra',
        preferredContactMethod: 'PHONE',
        privacyAccepted: true,
      })
      .expect(201)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            status: 'REQUESTED',
            reference: expect.stringMatching(/^KIS-SRV-/),
          }),
        );
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
