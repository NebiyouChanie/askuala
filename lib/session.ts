import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const secretKey = process.env.SESSION_SECRET;
const encodeKey = new TextEncoder().encode(secretKey);

// Session payload type
type SessionPayload = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  expiresAt: Date;
};

// Encrypt function to create JWT
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') 
    .sign(encodeKey);
}

// Decrypt function to verify JWT
export async function decrypt(session: string) {
  try {
    const { payload } = await jwtVerify(session, encodeKey, { algorithms: ['HS256'] });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

// Create session function
export async function createSession(userId: string, firstName: string, lastName: string, email: string, role: 'admin' | 'user') {
  const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); 
  const payload = { userId, firstName, lastName, email, role, expiresAt };
  const session = await encrypt(payload);

  // Set the session cookie
  (await cookies()).set('session', session, {
    httpOnly: true,
    secure: true,  
    expires: expiresAt,
    sameSite: 'lax',  
    path: '/',  
  });

}

// Verify session function
export async function verifySession() {
  const session = (await cookies()).get('session')?.value;
  if (!session) {
    redirect('/admin');  
  }

  const payload = await decrypt(session);
  if (!payload) {
    redirect('/admin');  
  }

  return { firstName: payload.firstName, lastName: payload.lastName, email: payload.email, role: payload.role };
}

// Delete session function
export async function deleteSession() {
  (await cookies()).delete('session');
  redirect('/auth/singin');  
}


