import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { upsertRow } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) return new NextResponse('Missing signature', { status: 400 });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err instanceof Error ? err.message : 'unknown error'}`, {
      status: 400
    });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    if (userId) {
      await upsertRow('profiles', { id: userId, plan: 'pro' });
    }
  }

  return NextResponse.json({ received: true });
}
