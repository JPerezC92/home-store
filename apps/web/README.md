# Web (Next.js Frontend)

Next.js 16 web application with App Router, Tailwind CSS, and React 19.

## Overview

This is a Next.js 16 application featuring:
- **App Router**: File-based routing with layouts
- **Tailwind CSS 4**: Utility-first styling
- **React 19**: Latest React features
- **Turbopack**: Fast development builds
- **Type-Safe API**: Shared types with backend via `@repo/api`

## Quick Start

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start development server
pnpm dev

# Application will be available at:
# http://localhost:3001
```

## Project Structure

```
apps/web/
├── app/
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── page.tsx                    # Home page (/)
│   │
│   ├── tasks/
│   │   └── page.tsx                # Tasks management (/tasks)
│   │
│   └── transactions/
│       └── page.tsx                # Transactions & upload (/transactions)
│
├── public/
│   ├── favicon.ico
│   └── ...
│
├── tailwind.config.ts              # Tailwind configuration
├── next.config.ts                  # Next.js configuration
└── tsconfig.json                   # TypeScript configuration
```

## Available Scripts

```bash
# Development
pnpm dev              # Start with Turbopack (port 3001)

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Lint with Next.js ESLint
pnpm check-types      # TypeScript type checking
```

## Pages

### Home Page (`/`)

Welcome dashboard with:
- Project overview
- Quick statistics
  - Total modules
  - Architecture type
  - Database type
  - Status indicator
- Navigation links to Tasks and Transactions
- Clean Architecture information

### Tasks Page (`/tasks`)

Full task management interface:

**Features**:
- **Statistics Cards**:
  - Total tasks
  - Completed tasks
  - Pending tasks
  - High priority tasks

- **Create Task Form**:
  - Title (required)
  - Description (optional)
  - Priority selector (low, medium, high)
  - Completed checkbox

- **Task List**:
  - Checkbox for completion toggle
  - Priority badges (color-coded)
  - Creation date
  - Delete button
  - Status tags (Completed/Pending)

- **Real-time Updates**: List refreshes after create, update, or delete
- **Loading States**: Spinners during API calls
- **Empty State**: Message when no tasks exist

### Transactions Page (`/transactions`)

Comprehensive transaction management:

**Features**:
- **Statistics Dashboard**:
  - Total transactions count
  - Total received (amount + payment count)
  - Total paid (amount + payment count)
  - Current balance (color-coded: green for positive, red for negative)

- **Excel File Upload**:
  - Drag & drop interface
  - File type validation (.xlsx only)
  - Two-phase process:
    1. **Validate**: Preview duplicates, errors, skipped rows
    2. **Confirm**: Save to database
  - Detailed validation results:
    - Total/Valid/Duplicate/Error counts
    - Row-by-row error reporting
    - Duplicate comparison (side-by-side view)
    - Skipped empty rows with reasons

- **Transaction List**:
  - Filterable and searchable
  - Filters:
    - Search text (debounced 500ms)
    - Transaction type (received/paid)
    - Date range (start/end)
    - Amount range (min/max)
  - Color-coded transaction cards:
    - Green border: Received ("Te pagó")
    - Orange border: Paid ("Pagaste")
  - Pagination controls
  - Transaction details:
    - Type indicator (arrow up/down)
    - Origin and destination
    - Amount (formatted with currency)
    - Message (if present)
    - Operation date

- **Success/Error Messaging**:
  - Dismissable notification banners
  - Clear error descriptions

## Design System

### JPC Color Palette (OKLCH)

Modern, vibrant color system defined in `app/globals.css` using OKLCH color space:

**Cyan** (Primary/Signature - Mint-Cyan):
- `jpc-cyan-400`: `oklch(0.85 0.14 175)` - Primary actions, focus rings

**Emerald** (Success/Received):
- `jpc-emerald-500`: `oklch(0.68 0.17 160)` - "TE PAGÓ" transactions, success states

**Orange** (Warning/Paid):
- `jpc-orange-400`: `oklch(0.64 0.22 35)` - "PAGASTE" transactions, warnings

**Sky Blue** (Accent):
- `jpc-sky-400`: `oklch(0.82 0.15 210)` - Secondary accents

**Purple** (Priority):
- `jpc-purple-400`: `oklch(0.76 0.20 300)` - Priority items, charts

**Pink** (Destructive/CTA):
- `jpc-pink-500`: `oklch(0.65 0.26 350)` - Error states, delete actions

### Transaction Card Colors

- **TE PAGÓ (Received)**: Emerald green (`jpc-emerald-500`)
  - Background: `/5` opacity, Border: `/20`, Text: full color
- **PAGASTE (Paid)**: Peachy orange (`jpc-orange-400`)
  - Background: `/5` opacity, Border: `/20`, Text: full color

### Theme Configuration

- **Light Mode**: Warm off-white backgrounds `oklch(0.985 0.002 85)`
- **Border Radius**: `0.625rem` (10px) system-wide
- **Typography**: Geist Sans (variable), Geist Mono (code)

See [DESIGN.md](./DESIGN.md) for complete color palette and usage guidelines.

## API Integration

### Type-Safe API Calls

Using shared types from `@repo/api`:

```typescript
import type { Task, CreateTaskDto } from '@repo/api';

