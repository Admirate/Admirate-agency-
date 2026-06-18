"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Recipient = {
  id: string;
  email: string;
  name: string;
  active: boolean;
  created_at: string;
};

const RecipientsPage = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

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
