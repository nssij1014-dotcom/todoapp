import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { OAUTH_STATE_COOKIE, getGithubRedirectUri } from "@/lib/oauth";

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "GITHUB_CLIENT_ID가 설정되지 않았습니다." }, { status: 500 });
  }
  const state = crypto.randomBytes(16).toString("hex");
  const redirectUri = getGithubRedirectUri(request);

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "read:user");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return response;
}
