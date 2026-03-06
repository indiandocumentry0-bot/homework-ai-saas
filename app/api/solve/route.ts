import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { countRows, insertRow, selectSingle } from '@/lib/supabase-admin';
import { getUserFromAuthHeader } from '@/lib/auth';

const HOMEWORK_PROMPT = `You are an expert tutor for school students.
Solve the homework problem step-by-step and explain in simple language suitable for a 12–16 year old student.

Provide output in this format:

Final Answer:
Step-by-step Explanation:
Key Concept:`;

export async function POST(req: Request) {
  try {
    const user = await getUserFromAuthHeader(req.headers.get('authorization'));
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const { question, extractedText } = await req.json();
    const finalQuestion = [question, extractedText].filter(Boolean).join('\n').trim();
    if (!finalQuestion) return new NextResponse('Question is required', { status: 400 });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const profile = await selectSingle('profiles', 'plan', `id=eq.${user.id}`);
    const isPro = profile?.plan === 'pro';

    if (!isPro) {
      const count = await countRows('questions', `user_id=eq.${user.id}&created_at=gte.${encodeURIComponent(startOfDay.toISOString())}`);
      if (count >= 5) {
        return new NextResponse('Free plan daily limit reached. Upgrade to Pro for unlimited solves.', {
          status: 403
        });
      }
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: HOMEWORK_PROMPT },
        { role: 'user', content: finalQuestion }
      ],
      temperature: 0.2
    });

    const answer = completion.choices[0]?.message?.content ?? 'No answer generated';

    await insertRow('questions', {
      user_id: user.id,
      question_text: finalQuestion,
      ai_answer: answer
    });

    return NextResponse.json({ answer, extractedText });
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : 'Internal server error', {
      status: 500
    });
  }
}
