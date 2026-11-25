"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, Clock, Tag, User } from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { DeckPage } from "@/components/slides/DeckPage";
import { CtaSlide } from "@/components/slides/CtaSlide";
import { PROSE_CLASS } from "@/components/slides/LegalPage";
import { cn } from "@/lib/utils";
import { TableOfContents, extractHeadings, injectHeadingIds } from "@/components/TableOfContents";
import { authorPath } from "@/config/authors";
import { useDict } from "@/i18n/LocaleProvider";
import type { BlogPost } from "@/types";

enum PostSlide {
    Intro = "intro",
    Article = "article",
    Start = "start",
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };

export interface BlogPostContentProps {
    post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
    const { blogPost: t, links } = useDict();
    const body = injectHeadingIds(post.body);
    const headings = extractHeadings(post.body).filter((h) => h.level <= 2);
    const formatDate = (date: string) => new Date(date).toLocaleDateString(t.dateLocale, DATE_FORMAT);

    return (
        <DeckPage>
            <Slide id={PostSlide.Intro} label={post.title} labelledBy="post-title" fit>
                {post.draft && <p className="absolute inset-x-0 top-20 z-10 bg-brand py-2 text-center font-mono text-xs uppercase tracking-[0.08em] text-white">{t.draftNotice}</p>}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_85%_20%,hsl(var(--brand)/0.18),transparent_70%)]" />
                <div className="wrap relative grid gap-12 pb-20 pt-32 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16 lg:pb-28 lg:pt-40">
                    <div>
                        <Link href={links.blog} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground">
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            {t.back}
                        </Link>
                        <p className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Clock className="size-3.5" aria-hidden="true" />
                                {t.readTime(post.readMinutes)}
                            </span>
                            <time dateTime={post.date} className="flex items-center gap-1.5">
                                <Calendar className="size-3.5" aria-hidden="true" />
                                {formatDate(post.date)}
                            </time>
                            {post.updatedAt.slice(0, 10) > post.date.slice(0, 10) && (
                                <time dateTime={post.updatedAt} className="flex items-center gap-1.5 text-brand-bright">
                                    {t.updated} {formatDate(post.updatedAt)}
                                </time>
                            )}
                        </p>
                        <h1 id="post-title" className="display-md mt-6 max-w-[22ch]">
                            {post.title}
                        </h1>
                        <p className="lede mt-6 max-w-[60ch]">{post.excerpt}</p>
                        {post.tags.length > 0 && (
                            <ul className="mt-8 flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <li key={tag}>
                                        <Link
                                            href={`${links.blog}?tag=${encodeURIComponent(tag)}`}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/12 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                                        >
                                            <Tag className="size-3" aria-hidden="true" />
                                            {tag}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-8 flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-full bg-muted">
                                <User className="size-5 text-muted-foreground" aria-hidden="true" />
                            </span>
                            {post.author.slug ? (
                                <Link href={authorPath(post.author.slug)} rel="author" title={`${t.moreBy} ${post.author.name}`} className="text-sm font-medium hover:text-brand-bright">
                                    {post.author.name}
                                </Link>
                            ) : (
                                <p className="text-sm font-medium">{post.author.name}</p>
                            )}
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-3xl border border-foreground/10 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.9)]">
                        <Image src={post.image} alt="" width={1200} height={630} priority sizes="(max-width: 1024px) 100vw, 40vw" className="h-auto w-full" />
                    </div>
                </div>
            </Slide>

            <Slide id={PostSlide.Article} label={t.article} ariaLabel={t.article} fit>
                <div className="wrap max-w-3xl py-24 lg:py-32">
                    {headings.length >= 2 && (
                        <div className="mb-12">
                            <TableOfContents headings={headings} />
                        </div>
                    )}
                    <article
                        className={cn(PROSE_CLASS, "prose-blockquote:border-l-brand-bright prose-blockquote:text-foreground/70 prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:text-foreground prose-pre:border prose-pre:border-border prose-pre:bg-muted prose-img:rounded-xl")}
                        dangerouslySetInnerHTML={{ __html: body }}
                    />
                    {post.sources.length > 0 && (
                        <aside aria-labelledby="post-sources" className="mt-16 border-t border-foreground/10 pt-10">
                            <h2 id="post-sources" className="eyebrow">
                                <span className="eyebrow-dot" aria-hidden="true" />
                                {t.sourcesTitle}
                            </h2>
                            <ol className="mt-6 space-y-3 text-sm">
                                {post.sources.map((source) => (
                                    <li key={source.url}>
                                        <a href={source.url} target="_blank" rel="noopener" className="inline-flex items-start gap-2 text-muted-foreground transition-colors hover:text-foreground">
                                            <ArrowUpRight className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                                            {source.title}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </aside>
                    )}
                </div>
            </Slide>

            <CtaSlide id={PostSlide.Start} label={t.ctaTitle} title={t.ctaTitle} text={t.ctaText} action={{ label: t.ctaButton, href: links.contact }} />
        </DeckPage>
    );
}
