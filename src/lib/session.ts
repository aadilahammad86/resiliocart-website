import 'server-only';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

// In production, this must be securely generated and set in the environment variables
const secretKey = process.env.SESSION_SECRET || 'development-fallback-secret-resiliocart';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Sessions last for 7 days
    .sign(key);
}

export async function decrypt(input: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string, username: string, role: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
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
