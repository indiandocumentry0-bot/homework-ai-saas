'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

type Question = {
  id: string;
  question_text: string;
  ai_answer: string;
  created_at: string;
};

export default function HistoryPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    (async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const data = await supabase.fetchQuestions(20);
      setQuestions(data);
      setLoading(false);
    })();
  }, [router]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-brand">History</h1>
      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : (
        <div className="mt-6 space-y-4">
          {questions.map((q) => (
            <div className="card" key={q.id}>
              <p className="text-xs text-slate-500">{new Date(q.created_at).toLocaleString()}</p>
              <p className="mt-2 font-semibold">{q.question_text}</p>
              <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{q.ai_answer}</pre>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
