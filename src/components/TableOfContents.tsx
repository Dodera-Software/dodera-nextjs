"use client";

import { useState } from "react";
import { List, ChevronDown } from "lucide-react";

export interface TocHeading {
    id: string;
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
}

/* ── Helpers ─────────────────────────────────────────────────── */

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

/** Parse h1–h6 elements out of an HTML string and return ordered heading list. */
export function extractHeadings(html: string): TocHeading[] {
    const headings: TocHeading[] = [];
    const re = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match: RegExpExecArray | null;
    while ((match = re.exec(html)) !== null) {
        const level = Number(match[1]) as 1 | 2 | 3 | 4 | 5 | 6;
        const text = match[2].replace(/<[^>]+>/g, "").trim();
        if (text) headings.push({ id: slugify(text), text, level });
    }
    return headings;
}

/** Add id attributes to every h1–h6 in an HTML string so anchor links work. */
export function injectHeadingIds(html: string): string {
    return html.replace(
        /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi,
        (_full, level, attrs, content) => {
            if (/\bid=/.test(attrs)) return _full; // already has id
            const text = content.replace(/<[^>]+>/g, "").trim();
            const id = slugify(text);
            return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
        },
    );
}

/* ── Component ───────────────────────────────────────────────── */

interface TableOfContentsProps {
    headings: TocHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [open, setOpen] = useState(false);

    if (headings.length < 2) return null;

    return (
        <div className="rounded-xl border border-border bg-muted/30 px-6 py-4">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center gap-2 text-left"
                aria-expanded={open}
            >
                <List className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-sm font-semibold">Contents</span>
                <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <ol className="mt-3 space-y-2 border-t border-border pt-3">
                    {headings.map((h) => (
                        <li
                            key={h.id}
                            style={{ paddingLeft: `${(h.level - 1) * 12}px` }}
                        >
                            <a
                                href={`#${h.id}`}
                                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                {h.text}
                            </a>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}
