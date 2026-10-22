import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHero } from "@/components/PageHero";
import { blogPostPath } from "@/config/blog-seo";
import { SITE } from "@/config/seo";
import { getAllPosts } from "@/lib/cms";
import { absoluteUrl, hreflangFor } from "@/i18n/routes";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/structured-data";

const TITLE = "Blog: software, AI și site-uri";
const DESCRIPTION =
    "Articole în română despre dezvoltare software, agenți AI, automatizări n8n și site-uri de prezentare, cu prețuri reale și exemple din proiectele noastre.";

/*
 * Romanian blog listing. Posts come from Prismic's "ro-ro" locale.
 * While there are none, the page says so, links to the English blog and is
 * noindex (an empty listing shouldn't be in Google), and it stays out of the
 * sitemap and hreflang.
 */
export async function generateMetadata(): Promise<Metadata> {
    const posts = await getAllPosts("ro");
    const languages = posts.length > 0 ? hreflangFor({ en: "/blog", ro: "/ro/blog" }) : undefined;
    return {
        title: TITLE,
        description: DESCRIPTION,
        alternates: { canonical: absoluteUrl("/ro/blog"), ...(languages && { languages }) },
        ...(posts.length === 0 && { robots: { index: false, follow: true } }),
        openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl("/ro/blog"), type: "website", siteName: SITE.name },
    };
}

export default async function BlogPageRo() {
    const posts = await getAllPosts("ro");

    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Acasă", url: absoluteUrl("/ro") },
                        { name: "Blog", url: absoluteUrl("/ro/blog") },
                    ]),
                    collectionPageSchema({ name: TITLE, description: DESCRIPTION, url: absoluteUrl("/ro/blog"), locale: "ro" }),
                ]}
            />
            <Navbar />
            <main>
                <Breadcrumb items={[{ label: "Acasă", href: "/ro" }, { label: "Blog" }]} />
                <PageHero
                    eyebrow="Blog"
                    id="blog-ro-heading"
                    title="Blog despre software, AI și site-uri"
                    lead="Articole în română despre dezvoltare software, agenți AI, automatizări și site-uri de prezentare, scrise de echipa Dodera Software din Satu Mare, cu prețuri reale și exemple din proiectele noastre."
                />
                <section className="pb-24">
                    <div className="mx-auto max-w-3xl px-6">
                        {posts.length > 0 ? (
                            <ul className="divide-y divide-border rounded-xl border border-border bg-card">
                                {posts.map((p) => (
                                    <li key={p.slug} className="p-6">
                                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{p.category}</p>
                                        <h2 className="mb-2 text-lg font-bold">
                                            <Link href={blogPostPath(p.slug, "ro")} className="hover:text-primary">{p.title}</Link>
                                        </h2>
                                        <p className="mb-2 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
                                        <p className="text-xs text-muted-foreground">
                                            <time dateTime={p.date}>
                                                {new Date(p.date).toLocaleDateString("ro-RO", { year: "numeric", month: "long", day: "numeric" })}
                                            </time>
                                            {p.author && <> · {p.author.name}</>}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="rounded-xl border border-border bg-card p-10 text-center">
                                <p className="mb-2 text-lg font-semibold">Primele articole în română apar în curând.</p>
                                <p className="mb-6 text-sm text-muted-foreground">
                                    Până atunci, puteți citi articolele noastre în engleză.
                                </p>
                                <Link href="/blog" hrefLang="en" className="font-medium text-primary hover:underline">
                                    Blogul în engleză
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
