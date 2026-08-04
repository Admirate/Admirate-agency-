import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";
import { requireAdmin } from "@/lib/api-auth";
import { cleanAudience } from "@/lib/campaign-audience";

type DraftUpdate = Database["public"]["Tables"]["email_drafts"]["Update"];

export async function GET() {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("email_drafts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch drafts error:", error);
      return NextResponse.json(
        { error: "Failed to fetch drafts" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Drafts API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { subject, body, status = "draft", templateId, industries } =
      await request.json();

    if (!subject || !body) {
      return NextResponse.json(
        { error: "Subject and body are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("email_drafts")
      .insert({
        subject,
        body,
        status,
        // Null rather than a default id: the registry decides what the default
        // is, and a draft that names no template should follow it if it moves.
        template_id: typeof templateId === "string" && templateId ? templateId : null,
        industries: cleanAudience(industries),
      })
      .select()
      .single();

    if (error) {
      console.error("Create draft error:", error);
      return NextResponse.json(
        { error: "Failed to save draft" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Drafts POST error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id, subject, body, status, templateId, industries } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const updateData: DraftUpdate = {};
    if (subject) updateData.subject = subject;
    if (body) updateData.body = body;
    if (status) updateData.status = status;
    // `undefined` means "not editing this"; null and [] are real values that
    // must be writable, so these test for presence rather than truthiness.
    if (templateId !== undefined) {
      updateData.template_id =
        typeof templateId === "string" && templateId ? templateId : null;
    }
    if (industries !== undefined) {
      updateData.industries = cleanAudience(industries);
    }

    const { error } = await supabase
      .from("email_drafts")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Update draft error:", error);
      return NextResponse.json(
        { error: "Failed to update draft" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Drafts PATCH error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("email_drafts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete draft error:", error);
      return NextResponse.json(
        { error: "Failed to delete draft" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Drafts DELETE error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
