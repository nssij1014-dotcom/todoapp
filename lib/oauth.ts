import type { NextRequest } from "next/server";

export const OAUTH_STATE_COOKIE = "gh_oauth_state";

// Must produce the exact same value in both app/auth/github/route.ts (build authorize URL)
// and app/auth/github/callback/route.ts (send back to GitHub during token exchange) - GitHub
// rejects the exchange if redirect_uri doesn't match what was used to start the flow.
export function getGithubRedirectUri(request: NextRequest): string {
  const appUrl = (process.env.APP_URL || request.nextUrl.origin).replace(/\/+$/, "");
  return `${appUrl}/auth/github/callback`;
}
