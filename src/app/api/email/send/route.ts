import { NextRequest, NextResponse } from "next/server";
import { resend, MAIL_FROM, MAIL_REPLY_TO } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import { EmailTemplate } from "@/components/email/template";
import { requireAdmin } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { subject, body, draftId } = await request.json();

    if (!subject || !body) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: recipients, error: recipientsError } = await supabase
      .from("email_recipients")
      .select("email, name")
      .eq("active", true);

    if (recipientsError || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: "No active recipients found" },
        { status: 400 }
      );
    }

    const { error: sendError } = await resend.emails.send({
      from: MAIL_FROM,
      replyTo: MAIL_REPLY_TO,
      to: recipients.map((r) => r.email),
      subject,
      /* `html`, not `react`: the template emits Outlook conditional comments
         and VML, which JSX cannot express. */
      html: EmailTemplate({ subject, body }),
    });

    if (sendError) {
      console.error("Resend error:", sendError);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    if (draftId) {
      await supabase
        .from("email_drafts")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", draftId);
    } else {
      await supabase
        .from("email_drafts")
        .insert({
          subject,
          body,
          status: "sent",
          sent_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({
      message: `Email sent to ${recipients.length} recipients`,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
