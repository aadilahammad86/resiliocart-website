import 'server-only';
import { type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { encrypt, decrypt } from '@/lib/jwt';

export { decrypt };

export async function createSession(userId: string, username: string, role: string) {
  // 10-year persistent cookies (effectively never expires for active returning users on the same device)
  const expires = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000);
  // Encode expires as string internally for generic JWTPayload compat
  const sessionData: JWTPayload = { userId, username, role, expires: expires.toISOString() };
  const sessionToken = await encrypt(sessionData);

  const cookieStore = await cookies();
  cookieStore.set('session', sessionToken, {
    httpOnly: true, // Prevents XSS attacks natively
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    path: '/',
    sameSite: 'lax',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function verifySession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) return null;

  const sessionData = await decrypt(sessionCookie);
  return sessionData; // Will be null if expired or tampered
}
