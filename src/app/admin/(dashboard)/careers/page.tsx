"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Plus,
    Trash2,
    Loader2,
    Briefcase,
    RefreshCw,
    Pencil,
    X,
    Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import type { JobOpening } from "@/types/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDateShort } from "@/lib/format";

const STATUS_OPTIONS = ["open", "closed", "draft"] as const;
const TYPE_OPTIONS = ["Full-time", "Part-time", "Contract", "Internship"] as const;

const STATUS_STYLES: Record<string, string> = {
    open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    closed: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

interface JobFormData {
    title: string;
    department: string;
    location: string;
    type: string;
    status: string;
    description: string;
    apply_url: string;
    sort_order: number;
}

const EMPTY_FORM: JobFormData = {
    title: "",
    department: "",
    location: "Remote",
    type: "Full-time",
    status: "open",
    description: "",
    apply_url: "",
    sort_order: 0,
};

export default function CareersAdminPage() {
    const [openings, setOpenings] = useState<JobOpening[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | "new" | null>(null);
    const [form, setForm] = useState<JobFormData>(EMPTY_FORM);
    const confirm = useConfirm();

    const fetchOpenings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/careers");
            const data = await res.json();
            if (data.status === "success") {
                setOpenings(data.data);
            }
        } catch {
            toast.error("Failed to fetch job openings");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOpenings();
    }, [fetchOpenings]);

    function startNew() {
        setForm(EMPTY_FORM);
        setEditingId("new");
    }

    function startEdit(job: JobOpening) {
        setForm({
            title: job.title,
            department: job.department ?? "",
            location: job.location,
            type: job.type,
            status: job.status,
            description: job.description ?? "",
            apply_url: job.apply_url ?? "",
            sort_order: job.sort_order,
        });
        setEditingId(job.id);
    }

    function cancelEdit() {
        setEditingId(null);
        setForm(EMPTY_FORM);
    }

    function handleFormChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: name === "sort_order" ? Number(value) : value }));
    }

    async function handleSave() {
        if (!form.title.trim()) {
            toast.error("Title is required");
            return;
        }
        setSaving(true);
        try {
            const isNew = editingId === "new";
            const res = await fetch("/api/admin/careers", {
                method: isNew ? "POST" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    isNew
                        ? form
                        : { id: editingId, ...form },
                ),
            });
            const data = await res.json();
            if (data.status === "success") {
                toast.success(isNew ? "Job opening created" : "Job opening updated");
                setEditingId(null);
                setForm(EMPTY_FORM);
                await fetchOpenings();
            } else {
                toast.error(data.message ?? "Failed to save");
            }
        } catch {
            toast.error("Failed to save job opening");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(job: JobOpening) {
        const ok = await confirm({
            title: "Delete job opening",
            description: `Delete "${job.title}"? This cannot be undone.`,
            confirmLabel: "Delete",
        });
        if (!ok) return;

        setDeleting(job.id);
        try {
            const res = await fetch("/api/admin/careers", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: job.id }),
            });
            if (res.ok) {
                setOpenings((prev) => prev.filter((j) => j.id !== job.id));
                if (editingId === job.id) cancelEdit();
                toast.success("Job opening deleted");
            } else {
                toast.error("Failed to delete job opening");
            }
        } catch {
            toast.error("Failed to delete job opening");
        } finally {
            setDeleting(null);
        }
    }

    async function handleStatusToggle(job: JobOpening) {
        const next = job.status === "open" ? "closed" : "open";
        try {
            const res = await fetch("/api/admin/careers", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: job.id, status: next }),
            });
            const data = await res.json();
            if (data.status === "success") {
                setOpenings((prev) =>
                    prev.map((j) => (j.id === job.id ? { ...j, status: next as JobOpening["status"] } : j)),
                );
                toast.success(`Marked as ${next}`);
            } else {
                toast.error("Failed to update status");
            }
        } catch {
            toast.error("Failed to update status");
        }
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Careers"
                subtitle={`${openings.filter((j) => j.status === "open").length} open position${openings.filter((j) => j.status === "open").length !== 1 ? "s" : ""}`}
                actions={
                    <>
                        <Button variant="outline" size="sm" onClick={fetchOpenings} disabled={loading}>
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                        <Button size="sm" onClick={startNew} disabled={editingId === "new"}>
                            <Plus className="w-4 h-4 mr-1" />
                            Add Position
                        </Button>
                    </>
                }
            />

            {/* ── Form (new or edit) ── */}
            {editingId !== null && (
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                    <h2 className="text-base font-semibold">
                        {editingId === "new" ? "New Position" : "Edit Position"}
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                Title *
                            </label>
                            <Input
                                name="title"
                                value={form.title}
                                onChange={handleFormChange}
                                placeholder="e.g. Senior Full-Stack Engineer"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                Department
                            </label>
                            <Input
                                name="department"
                                value={form.department}
                                onChange={handleFormChange}
                                placeholder="e.g. Engineering"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                Location
                            </label>
                            <Input
                                name="location"
                                value={form.location}
                                onChange={handleFormChange}
                                placeholder="e.g. Remote"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                Type
                            </label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleFormChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                {TYPE_OPTIONS.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                Status
                            </label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleFormChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                Apply URL
                            </label>
                            <Input
                                name="apply_url"
                                value={form.apply_url}
                                onChange={handleFormChange}
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                Sort Order
                            </label>
                            <Input
                                name="sort_order"
                                type="number"
                                value={form.sort_order}
                                onChange={handleFormChange}
                                placeholder="0"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                Description
                            </label>
                            <Textarea
                                name="description"
                                value={form.description}
                                onChange={handleFormChange}
                                placeholder="Role overview, responsibilities, requirements..."
                                rows={5}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={cancelEdit} disabled={saving}>
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={saving}>
                            {saving ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4 mr-1" />
                            )}
                            {editingId === "new" ? "Create" : "Save"}
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : openings.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
                    <Briefcase className="w-8 h-8" />
                    <p className="text-sm">No job openings yet. Click "Add Position" to create one.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/40">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                                <th className="hidden md:table-cell px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                                <th className="hidden sm:table-cell px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="hidden lg:table-cell px-4 py-3 text-left font-medium text-muted-foreground">Created</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {openings.map((job, i) => (
                                <tr
                                    key={job.id}
                                    className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                                >
                                    <td className="px-4 py-3 font-medium">
                                        <div>{job.title}</div>
                                        {job.department && (
                                            <div className="text-xs text-muted-foreground">{job.department}</div>
                                        )}
                                    </td>
                                    <td className="hidden md:table-cell px-4 py-3 text-muted-foreground">{job.type}</td>
                                    <td className="hidden sm:table-cell px-4 py-3 text-muted-foreground">{job.location}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleStatusToggle(job)}
                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 ${STATUS_STYLES[job.status] ?? ""}`}
                                        >
                                            {job.status}
                                        </button>
                                    </td>
                                    <td className="hidden lg:table-cell px-4 py-3 text-muted-foreground">
                                        {formatDateShort(job.created_at)}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => startEdit(job)}
                                                disabled={editingId !== null}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(job)}
                                                disabled={deleting === job.id}
                                            >
                                                {deleting === job.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                )}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
