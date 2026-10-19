import { PrismaClient } from '@prisma/client';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.production'), override: true });

let dbUrl = 'postgresql://postgres.nolcjuusuihhguohqymk:Aythlus%40sup86@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require&connect_timeout=30';

const ACCOUNT_ID = process.env.CF_R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.CF_R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.CF_R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.CF_R2_BUCKET ?? 'kobbys-intertech';
const PUBLIC_URL = (process.env.CF_R2_PUBLIC_URL ?? 'https://pub-55a5586b0fb34f5aa26d2c343a67ac5b.r2.dev').replace(/\/$/, '');

console.log('Connecting to Supabase at:', dbUrl.replace(/:[^:@]+@/, ':***@'));
const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY },
});

// Known captions from local dev
const KNOWN_CAPTIONS = {
  'photo gallery/photo_1792372672405_a6576773.jpg': 'Premium electrical works',
  'photo gallery/photo_1792372668378_deb80783.jpg': 'Fiber optic installation',
};

const SERVICES = [
  ['cctv-security', 'CCTV & security', 'Camera supply, installation, upgrades and support.'],
  ['fibre-internet', 'Fibre & internet', 'Fibre, wireless internet and connectivity support.'],
  ['networking', 'Networks', 'Home and office network design, installation and support.'],
  ['satellite', 'Satellite support', 'Dish installation, signal alignment and technical support.'],
  ['electrical-works', 'Electrical works', 'Electrical work within the company’s qualifications and authorisations.'],
  ['gps-tracking', 'GPS tracking', 'Vehicle-tracking installation and support.'],
  ['mc-event-hosting', 'MC & event hosting', 'Master of ceremonies and event-hosting services.'],
];

async function main() {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await prisma.$connect();
      console.log(`Connected to Supabase on attempt ${attempt}`);
      break;
    } catch (err) {
      console.log(`Attempt ${attempt} error:`, err.message?.slice(0, 120));
      if (attempt === 5) throw err;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  // 1. Seed services
  console.log('\n--- Seeding Services into Supabase ---');
  for (const [idx, [slug, name, description]] of SERVICES.entries()) {
    const s = await prisma.service.upsert({
      where: { slug },
      update: { name, description, displayOrder: idx + 1, isActive: true },
      create: { slug, name, description, displayOrder: idx + 1, isActive: true },
    });
    console.log(`  Service: ${s.name} (${s.slug})`);
  }

  // 2. Sync photos from Cloudflare R2
  console.log('\n--- Syncing Photos from Cloudflare R2 ---');
  const result = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));
  const objects = (result.Contents ?? []).filter(
    (o) => o.Key && /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(o.Key),
  );
  console.log(`Found ${objects.length} photos in R2 bucket.`);

  let inserted = 0;
  let updated = 0;

  for (const obj of objects) {
    const key = obj.Key;
    const url = `${PUBLIC_URL}/${encodeURI(key)}`;
    const caption = KNOWN_CAPTIONS[key] ?? null;

    const existing = await prisma.galleryPhoto.findUnique({ where: { filename: key } });
    if (existing) {
      await prisma.galleryPhoto.update({
        where: { id: existing.id },
        data: {
          url,
          r2Key: key,
          caption: existing.caption || caption,
        },
      });
      updated++;
      console.log(`  Updated: ${key}`);
    } else {
      await prisma.galleryPhoto.create({
        data: {
          filename: key,
          url,
          r2Key: key,
          caption,
          sortOrder: 0,
        },
      });
      inserted++;
      console.log(`  Inserted: ${key} -> ${url}`);
    }
  }

  console.log(`\nGallery Sync Complete: ${inserted} inserted, ${updated} updated.`);

  const finalPhotoCount = await prisma.galleryPhoto.count();
  const finalServiceCount = await prisma.service.count();
  console.log(`\nFinal counts in Supabase:`);
  console.log(`  Gallery photos: ${finalPhotoCount}`);
  console.log(`  Services: ${finalServiceCount}`);
}

main()
  .catch((err) => {
    console.error('Migration/Sync Error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
