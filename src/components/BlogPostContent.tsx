"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/types";
import { fadeInUp, fadeInUpLg } from "@/lib/animations";
import { TableOfContents, extractHeadings, injectHeadingIds } from "@/components/TableOfContents";
import { useLocale } from "@/i18n/LocaleProvider";
import { authorPath } from "@/config/authors";

const COPY = {
    en: {
        dateLocale: "en-US",
        back: "Back to Blog",
        backHref: "/blog",
        updated: "Updated",
        header: "Article header",
        image: "Featured image",
        body: "Article body",
        comingSoon: "Full article content coming soon.",
        comingSoonSub: "This post will be available once our CMS is connected.",
        ctaA: "Want us to build",
        ctaB: "your next project?",
        ctaText: "We write about engineering because we live it every day. If you like how we think, you'll love how we build.",
        ctaButton: "Start a Project",
        contact: "/#contact",
        moreBy: "More articles by",
    },
    ro: {
        dateLocale: "ro-RO",
        back: "Înapoi la blog",
        backHref: "/ro/blog",
        updated: "Actualizat",
        header: "Antetul articolului",
        image: "Imaginea articolului",
        body: "Conținutul articolului",
        comingSoon: "Conținutul complet al articolului apare în curând.",
        comingSoonSub: "",
        ctaA: "Vreți să construim",
        ctaB: "următorul dumneavoastră proiect?",
        ctaText: "Scriem despre dezvoltare software pentru că o facem în fiecare zi. Dacă vă place cum gândim, o să vă placă și cum construim.",
        ctaButton: "Începeți un proiect",
        contact: "/ro/contact",
        moreBy: "Mai multe articole de",
    },
} as const;

export interface BlogPostContentProps {
    post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
    const t = COPY[useLocale()];
    const processedBody = post.body ? injectHeadingIds(post.body) : undefined;
    const headings = post.body ? extractHeadings(post.body).filter((h) => h.level <= 2) : [];

    return (
        <>
            {/* ── Header ──────────────────────────────────── */}
            <section aria-label={t.header} className="relative pb-12 pt-20 md:pt-32">
                <div className="absolute inset-0 grid-bg" />

                <div className="relative z-10 mx-auto max-w-3xl px-6">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4 }}
                    >
                        <Link
                            href={t.backHref}
                            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                            {t.back}
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={fadeInUpLg}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.06 }}
                        className="mb-6 flex flex-wrap items-center gap-3"
                    >
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            {post.readTime}
                        </span>
                        <time
                            dateTime={post.date}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground"
                        >
                            <Calendar className="size-3" />
                            {new Date(post.date).toLocaleDateString(t.dateLocale, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </time>
                        {post.updatedAt && post.updatedAt !== post.date && (
                            <time
                                dateTime={post.updatedAt}
                                className="flex items-center gap-1.5 text-xs text-primary/80"
                            >
                                <Calendar className="size-3" />
                                {t.updated}{" "}
                                {new Date(post.updatedAt).toLocaleDateString(t.dateLocale, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </time>
                        )}
                    </motion.div>

                    <motion.h1
                        variants={fadeInUpLg}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
                    >
                        {post.title}
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.16 }}
                        className="text-lg leading-relaxed text-muted-foreground"
                    >
                        {post.excerpt}
                    </motion.p>

                    {post.tags.length > 0 && (
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.4, delay: 0.22 }}
                            className="mt-6 flex flex-wrap gap-3"
                        >
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-input px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                                >
                                    <Tag className="size-3" />
                                    {tag}
                                </Link>
                            ))}
                        </motion.div>
                    )}

                    {/* Author */}
                    {post.author && (
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.4, delay: 0.28 }}
                            className="mt-8 flex items-center gap-3"
                        >
                            {post.author.avatar ? (
                                <Image
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                                    <User className="size-5 text-muted-foreground" />
                                </div>
                            )}
                            <div>
                                {post.author.slug ? (
                                    <Link
                                        href={authorPath(post.author.slug)}
                                        rel="author"
                                        title={`${t.moreBy} ${post.author.name}`}
                                        className="text-sm font-medium hover:text-primary hover:underline"
                                    >
                                        {post.author.name}
                                    </Link>
                                ) : (
                                    <p className="text-sm font-medium">{post.author.name}</p>
                                )}
                                {post.author.bio && (
                                    <p className="text-xs text-muted-foreground">{post.author.bio}</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ── Featured Image ───────────────────────────── */}
            {post.image && (
                <section aria-label={t.image} className="relative">
                    <div className="mx-auto max-w-4xl px-6">
                        <motion.div
                            variants={fadeInUpLg}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="overflow-hidden rounded-xl border border-border"
                        >
                            <Image
                                src={post.image}
                                alt={post.title}
                                width={896}
                                height={504}
                                priority
                                className="h-auto w-full object-contain"
                                sizes="(max-width: 768px) 100vw, 896px"
                            />
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ── Body ────────────────────────────────────── */}
            <section aria-label={t.body} className="relative py-16">
                <div className="mx-auto max-w-3xl px-6">
                    {headings.length >= 2 && (
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.4, delay: 0.35 }}
                            className="mb-10"
                        >
                            <TableOfContents headings={headings} />
                        </motion.div>
                    )}
                    {processedBody ? (
                        <article
                            className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                prose-p:text-foreground/80 prose-p:leading-relaxed
                prose-strong:text-foreground prose-strong:font-semibold
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-li:text-foreground/80
                prose-blockquote:border-l-primary prose-blockquote:text-foreground/70
                prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-foreground prose-code:font-normal
                prose-pre:bg-muted prose-pre:border prose-pre:border-border
                prose-img:rounded-xl
                prose-hr:border-border"
                            dangerouslySetInnerHTML={{ __html: processedBody }}
                        />
                    ) : (
                        <div className="rounded-xl border border-border bg-card p-12 text-center">
                            <p className="text-lg text-muted-foreground">
                                {t.comingSoon}
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground/60">
                                {t.comingSoonSub}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────── */}
            <section aria-labelledby="post-cta" className="relative py-24">
                <div className="absolute inset-0 grid-bg" />
                <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
                    <h2
                        id="post-cta"
                        className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl"
                    >
                        {t.ctaA}{" "}
                        <span className="text-primary">{t.ctaB}</span>
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                        {t.ctaText}
                    </p>
                    <Button size="lg" asChild>
                        <Link href={t.contact}>
                            {t.ctaButton}
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
