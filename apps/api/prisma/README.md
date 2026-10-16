# Database setup

The schema in `schema.prisma` is the source of truth for the operational data model.

Before generating a client or applying a migration, copy `.env.example` to `.env` and replace `DATABASE_URL` with the connection string for a non-production PostgreSQL database.

Once Prisma is installed, run:

```powershell
npx prisma generate
npx prisma migrate dev --name initial_schema
```

Do not point development commands at the production database. Production migrations must run through the release pipeline after backup and restoration checks.
