/**
 * Turns an uploaded spreadsheet into recipients.
 *
 * The rows arrive as a grid of cells — from read-excel-file for .xlsx, from
 * `parseDelimited` below for .csv — and this decides which column is the name
 * and which is the email, drops what cannot be sent to, and collapses repeats.
 *
 * WHY IT SNIFFS RATHER THAN REQUIRES A FORMAT: the sheets that get uploaded are
 * exports from a CRM, a scrape, or someone's own list, and they disagree about
 * everything — header or no header, "Email"/"E-mail"/"Email Address", name in
 * the first column or the third. Demanding one shape means the first upload
 * fails and the feature is abandoned. Every rule here is a fallback, so a sheet
 * with no header at all still imports.
 *
 * Everything is pure and works on plain arrays, so it can run in the browser
 * (where the file is parsed) and be tested without a file at all.
 */

export type ParsedRecipient = { name: string; email: string };

export type SheetParseResult = {
  recipients: ParsedRecipient[];
  /** Rows that carried something but could not be used, for reporting back. */
  skipped: { row: number; value: string; reason: string }[];
  /** Repeats inside the uploaded file itself, already collapsed. */
  duplicatesInFile: number;
};

/**
 * Deliberately permissive: this decides what to *attempt*, and the mail
 * provider is the real authority on deliverability. It rejects the things that
 * are certainly not addresses — no @, whitespace inside, no dot in the domain,
 * a trailing comma from a split that went wrong.
 */
const EMAIL_RE = /^[^\s@,;<>()[\]\\]+@[^\s@,;<>()[\]\\]+\.[a-z]{2,}$/i;

export const isEmail = (value: string) => EMAIL_RE.test(value.trim());

/** Cells come back as strings, numbers, Dates or null depending on the source. */
const cell = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return v.toISOString();
  return String(v).trim();
};

/**
 * Whether a cell reads as a column label rather than prose.
 *
 * The header tests below end in a loose "contains the word email" rule, which
 * on its own is satisfied just as well by a title row ("50 Solid Dubai Real
 * Estate Business Emails") or a note ("No personal email format has been
 * guessed.") as by a real header — and a sheet that opens with either then has
 * its first column read as the addresses. A label is short, is a few words at
 * most, and does not end sentences; prose fails at least one of those.
 */
const isLabelLike = (v: string) =>
  v.length <= 40 && v.split(/\s+/).length <= 4 && !/[.!?]/.test(v);

const looksLikeEmailHeader = (v: string) =>
  isLabelLike(v) &&
  (/^(e[-\s]?mail|email[-\s]?address|mail)$/i.test(v) || /e[-\s]?mail/i.test(v));

/** Whether a column actually carries addresses from `from` downwards. */
const columnHasEmails = (rows: unknown[][], col: number, from: number) => {
  for (let r = from; r < rows.length; r++) {
    if (isEmail(cell(rows[r]?.[col]))) return true;
  }
  return false;
};

/**
 * How far down to look for the header row.
 *
 * Hand-built sheets open with a title, a line of provenance and a blank row
 * before the header; ten is well clear of that without scanning a whole file.
 * Past it the value-driven fallback still imports the sheet correctly, just
 * without reading the column names.
 */
const HEADER_SCAN_ROWS = 10;

/**
 * Ranked rather than a yes/no match, because a sheet routinely offers more than
 * one candidate. "Email, Company, Name" has two columns that look like a name
 * and taking the first found imports the company as the person. The score picks
 * the most specific claim instead of the leftmost one.
 */
const nameHeaderScore = (v: string): number => {
  if (/^(full[-\s]?name|name)$/i.test(v)) return 100;
  if (/^contact[-\s]?name$/i.test(v)) return 90;
  if (/^(first[-\s]?name|given[-\s]?name)$/i.test(v)) return 80;
  if (/^(contact|person|recipient)$/i.test(v)) return 60;
  if (/name/i.test(v)) return 50;
  if (/^(company|organisation|organization|business|firm)$/i.test(v)) return 30;
  return 0;
};

