import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/prisma/prisma-client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = Number(body.orderId);
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: 'uah',
      metadata: { orderId: String(order.id) },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (err) {
    console.error('[create payment intent]', err);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
