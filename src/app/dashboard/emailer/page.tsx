"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: "bg-amber-100 text-amber-700",
      scheduled: "bg-blue-100 text-blue-700",
      sent: "bg-green-100 text-green-700",
    };
    return styles[status] || "bg-gray-100 text-gray-500";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Email Composer</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0D0D]/30 focus:border-[#FF0D0D]/50"
              placeholder="Email subject line..."
            />
          </div>

          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0D0D]/30 focus:border-[#FF0D0D]/50 resize-y"
              placeholder="Write your email content here... (supports plain text, newlines will be preserved)"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSendNow}
              disabled={sending}
              className="px-5 py-2.5 bg-[#FF0D0D] hover:bg-[#e00b0b] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              {sending ? "Sending..." : "Send Now"}
            </button>
            <button
              onClick={handleSchedule}
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Schedule (10 AM IST)
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-200"
            >
              {saving ? "Saving..." : editingId ? "Update Draft" : "Save Draft"}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setSubject("");
                  setBody("");
                }}
                className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 text-sm font-medium rounded-lg transition-colors border border-gray-200"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Drafts & Sent</h2>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : drafts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No emails yet. Compose your first email above.
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-gray-900 font-medium truncate">
                      {draft.subject}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(draft.status)}`}
                    >
                      {draft.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {draft.body}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
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
                    <button
                      onClick={() => handleEdit(draft)}
                      className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="text-xs px-3 py-1.5 bg-[#FF0D0D]/5 hover:bg-[#FF0D0D]/10 text-[#FF0D0D] rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailerPage;
