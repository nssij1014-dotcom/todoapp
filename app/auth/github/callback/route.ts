import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { createSession } from "@/lib/session";
import { OAUTH_STATE_COOKIE, getGithubRedirectUri } from "@/lib/oauth";

function rejectAndClearState(error: string, status: number): NextResponse {
  const response = NextResponse.json({ error }, { status });
  response.cookies.delete(OAUTH_STATE_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || state !== cookieState) {
    return rejectAndClearState("invalid state or missing code", 400);
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: getGithubRedirectUri(request),
    }),
  });
  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  if (!accessToken) {
    return rejectAndClearState("token exchange failed", 401);
  }

  const profileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "todoapp",
    },
  });
  if (!profileResponse.ok) {
    return rejectAndClearState("profile fetch failed", 401);
  }
  const profile = await profileResponse.json();
  const { id, login, avatar_url } = profile;
  if (typeof id !== "number" || !login) {
    return rejectAndClearState("invalid profile", 401);
  }

  await connectToDatabase();
  const user = await User.findOneAndUpdate(
    { githubId: id },
    { $set: { username: login, avatarUrl: avatar_url } },
    { upsert: true, new: true }
  );

  await createSession(String(user._id));

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete(OAUTH_STATE_COOKIE);
  return response;
}
