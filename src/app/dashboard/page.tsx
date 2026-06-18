"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
        <span className="text-sm text-gray-500">
          {submissions.length} total
        </span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or message..."
          className="w-full max-w-md px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0D0D]/30 focus:border-[#FF0D0D]/50"
          aria-label="Search submissions"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {search ? "No matching submissions found" : "No submissions yet"}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((submission) => (
            <div
              key={submission.id}
              className={`bg-white border rounded-xl p-5 transition-colors shadow-sm ${
                submission.status === "unread"
                  ? "border-[#FF0D0D]/30 bg-[#FF0D0D]/[0.02]"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-gray-900 font-medium truncate">
                      {submission.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        submission.status === "unread"
                          ? "bg-[#FF0D0D]/10 text-[#FF0D0D]"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {submission.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {submission.email}
                    {submission.phone && ` • ${submission.phone}`}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {submission.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
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
                    <button
                      onClick={() => handleMarkStatus(submission.id, "read")}
                      className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                      aria-label={`Mark ${submission.name}'s submission as read`}
                    >
                      Mark Read
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkStatus(submission.id, "unread")}
                      className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                      aria-label={`Mark ${submission.name}'s submission as unread`}
                    >
                      Mark Unread
                    </button>
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
