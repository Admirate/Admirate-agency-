import { NextRequest, NextResponse } from "next/server";
import { sendCampaign } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTemplate } from "@/components/email/templates";
import { cleanAudience, describeAudience } from "@/lib/campaign-audience";
import { requireAdmin } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { subject, body, draftId, templateId, industries } =
      await request.json();

    if (!subject || !body) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    const audience = cleanAudience(industries);
    const template = getTemplate(
      typeof templateId === "string" ? templateId : null
    );

    const supabase = createAdminClient();

    let query = supabase
      .from("email_recipients")
      .select("email, name")
      .eq("active", true);

    // An empty audience is not a filter of nothing — it means everyone, which
    // is what this route did before segmentation existed and is still the
    // default the composer sends when no chip is picked.
    if (audience.length > 0) query = query.in("industry", audience);

    const { data: recipients, error: recipientsError } = await query;

    if (recipientsError || !recipients || recipients.length === 0) {
      /* Named rather than a bare "no recipients": with segmentation the usual
         cause is a segment nobody has been assigned to yet, and the fix is to
         go and assign them. A generic message sends people to look at the
         wrong screen. */
      return NextResponse.json(
        {
          error:
            audience.length > 0
              ? `No active recipients in ${describeAudience(audience)}`
              : "No active recipients found",
        },
        { status: 400 }
      );
    }

    const { error: sendError } = await sendCampaign({
      to: recipients.map((r) => r.email),
      subject,
      /* `html`, not `react`: the template emits Outlook conditional comments
         and VML, which JSX cannot express. */
      html: template.render({ subject, body }),
    });

    if (sendError) {
      /* The provider's own words, not "Failed to send email": the composer
         shows this error verbatim, and a bare failure string sent the last
         outage to the server logs to find out what went wrong. */
      return NextResponse.json(
        { error: `Failed to send email: ${sendError}` },
        { status: 500 }
      );
    }

    if (draftId) {
      await supabase
        .from("email_drafts")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          template_id: template.id,
          industries: audience,
        })
        .eq("id", draftId);
    } else {
      await supabase.from("email_drafts").insert({
        subject,
        body,
        status: "sent",
        sent_at: new Date().toISOString(),
        template_id: template.id,
        industries: audience,
      });
    }

    return NextResponse.json({
      message: `Email sent to ${recipients.length} recipients${
        audience.length > 0 ? ` in ${describeAudience(audience)}` : ""
      }`,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
