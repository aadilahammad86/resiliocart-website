import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

// In production, this must be securely generated and set in the environment variables
const secretKey = process.env.SESSION_SECRET || 'development-fallback-secret-resiliocart';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().sign(key);
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
