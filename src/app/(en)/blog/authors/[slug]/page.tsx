import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Linkedin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/Breadcrumb";
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
        <div className="min-h-screen bg-background">
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
            <Navbar />
            <main>
                <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: author.displayName }]} />
                <section aria-labelledby="author-heading" className="relative pb-12 pt-32">
                    <div className="absolute inset-0 grid-bg" />
                    <div className="relative z-10 mx-auto max-w-3xl px-6">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Author · {SITE.name}</p>
                        <h1 id="author-heading" className="mb-3 text-4xl font-bold tracking-tight">{author.displayName}</h1>
                        {author.jobTitle && <p className="mb-4 font-medium text-primary">{author.jobTitle.en}</p>}
                        {author.bio && <p className="mb-4 text-lg leading-relaxed text-muted-foreground">{author.bio.en}</p>}
                        {author.linkedin && (
                            <a href={author.linkedin} target="_blank" rel="noopener noreferrer me" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                                <Linkedin className="size-4" aria-hidden="true" /> LinkedIn
                            </a>
                        )}
                    </div>
                </section>

                <section aria-labelledby="author-posts" className="pb-24">
                    <div className="mx-auto max-w-3xl px-6">
                        <h2 id="author-posts" className="mb-6 text-xl font-bold tracking-tight">Articles ({posts.length})</h2>
                        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
                            {posts.map((p) => (
                                <li key={p.href} className="p-5">
                                    <Link href={p.href} hrefLang={p.lang} className="font-semibold hover:text-primary">{p.title}</Link>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        <time dateTime={p.date}>{formatDateShort(p.date)}</time> · {p.category}
                                        {p.lang === "ro" && " · Română"}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
