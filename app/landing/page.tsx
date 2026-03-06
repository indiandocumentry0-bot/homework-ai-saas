import Link from 'next/link';
import { Navbar } from '@/components/navbar';

export default function LandingPage() {
  return (
    <main className="px-4">
      <Navbar />
      <section className="mx-auto grid max-w-6xl gap-10 py-16 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-bold leading-tight text-brand md:text-5xl">
            Solve Your Homework Instantly with AI
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Upload a question or photo and get step-by-step explanations in seconds.
          </p>
          <div className="mt-6 flex gap-3">
            <Link className="rounded-xl bg-brand px-5 py-3 font-semibold text-white" href="/signup">
              Get Started
            </Link>
            <Link className="rounded-xl border border-purple-200 px-5 py-3 font-semibold" href="/login">
              Login
            </Link>
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold">Why students love HomeworkAI</h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>✅ Step-by-step reasoning</li>
            <li>✅ Photo upload with OCR</li>
            <li>✅ Saved answer history</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl py-8">
        <h3 className="text-2xl font-bold">How it works</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {['Type or upload your homework', 'AI solves with clear steps', 'Review and save answers'].map((step, i) => (
            <div className="card" key={step}>
              <p className="text-sm font-semibold text-brand">Step {i + 1}</p>
              <p className="mt-2 font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl py-8">
        <h3 className="text-2xl font-bold">Features</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {['Text + image question input', 'Simple language for ages 12–16', 'Daily free credits', 'Secure Supabase login'].map((item) => (
            <div className="card" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl py-8">
        <h3 className="text-2xl font-bold">Pricing</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card">
            <h4 className="text-xl font-bold">Free</h4>
            <p className="mt-2">5 questions/day</p>
          </div>
          <div className="card border-brand">
            <h4 className="text-xl font-bold">Pro</h4>
            <p className="mt-2">$9/month · Unlimited questions</p>
            <Link href="/pricing" className="mt-4 inline-block rounded-xl bg-brand px-4 py-2 text-white">
              Upgrade
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
