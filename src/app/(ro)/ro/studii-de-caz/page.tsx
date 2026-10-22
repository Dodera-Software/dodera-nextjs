import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { CaseStudiesHub } from "@/components/CaseStudyPage";
import { SITE } from "@/config/seo";
import { getDictionary } from "@/i18n/dictionaries";
import { STATIC_PATHS } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/structured-data";

const TITLE = "Studii de caz: automatizări, aplicații web";
const DESCRIPTION =
    "Cum am redus cu 94% procesarea manuală a comenzilor, cu 97% timpul de raportare și am înlocuit un sistem de programări care cădea des.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: alternatesFor("caseStudies", "ro"),
    openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(STATIC_PATHS.caseStudies.ro), type: "website", siteName: SITE.name },
};

export default function CaseStudiesHubRo() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Acasă", url: absoluteUrl("/ro") },
                        { name: "Studii de caz", url: absoluteUrl(STATIC_PATHS.caseStudies.ro) },
                    ]),
                    collectionPageSchema({ name: TITLE, description: DESCRIPTION, url: absoluteUrl(STATIC_PATHS.caseStudies.ro), locale: "ro" }),
                ]}
            />
            <Navbar />
            <main>
                <CaseStudiesHub locale="ro" items={getDictionary("ro").caseStudies.items} />
            </main>
            <Footer />
        </div>
    );
}
