# API (NestJS Backend)

NestJS backend API implementing Clean Architecture for transaction and task management.

## Overview

This is a NestJS 11 application built with:
- **Clean Architecture**: Domain, Application, Infrastructure layers
- **Turso Database**: libSQL (edge-optimized SQLite)
- **Drizzle ORM**: Type-safe database access
- **Vitest**: Fast unit and E2E testing
- **Swagger**: Auto-generated API documentation
- **Zod**: Runtime validation

## Quick Start

```bash
# Install dependencies (from monorepo root)
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Push database schema
pnpm db:push

# Start development server
pnpm dev

# API will be available at:
# - http://localhost:3000
# - Swagger docs: http://localhost:3000/api
```

## Project Structure

```
apps/api/
├── src/
│   ├── app.module.ts                    # Root module
│   ├── main.ts                          # Application entry point
│   │
│   ├── database/
│   │   ├── database.module.ts           # Database configuration
│   │   └── database.providers.ts        # Drizzle client provider
│   │
│   ├── tasks/                           # Tasks module (Clean Architecture)
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── task.entity.ts       # Domain model
│   │   │   └── repositories/
│   │   │       └── task.repository.interface.ts
│   │   ├── application/
│   │   │   └── use-cases/               # Business workflows
│   │   │       ├── create-task.use-case.ts
│   │   │       ├── get-all-tasks.use-case.ts
│   │   │       ├── get-task-by-id.use-case.ts
│   │   │       ├── update-task.use-case.ts
│   │   │       └── delete-task.use-case.ts
│   │   └── infrastructure/
│   │       ├── repositories/
│   │       │   └── task.repository.ts    # Drizzle implementation
│   │       ├── tasks.controller.ts       # HTTP endpoints
│   │       ├── tasks.service.ts          # Orchestration
│   │       └── tasks.module.ts           # DI configuration
│   │
│   └── transactions/                    # Transactions module
│       ├── domain/
│       │   ├── entities/
│       │   │   └── transaction.entity.ts
│       │   ├── repositories/
│       │   │   └── transaction.repository.interface.ts
│       │   └── errors/
│       │       └── excel-parsing.errors.ts
│       ├── application/
│       │   └── use-cases/
│       │       ├── upload-excel.use-case.ts
│       │       ├── get-transactions.use-case.ts
│       │       ├── get-statistics.use-case.ts
│       │       └── get-upload-history.use-case.ts
│       └── infrastructure/
│           ├── parsers/
│           │   └── excel-parser.service.ts  # XLSX file processing
│           ├── repositories/
│           │   └── transaction.repository.ts
│           ├── transactions.controller.ts
│           ├── transactions.service.ts
│           └── transactions.module.ts
│
├── drizzle/                             # Database migrations
│   ├── 0000_initial.sql
│   ├── 0001_transactions.sql
│   └── meta/
│       ├── _journal.json
│       └── *.snapshot.json
│
├── test/                                # E2E tests
├── drizzle.config.ts                    # Drizzle CLI configuration
└── vitest.config.ts                     # Vitest configuration
```

## Available Scripts

```bash
# Development
pnpm dev                    # Start with hot reload
pnpm dev:debug              # Start with debugger

# Building
pnpm build                  # Build for production
pnpm start:prod             # Run production build

# Testing
pnpm test                   # Run unit tests
pnpm test:watch             # Watch mode
pnpm test:coverage          # Generate coverage report
pnpm test:e2e               # Run E2E tests (in-memory DB)

# Database
pnpm db:generate            # Generate migrations from schema
pnpm db:migrate             # Run migrations
pnpm db:push                # Push schema directly (dev)
pnpm db:studio              # Launch Drizzle Studio GUI

# Code Quality
pnpm lint                   # Lint code
pnpm format                 # Format with Prettier
```

## Environment Variables

Create a `.env` file in `apps/api/`:

```bash
# Database (Required)
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=your-auth-token

# For local development with SQLite
# DATABASE_URL=file:local.db

# Application (Optional)
NODE_ENV=development
PORT=3000

# CORS (Optional)
CORS_ORIGINS=http://localhost:3001
```

## API Endpoints

