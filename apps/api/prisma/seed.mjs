import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const services = [
  ['cctv-security', 'CCTV & Security', 'Camera supply, installation, upgrades and support.'],
  ['fibre-internet', 'Fibre & Satellite Internet', 'Fibre, wireless internet and connectivity support.'],
  ['networking', 'Network Infrastructure', 'Home and office network design, installation and support.'],
  ['satellite', 'Satellite TV', 'Satellite dish installation, signal alignment and technical support.'],
  ['electrical-works', 'Electrical works', 'Electrical work within the company’s qualifications and authorisations.'],
  ['gps-tracking', 'GPS tracking', 'Vehicle-tracking installation and support.'],
];

async function seed() {
  for (const [displayOrder, [slug, name, description]] of services.entries()) {
    await prisma.service.upsert({
      where: { slug },
      update: { name, description, displayOrder: displayOrder + 1, isActive: true },
      create: { slug, name, description, displayOrder: displayOrder + 1 },
    });
  }

  const ownerEmail = process.env.INITIAL_OWNER_EMAIL?.trim().toLowerCase();
  const ownerPassword = process.env.INITIAL_OWNER_PASSWORD;
  if (ownerEmail && ownerPassword) {
    const ownerRole = await prisma.role.upsert({
      where: { name: 'OWNER' },
      update: {},
      create: { name: 'OWNER', description: 'Full staff administration access' },
    });
    const existingOwner = await prisma.user.findUnique({ where: { email: ownerEmail } });
    if (!existingOwner) {
      await prisma.user.create({
        data: {
          email: ownerEmail,
          displayName: process.env.INITIAL_OWNER_NAME?.trim() || 'Account Owner',
          passwordHash: await hash(ownerPassword, 12),
          accountStatus: 'ACTIVE',
          emailVerifiedAt: new Date(),
          roles: { create: { roleId: ownerRole.id } },
        },
      });
      console.log(`Initial Owner account created for ${ownerEmail}.`);
    } else {
      const hasOwnerRole = await prisma.userRole.findUnique({
        where: { userId_roleId: { userId: existingOwner.id, roleId: ownerRole.id } },
      });
      if (!hasOwnerRole) {
        await prisma.userRole.create({ data: { userId: existingOwner.id, roleId: ownerRole.id } });
        console.log(`Existing account ${ownerEmail} granted the Owner role.`);
      } else {
        console.log(`Owner account for ${ownerEmail} already exists; password was not changed.`);
      }
    }
  }
}

seed()
  .then(() => console.log('Service catalogue seeded.'))
  .finally(async () => prisma.$disconnect());
