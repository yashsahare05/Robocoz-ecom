# Tech Stack

This document summarizes the **actual tech stack used in this repository**, based on `package.json`, `README.md`, and code usage.

## Core Framework
1. Next.js `16.1.6` (App Router)
2. React `18.2.0`
3. TypeScript `^5`

## Styling & UI
1. Tailwind CSS `3.4.19` + `@tailwindcss/forms`
2. Utility helpers: `tailwind-merge`, `clsx`
3. Radix UI: `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-slot`
4. Icons: `lucide-react`, `@heroicons/react`

## Data & Auth
1. Prisma ORM `5.20.0`
2. NextAuth `4.24.13` + `@next-auth/prisma-adapter`
3. Password hashing: `bcryptjs`

## Forms & Validation
1. React Hook Form `7.66.1`
2. Zod `4.1.13` + `@hookform/resolvers`

## State & UX
1. Zustand `5.0.8`
2. react-hot-toast `2.6.0`

## Payments & API
1. Stripe SDK `20.0.0`
2. Axios `1.13.2`

## Utilities
1. date-fns `4.1.0`
2. uuid `13.0.0`

## Tooling
1. ESLint `8.57.1` + `eslint-config-next` `16.1.6`
2. PostCSS `8.5.6`, Autoprefixer `10.4.22`
3. tsx `4.20.6` (Prisma seed script)

## Database
- PostgreSQL (declared in `README.md` / env configuration for Prisma)

## Note
- `README.md` mentions Next.js 14, but `package.json` specifies Next.js 16.1.6. The `package.json` version is the source of truth.
