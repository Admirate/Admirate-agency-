import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
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
    const { id, active } = await request.json();

    if (!id || typeof active !== "boolean") {
      return NextResponse.json(
        { error: "ID and active status are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("email_recipients")
      .update({ active })
      .eq("id", id);

    if (error) {
      console.error("Update recipient error:", error);
      return NextResponse.json(
        { error: "Failed to update recipient" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Recipients PATCH error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("email_recipients")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete recipient error:", error);
      return NextResponse.json(
        { error: "Failed to delete recipient" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Recipients DELETE error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
