import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { CaseStudyPage, caseStudyLead } from "@/components/CaseStudyPage";
import { CASE_STUDIES } from "@/config/case-studies";
import { SITE } from "@/config/seo";
import { CASE_STUDY_PATHS, STATIC_PATHS } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema, caseStudySchema } from "@/lib/structured-data";

const slugOf = (id: string) => CASE_STUDY_PATHS[id].en!.split("/").pop()!;
const find = (slug: string) => CASE_STUDIES.find((c) => slugOf(c.id) === slug);

export function generateStaticParams() {
    return CASE_STUDIES.map((c) => ({ slug: slugOf(c.id) }));
}

export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const cs = find((await params).slug);
    if (!cs) return {};
    const title = cs.seoTitle ?? cs.headline;
    const description = caseStudyLead("en", cs);
    return {
        title,
        description,
        alternates: alternatesFor(`case:${cs.id}`, "en"),
        openGraph: { title, description, url: absoluteUrl(CASE_STUDY_PATHS[cs.id].en!), type: "article", siteName: SITE.name },
    };
}

export default async function CaseStudyPageEn({ params }: PageProps) {
    const cs = find((await params).slug);
    if (!cs) notFound();
    const url = absoluteUrl(CASE_STUDY_PATHS[cs.id].en!);

    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Home", url: SITE.url },
                        { name: "Case Studies", url: absoluteUrl(STATIC_PATHS.caseStudies.en) },
                        { name: cs.headline, url },
                    ]),
                    caseStudySchema({ headline: cs.headline, description: caseStudyLead("en", cs), url, industry: cs.industry, locale: "en" }),
                ]}
            />
            <Navbar />
            <main>
                <CaseStudyPage locale="en" caseStudy={cs} />
            </main>
            <Footer />
        </div>
    );
}
