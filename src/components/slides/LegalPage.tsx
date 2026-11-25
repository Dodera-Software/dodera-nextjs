import { Slide } from "@/components/deck/Slide";
import type { BreadcrumbItem } from "@/components/Breadcrumb";
import { DeckPage } from "./DeckPage";
import { PageHeroSlide } from "./PageHeroSlide";

enum LegalSlide {
    Intro = "intro",
    Text = "text",
}

export const PROSE_CLASS =
    "prose prose-lg prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-headings:text-foreground prose-p:leading-relaxed prose-p:text-foreground/80 prose-a:text-brand-bright prose-a:no-underline hover:prose-a:underline prose-li:text-foreground/80 prose-strong:text-foreground prose-hr:border-border";

export function LegalPage({ home, title, updated, children }: { home: BreadcrumbItem; title: string; updated: React.ReactNode; children: React.ReactNode }) {
    return (
        <DeckPage>
            <PageHeroSlide id={LegalSlide.Intro} label={title} title={title} description={updated} breadcrumb={[home, { label: title }]} />
            <Slide id={LegalSlide.Text} label={title} ariaLabel={title} fit>
                <div className="wrap max-w-3xl py-24 lg:py-32">
                    <div className={PROSE_CLASS}>{children}</div>
                </div>
            </Slide>
        </DeckPage>
    );
}
