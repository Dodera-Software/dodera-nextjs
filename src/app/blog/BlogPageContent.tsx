"use client";

import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
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

    const allTags = Array.from(
        new Set(posts.flatMap((p) => p.tags))
    ).sort();

    const filtered = activeTag
        ? posts.filter((p) => p.tags.includes(activeTag))
        : posts;

    function selectTag(tag: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (tag) {
            params.set("tag", tag);
        } else {
            params.delete("tag");
        }
        router.push(`/blog?${params.toString()}`, { scroll: false });
    }

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
                            <button
                                onClick={() => selectTag("")}
                                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${!activeTag
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-input bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                    }`}
                            >
                                All
                            </button>
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => selectTag(tag)}
                                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${activeTag === tag
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-input bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
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
                                                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors ${activeTag === tag
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
                                                        dateTime={post.updatedAt ?? post.date}
                                                        className="text-[10px] leading-tight text-muted-foreground"
                                                    >
                                                        {formatDateShort(post.updatedAt ?? post.date)}
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
