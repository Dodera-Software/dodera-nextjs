"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/types";
import { fadeInUp, fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";
import { formatDateShort } from "@/lib/format";

export interface BlogPageContentProps {
    posts: BlogPost[];
}

export function BlogPageContent({ posts }: BlogPageContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTag = searchParams.get("tag") ?? "";
    const [moreOpen, setMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);

    // Pinned tags always shown first (in this order)
    const PINNED_TAGS = ["Software Development", "Automation", "MVP Development", "User Experience"];

    // Deduplicate case-insensitively, keeping the first-seen capitalisation
    const allTags = Array.from(
        new Map(
            posts.flatMap((p) => p.tags).map((t) => [t.toLowerCase(), t])
        ).values()
    ).sort((a, b) => a.localeCompare(b));

    // Tags actually present in posts
    const presentPinned = PINNED_TAGS.filter((pt) =>
        allTags.some((t) => t.toLowerCase() === pt.toLowerCase())
    );
    const overflowTags = allTags.filter(
        (t) => !PINNED_TAGS.some((pt) => pt.toLowerCase() === t.toLowerCase())
    );

    const filtered = activeTag
        ? posts.filter((p) =>
            p.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())
        )
        : posts;

    function selectTag(tag: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (tag) {
            params.set("tag", tag);
        } else {
            params.delete("tag");
        }
        setMoreOpen(false);
        router.push(`/blog?${params.toString()}`, { scroll: false });
    }

    // Close dropdown on outside click
    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
                setMoreOpen(false);
            }
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    return (
        <>
            {/* ── Hero ────────────────────────────────────── */}
            <section aria-label="Blog" className="relative pb-16 pt-32">
                <div className="absolute inset-0 grid-bg" />

                <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4 }}
                        className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                        Blog
                    </motion.p>
                    <motion.h1
                        variants={fadeInUpLg}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.06 }}
                        className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                    >
                        Engineering{" "}
                        <span className="text-primary">Insights</span>{" "}
                        & AI Development
                    </motion.h1>
                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.12 }}
                        className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
                    >
                        Deep dives into AI development, software architecture, SaaS best practices, and technical documentation &ndash; from the team that builds production systems every day.
                    </motion.p>
                </div>
            </section>

            {/* ── Tag Filter Bar ───────────────────────────── */}
            {allTags.length > 0 && (
                <section aria-label="Filter by tag" className="py-8">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {/* All */}
                            <button
                                onClick={() => selectTag("")}
                                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${!activeTag
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-input bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                    }`}
                            >
                                All
                            </button>

                            {/* Pinned tags */}
                            {presentPinned.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => selectTag(tag)}
                                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${activeTag.toLowerCase() === tag.toLowerCase()
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-input bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}

                            {/* More dropdown */}
                            {overflowTags.length > 0 && (
                                <div ref={moreRef} className="relative">
                                    <button
                                        onClick={() => setMoreOpen((v) => !v)}
                                        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${overflowTags.some((t) => t.toLowerCase() === activeTag.toLowerCase())
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-input bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                            }`}
                                    >
                                        More
                                        <ChevronDown className={`size-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {moreOpen && (
                                        <div className="absolute left-1/2 top-full z-50 mt-2 w-52 -translate-x-1/2 rounded-xl border border-border bg-card p-2 shadow-lg">
                                            {overflowTags.map((tag) => (
                                                <button
                                                    key={tag}
                                                    onClick={() => selectTag(tag)}
                                                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${activeTag.toLowerCase() === tag.toLowerCase()
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        }`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Posts Grid ───────────────────────────────── */}
            <section aria-labelledby="posts-heading" className="relative py-16">
                <div className="mx-auto max-w-6xl px-6">
                    <h2
                        id="posts-heading"
                        className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                        {activeTag ? `Articles tagged "${activeTag}"` : "Latest Articles"}
                    </h2>
                    {filtered.length === 0 && (
                        <p className="text-center text-muted-foreground">
                            No articles found for this tag.
                        </p>
                    )}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((post, i) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="block"
                            >
                                <motion.article
                                    variants={fadeInUpLg}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={viewportOnce}
                                    transition={stagger(i % 3)}
                                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/20 hover:bg-accent/30"
                                >
                                    {post.image && (
                                        <div className="relative aspect-[16/9] w-full overflow-hidden">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    )}

                                    <div className="flex flex-1 flex-col p-6">

                                        <h3 className="mb-3 text-lg font-bold leading-tight transition-colors group-hover:text-primary">
                                            {post.title}
                                        </h3>

                                        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                                            {post.excerpt}
                                        </p>

                                        <div className="mb-4 flex flex-wrap gap-1.5">
                                            {post.tags.slice(0, 3).map((tag) => (
                                                <button
                                                    key={tag}
                                                    onClick={(e) => { e.preventDefault(); selectTag(tag); }}
                                                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors ${activeTag.toLowerCase() === tag.toLowerCase()
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-input text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                                        }`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between border-t border-border pt-4">
                                            <div className="flex items-center gap-2">
                                                {post.author?.avatar ? (
                                                    <Image
                                                        src={post.author.avatar}
                                                        alt={post.author.name}
                                                        width={28}
                                                        height={28}
                                                        className="size-7 rounded-full object-cover ring-1 ring-border"
                                                    />
                                                ) : (
                                                    <span className="flex size-7 items-center justify-center rounded-full bg-muted ring-1 ring-border">
                                                        <User className="size-3.5 text-muted-foreground" />
                                                    </span>
                                                )}
                                                <div className="flex flex-col">
                                                    {post.author?.name && (
                                                        <span className="text-[11px] font-semibold leading-tight text-foreground">
                                                            {post.author.name}
                                                        </span>
                                                    )}
                                                    <time
                                                        dateTime={post.date}
                                                        className="text-[10px] leading-tight text-muted-foreground"
                                                    >
                                                        {formatDateShort(post.date)}
                                                    </time>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors">
                                                Read More
                                                <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </div>
                                </motion.article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────── */}
            <section aria-labelledby="blog-cta" className="relative py-24">
                <div className="absolute inset-0 grid-bg-sm" />
                <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
                    <motion.div
                        variants={fadeInUpLg}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                    >
                        <h2
                            id="blog-cta"
                            className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            Want us to build{" "}
                            <span className="text-primary">your next project?</span>
                        </h2>
                        <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                            We write about engineering because we live it every day. If you
                            like how we think, you&apos;ll love how we build.
                        </p>
                        <Button size="lg" asChild>
                            <Link href="/#contact">
                                Start a Project
                                <ArrowRight className="ml-1 size-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
