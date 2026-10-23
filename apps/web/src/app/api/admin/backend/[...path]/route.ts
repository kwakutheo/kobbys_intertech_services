import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession, getServerApiBaseUrl, SESSION_COOKIE } from '@/lib/admin-auth';

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const session = await getAdminSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 });

  if (!['GET', 'HEAD'].includes(request.method)) {
    const origin = request.headers.get('origin');
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }
  }

  const { path } = await context.params;
  const target = new URL(`${getServerApiBaseUrl()}/${path.map(encodeURIComponent).join('/')}`);
  target.search = request.nextUrl.search;
  const headers = new Headers();
  headers.set('authorization', `Bearer ${session.accessToken}`);
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  const response = await fetch(target, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    // Required by Node's fetch when forwarding a ReadableStream body.
    // @ts-expect-error Next's Request stream is supported by the runtime.
    duplex: 'half',
    cache: 'no-store',
  });

  const responseHeaders = new Headers();
  const responseContentType = response.headers.get('content-type');
  if (responseContentType) responseHeaders.set('content-type', responseContentType);
  return new NextResponse(response.body, { status: response.status, headers: responseHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
