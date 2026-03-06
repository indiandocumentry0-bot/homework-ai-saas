'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      window.location.href = '/login';
      return;
    }

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-brand">Pricing</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="text-xl font-semibold">Free Plan</h2>
          <p className="mt-2">5 questions/day</p>
        </div>
        <div className="card border-brand">
          <h2 className="text-xl font-semibold">Pro Plan</h2>
          <p className="mt-2">$9/month · Unlimited questions</p>
          <button className="mt-4 rounded-xl bg-brand px-4 py-2 text-white" onClick={checkout} disabled={loading}>
            {loading ? 'Redirecting...' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>
    </main>
  );
}
