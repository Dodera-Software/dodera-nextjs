import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Linkedin } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { DeckPage } from "@/components/slides/DeckPage";
import { PageHeroSlide } from "@/components/slides/PageHeroSlide";
import { SplitSlide } from "@/components/slides/SplitSlide";
import { AUTHORS, authorPath, getAuthorBySlug } from "@/config/authors";
import { blogPostPath } from "@/config/blog-seo";
import { SITE } from "@/config/seo";
import { getAllPosts } from "@/lib/cms";
import { formatDateShort } from "@/lib/format";
import { absoluteUrl } from "@/i18n/routes";
import { authorProfileSchema, breadcrumbSchema } from "@/lib/structured-data";

export function generateStaticParams() {
    return AUTHORS.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const author = getAuthorBySlug((await params).slug);
    if (!author) return {};
    const title = `${author.displayName} - Author`;
    const description = author.bio?.en ?? `Articles by ${author.displayName} on the ${SITE.name} blog: software development, AI and web.`;
    return {
        title,
        description,
        alternates: { canonical: absoluteUrl(authorPath(author.slug)) },
        openGraph: { title, description, url: absoluteUrl(authorPath(author.slug)), type: "profile", siteName: SITE.name },
    };
}

/**
 * Author page (Person). English and Romanian posts by the author are both
 * listed, each in its own language.
 */
export default async function AuthorPage({ params }: PageProps) {
    const author = getAuthorBySlug((await params).slug);
    if (!author) notFound();

    const [en, ro] = await Promise.all([getAllPosts("en"), getAllPosts("ro")]);
    const byAuthor = (p: { author?: { slug?: string } }) => p.author?.slug === author.slug;
    const posts = [
        ...en.filter(byAuthor).map((p) => ({ ...p, href: blogPostPath(p.slug, "en"), lang: "en" })),
        ...ro.filter(byAuthor).map((p) => ({ ...p, href: blogPostPath(p.slug, "ro"), lang: "ro" })),
    ].sort((a, b) => (b.date > a.date ? 1 : -1));

    const url = absoluteUrl(authorPath(author.slug));

    return (
        <>
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Home", url: SITE.url },
                        { name: "Blog", url: absoluteUrl("/blog") },
                        { name: author.displayName, url },
                    ]),
                    authorProfileSchema({
                        name: author.displayName,
                        url,
                        jobTitle: author.jobTitle?.en,
                        description: author.bio?.en,
                        sameAs: author.linkedin ? [author.linkedin] : undefined,
                        image: author.photo ? `${SITE.url}${author.photo}` : undefined,
                    }),
                ]}
            />
            <DeckPage>
                <PageHeroSlide
                    id="author"
                    label={author.displayName}
                    title={author.displayName}
                    description={[author.jobTitle?.en, author.bio?.en].filter(Boolean).join(". ") || undefined}
                    breadcrumb={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: author.displayName }]}
                    actions={
                        author.linkedin && (
                            <a href={author.linkedin} target="_blank" rel="noopener noreferrer me" className="inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-semibold hover:border-foreground">
                                <Linkedin className="size-4" aria-hidden="true" /> LinkedIn
                            </a>
                        )
                    }
                />
                <SplitSlide id="articles" label="Articles" eyebrow="Blog" title={`Articles (${posts.length})`}>
                    <ul className="border-t border-foreground/10">
                        {posts.map((p) => (
                            <li key={p.href} className="reveal border-b border-foreground/10">
                                <Link href={p.href} hrefLang={p.lang} className="group flex items-start justify-between gap-6 py-5">
                                    <span>
                                        <span className="block text-lg font-semibold transition-colors group-hover:text-brand-bright">{p.title}</span>
                                        <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                                            <time dateTime={p.date}>{formatDateShort(p.date)}</time> · {p.category}
                                            {p.lang === "ro" && " · Română"}
                                        </span>
                                    </span>
                                    <ArrowUpRight className="mt-1 size-5 shrink-0 text-foreground/40 transition-colors group-hover:text-brand-bright" aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </SplitSlide>
            </DeckPage>
        </>
    );
}