/**
 * Finds the name and email columns.
 *
 * Header first, because a header is an explicit statement of intent. When there
 * is none, the email column is found by looking for the one that actually holds
 * addresses — a column of values containing "@" is unambiguous in a way that
 * position is not — and the name is then the first other column with text in
 * it, which is where it sits in every export worth supporting.
 *
 * The header is looked for over the first several rows rather than only the
 * first. A sheet someone assembled by hand, as opposed to one a CRM exported,
 * routinely opens with a title and a line about where the addresses came from,
 * and the header sits below them. Reading only row 0 there finds no header —
 * or worse, mistakes the title for one.
 *
 * A header also has to be corroborated by the data beneath it: a column called
 * "Email Status" holding "verified" and "bounced" names the concept without
 * carrying an address, and taking it on the strength of its label alone rejects
 * every row in the file. Where the label and the values disagree the values
 * win, because they are what actually gets sent to.
 */
export function pickColumns(rows: unknown[][]): {
  nameIdx: number;
  emailIdx: number;
  headerRows: number;
} {
  const limit = Math.min(rows.length, HEADER_SCAN_ROWS);
  for (let h = 0; h < limit; h++) {
    const cells = (rows[h] ?? []).map(cell);

    const headerEmail = cells.findIndex(
      (c) => c !== "" && !isEmail(c) && looksLikeEmailHeader(c)
    );
    if (headerEmail === -1) continue;
    if (!columnHasEmails(rows, headerEmail, h + 1)) continue;

    let headerName = -1;
    let bestScore = 0;
    cells.forEach((c, i) => {
      if (i === headerEmail || c === "" || !isLabelLike(c)) return;
      const score = nameHeaderScore(c);
      if (score > bestScore) {
        bestScore = score;
        headerName = i;
      }
    });
    return { nameIdx: headerName, emailIdx: headerEmail, headerRows: h + 1 };
  }

  // No usable header. Score every column by how many of its cells are addresses
  // and take the strongest — scanning the whole sheet rather than one row, so a
  // blank or malformed first entry cannot pick the wrong column.
  const width = rows.reduce((w, r) => Math.max(w, r.length), 0);
  let emailIdx = -1;
  let best = 0;
  for (let c = 0; c < width; c++) {
    let hits = 0;
    for (const r of rows) if (isEmail(cell(r[c]))) hits++;
    if (hits > best) {
      best = hits;
      emailIdx = c;
    }
  }

  let nameIdx = -1;
  if (emailIdx !== -1) {
    for (let c = 0; c < width; c++) {
      if (c === emailIdx) continue;
      const hasText = rows.some((r) => {
        const v = cell(r[c]);
        return v !== "" && !isEmail(v);
      });
      if (hasText) {
        nameIdx = c;
        break;
      }
    }
  }

  // Anything above the first real address is a title, a note or an unrecognised
  // header. Treated as data it would be reported back as a row of broken
  // addresses, which reads as the file being wrong rather than as a preamble
  // the importer simply had no use for.
  let headerRows = 0;
  if (emailIdx !== -1) {
    while (
      headerRows < rows.length &&
      !isEmail(cell(rows[headerRows]?.[emailIdx]))
    ) {
      headerRows++;
    }
  }

  return { nameIdx, emailIdx, headerRows };
}

/**
 * A missing name is filled from the address rather than left blank: the list UI
 * and the dashboard both show the name as the primary line, and a row that
 * renders as an empty string reads as broken data. "priya.sharma@x.com" becomes
 * "Priya Sharma", which is a guess but a legible one, and it is editable later.
 */
export const nameFromEmail = (email: string) =>
  email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\d+/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || email.split("@")[0];

type SheetEnvelope = { sheet?: string; data?: unknown[][] };

