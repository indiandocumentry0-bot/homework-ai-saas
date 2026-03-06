# HomeworkAI SaaS (Next.js 14)

HomeworkAI is an AI-powered homework solver built as a full-stack SaaS web application.
Students can type homework questions or upload a photo, then receive step-by-step explanations.

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend:** Next.js Route Handlers (`app/api/*`)
- **Database/Auth/Storage:** Supabase PostgreSQL + Supabase Auth + Supabase Storage
- **AI:** OpenAI API
- **OCR:** Tesseract.js
- **Payments:** Stripe subscriptions

## Generated Pages

- `/landing`
- `/login`
- `/signup`
- `/dashboard`
- `/history`
- `/pricing`

## Folder Structure

```txt
app/
  api/
    solve/route.ts
    create-checkout-session/route.ts
    webhook/route.ts
  auth/callback/page.tsx
  dashboard/page.tsx
  history/page.tsx
  landing/page.tsx
  login/page.tsx
  pricing/page.tsx
  signup/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  auth-form.tsx
  dashboard-solver.tsx
  navbar.tsx
lib/
  openai.ts
  stripe.ts
  supabase-admin.ts
  supabase-browser.ts
supabase/
  schema.sql
```

## Core Features

1. **Landing page** with hero, 3-step flow, features, pricing CTA
2. **Authentication** with email/password + Google login via Supabase Auth
3. **Dashboard** with:
   - question textbox
   - image upload
   - "Solve Homework" action
4. **AI solving pipeline**:
   - optional OCR extraction from uploaded image using Tesseract.js
   - prompt sent to OpenAI with structured response template
5. **History page** to view prior solved questions
6. **SaaS credits**:
   - free plan: 5 questions/day
   - pro plan: unlimited
7. **Stripe subscription checkout** for Pro plan

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

OPENAI_API_KEY=your_openai_api_key

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PRICE_ID=your_stripe_price_id_for_9_usd_monthly
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Supabase Setup

1. Create a Supabase project.
2. Run SQL in `supabase/schema.sql`.
3. In Auth providers, enable **Email** and **Google**.
4. Create a storage bucket named `homework-images`.
5. Configure Google OAuth redirect URL:
   - `https://<your-domain>/auth/callback`
   - `http://localhost:3000/auth/callback` for local dev.

## Stripe Setup

1. Create a product + recurring price `$9/month`.
2. Put the price id in `STRIPE_PRICE_ID`.
3. Configure webhook endpoint:
   - local: `http://localhost:3000/api/webhook`
   - production: `https://<your-domain>/api/webhook`
4. Subscribe to `checkout.session.completed`.

## Local Development

```bash
npm install
npm run dev
```

Open: `http://localhost:3000/landing`

## Deployment

### Vercel (Frontend + API)

1. Import Git repository into Vercel.
2. Set all environment variables listed above.
3. Deploy.

### Supabase (Database/Auth/Storage)

- Keep schema and policies from `supabase/schema.sql`.
- Keep `profiles` and `questions` tables + RLS.
- Keep `homework-images` bucket.

## Notes

- Free users are limited to **5 questions per day** by counting same-day rows in `questions`.
- Pro users are marked as `plan='pro'` in `profiles` after Stripe webhook success.
- OCR runs in the browser for uploaded images and sends extracted text to `/api/solve`.
