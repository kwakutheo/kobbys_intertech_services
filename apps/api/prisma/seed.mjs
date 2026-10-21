import { PrismaClient } from '@prisma/client';

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
}

seed()
  .then(() => console.log('Service catalogue seeded.'))
  .finally(async () => prisma.$disconnect());
