import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * Gates the dashboard pages. This checks the token's *signature* — it
 * previously decoded the payload segment and trusted whatever `exp` it found,
 * so any hand-written token with a future expiry was accepted.
 *
 * This is the gate for the dashboard UI only. The API routes guard themselves
 * (see lib/api-auth.ts) rather than relying on middleware, so a bypass here
 * cannot expose data.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;
  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    const response = NextResponse.redirect(
      new URL("/dashboard/login", request.url)
    );
    response.cookies.delete("admin_token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
