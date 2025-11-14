import { NextRequest, NextResponse } from 'next/server';
import { verifyEmail } from '@/app/actions';

export async function GET(req: NextRequest) {
  try {
     const code = req.nextUrl.searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Неверный код' }, { status: 400 });
    }

    await verifyEmail(code);

    return NextResponse.redirect(new URL('/?verified', req.url));
  } catch (error) {
    console.error(error);
    console.log('[VERIFY_GET] Server error', error);
  }
}