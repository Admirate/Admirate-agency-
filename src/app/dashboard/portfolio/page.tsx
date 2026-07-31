"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Button,
  Card,
  EmptyState,
  PageHeader,
  SkeletonRows,
} from "@/components/dashboard/ui";

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  external_url: string;
  tags: string[];
  order: number;
  created_at: string;
};

const emptyForm = {
  title: "",
  description: "",
  image_url: "",
  external_url: "",
  tags: "",
  order: 0,
};

const PortfolioPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      if (res.ok) setProjects(data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.image_url || !form.external_url) {
      toast.error("All fields except tags are required");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        const res = await fetch("/api/portfolio", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });

        if (res.ok) {
          toast.success("Project updated");
          setEditingId(null);
        } else {
          toast.error("Failed to update");
        }
      } else {
        const res = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          toast.success("Project added");
        } else {
          toast.error("Failed to add");
        }
      }

      setForm(emptyForm);
      setShowForm(false);
      fetchProjects();
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setForm({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      external_url: project.external_url,
      tags: project.tags.join(", "),
      order: project.order,
    });
    setEditingId(project.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/portfolio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("Project deleted");
        fetchProjects();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <PageHeader
        title="Portfolio Projects"
        description="What the public work page shows."
        actions={
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Hide Form" : "+ Add Project"}
          </Button>
        }
      />

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-line rounded-xl p-6 mb-8 space-y-4"
        >
          <h2 className="text-lg font-semibold text-ink">
            {editingId ? "Edit Project" : "New Project"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-ink mb-1.5"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-warm border border-line rounded-lg text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50"
                placeholder="Project title"
              />
            </div>

            <div>
              <label
                htmlFor="external_url"
                className="block text-sm font-medium text-ink mb-1.5"
              >
                External URL
              </label>
              <input
                id="external_url"
                type="url"
                value={form.external_url}
                onChange={(e) =>
                  setForm({ ...form, external_url: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-warm border border-line rounded-lg text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label
                htmlFor="image_url"
                className="block text-sm font-medium text-ink mb-1.5"
              >
                Image URL
              </label>
              <input
                id="image_url"
                type="url"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="w-full px-4 py-2.5 bg-warm border border-line rounded-lg text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50"
                placeholder="https://supabase.co/storage/..."
              />
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-ink mb-1.5"
              >
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-4 py-2.5 bg-warm border border-line rounded-lg text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50"
                placeholder="Web Design, Branding, Social Media"
              />
            </div>

            <div>
              <label
                htmlFor="order"
                className="block text-sm font-medium text-ink mb-1.5"
              >
                Display Order
              </label>
              <input
                id="order"
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2.5 bg-warm border border-line rounded-lg text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-ink mb-1.5"
            >
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 bg-warm border border-line rounded-lg text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/50 resize-y"
              placeholder="Brief project description..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-brand hover:bg-brand/90 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Project"
                  : "Add Project"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 bg-warm hover:bg-warm text-muted text-sm font-medium rounded-lg transition-colors border border-line"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <SkeletonRows count={4} />
      ) : projects.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ImageIcon />}
            title="No portfolio items yet"
            body="Add your first project with the button above."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-line rounded-xl overflow-hidden"
            >
              {project.image_url && (
                <div className="aspect-video bg-warm overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-ink font-medium">{project.title}</h3>
                  <span className="text-xs text-muted shrink-0">
                    #{project.order}
                  </span>
                </div>
                <p className="text-sm text-muted line-clamp-2 mb-2">
                  {project.description}
                </p>
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-warm text-muted rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-xs px-3 py-1.5 bg-warm hover:bg-warm text-muted rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-xs px-3 py-1.5 bg-brand/5 hover:bg-brand/10 text-brand rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                  <a
                    href={project.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 bg-warm hover:bg-warm text-muted rounded-lg transition-colors ml-auto"
                  >
                    View ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
