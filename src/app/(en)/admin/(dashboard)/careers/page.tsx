"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Plus,
    Loader2,
    RefreshCw,
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
import { JobOpeningsTable } from "@/components/admin/JobOpeningsTable";
import { formatDateShort } from "@/lib/format";

const STATUS_OPTIONS = ["open", "closed", "draft"] as const;
const TYPE_OPTIONS = ["Full-time", "Part-time", "Contract", "Internship"] as const;

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
            <JobOpeningsTable
                loading={loading}
                openings={openings}
                editingId={editingId}
                deleting={deleting}
                onStatusToggle={handleStatusToggle}
                onEdit={startEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