/**
 * Normalises whatever the reader hands back into a plain grid.
 *
 * read-excel-file v9 returns `[{ sheet, data }]` — one entry per worksheet —
 * rather than the flat grid its older docs describe, and it does so even when a
 * single `sheet` is requested. Both shapes are accepted here so the caller
 * never has to care, and so a change in that library cannot silently break the
 * import.
 *
 * When a workbook has several sheets the one holding the most addresses wins,
 * not the first: contact exports routinely lead with a "Summary" or "Notes" tab
 * and the list sits behind it.
 */
export function toGrid(input: unknown): unknown[][] {
  if (!Array.isArray(input) || input.length === 0) return [];

  if (Array.isArray(input[0])) return input as unknown[][];

  const sheets = (input as SheetEnvelope[]).filter(
    (s) => s && typeof s === "object" && Array.isArray(s.data)
  );
  if (sheets.length === 0) return [];

  let best = sheets[0].data as unknown[][];
  let bestHits = -1;
  for (const s of sheets) {
    const grid = s.data as unknown[][];
    let hits = 0;
    for (const row of grid) {
      if (!Array.isArray(row)) continue;
      for (const c of row) if (isEmail(cell(c))) hits++;
    }
    if (hits > bestHits) {
      bestHits = hits;
      best = grid;
    }
  }
  return best;
}

export function parseRecipientRows(input: unknown): SheetParseResult {
  const skipped: SheetParseResult["skipped"] = [];
  const recipients: ParsedRecipient[] = [];
  const seen = new Set<string>();
  let duplicatesInFile = 0;

  const grid = toGrid(input).filter(
    (r) => Array.isArray(r) && r.some((c) => cell(c) !== "")
  );
  if (grid.length === 0) {
    return { recipients, skipped, duplicatesInFile };
  }

  const { nameIdx, emailIdx, headerRows } = pickColumns(grid);

  if (emailIdx === -1) {
    return {
      recipients,
      skipped: [
        { row: 0, value: "", reason: "No column of email addresses found" },
      ],
      duplicatesInFile,
    };
  }

  for (let i = headerRows; i < grid.length; i++) {
    const row = grid[i];
    // +1 so the number matches the spreadsheet's own row numbering.
    const rowNo = i + 1;
    const email = cell(row[emailIdx]).toLowerCase();

    if (email === "") continue;

    if (!isEmail(email)) {
      skipped.push({ row: rowNo, value: email, reason: "Not a valid email" });
      continue;
    }

    if (seen.has(email)) {
      duplicatesInFile++;
      continue;
    }
    seen.add(email);

    const rawName = nameIdx === -1 ? "" : cell(row[nameIdx]);
    recipients.push({ name: rawName || nameFromEmail(email), email });
  }

  return { recipients, skipped, duplicatesInFile };
}

/**
 * A CSV reader, because read-excel-file handles .xlsx only.
 *
 * It is quote-aware rather than a `split(",")`: names carry commas ("Rao, Priya"
 * from a CRM export) and a naive split shifts every column after them, which
 * silently imports the wrong address rather than failing. Doubled quotes inside
 * a quoted field are the CSV escape and collapse to one.
 *
 * The delimiter is sniffed because Excel writes semicolons in locales where the
 * comma is the decimal separator, and a tab when the data came off a clipboard.
 */
export function parseDelimited(text: string): string[][] {
  const body = text.replace(/^﻿/, "");
  const firstLine = body.slice(0, body.search(/\r?\n/) + 1 || body.length);
  const delim = [",", ";", "\t"]
    .map((d) => ({ d, n: firstLine.split(d).length }))
    .sort((a, b) => b.n - a.n)[0].d;

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < body.length; i++) {
    const ch = body[i];

    if (quoted) {
      if (ch === '"') {
        if (body[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
      continue;
    }

    if (ch === '"') quoted = true;
    else if (ch === delim) {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") field += ch;
  }

  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}
