'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    if (token) {
      supabase.auth.setAccessToken(token);
      router.replace('/dashboard');
      return;
    }
    router.replace('/login');
  }, [router]);

  return <main className="px-4 py-10">Signing you in...</main>;
}
