import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/api-auth";
import { isEmail, nameFromEmail } from "@/lib/recipient-sheet";
import { toIndustryId } from "@/lib/industries";

/**
 * Bulk recipient import, behind the spreadsheet upload on the recipients page.
 *
 * The sheet is parsed in the browser — a 5,000-row workbook is a few hundred KB
 * of XML that would otherwise be uploaded and parsed per request — and this
 * receives the extracted rows as JSON. It re-validates all of it: the parser
 * runs on the client, so nothing it produces can be trusted here.
 *
 * Existing addresses are skipped rather than updated. Re-uploading the same
 * sheet is therefore harmless, which matters because that is exactly what
 * happens when someone is unsure whether the first upload worked. In
 * particular it never flips `active` back on — a deactivated recipient opted
 * out, and an import must not resurrect them.
 */

/** Enough for any realistic list, low enough that one request cannot wedge the DB. */
const MAX_ROWS = 5000;

/** Postgres takes a large `IN (...)`, but the URL it is encoded into does not. */
const LOOKUP_CHUNK = 200;
const INSERT_CHUNK = 500;

type Incoming = { name?: unknown; email?: unknown; industry?: unknown };

export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await request.json();
    const rows: Incoming[] = Array.isArray(body?.recipients)
      ? body.recipients
      : [];

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No recipients supplied" },
        { status: 400 }
      );
    }

    if (rows.length > MAX_ROWS) {
      return NextResponse.json(
        { error: `Too many rows — the limit is ${MAX_ROWS} per upload` },
        { status: 413 }
      );
    }

    // Re-validate and re-deduplicate server-side. The client did both, but the
    // client is not the authority on either.
    const byEmail = new Map<
      string,
      { email: string; name: string; industry: string | null }
    >();
    let invalid = 0;

    for (const row of rows) {
      const email =
        typeof row?.email === "string" ? row.email.trim().toLowerCase() : "";
      if (!isEmail(email)) {
        invalid++;
        continue;
      }
      if (byEmail.has(email)) continue;

      const name =
        typeof row?.name === "string" && row.name.trim() !== ""
          ? row.name.trim().slice(0, 200)
          : nameFromEmail(email);

      // Re-resolved rather than trusted. The browser ran the same function over
      // the same cell, but the browser is not the authority on what reaches the
      // column — and toIndustryId is idempotent, so re-running it is free.
      byEmail.set(email, { email, name, industry: toIndustryId(row?.industry) });
    }

    const candidates = [...byEmail.values()];
    if (candidates.length === 0) {
      return NextResponse.json(
        { error: "No valid email addresses found in that file" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Which of these are already on the list.
    const existing = new Set<string>();
    for (let i = 0; i < candidates.length; i += LOOKUP_CHUNK) {
      const slice = candidates.slice(i, i + LOOKUP_CHUNK).map((c) => c.email);
      const { data, error } = await supabase
        .from("email_recipients")
        .select("email")
        .in("email", slice);

      if (error) {
        console.error("Bulk import lookup error:", error);
        return NextResponse.json(
          { error: "Failed to check existing recipients" },
          { status: 500 }
        );
      }
      for (const r of data ?? []) existing.add(String(r.email).toLowerCase());
    }

    const fresh = candidates.filter((c) => !existing.has(c.email));

    let added = 0;
    for (let i = 0; i < fresh.length; i += INSERT_CHUNK) {
      const slice = fresh
        .slice(i, i + INSERT_CHUNK)
        .map((c) => ({ ...c, active: true }));

      const { data, error } = await supabase
        .from("email_recipients")
        .insert(slice)
        .select("id");

      if (error) {
        console.error("Bulk import insert error:", error);
        // Partial success is reported rather than swallowed: some rows are
        // already committed and the caller needs to know before retrying.
        return NextResponse.json(
          {
            error: `Imported ${added} before failing. ${error.message}`,
            added,
          },
          { status: 500 }
        );
      }
      added += data?.length ?? 0;
    }

    return NextResponse.json({
      added,
      skippedExisting: candidates.length - fresh.length,
      invalid,
      message: `${added} added${
        candidates.length - fresh.length > 0
          ? `, ${candidates.length - fresh.length} already on the list`
          : ""
      }${invalid > 0 ? `, ${invalid} invalid` : ""}`,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
