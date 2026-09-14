import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUserFromToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { unauthorizedResponse } from "@/lib/apiUtils";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getSessionUserFromToken(token);

  if (!user) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return unauthorizedResponse();
    }
    return NextResponse.redirect(new URL("/auth/github", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/todos", "/api/todos", "/api/todos/:path*"],
};
