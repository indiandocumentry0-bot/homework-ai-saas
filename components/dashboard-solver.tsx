'use client';

import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

type SolveResponse = {
  answer: string;
  extractedText?: string;
};

export function DashboardSolver() {
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createSupabaseBrowserClient();

  async function runOCR(file: File) {
    const worker = await createWorker('eng');
    const {
      data: { text }
    } = await worker.recognize(file);
    await worker.terminate();
    return text;
  }

  async function uploadImage(file: File) {
    const path = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('homework-images').upload(path, file);
    if (error) throw new Error(error.message);
    return data.path;
  }

  async function solveHomework() {
    setLoading(true);
    setError('');
    try {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Please log in first.');

      let extractedText = '';
      let imagePath = '';

      if (image) {
        extractedText = await runOCR(image);
        imagePath = await uploadImage(image);
      }

      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ question, extractedText, imagePath })
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to solve question');
      }

      const data: SolveResponse = await res.json();
      setAnswer(data.answer);
      if (!question && data.extractedText) setQuestion(data.extractedText);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <textarea className="min-h-32 w-full rounded-xl border border-purple-200 p-3" placeholder="Type your homework question" value={question} onChange={(e) => setQuestion(e.target.value)} />
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
      <button className="rounded-xl bg-brand px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={loading || (!question && !image)} onClick={solveHomework}>
        {loading ? 'Solving…' : 'Solve Homework'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {answer && <pre className="card whitespace-pre-wrap text-sm leading-6 text-slate-800">{answer}</pre>}
    </div>
  );
}
