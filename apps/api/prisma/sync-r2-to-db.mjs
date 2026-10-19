/**
 * Syncs photos from Cloudflare R2 into the Supabase GalleryPhoto table.
 * Run from apps/api: node prisma/sync-r2-to-db.mjs
 */
import { PrismaClient } from '@prisma/client';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.production'), override: true });

let dbUrl = process.env.DATABASE_URL;
if (dbUrl && !dbUrl.includes('sslmode=')) {
  dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'sslmode=require';
}

const ACCOUNT_ID = process.env.CF_R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.CF_R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.CF_R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.CF_R2_BUCKET ?? 'kobbys-intertech';
const PUBLIC_URL = (process.env.CF_R2_PUBLIC_URL ?? 'https://pub-55a5586b0fb34f5aa26d2c343a67ac5b.r2.dev').replace(/\/$/, '');

const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY },
});

async function main() {
  await prisma.$connect();
  console.log('Listing R2 bucket objects...');
  const result = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));
  const objects = (result.Contents ?? []).filter(
    (o) => o.Key && /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(o.Key),
  );

  console.log(`Found ${objects.length} photos in R2.`);
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const obj of objects) {
    const key = obj.Key;
    const url = `${PUBLIC_URL}/${encodeURI(key)}`;

    const existing = await prisma.galleryPhoto.findUnique({ where: { filename: key } });
    if (existing) {
      if (!existing.url || !existing.r2Key) {
        await prisma.galleryPhoto.update({
          where: { id: existing.id },
          data: { url, r2Key: key },
        });
        updated++;
        console.log(`  Updated: ${key} -> ${url}`);
      } else {
        skipped++;
      }
    } else {
      await prisma.galleryPhoto.create({
        data: {
          filename: key,
          url,
          r2Key: key,
          sortOrder: 0,
        },
      });
      inserted++;
      console.log(`  Inserted: ${key}`);
    }
  }

  console.log(`\nDone. Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}`);
}

main().finally(() => prisma.$disconnect());
