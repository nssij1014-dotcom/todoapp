import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";

export const SESSION_COOKIE_NAME = "session_token";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionUser {
  _id: string;
  githubId: number;
  username: string;
  avatarUrl: string;
}

// Creates a DB-backed session for userId and sets the session cookie on the current response.
// Must be called from a Route Handler (uses cookies().set).
export async function createSession(userId: string): Promise<void> {
  await connectToDatabase();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await Session.create({ token, userId, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

// Core lookup usable both from Route Handlers/Server Components (via getSessionUser)
// AND from proxy.ts (which reads the raw cookie value itself via request.cookies, since
// proxy.ts cannot use next/headers `cookies()`). Do not change this signature.
export async function getSessionUserFromToken(token: string | undefined | null): Promise<SessionUser | null> {
  if (!token) return null;
  await connectToDatabase();
  const session = await Session.findOne({ token });
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await Session.deleteOne({ _id: session._id });
    return null;
  }
  const user = await User.findById(session.userId);
  if (!user) return null;
  return {
    _id: String(user._id),
    githubId: user.githubId,
    username: user.username,
    avatarUrl: user.avatarUrl,
  };
}

// Convenience for Route Handlers / Server Components: reads the cookie via next/headers.
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return getSessionUserFromToken(token);
}

// Deletes the session record from the DB entirely (not just the cookie) and clears the cookie.
// Must be called from a Route Handler.
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await connectToDatabase();
    await Session.deleteOne({ token });
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}
