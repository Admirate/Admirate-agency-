"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  PageHeader,
  SkeletonRows,
  StatTile,
} from "@/components/dashboard/ui";
import RecipientsTable, {
  type Recipient,
} from "@/components/dashboard/RecipientsTable";
import { INDUSTRIES, industryLabel } from "@/lib/industries";
import {
  allSelected,
  clearSelection,
  countByStatus,
  filterRecipients,
  selectAll,
  toggleSelection,
  INDUSTRY_ANY,
  INDUSTRY_NONE,
  type RecipientStatus,
} from "@/lib/recipient-list";
import {
  parseDelimited,
  parseRecipientRows,
  type SheetParseResult,
} from "@/lib/recipient-sheet";

type Preview = SheetParseResult & { fileName: string };

const SHEET_EXT = /\.(xlsx|xlsm|xltx|csv|txt|tsv)$/i;

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const PeopleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
  </svg>
);

const RecipientsPage = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newIndustry, setNewIndustry] = useState("");
  const [adding, setAdding] = useState(false);

  const [preview, setPreview] = useState<Preview | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<RecipientStatus>("all");
  const [industry, setIndustry] = useState<string>(INDUSTRY_ANY);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<null | "all" | "selected">(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      const res = await fetch("/api/email/recipients");
      const data = await res.json();
      if (res.ok) setRecipients(data);
    } catch {
      toast.error("Failed to load recipients");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail.trim() || !newName.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/email/recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          name: newName,
          industry: newIndustry || null,
        }),
      });

      if (res.ok) {
        toast.success("Recipient added");
        setNewEmail("");
        setNewName("");
        setNewIndustry("");
        fetchRecipients();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setAdding(false);
    }
  };

  /**
   * Reads the sheet in the browser rather than uploading it.
   *
   * The .xlsx reader is imported here, not at the top of the file, so it is
   * fetched the first time someone picks a file instead of riding in the
   * dashboard bundle for everyone who never uses the import.
   */
  const handleFile = async (file: File) => {
    if (!SHEET_EXT.test(file.name)) {
      toast.error("Upload an .xlsx or .csv file");
      return;
    }

    setParsing(true);
    setPreview(null);
    try {
      const isText = /\.(csv|txt|tsv)$/i.test(file.name);
      const parsed = isText
        ? parseRecipientRows(parseDelimited(await file.text()))
        : parseRecipientRows(
            // The subpath is required: the package publishes no root export,
            // only ./browser, ./node and ./web-worker.
            await (await import("read-excel-file/browser")).default(file)
          );

      if (parsed.recipients.length === 0) {
        toast.error(
          parsed.skipped[0]?.reason ?? "No email addresses found in that file"
        );
        return;
      }
      setPreview({ ...parsed, fileName: file.name });
    } catch (err) {
      console.error("Sheet parse error:", err);
      toast.error("Could not read that file");
    } finally {
      setParsing(false);
      // Clears the input so re-picking the same file fires onChange again.
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const handleImport = async () => {
    if (!preview) return;

    setImporting(true);
    try {
      const res = await fetch("/api/email/recipients/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients: preview.recipients }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Imported");
        setPreview(null);
        fetchRecipients();
      } else {
        toast.error(data.error || "Import failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setImporting(false);
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/email/recipients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentActive }),
      });

      if (res.ok) {
        setRecipients((prev) =>
          prev.map((r) => (r.id === id ? { ...r, active: !currentActive } : r))
        );
        toast.success(
          `Recipient ${!currentActive ? "activated" : "deactivated"}`
        );
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  /**
   * Optimistic, like handleToggle: the select has already moved under the
   * pointer, so waiting on a round trip to redraw it would read as lag. A
   * failure puts the previous value back rather than leaving the control
   * showing something the database does not hold.
   */
  const handleSetIndustry = async (id: string, next: string | null) => {
    const previous = recipients.find((r) => r.id === id)?.industry ?? null;
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, industry: next } : r))
    );

    try {
      const res = await fetch("/api/email/recipients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, industry: next }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Set to ${industryLabel(next)}`);
    } catch {
      setRecipients((prev) =>
        prev.map((r) => (r.id === id ? { ...r, industry: previous } : r))
      );
      toast.error("Failed to update industry");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/email/recipients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setRecipients((prev) => prev.filter((r) => r.id !== id));
        toast.success("Recipient removed");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleBulkActive = async (active: boolean) => {
    setBulkBusy(true);
    try {
      const res = await fetch("/api/email/recipients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selected], active }),
      });
      if (!res.ok) throw new Error();
      setRecipients((prev) =>
        prev.map((r) => (selected.has(r.id) ? { ...r, active } : r))
      );
      toast.success(`${selected.size} ${active ? "activated" : "paused"}`);
      setSelected(clearSelection());
    } catch {
      toast.error("Failed to update");
    } finally {
      setBulkBusy(false);
    }
  };

  const handleBulkDelete = async (scope: "all" | "selected") => {
    setBulkBusy(true);
    try {
      const res = await fetch("/api/email/recipients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          scope === "all" ? { all: true } : { ids: [...selected] }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setRecipients((prev) =>
        scope === "all" ? [] : prev.filter((r) => !selected.has(r.id))
      );
      setSelected(clearSelection());
      toast.success(data.message || "Deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setBulkBusy(false);
      setConfirm(null);
    }
  };

  const counts = countByStatus(recipients);
  const visible = filterRecipients(recipients, { query, status, industry });
  const visibleIds = visible.map((r) => r.id);
  const filtering =
    query.trim() !== "" || status !== "all" || industry !== INDUSTRY_ANY;

  return (
    <div>
      <PageHeader
        title="Recipients"
        description="Everyone the campaign sends to."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <StatTile label="Total" value={counts.total} />
        <StatTile label="Active" value={counts.active} />
        <StatTile label="Paused" value={counts.paused} />
      </div>

      <Card className="p-5 mb-6">
        <form onSubmit={handleAdd}>
          <h2 className="text-sm font-semibold text-ink mb-3">Add recipient</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              aria-label="Recipient name"
            />
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="email@example.com"
              aria-label="Recipient email"
            />
            <select
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              aria-label="Recipient industry"
              className="px-3 py-2.5 bg-white border border-line rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/50"
            >
              <option value="">Industry — Unassigned</option>
              {INDUSTRIES.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
            </select>
            <Button type="submit" loading={adding} className="whitespace-nowrap">
              {adding ? "Adding…" : "Add"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Spreadsheet import. The dropzone is a <label> wrapping a hidden file
          input, so the keyboard reaches it and the click target is the whole
          panel rather than a small button. */}
      <Card className="p-5 mb-6">
        <h2 className="text-sm font-semibold text-ink mb-1">
          Import from a spreadsheet
        </h2>
        <p className="text-xs text-muted mb-3">
          Excel (.xlsx) or CSV. Name and email columns are detected
          automatically — a header row helps but is not required.
        </p>

        {!preview ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-8 rounded-lg border border-dashed cursor-pointer transition-colors ${
              dragging
                ? "border-brand bg-brand/5"
                : "border-line hover:border-brand/40 bg-warm"
            }`}
          >
            <input
              ref={fileInput}
              type="file"
              accept=".xlsx,.xlsm,.xltx,.csv,.txt,.tsv"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <span className="text-sm text-ink">
              {parsing ? "Reading file…" : "Drop a file here, or click to choose"}
            </span>
            <span className="text-xs text-muted">
              .xlsx or .csv — up to 5,000 rows
            </span>
          </label>
        ) : (
          <div className="rounded-lg border border-line bg-warm p-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
              <span className="text-sm text-ink font-medium truncate">
                {preview.fileName}
              </span>
              <Badge tone="active">{preview.recipients.length} ready</Badge>
              {preview.duplicatesInFile > 0 && (
                <Badge>{preview.duplicatesInFile} repeated in file</Badge>
              )}
              {preview.skipped.length > 0 && (
                <Badge>{preview.skipped.length} unusable</Badge>
              )}
              {preview.withIndustry > 0 && (
                <Badge>
                  {preview.withIndustry} of {preview.recipients.length} with an
                  industry
                </Badge>
              )}
            </div>

            {/* A sample, so a mis-detected column is obvious before anything is
                written to the list. */}
            <ul className="text-xs text-muted space-y-1 mb-3">
              {preview.recipients.slice(0, 4).map((r) => (
                <li key={r.email} className="truncate">
                  <span className="text-ink">{r.name}</span>
                  <span> — </span>
                  {r.email}
                  {r.industry && <span> · {industryLabel(r.industry)}</span>}
                </li>
              ))}
              {preview.recipients.length > 4 && (
                <li>and {preview.recipients.length - 4} more</li>
              )}
            </ul>

            {preview.skipped.length > 0 && (
              <p className="text-xs text-muted mb-3">
                Skipping row{preview.skipped.length > 1 ? "s" : ""}{" "}
                {preview.skipped
                  .slice(0, 5)
                  .map((s) => s.row)
                  .join(", ")}
                {preview.skipped.length > 5 && "…"} — not valid email addresses.
              </p>
            )}

            <div className="flex gap-3">
              <Button onClick={handleImport} loading={importing}>
                {importing
                  ? "Importing…"
                  : `Import ${preview.recipients.length}`}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setPreview(null)}
                disabled={importing}
              >
                Cancel
              </Button>
            </div>
            <p className="text-xs text-muted mt-3">
              Addresses already on the list are skipped, and anyone deactivated
              stays deactivated.
            </p>
          </div>
        )}
      </Card>

      <Card>
        <div className="sticky top-0 z-20 flex flex-wrap items-center gap-3 px-4 py-3 bg-white border-b border-line rounded-t-xl">
          <Input
            type="search"
            icon={<SearchIcon />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email…"
            aria-label="Search recipients"
            className="max-w-xs"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as RecipientStatus)}
            aria-label="Filter by status"
            className="px-3 py-2.5 bg-white border border-line rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/50"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>

          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            aria-label="Filter by industry"
            className="px-3 py-2.5 bg-white border border-line rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/50"
          >
            <option value={INDUSTRY_ANY}>All industries</option>
            {INDUSTRIES.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
            <option value={INDUSTRY_NONE}>Unassigned</option>
          </select>

          <span className="text-xs text-muted tabular-nums">
            Showing {visible.length} of {counts.total}
          </span>

          <div className="ml-auto">
            <Button
              variant="danger"
              size="sm"
              disabled={filtering || counts.total === 0}
              title={
                filtering ? "Clear the filter to delete all" : undefined
              }
              onClick={() => setConfirm("all")}
            >
              Delete all
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden border-b border-line bg-brand/5"
            >
              <div className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="text-xs font-medium text-ink tabular-nums">
                  {selected.size} selected
                </span>
                <div className="flex gap-2 ml-auto">
                  <Button
                    size="sm"
                    variant="ghost"
                    loading={bulkBusy}
                    onClick={() => handleBulkActive(true)}
                  >
                    Activate
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    loading={bulkBusy}
                    onClick={() => handleBulkActive(false)}
                  >
                    Pause
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setConfirm("selected")}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="p-4">
            <SkeletonRows count={6} />
          </div>
        ) : counts.total === 0 ? (
          <EmptyState
            icon={<PeopleIcon />}
            title="No recipients yet"
            body="Add one above, or import a spreadsheet."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<SearchIcon />}
            title="No matches"
            body="Nothing matches that search or filter."
          />
        ) : (
          <RecipientsTable
            rows={visible}
            selected={selected}
            onToggleRow={(id) => setSelected(toggleSelection(selected, id))}
            onToggleAll={() =>
              setSelected(
                allSelected(selected, visibleIds)
                  ? clearSelection()
                  : selectAll(selected, visibleIds)
              )
            }
            allChecked={allSelected(selected, visibleIds)}
            onToggleActive={handleToggle}
            onSetIndustry={handleSetIndustry}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <ConfirmDialog
        open={confirm !== null}
        danger
        busy={bulkBusy}
        title={
          confirm === "all" ? "Delete all recipients?" : "Delete selected?"
        }
        message={
          confirm === "all"
            ? `Delete all ${counts.total} recipients? This cannot be undone.`
            : `Delete ${selected.size} recipient${
                selected.size === 1 ? "" : "s"
              }? This cannot be undone.`
        }
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() =>
          handleBulkDelete(confirm === "all" ? "all" : "selected")
        }
      />
    </div>
  );
};

export default RecipientsPage;
