"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { adminCommon } from "@/i18n/admin/common";
import { cn } from "@/lib/utils";

export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
}

export function SearchInput({ value, onChange, placeholder, className }: SearchInputProps) {
    return (
        <div className={cn("relative w-full sm:max-w-xs", className)}>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="h-10 rounded-full border-foreground/10 bg-foreground/[0.03] pl-10 pr-9 [&::-webkit-search-cancel-button]:hidden"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    aria-label={adminCommon.actions.close}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
                >
                    <X className="size-3.5" />
                </button>
            )}
        </div>
    );
}

export function Toolbar({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center", className)}>{children}</div>;
}
