## Purpose
Short, actionable guide to help coding agents be productive in this repository (NestJS + Prisma starter).

## Big picture (what this app is)
- Type: NestJS server (src/) using modules/controllers/providers. Entry point: `src/main.ts` (Bootstraps `AppModule`).
- Current surface: a single `UsersModule` under `src/users/` (see `users.controller.ts`, `users.service.ts`). The controller uses dependency injection: `constructor(private readonly usersService: UsersService)`.
- Data layer: Prisma is present (`prisma/schema.prisma`) with a generator that outputs a client to `generated/prisma` (relative to the repository root). The schema's datasource is Postgres — the DB URL is expected from env (no URL is hard-coded).

## Key files to read first
- `src/main.ts` — app bootstrap, reads `process.env.PORT`.
- `src/app.module.ts` — where feature modules are imported (currently imports `UsersModule`).
- `src/users/*` — example of controller/service pattern used across codebase.
- `prisma/schema.prisma` — Prisma schema and generator output (client target: `generated/prisma`).
- `package.json` — scripts (dev/build/test) and deps (Nest v11, Prisma, ts-jest).
- `test/jest-e2e.json` and the `jest` section in `package.json` — unit vs e2e test config differences.

## Developer workflows / commands (explicit)
- Install dependencies: `npm install` (see README.md).
- Run dev server (watch): `npm run dev` (alias: `nest start --watch`).
- Build for production: `npm run build` -> compiled output in `dist/`; run: `npm run start:prod` (runs `node dist/main`).
- Debug run: `npm run start:debug` (starts Nest with debug + watch).
- Lint/auto-fix: `npm run lint` (ESLint configured for `{src,apps,libs,test}` patterns).
- Unit tests: `npm run test` (Jest; package.json sets `rootDir: src`).
- E2E tests: `npm run test:e2e` (uses `test/jest-e2e.json`; note its `rootDir` is `.` and `testRegex` is `.e2e-spec.ts$`).

## Prisma / DB notes (important)
- Generator in `prisma/schema.prisma` has `output = "../generated/prisma"`. After editing the Prisma schema run:
  - `npx prisma generate` to refresh the client.
  - `npx prisma migrate dev` (or other migrate commands) when you need persisted schema changes — the project expects a PostgreSQL `DATABASE_URL` env var.
- Typical import from TypeScript files: `import { PrismaClient } from '../generated/prisma'; const prisma = new PrismaClient();` (the `generated` folder is at repo root).

## Project-specific conventions & gotchas
- Module pattern: feature modules export controllers/providers via `@Module({ controllers: [...], providers: [...] })` (see `UsersModule`). Follow that exact pattern when adding new features.
- Controller routes: use `@Controller('route')` strings (see `UsersController` -> `@Controller('users')`). Keep controller methods thin; business logic belongs in services.
- TypeScript config: `tsconfig.json` uses `module: "nodenext"` and `esModuleInterop/emitDecoratorMetadata/experimentalDecorators` — maintain decorator metadata when adding injectable providers.
- Generated Prisma client path is non-default (`generated/prisma`), so code and tests must import from that path instead of `@prisma/client` unless the client is reconfigured.
- Tests: unit tests run with rootDir `src` (package.json jest). E2E tests run with test/jest-e2e.json (`rootDir: .`) — when writing e2e tests, reference compiled sources or use ts-jest transform so `.ts` tests run correctly.

## Integration points & env expectations
- Port: `process.env.PORT` (fallback 3000) — `src/main.ts`.
- Database: Prisma datasource uses `postgresql` provider; set `DATABASE_URL` in the environment for local dev and CI.
- No external service keys are checked into the repo. Expect standard env var usage.

## Examples to reference in edits
- Add a new route: mirror `src/users/users.controller.ts` and `src/users/users.service.ts` patterns.
- Prisma usage example (pattern to add):
  ```ts
  import { PrismaClient } from '../generated/prisma';
  const prisma = new PrismaClient();
  // use prisma.user.findMany() etc.
  ```

## Where to update if you change build / output paths
- `tsconfig.json` -> `outDir` (`./dist`) for compiled code. `package.json` start scripts assume `dist/main`.
- Prisma client output: update `prisma/schema.prisma` generator `output` and re-run `npx prisma generate`.

## What I did (if merging existing file)
- No existing `.github/copilot-instructions.md` was found; this file is newly created. If you have internal agent rules elsewhere, tell me where to merge and I will preserve that content.

If anything here is unclear or you want more detail on testing, CI, or how Prisma is wired into service classes, tell me which area to expand and I will iterate.
