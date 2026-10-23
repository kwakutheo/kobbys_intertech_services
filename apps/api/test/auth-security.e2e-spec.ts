import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../src/database/prisma.service.js';
import { configureApplication } from '../src/app.config.js';
import { AppModule } from '../src/app.module.js';

describe.sequential('Auth & Customer Security Boundary (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
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

  afterAll(async () => {
    await app.close();
  });

  const testId = Date.now();
  const rawPassword = 'StrongCustomerPassword123!';
  const customerEmail = `sec.customer.${testId}@example.com`;
  let customerAccessToken = '';

  it('registers account with CUSTOMER role, bcrypt password hash, and expiring JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Security Customer',
        email: customerEmail,
        phone: '+233243487170',
        password: rawPassword,
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        tokenType: 'Bearer',
        expiresIn: 900,
        user: {
          email: customerEmail,
          roles: ['CUSTOMER'],
        },
      }),
    );

    customerAccessToken = response.body.accessToken;

    // Verify database record: password must be bcrypt-hashed, NOT plaintext
    const dbUser = await prisma.user.findUnique({
      where: { email: customerEmail },
      include: {
        roles: { include: { role: true } },
        customer: true,
      },
    });

    expect(dbUser).toBeDefined();
    expect(dbUser?.passwordHash).not.toEqual(rawPassword);
    expect(dbUser?.passwordHash).toMatch(/^\$2[aby]\$\d{2}\$/);
    expect(dbUser?.accountStatus).toBe('ACTIVE');
    expect(dbUser?.roles.map((r) => r.role.name)).toContain('CUSTOMER');
    expect(dbUser?.customer?.fullName).toBe('Security Customer');
  });

  it('rejects duplicate registration with 409 Conflict', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Duplicate Customer',
        email: customerEmail,
        phone: '+233243487170',
        password: rawPassword,
      })
      .expect(409);
  });

  it('rejects invalid login credentials with 401 Unauthorized', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: customerEmail,
        password: 'WrongPassword123!',
      })
      .expect(401);

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: `nonexistent.${testId}@example.com`,
        password: rawPassword,
      })
      .expect(401);
  });

  it('logs in successfully with valid credentials and returns a signed access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: customerEmail,
        password: rawPassword,
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
        tokenType: 'Bearer',
        expiresIn: 900,
        user: {
          email: customerEmail,
          roles: ['CUSTOMER'],
        },
      }),
    );
  });

  it('throttles repeated sign-in attempts against the same account', async () => {
    // Credential stuffing is bounded per targeted account, so a shared office
    // or mobile network cannot be locked out by one noisy colleague.
    const bruteEmail = `brute.${testId}@example.com`;
    await request(app.getHttpServer()).post('/api/v1/auth/register').send({
      fullName: 'Throttle Target',
      email: bruteEmail,
      phone: '+233243487171',
      password: rawPassword,
    }).expect(201);

    const attempts = await Promise.all(
      Array.from({ length: 12 }, () =>
        request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({ email: bruteEmail, password: 'WrongPassword999!' }),
      ),
    );

    expect(attempts.filter((response) => response.status === 401).length).toBeGreaterThanOrEqual(1);
    expect(attempts.some((response) => response.status === 429)).toBe(true);
    expect(attempts.find((response) => response.status === 429)!.body.message).toMatch(/too many/i);
  });

  it('enforces authentication on GET /api/v1/customer/requests', async () => {
    // Missing token
    await request(app.getHttpServer())
      .get('/api/v1/customer/requests')
      .expect(401);

    // Invalid bearer token
    await request(app.getHttpServer())
      .get('/api/v1/customer/requests')
      .set('Authorization', 'Bearer invalid.token.payload')
      .expect(401);
  });

  it('protects unclaimed booking records from being claimed by newly registered accounts', async () => {
    const unclaimedEmail = `unclaimed.prior.${testId}@example.com`;

    // 1. Unclaimed booking is submitted prior to account creation
    const enquiryRes = await request(app.getHttpServer())
      .post('/api/v1/enquiries')
      .send({
        fullName: 'Unclaimed Requester',
        email: unclaimedEmail,
        phone: '+233243487198',
        serviceSlug: 'cctv-security',
        description: 'Past booking request from website enquiry.',
        address: 'Adenta, Accra',
        preferredContactMethod: 'EMAIL',
        privacyAccepted: true,
      })
      .expect(201);

    const unclaimedRef = enquiryRes.body.reference;
    expect(unclaimedRef).toBeDefined();

    // 2. An account is registered using that same email address
    const registerRes = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        fullName: 'New Account Holder',
        email: unclaimedEmail,
        phone: '+233243487198',
        password: 'Password98765!',
      })
      .expect(201);

    const newAccountToken = registerRes.body.accessToken;

    // 3. GET /api/v1/customer/requests must NOT reveal the past unclaimed request
    const listRes = await request(app.getHttpServer())
      .get('/api/v1/customer/requests')
      .set('Authorization', `Bearer ${newAccountToken}`)
      .expect(200);

    expect(listRes.body).toEqual([]);
    expect(listRes.body.some((r: { reference: string }) => r.reference === unclaimedRef)).toBe(false);

    // 4. Confirm server-side ownership enforcement: newly created requests for this customer account ARE returned
    const user = await prisma.user.findUnique({
      where: { email: unclaimedEmail },
      include: { customer: true },
    });
    const service = await prisma.service.findFirst({ where: { slug: 'cctv-security' } });

    const customerRequest = await prisma.serviceRequest.create({
      data: {
        reference: `KIS-SRV-OWNED-${testId}`,
        customerId: user!.customer!.id,
        serviceId: service!.id,
        description: 'Legitimate request created for this customer.',
        address: 'Adenta, Accra',
      },
    });

    const updatedListRes = await request(app.getHttpServer())
      .get('/api/v1/customer/requests')
      .set('Authorization', `Bearer ${newAccountToken}`)
      .expect(200);

    expect(updatedListRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ reference: customerRequest.reference }),
      ]),
    );

    // Ensure the unclaimed booking record remains isolated and unclaimable
    expect(updatedListRes.body.some((r: { reference: string }) => r.reference === unclaimedRef)).toBe(false);

    // 5. Ensure another registered customer cannot see this customer's requests
    const otherCustomerListRes = await request(app.getHttpServer())
      .get('/api/v1/customer/requests')
      .set('Authorization', `Bearer ${customerAccessToken}`)
      .expect(200);

    expect(otherCustomerListRes.body.some((r: { reference: string }) => r.reference === customerRequest.reference)).toBe(false);
  });
});
