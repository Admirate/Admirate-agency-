import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