async function createTask(data: CreateTaskDto): Promise<Task> {
  const response = await fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
}
```

### API Base URL

Configured in page components:
- Development: `http://localhost:3000`
- Production: Configure via environment variable

## Styling

### Tailwind CSS

Utility-first CSS framework:

```typescript
// Example component styling
<div className="rounded-lg border border-jpc-vibrant-cyan-500/20 p-6 bg-white/5 backdrop-blur-sm hover:scale-105 transition-all">
  {/* Content */}
</div>
```

### Custom Fonts

Uses **Geist** font family:
- Geist Sans (variable)
- Geist Mono (variable)

Automatically optimized with `next/font`.

## Performance

### Turbopack

Fast development builds:
- Hot Module Replacement (HMR)
- Incremental compilation
- Optimized bundling

### Next.js Optimizations

- Automatic code splitting
- Image optimization
- Font optimization
- Server Components (where applicable)

## Environment Variables

Create `.env.local` (optional):

```bash
# API URL (optional, defaults to http://localhost:3000)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Building for Production

### Build

```bash
pnpm build

# Outputs to .next/
# Optimized for production
```

### Start Production Server

```bash
pnpm start

# Runs on http://localhost:3000
# Set PORT environment variable to change
```

## Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link GitHub repo to Vercel
2. **Configure Build**:
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
3. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your production API URL
4. **Deploy**: Automatic deployments on git push

### Manual Deployment

```bash
# Build
pnpm build

# Copy .next/ folder to server
# Run production server
pnpm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm build

# Expose port
EXPOSE 3000

# Start
CMD ["pnpm", "start"]
```

## Routing

### App Router

File-based routing in `app/`:

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Home page |
| `/tasks` | `app/tasks/page.tsx` | Tasks management |
| `/transactions` | `app/transactions/page.tsx` | Transactions |

### Navigation

```typescript
import Link from 'next/link';

<Link href="/tasks">Tasks</Link>
```

## TypeScript

### Strict Mode

TypeScript configured with strict mode:
- `strict: true`
- `noUnused

Locals: true`
- `noUncheckedIndexedAccess: true`

### Type Checking

```bash
pnpm check-types
```

## Troubleshooting

### Port Already in Use

```bash
# Change port
PORT=3002 pnpm dev
```

### API Connection Issues

Ensure API is running:
```bash
cd apps/api
pnpm dev
# Should be running on http://localhost:3000
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
pnpm build
```

## Learn More

- [Main README](../../README.md)
- [Architecture Documentation](../../ARCHITECTURE.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel Deployment](https://vercel.com/docs)
