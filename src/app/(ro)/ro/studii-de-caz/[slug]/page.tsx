import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { CaseStudyPage } from "@/components/CaseStudyPage";
import { SITE } from "@/config/seo";
import { getDictionary } from "@/i18n/dictionaries";
import { CASE_STUDY_PATHS, STATIC_PATHS } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema, caseStudySchema } from "@/lib/structured-data";

const ITEMS = getDictionary("ro").caseStudies.items;
const slugOf = (id: string) => CASE_STUDY_PATHS[id].ro!.split("/").pop()!;
const find = (slug: string) => ITEMS.find((c) => slugOf(c.id) === slug);

export function generateStaticParams() {
    return ITEMS.map((c) => ({ slug: slugOf(c.id) }));
}

export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const cs = find((await params).slug);
    if (!cs) return {};
    const title = cs.seoTitle ?? cs.headline;
    const description = getDictionary("ro").caseStudyPage.description(cs);
    return {
        title,
        description,
        alternates: alternatesFor(`case:${cs.id}`, "ro"),
        openGraph: { title, description, url: absoluteUrl(CASE_STUDY_PATHS[cs.id].ro!), type: "article", siteName: SITE.name, images: [{ url: "/og-images/og-case-studies-ro.png", width: 1200, height: 630, alt: SITE.name }] },
    };
}

export default async function CaseStudyPageRo({ params }: PageProps) {
    const cs = find((await params).slug);
    if (!cs) notFound();
    const url = absoluteUrl(CASE_STUDY_PATHS[cs.id].ro!);

    return (
        <>
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Acasă", url: absoluteUrl("/ro") },
                        { name: "Studii de caz", url: absoluteUrl(STATIC_PATHS.caseStudies.ro) },
                        { name: cs.headline, url },
                    ]),
                    caseStudySchema({ headline: cs.headline, description: getDictionary("ro").caseStudyPage.description(cs), url, industry: cs.industry, locale: "ro" }),
                ]}
            />
            <CaseStudyPage locale="ro" caseStudy={cs} />
        </>
    );
}
