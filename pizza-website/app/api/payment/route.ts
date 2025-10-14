import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
    try {
        const { amount } = await request.json();
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'uah',
            automatic_payment_methods: { enabled: true },
        });
        return NextResponse.json({ clientSecret: paymentIntent.client_secret });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 400 });
        }
        return new Response("Invalid request body", { status: 400 });
    }
}
