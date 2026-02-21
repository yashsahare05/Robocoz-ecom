## Robocoz

Production-ready e-commerce and fabrication platform for an electronics supplier that also offers 3D printing (FDM & SLA) and custom PCB manufacturing services. Built with Next.js 16.1.16 App Router, Prisma, PostgreSQL, NextAuth, Tailwind CSS and Stripe-ready payments.

### Tech Stack
- Next.js 16.1.16 (App Router, TypeScript)
- Tailwind CSS 3.4 for styling
- Prisma ORM + PostgreSQL
- NextAuth (Credentials + Google OAuth)
- Stripe integration-ready payments
- Zustand cart store, Zod validation, React Hook Form

### Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy environment template
   ```bash
   cp env.example .env.local
   ```
   Fill in Postgres/Stripe/Google credentials plus `NEXTAUTH_SECRET`.
3. Generate Prisma client & run migrations
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```
4. Launch dev server
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:3000`.

### Environment Variables
| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret for NextAuth JWT |
| `NEXTAUTH_URL` | Base URL for auth callbacks |
| `GOOGLE_CLIENT_ID/SECRET` | OAuth credentials |
| `STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` | Stripe keys |
| `FILE_STORAGE_BUCKET` | Bucket/prefix for uploaded files |

### Scripts
| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed sample catalog/services data |

### Project Highlights
- **Home**: hero CTA, featured categories, products carousel, services, testimonials, value props.
- **Shop**: filters/search scaffolding, category pages, detailed product pages w/ specs, tiered pricing, related products.
- **3D Printing Services**: instant quote form (tech/material/color/layer/infill/quantity/delivery), estimated pricing, upload slots and add to cart.
- **PCB Manufacturing**: capability overview + configurable quote (dimensions, layers, finish, solder mask, assembly, BOM, lead time) with pricing logic.
- **Account Center**: profile, orders, downloads, notifications, saved quotes placeholder.
- **Cart & Checkout**: carts combine physical + service SKUs, taxes/shipping calculation, Stripe payment placeholder.
- **Admin Dashboard**: overview cards, service queue, CMS quick links (secured by middleware when auth is enabled).
- **CMS-ready content**: About, Contact, FAQ, Shipping & Returns, Terms, Privacy.
- **API Routes**: Products CRUD, orders/Stripe intents, 3D printing + PCB submissions, uploads, NextAuth.

### Pricing & Service Logic
Located in `src/lib/pricing`:
- `estimate3dPrintPrice(input)` uses material multipliers, technology factors, volume, layer height and infill.
- `estimatePcbPrice(input)` uses area, layers, finish multipliers, copper weight, lead time and assembly surcharge.
Adjust multipliers or formulas there; material/finish catalogs live in `src/lib/constants.ts`.

### Adding New Options
- **Filaments/Resins**: update `printingMaterials` array (`src/lib/constants.ts`) with new color sets, multipliers, and base rates.
- **PCB Options**: extend `pcbFinishes`, `solderMaskColors`, `silkscreenColors` and update validators in `PcbQuoteForm`.
- **Catalog Data**: use Prisma schema (products/categories/brands) and seed script (`prisma/seed.ts`) for initial datasets.

### Deployment Notes
- Set all environment variables in your hosting provider (Vercel, Render, etc.).
- Run `npm run build` then `npm run start`.
- Configure file storage (S3, GCS) by updating `storageService` implementation; current version mocks uploads but stores consistent file metadata.
- Email + Stripe hooks are abstracted in `src/lib/email.ts` and `src/lib/stripe.ts` for easy provider swapping.

### Testing & QA
- Use Prisma Studio (`npx prisma studio`) to inspect seeded data.
- Verify NextAuth social login by configuring Google OAuth callback to `https://your-domain/api/auth/callback/google`.
- Update pricing formulas and multipliers in `src/lib/pricing` and `src/lib/constants` as business rules change.
