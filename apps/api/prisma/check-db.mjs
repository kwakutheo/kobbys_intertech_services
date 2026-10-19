import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.production'), override: true });

const url = 'postgresql://postgres.nolcjuusuihhguohqymk:Aythlus%40sup86@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require&connect_timeout=30';
const prisma = new PrismaClient({ datasources: { db: { url } } });

async function main() {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await prisma.$connect();
      console.log(`Connected on attempt ${attempt}`);
      break;
    } catch (err) {
      console.log(`Attempt ${attempt} error:`, err.message?.slice(0, 120));
      if (attempt === 5) throw err;
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  const tables = await prisma.$queryRawUnsafe(`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_name IN ('GalleryPhoto', 'Service', '_prisma_migrations')
  `);
  console.log('Tables:', tables);

  const migrations = await prisma.$queryRawUnsafe(`
    SELECT id, migration_name, finished_at FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5
  `);
  console.log('Migrations in Supabase:', migrations);

  const serviceCount = await prisma.service.count();
  const photoCount = await prisma.galleryPhoto.count();
  console.log('SUPABASE service count:', serviceCount);
  console.log('SUPABASE photo count:', photoCount);
}

main().finally(() => prisma.$disconnect());
