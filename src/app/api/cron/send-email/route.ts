import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import { EmailTemplate } from "@/components/email/template";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    const { data: scheduledDraft, error: draftError } = await supabase
      .from("email_drafts")
      .select("*")
      .eq("status", "scheduled")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (draftError || !scheduledDraft) {
      return NextResponse.json(
        { message: "No scheduled emails to send" },
        { status: 200 }
      );
    }

    const { data: recipients, error: recipientsError } = await supabase
      .from("email_recipients")
      .select("email, name")
      .eq("active", true);

    if (recipientsError || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { message: "No active recipients" },
        { status: 200 }
      );
    }

    const { error: sendError } = await resend.emails.send({
      from: "ADMIRATE <noreply@admirate.in>",
      to: recipients.map((r) => r.email),
      subject: scheduledDraft.subject,
      react: EmailTemplate({
        subject: scheduledDraft.subject,
        body: scheduledDraft.body,
      }),
    });

    if (sendError) {
      console.error("Cron email send error:", sendError);
      return NextResponse.json(
        { error: "Failed to send scheduled email" },
        { status: 500 }
      );
    }

    await supabase
      .from("email_drafts")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", scheduledDraft.id);

    return NextResponse.json({
      message: `Scheduled email sent to ${recipients.length} recipients`,
    });
  } catch (error) {
    console.error("Cron send error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
