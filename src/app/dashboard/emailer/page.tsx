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
  sent_at: string | null;
  created_at: string;
};

const EmailerPage = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDrafts();
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
          body: JSON.stringify({ id: editingId, subject, body }),
        });
        if (res.ok) {
          toast.success("Draft updated");
          setEditingId(null);
        }
      } else {
        const res = await fetch("/api/email/drafts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, body, status: "draft" }),
        });
        if (res.ok) toast.success("Draft saved");
      }

      setSubject("");
      setBody("");
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
        body: JSON.stringify({ subject, body, status: "scheduled" }),
      });

      if (res.ok) {
        toast.success("Email scheduled for 10 AM IST");
        setSubject("");
        setBody("");
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
        body: JSON.stringify({ subject, body, draftId: editingId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setSubject("");
        setBody("");
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

  return (
    <div>
      <PageHeader
        title="Email Composer"
        description="Compose, save and send the campaign."
      />

      <Card className="p-6 mb-8">
        <div className="space-y-4">
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

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSendNow} loading={sending}>
              {sending ? "Sending…" : "Send Now"}
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
