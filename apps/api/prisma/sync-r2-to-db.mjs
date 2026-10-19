/**
 * One-off script: Syncs existing photos from Cloudflare R2 into the Supabase GalleryPhoto table.
 * Run from apps/api: node prisma/sync-r2-to-db.mjs
 *
 * Uses the DATABASE_URL from .env.production and R2 credentials from environment.
 */
import { PrismaClient } from '@prisma/client';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.production') });

const DB_URL = process.env.DATABASE_URL;
const ACCOUNT_ID = process.env.CF_R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.CF_R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.CF_R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.CF_R2_BUCKET ?? 'kobbys-intertech';
const PUBLIC_URL = (process.env.CF_R2_PUBLIC_URL ?? '').replace(/\/$/, '');

const prisma = new PrismaClient({ datasources: { db: { url: DB_URL } } });

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY },
});

async function main() {
  console.log('Listing R2 bucket objects...');
  const result = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));
  const objects = (result.Contents ?? []).filter(
    (o) => o.Key && /\.(jpg|jpeg|png|webp|gif)$/i.test(o.Key),
  );

  console.log(`Found ${objects.length} photos in R2.`);
  let inserted = 0;
  let skipped = 0;

  for (const obj of objects) {
    const key = obj.Key;
    const url = `${PUBLIC_URL}/${encodeURI(key)}`;

    const existing = await prisma.galleryPhoto.findUnique({ where: { filename: key } });
    if (existing) {
      // Update url and r2Key if missing
      if (!existing.url || !existing.r2Key) {
        await prisma.galleryPhoto.update({
          where: { id: existing.id },
          data: { url, r2Key: key },
        });
        inserted++; // count updates too
        console.log(`  Updated: ${key} -> ${url}`);
      } else {
        skipped++;
        console.log(`  Skipped (already has url): ${key}`);
      }
    } else {
      await prisma.galleryPhoto.create({
        data: {
          filename: key,
          url,
          r2Key: key,
        },
      });
      inserted++;
      console.log(`  Inserted: ${key}`);
    }
  }

  console.log(`\nDone. Inserted: ${inserted}, Updated existing, Skipped: ${skipped}`);
}

await main().finally(() => prisma.$disconnect());
