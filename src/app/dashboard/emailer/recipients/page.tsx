"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  parseDelimited,
  parseRecipientRows,
  type SheetParseResult,
} from "@/lib/recipient-sheet";

type Recipient = {
  id: string;
  email: string;
  name: string;
  active: boolean;
  created_at: string;
};

type Preview = SheetParseResult & { fileName: string };

const SHEET_EXT = /\.(xlsx|xlsm|xltx|csv|txt|tsv)$/i;

const RecipientsPage = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  const [preview, setPreview] = useState<Preview | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

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
        body: JSON.stringify({ email: newEmail, name: newName }),
      });

      if (res.ok) {
        toast.success("Recipient added");
        setNewEmail("");
        setNewName("");
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
          prev.map((r) =>
            r.id === id ? { ...r, active: !currentActive } : r
          )
        );
        toast.success(`Recipient ${!currentActive ? "activated" : "deactivated"}`);
      }
    } catch {
      toast.error("Failed to update");
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

  const activeCount = recipients.filter((r) => r.active).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Email Recipients</h1>
        <span className="text-sm text-neutral-400">
          {activeCount} active / {recipients.length} total
        </span>
      </div>

      <form
        onSubmit={handleAdd}
        className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mb-6"
      >
        <h2 className="text-sm font-medium text-neutral-300 mb-3">
          Add Recipient
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
            className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            aria-label="Recipient name"
          />
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="email@example.com"
            className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            aria-label="Recipient email"
          />
          <button
            type="submit"
            disabled={adding}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </form>

      {/* Spreadsheet import. The dropzone is a <label> wrapping a hidden file
          input, so the keyboard reaches it and the click target is the whole
          panel rather than a small button. */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-medium text-neutral-300 mb-1">
          Import from a spreadsheet
        </h2>
        <p className="text-xs text-neutral-500 mb-3">
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
                ? "border-red-500 bg-red-500/5"
                : "border-neutral-700 hover:border-neutral-600 bg-neutral-800/40"
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
            <span className="text-sm text-neutral-300">
              {parsing ? "Reading file..." : "Drop a file here, or click to choose"}
            </span>
            <span className="text-xs text-neutral-500">
              .xlsx or .csv — up to 5,000 rows
            </span>
          </label>
        ) : (
          <div className="rounded-lg border border-neutral-700 bg-neutral-800/40 p-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
              <span className="text-sm text-white font-medium truncate">
                {preview.fileName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                {preview.recipients.length} ready
              </span>
              {preview.duplicatesInFile > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-700 text-neutral-300">
                  {preview.duplicatesInFile} repeated in file
                </span>
              )}
              {preview.skipped.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400">
                  {preview.skipped.length} unusable
                </span>
              )}
            </div>

            {/* A sample, so a mis-detected column is obvious before anything is
                written to the list. */}
            <ul className="text-xs text-neutral-400 space-y-1 mb-3">
              {preview.recipients.slice(0, 4).map((r) => (
                <li key={r.email} className="truncate">
                  <span className="text-neutral-200">{r.name}</span>
                  <span className="text-neutral-600"> — </span>
                  {r.email}
                </li>
              ))}
              {preview.recipients.length > 4 && (
                <li className="text-neutral-600">
                  and {preview.recipients.length - 4} more
                </li>
              )}
            </ul>

            {preview.skipped.length > 0 && (
              <p className="text-xs text-yellow-500/80 mb-3">
                Skipping row{preview.skipped.length > 1 ? "s" : ""}{" "}
                {preview.skipped
                  .slice(0, 5)
                  .map((s) => s.row)
                  .join(", ")}
                {preview.skipped.length > 5 && "…"} — not valid email addresses.
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleImport}
                disabled={importing}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {importing
                  ? "Importing..."
                  : `Import ${preview.recipients.length}`}
              </button>
              <button
                onClick={() => setPreview(null)}
                disabled={importing}
                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-neutral-300 text-sm font-medium rounded-lg transition-colors border border-neutral-700"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-neutral-600 mt-3">
              Addresses already on the list are skipped, and anyone deactivated
              stays deactivated.
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-neutral-400">Loading...</div>
      ) : recipients.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          No recipients yet. Add your first recipient above.
        </div>
      ) : (
        <div className="space-y-2">
          {recipients.map((recipient) => (
            <div
              key={recipient.id}
              className={`flex items-center justify-between gap-4 bg-neutral-900 border rounded-xl px-5 py-3 ${
                recipient.active ? "border-neutral-800" : "border-neutral-800/50 opacity-60"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">
                    {recipient.name}
                  </span>
                  {!recipient.active && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-700 text-neutral-400">
                      inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-400 truncate">
                  {recipient.email}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleToggle(recipient.id, recipient.active)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    recipient.active
                      ? "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400"
                      : "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                  }`}
                  aria-label={`${recipient.active ? "Deactivate" : "Activate"} ${recipient.name}`}
                >
                  {recipient.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(recipient.id)}
                  className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  aria-label={`Remove ${recipient.name}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipientsPage;
