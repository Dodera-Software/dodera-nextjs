import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pagination } from "@/types/admin";

export interface AdminPaginationProps {
    pagination: Pagination;
    onPageChange: (page: number) => void;
}

/**
 * Page-forward / page-back controls for admin data tables.
 * Renders nothing when the data fits on a single page.
 */
export function AdminPagination({ pagination, onPageChange }: AdminPaginationProps) {
    const { page, totalPages, total, limit } = pagination;
    if (totalPages <= 1) return null;

    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
                Showing {start}–{end} of {total}
            </span>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
