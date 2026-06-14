# ADMIRATE Agency

Strategic Design & Marketing Agency website — [admirate.in](https://admirate.in)

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** GSAP, Framer Motion, Lenis
- **Backend:** Supabase (PostgreSQL + Storage)
- **Forms:** React Hook Form + Zod
- **Deployment:** Netlify

## Getting Started

### Prerequisites

- Node.js 22+
- npm
- A [Supabase](https://supabase.com) project

### Setup

1. **Install dependencies:**

   ```bash
   cd Admirate-agency-
   npm install
   ```

2. **Configure environment variables:**

   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

   ```bash
   cp .env.example .env.local
   ```

   Required variables:

   | Variable | Description |
   |----------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

3. **Create the database table:**

   Run this SQL in your Supabase SQL Editor:

   ```sql
   CREATE TABLE contact_submissions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     phone TEXT,
     message TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT now()
   );

   ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Allow anonymous inserts"
     ON contact_submissions FOR INSERT
     WITH CHECK (true);
   ```

4. **Run the dev server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/                  # Next.js App Router (pages + API routes)
│   ├── api/contact/      # Contact form API endpoint
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles + fonts
├── components/
│   ├── ui/               # Primitives (LenisProvider, etc.)
│   ├── layout/           # Header, Footer, Navigation
│   └── sections/         # Page sections
├── lib/
│   ├── supabase/         # Supabase client (browser + server)
│   └── utils.ts          # Shared utilities (cn helper)
├── hooks/                # Custom React hooks
├── types/                # TypeScript types + Supabase DB types
└── constants/            # Static data and config values
```