### Tasks

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/tasks` | Create task | `CreateTaskDto` | `Task` |
| GET | `/tasks` | Get all tasks | - | `Task[]` |
| GET | `/tasks/:id` | Get task by ID | - | `Task` |
| PATCH | `/tasks/:id` | Update task | `UpdateTaskDto` | `Task` |
| DELETE | `/tasks/:id` | Delete task | - | `void` |

**CreateTaskDto**:
```typescript
{
  title: string;          // Required
  description?: string;   // Optional
  priority: 'low' | 'medium' | 'high';  // Default: 'medium'
  completed?: boolean;    // Default: false
}
```

**UpdateTaskDto**:
```typescript
{
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
}
```

### Transactions

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/transactions/upload/validate` | Validate Excel file | FormData (file) | `UploadResult` |
| POST | `/transactions/upload/confirm` | Save validated transactions | FormData (file) | `UploadSummary` |
| GET | `/transactions` | Get transactions | Query params | `Transaction[]` |
| GET | `/transactions/statistics` | Get statistics | - | `Statistics` |
| GET | `/transactions/upload-history` | Get upload history | - | `UploadHistory[]` |
| GET | `/transactions/:id` | Get transaction by ID | - | `Transaction` |

**Upload Excel File**:
```bash
curl -X POST http://localhost:3000/transactions/upload/validate \
  -F "file=@ReporteTransacciones+51922076456.xlsx"
```

**Get Transactions with Filters**:
```bash
GET /transactions?transactionType=Te%20pagó&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=20
```

Query parameters:
- `transactionType`: "Te pagó" (received) or "Pagaste" (paid)
- `startDate`, `endDate`: ISO date strings (YYYY-MM-DD)
- `minAmount`, `maxAmount`: Number filters
- `search`: Text search (origin, destination, message)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Statistics Response**:
```json
{
  "totalTransactions": 3339,
  "totalReceived": 3160,
  "totalPaid": 179,
  "totalReceivedAmount": 22124.08,
  "totalPaidAmount": 16075.26,
  "balance": 6048.82
}
```

## Swagger Documentation

### Access

- **URL**: http://localhost:3000/api
- **Interactive**: Try out endpoints directly
- **Auto-generated**: From NestJS decorators and Zod schemas

## Database

### Turso Setup

1. **Create Database**:
   ```bash
   turso db create home-store
   ```

2. **Get Credentials**:
   ```bash
   turso db show home-store
   # Copy URL and generate auth token
   turso db tokens create home-store
   ```

3. **Update `.env`**:
   ```bash
   DATABASE_URL=libsql://home-store-xxxxx.turso.io
   DATABASE_AUTH_TOKEN=eyJhbGciOi...
   ```

### Local SQLite

For local development without Turso:

```bash
DATABASE_URL=file:local.db
# No auth token needed
```

### Migrations

```bash
# Generate migration from schema changes
pnpm db:generate

# This creates:
# - drizzle/0002_migration_name.sql
# - drizzle/meta/0002_snapshot.json
# - Updates drizzle/meta/_journal.json

# Apply migrations
pnpm db:migrate
```

### Schema Changes

When modifying schemas in `packages/database/src/schemas/`:

```bash
# Development (direct push)
pnpm db:push

# Production (versioned migration)
pnpm db:generate
pnpm db:migrate
```

### Drizzle Studio

Visual database browser:

```bash
pnpm db:studio
# Opens https://local.drizzle.studio
```

## Testing

### Unit Tests

```bash
pnpm test
```

### E2E Tests

Test full HTTP request/response cycle:

```bash
pnpm test:e2e
```

E2E tests use in-memory SQLite for isolation.

### Coverage

```bash
pnpm test:coverage

# View report
open coverage/index.html
```

## Production Deployment

### Build

```bash
pnpm build

# Outputs to dist/
# Compiled JavaScript, ready for Node.js
```

### Environment Setup

```bash
# Set production environment
export NODE_ENV=production
export DATABASE_URL=libsql://production-db.turso.io
export DATABASE_AUTH_TOKEN=<prod-token>
export PORT=3000
```

### Run

```bash
# Apply migrations
pnpm db:migrate

# Start server
pnpm start:prod

# Or with PM2
pm2 start dist/main.js --name api
```

### Health Check

```bash
curl http://localhost:3000/
# Should return: "Hello World!"
```

## Troubleshooting

### Database Connection Failed

```bash
# Check credentials
pnpm db:studio

# Test connection
turso db shell home-store
```

### Migration Errors

```bash
# Reset and regenerate
rm -rf drizzle/
pnpm db:generate
pnpm db:push
```

### Port Already in Use

```bash
# Kill process on port 3000 (Unix/Mac)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 pnpm dev
```

## Learn More

- [Main README](../../README.md)
- [Architecture Documentation](../../ARCHITECTURE.md)
- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Turso Documentation](https://docs.turso.tech)
- [Vitest](https://vitest.dev)
