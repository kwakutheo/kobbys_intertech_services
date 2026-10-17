# Kobby's Intertech Services

The platform comprises a public Next.js website, a NestJS API, and a PostgreSQL operational database. The implementation specification remains in `kobbys_intertect.md`.

## Applications

| Application | Location | Purpose |
| --- | --- | --- |
| Web | `apps/web` | Public website, future customer portal and staff interface |
| API | `apps/api` | Versioned REST API, validation, workflow rules and business operations |
| Database | `apps/api/prisma/schema.prisma` | PostgreSQL data model and migrations |

## Local development

1. Start the development database. This uses development-only credentials and data:

   ```powershell
   docker compose up -d postgres
   ```

2. Copy `apps/api/.env.example` to `apps/api/.env`. The default `DATABASE_URL` is configured for the Docker service above.

3. Install dependencies and run the apps in separate terminals:

   ```powershell
   cd apps/web
   npm install
   npm run dev
   ```

   ```powershell
   cd apps/api
   npm install
   npm run start:dev
   ```

   The website runs at `http://localhost:3000` and the API at `http://localhost:4000`.

4. Once Prisma is installed, generate its client and create the development migration:

   ```powershell
   cd apps/api
   npx prisma generate
   npx prisma migrate dev --name initial_schema
   ```

### Quick start scripts (Windows)

You can also start and stop the local servers using the batch scripts in the project root:

- `start.bat`: Checks database availability, cleans up stale instances, and launches the NestJS API (`http://localhost:4000`) and Next.js Web app (`http://localhost:3000`) in separate dedicated terminal windows.
- `stop.bat`: Gracefully terminates all processes and trees listening on ports `3000` and `4000` and closes the respective terminal windows.

## Verification

Run the appropriate checks before merging a change:

```powershell
cd apps/web
npm run lint
npm run build
```

```powershell
cd apps/api
npm run lint
npm test
npm run test:e2e
npm run build
```

Do not use production customer data or credentials in local development. The production database, transactional email configuration, domain, file storage, and messaging providers remain separate launch decisions.
