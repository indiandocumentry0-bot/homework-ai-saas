'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSolver } from '@/components/dashboard-solver';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login');
      else setReady(true);
    });
  }, [router]);

  if (!ready) return <main className="px-4 py-10">Loading...</main>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-brand">Homework Dashboard</h1>
      <p className="mt-2 text-slate-700">Ask by text or upload a photo to solve with AI.</p>
      <div className="card mt-6">
        <DashboardSolver />
      </div>
    </main>
  );
}
