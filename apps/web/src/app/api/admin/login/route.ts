import { NextResponse } from 'next/server';
import { SESSION_COOKIE, createAdminToken, getAdminPassword } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password } = body;

    const expectedPassword = getAdminPassword();

    if (!password || typeof password !== 'string' || password !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: 'Incorrect administrator password.' },
        { status: 401 }
      );
    }

    const token = await createAdminToken();

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
