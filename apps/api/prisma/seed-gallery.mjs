// One-off seed: inserts existing gallery images from public/gallery into DB
// Run: node apps/api/prisma/seed-gallery.mjs
import { PrismaClient } from '@prisma/client';
import { readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const prisma = new PrismaClient();
const galleryDir = resolve('apps', 'web', 'public', 'gallery');

async function seed() {
  const files = readdirSync(galleryDir).filter((f) =>
    /\.(jpg|jpeg|png|webp|gif)$/i.test(f),
  );

  let inserted = 0;
  for (const filename of files) {
    const existing = await prisma.galleryPhoto.findUnique({ where: { filename } });
    if (!existing) {
      await prisma.galleryPhoto.create({ data: { filename } });
      inserted++;
    }
  }
  console.log(`Seeded ${inserted} new photos (${files.length - inserted} already existed).`);
}

await seed().finally(() => prisma.$disconnect());
