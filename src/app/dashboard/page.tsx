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
  StatTile,
} from "@/components/dashboard/ui";

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  // Only the /start-project brief sends these. Rows predating that page have
  // them null/absent, so every render below is conditional.
  company: string | null;
  services: string[] | null;
  budget: string | null;
  timeline: string | null;
  created_at: string;
};

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/submissions");
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to fetch submissions");
        return;
      }

      setSubmissions(data);
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        toast.error("Failed to update status");
        return;
      }

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Network error");
    }
  };

  const filtered = submissions.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.message.toLowerCase().includes(search.toLowerCase())
  );

  // A week, in milliseconds. Named because `7 * 24 * 60 * 60 * 1000` inline
  // reads as noise at the call site.
  const WEEK = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const stats = {
    unread: submissions.filter((s) => s.status === "unread").length,
    week: submissions.filter(
      (s) => now - new Date(s.created_at).getTime() < WEEK
    ).length,
    total: submissions.length,
  };

  return (
    <div>
      <PageHeader
        title="Contact Submissions"
        description="Enquiries from the site and the project brief."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <StatTile label="New" value={stats.unread} />
        <StatTile label="This week" value={stats.week} />
        <StatTile label="Total" value={stats.total} />
      </div>

      <div className="mb-4 max-w-md">
        <Input
          type="search"
          icon={<SearchIcon />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or message…"
          aria-label="Search submissions"
        />
      </div>

      {loading ? (
        <SkeletonRows count={5} />
      ) : submissions.length === 0 ? (
        <Card>
          <EmptyState
            icon={<InboxIcon />}
            title="No submissions yet"
            body="Enquiries from the site land here."
          />
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<SearchIcon />}
            title="No matches"
            body="Nothing matches that search."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((submission) => (
            <div
              key={submission.id}
              className={`bg-white border rounded-xl p-5 transition-colors ${
                submission.status === "unread"
                  ? "border-brand/30 bg-brand/[0.02]"
                  : "border-line"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-ink font-medium truncate">
                      {submission.name}
                    </h3>
                    <Badge
                      tone={
                        submission.status === "unread" ? "active" : "neutral"
                      }
                    >
                      {submission.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted mb-2">
                    {submission.email}
                    {submission.phone && ` • ${submission.phone}`}
                  </p>
                  <p className="text-sm text-ink line-clamp-2">
                    {submission.message}
                  </p>

                  {submission.company && (
                    <p className="text-xs text-muted mt-2">
                      {submission.company}
                    </p>
                  )}

                  {submission.services && submission.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {submission.services.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-warm border border-line text-muted"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {(submission.budget || submission.timeline) && (
                    <div className="flex gap-4 mt-2 text-xs text-muted">
                      {submission.budget && (
                        <span>
                          Budget:{" "}
                          <b className="font-medium text-ink">
                            {submission.budget}
                          </b>
                        </span>
                      )}
                      {submission.timeline && (
                        <span>
                          Timeline:{" "}
                          <b className="font-medium text-ink">
                            {submission.timeline}
                          </b>
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-muted mt-2">
                    {new Date(submission.created_at).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  {submission.status === "unread" ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMarkStatus(submission.id, "read")}
                      aria-label={`Mark ${submission.name}'s submission as read`}
                    >
                      Mark Read
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMarkStatus(submission.id, "unread")}
                      aria-label={`Mark ${submission.name}'s submission as unread`}
                    >
                      Mark Unread
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionsPage;
