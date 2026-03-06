import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getUserFromAuthHeader } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getUserFromAuthHeader(req.headers.get('authorization'));
  if (!user?.email) return new NextResponse('Unauthorized', { status: 401 });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    customer_email: user.email,
    metadata: {
      user_id: user.id
    }
  });

  return NextResponse.json({ url: session.url });
}
