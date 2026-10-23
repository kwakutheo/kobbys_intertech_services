import { NextResponse } from 'next/server';
import { SESSION_COOKIE, createAdminToken, getServerApiBaseUrl } from '@/lib/admin-auth';
import { isStaffRole } from '@/lib/admin-roles';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Enter your staff email address and password.' },
        { status: 400 }
      );
    }

    const authResponse = await fetch(`${getServerApiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });
    const authData = await authResponse.json().catch(() => null);
    const roles = authData?.user?.roles as string[] | undefined;
    const isStaff = roles?.some(isStaffRole);
    if (!authResponse.ok || !authData?.accessToken || !isStaff) {
      return NextResponse.json({ success: false, error: 'Invalid staff email address or password.' }, { status: 401 });
    }

    const token = await createAdminToken(authData.accessToken, { email: authData.user.email, roles: roles ?? [] });

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
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
