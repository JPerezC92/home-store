# Copilot Instructions for Home Store Monorepo

## Big Picture Architecture
- **Monorepo managed by Turborepo**: Contains multiple apps and packages, all TypeScript-based.
- **Apps**:
  - `apps/api`: NestJS backend (see `src/` for modules, services, controllers).
  - `apps/web`: Next.js frontend.
  - `apps/mobile`: Expo React Native app (file-based routing in `app/`).
- **Packages**:
  - `@hs/api`: Shared NestJS resources.
  - `@hs/ui`: Shared React component library.
  - `@hs/jest-config`, `@hs/typescript-config`: Centralized config for tests and TypeScript.
- **Data Flow**: API (NestJS) exposes business logic and data via REST endpoints, consumed by web/mobile frontends. Shared packages unify types and UI components.

## Developer Workflows
- **Build all apps/packages**: `pnpm run build`
- **Develop (hot reload)**: `pnpm run dev`
- **Test suites**: `pnpm run test` (unit), `pnpm run test:e2e` (end-to-end)
- **Lint/Format**: `pnpm run lint`, `pnpm format` (Biome)
- **Remote Caching**: Use Vercel Remote Cache with Turborepo (`npx turbo login`, `npx turbo link`)
- **Mobile**: See `apps/mobile/README.md` for Expo-specific commands and emulator/simulator setup.

## Project-Specific Conventions

## Clean Architecture Structure
- **Modules follow Clean Architecture**: Each backend module (e.g., `payment`) is organized into:
  - `domain/`: Core business models, entities, and domain logic
  - `application/`: Use cases, service orchestration, business rules
  - `infrastructure/`: Frameworks, adapters, repositories, external integrations
- **Dependency Rule**: Domain layer is independent; application depends on domain; infrastructure depends on both.
- **Example**: See `apps/api/src/payment/` for a full implementation.

## Commit Message Convention
- **Commitlint enforced**: All commits must follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- **Format**: `<type>(optional scope): <description>`
  - Examples: `feat(payment): add batch income import`, `fix(api): correct income filter logic`
- **Types**: Common types include `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- See `commitlint.config.js` for config details.

## Integration Points & Patterns
- **Cross-app communication**: Shared types/components via packages (`@hs/ui`, `@hs/api`).
- **Database**: Prisma migrations in `apps/api/prisma/migrations/`.
- **External services**: Payment integrations via adapters (see `yapeExcelParser.adapter.ts`).
- **Environment variables**: Managed per app/package; check `.env` files and config docs.

## Key Files/Directories
- `apps/api/src/payment/infrastructure/payment.service.ts`: Example of domain-driven service, filter logic, and repository usage.
- `apps/web/app/`: Next.js pages/components.
- `apps/mobile/app/`: Expo file-based routing.
- `packages/ui/src/`: Shared React components.
- `packages/jest-config/`, `packages/typescript-config/`: Centralized config.

## Example Patterns
- **Service construction**:
  ```typescript
  new FindIncomesByCriteria({ PaymentRepository: new PaymentPostgreeRepository(prisma) })
  ```
- **Prisma query with filters**:
  ```typescript
  prisma.incomeDB.count({ where: buildPrismaWhereClause(filters) })
  ```
- **Adapter usage**:
  ```typescript
  paymentMethodDBToModel(method)
  ```

---

If any section is unclear or missing, please provide feedback to improve these instructions.
