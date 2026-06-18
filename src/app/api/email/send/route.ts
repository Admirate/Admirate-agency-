import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import { EmailTemplate } from "@/components/email/template";

export async function POST(request: NextRequest) {
  try {
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
      from: "ADMIRATE <noreply@admirate.in>",
      to: recipients.map((r) => r.email),
      subject,
      react: EmailTemplate({ subject, body }),
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
