import type { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { SignJWT, jwtVerify } from "jose";

interface UserJwtPayload {
  jti: string;
  iat: number;
}

export class AuthError extends Error {}

function getJwtSecretKey(): string {
  const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET!;

  if (!JWT_SECRET_KEY || JWT_SECRET_KEY.length === 0) {
    throw new Error("The environment variable JWT_SECRET_KEY is not set.");
  }

  return JWT_SECRET_KEY;
}

export const USER_TOKEN = "user-token";

/**
 * Verifies the user's JWT token and returns its payload if it's valid.
 */
export async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get(USER_TOKEN)?.value;

  if (!token) {
    return false;
  }

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );
    return verified.payload as UserJwtPayload;
  } catch (err) {
    throw new AuthError("Your token has expired.");
  }
}

/**
 * Adds the user token cookie to a response.
 */

export async function signToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(new TextEncoder().encode(getJwtSecretKey()));

  return token;
}

/**
 * Expires the user token cookie
 */
export function expireUserCookie(res: NextResponse) {
  res.cookies.set(USER_TOKEN, "", { httpOnly: true, maxAge: 0 });
  return res;
}
