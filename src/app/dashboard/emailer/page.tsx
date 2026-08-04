"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  PageHeader,
  SkeletonRows,
} from "@/components/dashboard/ui";
import { TEMPLATES, DEFAULT_TEMPLATE_ID } from "@/components/email/templates";
import { INDUSTRIES, industryLabel } from "@/lib/industries";
import { describeAudience } from "@/lib/campaign-audience";

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

type Draft = {
  id: string;
  subject: string;
  body: string;
  status: "draft" | "sent" | "scheduled";
  template_id: string | null;
  industries: string[];
  sent_at: string | null;
  created_at: string;
};

/** Only the fields the audience counter needs. */
type AudienceRow = { active: boolean; industry: string | null };

const EmailerPage = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID);
  const [audience, setAudience] = useState<string[]>([]);
  const [rows, setRows] = useState<AudienceRow[]>([]);

  useEffect(() => {
    fetchDrafts();
    fetchAudienceRows();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await fetch("/api/email/drafts");
      const data = await res.json();
      if (res.ok) setDrafts(data);
    } catch {
      toast.error("Failed to load drafts");
    } finally {
      setLoading(false);
    }
  };

  /**
   * The recipient list, for the counts on the audience chips only.
   *
   * Counted in the browser from the list the recipients page already serves,
   * rather than adding a counts endpoint: the whole list is a few KB, it is one
   * request, and the numbers cannot drift from what that page shows.
   */
  const fetchAudienceRows = async () => {
    try {
      const res = await fetch("/api/email/recipients");
      const data = await res.json();
      if (res.ok) setRows(data);
    } catch {
      // A failed count leaves the chips reading 0. It must not block composing.
    }
  };

  const handleSaveDraft = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and body are required");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch("/api/email/drafts", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            subject,
            body,
            templateId,
            industries: audience,
          }),
        });
        if (res.ok) {
          toast.success("Draft updated");
          setEditingId(null);
        }
      } else {
        const res = await fetch("/api/email/drafts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            body,
            status: "draft",
            templateId,
            industries: audience,
          }),
        });
        if (res.ok) toast.success("Draft saved");
      }

      setSubject("");
      setBody("");
      setTemplateId(DEFAULT_TEMPLATE_ID);
      setAudience([]);
      fetchDrafts();
    } catch {
      toast.error("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const handleSchedule = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and body are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/email/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body,
          status: "scheduled",
          templateId,
          industries: audience,
        }),
      });

      if (res.ok) {
        toast.success("Email scheduled for 10 AM IST");
        setSubject("");
        setBody("");
        setTemplateId(DEFAULT_TEMPLATE_ID);
        setAudience([]);
        fetchDrafts();
      }
    } catch {
      toast.error("Failed to schedule email");
    } finally {
      setSaving(false);
    }
  };

  const handleSendNow = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and body are required");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body,
          draftId: editingId,
          templateId,
          industries: audience,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setSubject("");
        setBody("");
        setTemplateId(DEFAULT_TEMPLATE_ID);
        setAudience([]);
        setEditingId(null);
        fetchDrafts();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const handleEdit = (draft: Draft) => {
    setSubject(draft.subject);
    setBody(draft.body);
    setTemplateId(draft.template_id ?? DEFAULT_TEMPLATE_ID);
    setAudience(draft.industries ?? []);
    setEditingId(draft.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/email/drafts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("Draft deleted");
        fetchDrafts();
      }
    } catch {
      toast.error("Failed to delete draft");
    }
  };

  /**
   * The palette has one accent, so the three states cannot each have their own
   * colour. Only "sent" is marked — it is the irreversible one, and the word
   * itself distinguishes draft from scheduled well enough.
   */
  const statusTone = (status: string) => (status === "sent" ? "active" : "neutral");

  const activeRows = rows.filter((r) => r.active);
  const countFor = (id: string) =>
    activeRows.filter((r) => r.industry === id).length;
  const reach =
    audience.length === 0
      ? activeRows.length
      : activeRows.filter((r) => r.industry && audience.includes(r.industry))
          .length;

  const toggleIndustry = (id: string) =>
    setAudience((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );

  return (
    <div>
      <PageHeader
        title="Email Composer"
        description="Compose, save and send the campaign."
      />

      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="block text-sm font-medium text-ink">Template</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  window.open(
                    // The body is truncated because it only ever becomes the
                    // preheader, which is cut at 140 characters anyway, and a
                    // long draft would otherwise build a URL a proxy refuses.
                    `/api/email/preview?template=${encodeURIComponent(templateId)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.slice(0, 200))}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Preview
              </Button>
            </div>

            {/* Cards rather than a select. These are flat artwork creatives —
                the names distinguish them for whoever wrote them and for nobody
                else, and picking the wrong one is a send you cannot recall. */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateId(t.id)}
                  aria-pressed={templateId === t.id}
                  className={`shrink-0 w-56 text-left rounded-lg border overflow-hidden bg-white transition-colors ${
                    templateId === t.id
                      ? "border-brand ring-2 ring-brand/25"
                      : "border-line hover:border-brand/40"
                  }`}
                >
                  {/* object-top: the slices are tall strips, and the top of the
                      creative is the part that identifies it. */}
                  <span className="block h-28 bg-warm overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.thumbnail}
                      alt=""
                      className="w-full h-28 object-cover object-top"
                    />
                  </span>
                  <span className="block px-3 py-2">
                    <span className="block text-sm font-medium text-ink truncate">
                      {t.name}
                    </span>
                    <span className="block text-xs text-muted line-clamp-2">
                      {t.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Subject
            </label>
            <Input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject line…"
            />
          </div>

          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full px-4 py-2.5 bg-white border border-line rounded-lg text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/50 resize-y transition-colors"
              placeholder="Write your email content here… (supports plain text, newlines will be preserved)"
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-ink mb-2">
              Audience
            </span>
            <div className="flex flex-wrap gap-2">
              {/* "Everyone" is not one more industry — it is the absence of a
                  filter, which is why picking it clears the rest rather than
                  joining them. */}
              <button
                type="button"
                onClick={() => setAudience([])}
                aria-pressed={audience.length === 0}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                  audience.length === 0
                    ? "bg-brand text-white border-transparent"
                    : "bg-white text-ink border-line hover:bg-warm"
                }`}
              >
                Everyone · {activeRows.length}
              </button>

              {INDUSTRIES.map((i) => {
                const on = audience.includes(i.id);
                return (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => toggleIndustry(i.id)}
                    aria-pressed={on}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                      on
                        ? "bg-brand text-white border-transparent"
                        : "bg-white text-ink border-line hover:bg-warm"
                    }`}
                  >
                    {i.label} · {countFor(i.id)}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted mt-2">
              {audience.length === 0
                ? "Sending to every active recipient."
                : `Sending to ${describeAudience(audience)}.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSendNow} loading={sending} disabled={reach === 0}>
              {sending ? "Sending…" : `Send to ${reach}`}
            </Button>
            <Button variant="ghost" onClick={handleSchedule} disabled={saving}>
              Schedule (10 AM IST)
            </Button>
            <Button variant="ghost" onClick={handleSaveDraft} loading={saving}>
              {saving ? "Saving…" : editingId ? "Update Draft" : "Save Draft"}
            </Button>
            {editingId && (
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingId(null);
                  setSubject("");
                  setBody("");
                  setTemplateId(DEFAULT_TEMPLATE_ID);
                  setAudience([]);
                }}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </div>
      </Card>

      <h2 className="text-lg font-semibold text-ink mb-4">Drafts &amp; Sent</h2>

      {loading ? (
        <SkeletonRows count={3} />
      ) : drafts.length === 0 ? (
        <Card>
          <EmptyState
            icon={<MailIcon />}
            title="No drafts yet"
            body="Compose above and save a draft to see it here."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => (
            <Card key={draft.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-ink font-medium truncate">
                      {draft.subject}
                    </h3>
                    <Badge tone={statusTone(draft.status)}>
                      {draft.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted line-clamp-2">
                    {draft.body}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {(TEMPLATES.find((t) => t.id === draft.template_id) ??
                      TEMPLATES[0]).name}
                    {" · "}
                    {draft.industries?.length
                      ? draft.industries.map(industryLabel).join(", ")
                      : "Everyone"}
                  </p>
                  <p className="text-xs text-muted mt-2">
                    {new Date(draft.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {draft.sent_at &&
                      ` • Sent ${new Date(draft.sent_at).toLocaleDateString("en-IN")}`}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  {draft.status !== "sent" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(draft)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(draft.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailerPage;
