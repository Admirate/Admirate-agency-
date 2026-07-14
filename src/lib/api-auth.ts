import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

/**
 * Admin gate for API route handlers.
 *
 * The `/dashboard` middleware does not match `/api/*`, so before this existed
 * every dashboard endpoint answered an unauthenticated caller: anyone could
 * read every contact submission or mail the whole recipient list by hitting
 * the route directly.
 *
 * The check lives in the handler rather than in middleware deliberately.
 * Middleware is a routing layer and has had bypasses (CVE-2025-29927); a
 * handler-level check cannot be skipped by a crafted request header. It also
 * keeps the read/write split honest — `GET /api/portfolio` feeds the public
 * services page and stays open, while the writes beside it do not.
 *
 * Usage, first line of every protected handler:
 *
 *   const denied = await requireAdmin();
 *   if (denied) return denied;
 *
 * Returns a 401 response when the caller is not the signed-in admin, and
 * `null` when they are — so `if (denied)` reads as "stop here".
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const token = (await cookies()).get("admin_token")?.value;
  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
