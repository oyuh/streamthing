import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export interface UserPayload {
  id: string;
  username: string;
  iat?: number;
  exp?: number;
}

export function createSecureToken(user: { id: string; username: string }): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    JWT_SECRET,
    {
      expiresIn: '7d', // Token expires in 7 days
    }
  );
}

export function verifySecureToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & UserPayload;
    return {
      id: decoded.id,
      username: decoded.username,
      iat: decoded.iat,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export function getUserFromToken(token?: string): UserPayload | null {
  if (!token) {
    return null;
  }

  return verifySecureToken(token);
}
