import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, MAIL_FROM } from "@/lib/resend";
import { SITE } from "@/lib/seo";
import {
  renderEnquiryAck,
  renderEnquiryAckText,
  enquiryAckSubject,
} from "@/components/email/enquiry-ack";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
  // Collected only by the /start-project brief. Optional, so the plain contact
  // path — which never sends them — validates exactly as it did before.
  company: z
    .string()
    .max(120, "Company name is too long")
    .optional()
    .or(z.literal("")),
  services: z.array(z.string().max(60)).max(20).optional(),
  budget: z.string().max(40).optional().or(z.literal("")),
  timeline: z.string().max(40).optional().or(z.literal("")),
  // Collected only by the /start-project wizard. Optional for the same reason
  // the fields above are: the plain contact path never sends them.
  industry: z.string().max(60).optional().or(z.literal("")),
  plan: z.string().max(60).optional().or(z.literal("")),
  billing_cycle: z.string().max(20).optional().or(z.literal("")),
});

type ContactSubmission = z.infer<typeof contactSchema>;

/**
 * The automatic "thank you, we'll be in touch" reply to whoever submitted.
 *
 * Never throws. The lead is already safe in Supabase by the time this runs, and
 * a Resend outage — or a missing RESEND_API_KEY on a preview deploy — must not
 * turn a captured enquiry into an error screen that makes the visitor submit it
 * a second time. A failure here is logged and nothing more.
 *
 * Awaited rather than fired and forgotten: on a serverless host the function
 * can be frozen the moment the response is returned, and a floating promise
 * would be killed before the request to Resend ever left.
 */
async function sendAcknowledgement(submission: ContactSubmission) {
  const ack = {
    name: submission.name,
    company: submission.company,
    message: submission.message,
  };

  try {
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      /* Replies land in the mailbox printed on the site, so the address the
         visitor already has is the address that answers them. */
      replyTo: SITE.email,
      to: [submission.email],
      subject: enquiryAckSubject(submission.company),
      html: renderEnquiryAck(ack),
      /* Sending both parts makes this a real multipart/alternative message.
         HTML-only is a shape bulk senders produce and person-to-person mail
         does not, and Gmail's Promotions classifier is one of the things that
         reads it. */
      text: renderEnquiryAckText(ack),
    });

    if (error) console.error("Enquiry acknowledgement failed:", error);
  } catch (err) {
    console.error("Enquiry acknowledgement error:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    const supabase = createAdminClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name: validated.name,
      email: validated.email,
      phone: validated.phone || null,
      message: validated.message,
      company: validated.company || null,
      services: validated.services ?? [],
      budget: validated.budget || null,
      timeline: validated.timeline || null,
      industry: validated.industry || null,
      plan: validated.plan || null,
      billing_cycle: validated.billing_cycle || null,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit. Please try again later." },
        { status: 500 }
      );
    }

    await sendAcknowledgement(validated);

    return NextResponse.json(
      { message: "Thank you! We'll get back to you soon." },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
