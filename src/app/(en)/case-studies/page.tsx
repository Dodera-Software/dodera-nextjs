import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { CaseStudiesHub } from "@/components/CaseStudyPage";
import { SITE } from "@/config/seo";
import { STATIC_PATHS } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/structured-data";

const TITLE = "Case Studies - Automation & Web Apps";
const DESCRIPTION =
    "How we cut manual order processing by 94%, weekly reporting time by 97% and replaced a crashing booking system: problem, stack, timeline and result.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: alternatesFor("caseStudies", "en"),
    openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(STATIC_PATHS.caseStudies.en), type: "website", siteName: SITE.name, images: [{ url: "/og-images/og-case-studies.png", width: 1200, height: 630, alt: SITE.name }] },
};

export default function CaseStudiesHubEn() {
    return (
        <>
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Home", url: SITE.url },
                        { name: "Case Studies", url: absoluteUrl(STATIC_PATHS.caseStudies.en) },
                    ]),
                    collectionPageSchema({ name: TITLE, description: DESCRIPTION, url: absoluteUrl(STATIC_PATHS.caseStudies.en), locale: "en" }),
                ]}
            />
            <CaseStudiesHub locale="en" />
        </>
    );
}
