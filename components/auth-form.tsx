'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

type Props = {
  mode: 'login' | 'signup';
};

export function AuthForm({ mode }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const supabase = createSupabaseBrowserClient();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      setMessage(error ? error.message : 'Signup successful. Check your email verification link.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    router.push('/dashboard');
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) setMessage(error.message);
  }

  return (
    <div className="card mx-auto w-full max-w-md">
      <h1 className="mb-4 text-2xl font-bold text-brand">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="w-full rounded-xl border border-purple-200 p-3" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-xl border border-purple-200 p-3" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full rounded-xl bg-brand p-3 font-semibold text-white" type="submit">
          {mode === 'login' ? 'Log in' : 'Sign up'}
        </button>
      </form>
      <button className="mt-3 w-full rounded-xl border border-purple-200 p-3 text-sm font-medium" onClick={signInWithGoogle} type="button">
        Continue with Google
      </button>
      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
    </div>
  );
}
