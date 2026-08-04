import { NextRequest, NextResponse } from "next/server";
import { getTemplate } from "@/components/email/templates";
import { requireAdmin } from "@/lib/api-auth";

/**
 * Renders a template exactly as the send routes will, for a new browser tab.
 *
 * It calls the same `getTemplate(id).render()` those routes call rather than
 * approximating it, so what is on screen is the bytes Resend gets. Sending a
 * creative to a list is not reversible; being able to look at it first is worth
 * one route.
 *
 * Admin-gated like every other dashboard endpoint — this returns marketing
 * copy, not secrets, but an open route that renders arbitrary query text into
 * HTML is not something to leave lying about.
 */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const params = request.nextUrl.searchParams;
  const template = getTemplate(params.get("template"));

  const html = template.render({
    subject: params.get("subject") ?? "",
    body: params.get("body") ?? "",
  });

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // A preview is of whatever is in the composer right now. A cached one
      // showing the previous subject is worse than no preview at all.
      "Cache-Control": "no-store",
    },
  });
}
