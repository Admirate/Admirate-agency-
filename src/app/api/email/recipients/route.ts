import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("email_recipients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch recipients error:", error);
      return NextResponse.json(
        { error: "Failed to fetch recipients" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Recipients API error:", error);
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

    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("email_recipients")
      .insert({ email, name, active: true })
      .select()
      .single();

    if (error) {
      console.error("Add recipient error:", error);
      return NextResponse.json(
        { error: "Failed to add recipient" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Recipients POST error:", error);
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

    const { id, ids, active } = await request.json();

    const targets: string[] = Array.isArray(ids) ? ids : id ? [id] : [];

    if (targets.length === 0 || targets.some((v) => typeof v !== "string")) {
      return NextResponse.json(
        { error: "An id or a list of ids is required" },
        { status: 400 }
      );
    }

    if (typeof active !== "boolean") {
      return NextResponse.json(
        { error: "active must be true or false" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("email_recipients")
      .update({ active })
      .in("id", targets)
      .select("id");

    if (error) {
      console.error("Update recipients error:", error);
      return NextResponse.json(
        { error: "Failed to update recipients" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Updated successfully",
      updated: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Recipients PATCH error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * Deletes one recipient, a named set, or the entire list.
 *
 * `all` is an explicit flag rather than a client-supplied array of every id.
 * Emptying the table should say so: it lets the server recognise the intent,
 * and it means a truncated or half-built id list cannot silently delete a
 * subset nobody chose. The single-`id` shape is unchanged because the row
 * actions still use it.
 */
export async function DELETE(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id, ids, all } = await request.json();
    const supabase = await createClient();

    if (all === true) {
      // Supabase requires a filter on delete. `not id is null` matches every
      // row without naming one.
      const { data, error } = await supabase
        .from("email_recipients")
        .delete()
        .not("id", "is", null)
        .select("id");

      if (error) {
        console.error("Delete all recipients error:", error);
        return NextResponse.json(
          { error: "Failed to delete recipients" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: `Deleted ${data?.length ?? 0} recipients`,
        deleted: data?.length ?? 0,
      });
    }

    const targets: string[] = Array.isArray(ids) ? ids : id ? [id] : [];

    if (targets.length === 0 || targets.some((v) => typeof v !== "string")) {
      return NextResponse.json(
        { error: "An id, a list of ids, or all:true is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("email_recipients")
      .delete()
      .in("id", targets)
      .select("id");

    if (error) {
      console.error("Delete recipients error:", error);
      return NextResponse.json(
        { error: "Failed to delete recipients" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message:
        data?.length === 1
          ? "Deleted successfully"
          : `Deleted ${data?.length ?? 0}`,
      deleted: data?.length ?? 0,
    });
  } catch (error) {
    console.error("Recipients DELETE error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
