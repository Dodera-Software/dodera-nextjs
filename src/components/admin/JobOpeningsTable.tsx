import { Loader2, Briefcase, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JobOpening } from "@/types/admin";
import { formatDateShort } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
    open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    closed: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

interface JobOpeningsTableProps {
    loading: boolean;
    openings: JobOpening[];
    editingId: number | "new" | null;
    deleting: number | null;
    onStatusToggle: (job: JobOpening) => void;
    onEdit: (job: JobOpening) => void;
    onDelete: (job: JobOpening) => void;
}

export function JobOpeningsTable({
    loading,
    openings,
    editingId,
    deleting,
    onStatusToggle,
    onEdit,
    onDelete,
}: JobOpeningsTableProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (openings.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
                <Briefcase className="w-8 h-8" />
                <p className="text-sm">No job openings yet. Click "Add Position" to create one.</p>
            </div>
        );
    }

    return (
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
                                    onClick={() => onStatusToggle(job)}
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
                                        onClick={() => onEdit(job)}
                                        disabled={editingId !== null}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(job)}
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
    );
}
