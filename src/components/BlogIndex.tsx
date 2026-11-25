"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { DeckPage } from "@/components/slides/DeckPage";
import { PageHeroSlide } from "@/components/slides/PageHeroSlide";
import { CtaSlide } from "@/components/slides/CtaSlide";
import { blogPostPath } from "@/config/blog-seo";
import { cn } from "@/lib/utils";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import type { BlogPost } from "@/types";

enum BlogSlide {
    Intro = "intro",
    Posts = "posts",
    Start = "start",
}

const VISIBLE_TAGS = 6;
const DATE_FORMAT: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
const sameTag = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

function orderedTags(posts: BlogPost[], pinned: string[]): string[] {
    const counts = new Map<string, { label: string; count: number }>();
    for (const tag of posts.flatMap((p) => p.tags)) {
        const key = tag.toLowerCase();
        const entry = counts.get(key);
        counts.set(key, { label: entry?.label ?? tag, count: (entry?.count ?? 0) + 1 });
    }
    const all = [...counts.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)).map((e) => e.label);
    const first = pinned.filter((p) => all.some((t) => sameTag(t, p)));
    return [...first, ...all.filter((t) => !first.some((p) => sameTag(p, t)))];
}

function TagChip({ label, href, active }: { label: string; href: string; active: boolean }) {
    return (
        <Link
            href={href}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={cn("rounded-full border px-4 py-1.5 text-sm transition-colors", active ? "border-brand bg-brand text-white" : "border-foreground/12 text-muted-foreground hover:border-foreground/30 hover:text-foreground")}
        >
            {label}
        </Link>
    );
}

export function BlogIndex({ posts, activeTag }: { posts: BlogPost[]; activeTag: string }) {
    const { blogIndex: t, blogPost, breadcrumb, links } = useDict();
    const locale = useLocale();
    const tags = orderedTags(posts, t.pinnedTags);
    const shownTags = tags.slice(0, VISIBLE_TAGS);
    const moreTags = tags.slice(VISIBLE_TAGS);
    const filtered = activeTag ? posts.filter((p) => p.tags.some((tag) => sameTag(tag, activeTag))) : posts;
    const tagHref = (tag: string) => `${links.blog}?tag=${encodeURIComponent(tag)}`;

    return (
        <DeckPage>
            <PageHeroSlide
                id={BlogSlide.Intro}
                label={t.eyebrow}
                title={t.title}
                highlight={t.highlight}
                description={t.lead}
                breadcrumb={[{ label: breadcrumb.home, href: links.home }, { label: t.eyebrow }]}
            />
            <Slide id={BlogSlide.Posts} label={t.latest} labelledBy="posts-heading" fit>
                <div className="wrap py-24 lg:py-32">
                    <div className="flex flex-wrap items-end justify-between gap-8">
                        <h2 id="posts-heading" className="display-md">
                            {activeTag ? t.tagged(activeTag) : t.latest}
                        </h2>
                        {tags.length > 0 && (
                            <nav aria-label={t.filterAria} className="flex flex-wrap items-center gap-2">
                                <TagChip label={t.all} href={links.blog} active={!activeTag} />
                                {shownTags.map((tag) => (
                                    <TagChip key={tag} label={tag} href={tagHref(tag)} active={sameTag(tag, activeTag)} />
                                ))}
                                {moreTags.length > 0 && (
                                    <details className="group relative">
                                        <summary className="flex cursor-pointer list-none items-center gap-1 rounded-full border border-foreground/12 px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
                                            {t.more}
                                            <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" aria-hidden="true" />
                                        </summary>
                                        <div className="glass absolute right-0 z-20 mt-2 flex max-h-72 w-64 flex-col gap-1 overflow-auto rounded-2xl p-2">
                                            {moreTags.map((tag) => (
                                                <Link key={tag} href={tagHref(tag)} scroll={false} className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-foreground/5 hover:text-foreground">
                                                    {tag}
                                                </Link>
                                            ))}
                                        </div>
                                    </details>
                                )}
                            </nav>
                        )}
                    </div>

                    {posts.length === 0 ? (
                        <div className="glass mt-14 rounded-3xl p-10">
                            <p className="display text-2xl">{t.emptyTitle}</p>
                            <p className="mt-3 text-muted-foreground">{t.emptyText}</p>
                            {t.emptyLink && (
                                <Link href={t.emptyLink.href} hrefLang="en" className="mt-6 inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-semibold hover:border-foreground">
                                    {t.emptyLink.label}
                                    <ArrowRight className="size-4" aria-hidden="true" />
                                </Link>
                            )}
                        </div>
                    ) : filtered.length === 0 ? (
                        <p className="mt-14 text-muted-foreground">{t.noneForTag}</p>
                    ) : (
                        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/10 md:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((post) => (
                                <li key={post.slug} className="bg-background">
                                    <Link href={blogPostPath(post.slug, locale)} className="group flex h-full flex-col transition-colors duration-500 hover:bg-card">
                                        {post.image && (
                                            <span className="relative block aspect-[16/9] overflow-hidden">
                                                <Image src={post.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                                            </span>
                                        )}
                                        <span className="flex flex-1 flex-col p-7">
                                            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                                                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString(blogPost.dateLocale, DATE_FORMAT)}</time>
                                                {post.readTime && <> · {post.readTime}</>}
                                            </span>
                                            <span className="mt-4 block text-xl font-semibold leading-snug">{post.title}</span>
                                            <span className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</span>
                                            <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-brand-bright">
                                                {t.readMore}
                                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Slide>
            <CtaSlide id={BlogSlide.Start} label={blogPost.ctaTitle} title={blogPost.ctaTitle} text={blogPost.ctaText} action={{ label: blogPost.ctaButton, href: links.contact }} />
        </DeckPage>
    );
}
