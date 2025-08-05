---
trigger: manual
---

# Coding Guidelines

## Language & TypeScript
- Primary language: TypeScript
- Target: ES2022
- Strict type checking enabled
- Module system: NodeNext
- Declaration files are generated

## Project Structure
- Monorepo architecture
- Package manager: pnpm
- Node.js version: >= 18
- Managed with Turborepo

## Code Quality
- Linting and Formatting: Biome
- Strict TypeScript compiler options
- No unchecked indexed access

## Development Workflow
- `dev`: Start development servers
- `build`: Build all packages
- `test`: Run tests
- `test:e2e`: Run end-to-end tests
- `lint`: Run linter with Biome
- `format-and-lint`: Check code with Biome
- `format-and-lint:fix`: Fix issues with Biome

## Module Resolution
- Uses Node.js module resolution
- ES modules with Node.js compatibility
- JSON modules supported
- Type declaration maps enabled

## Type Safety
- Strict mode enabled
- No implicit any
- Strict null checks
- Strict function types
- Strict property initialization
- No unchecked indexed access
- Isolated modules
