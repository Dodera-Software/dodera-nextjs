import { DeckPage } from "@/components/slides/DeckPage";
import { HeroSlide } from "./HeroSlide";
import { ProductsSlide } from "./ProductsSlide";
import { ServicesSlide } from "./ServicesSlide";
import { WorkSlide } from "./WorkSlide";
import { ProcessSlide } from "./ProcessSlide";
import { PricingSlide } from "./PricingSlide";
import { StudioSlide } from "./StudioSlide";
import { ContactSlide } from "./ContactSlide";

export function HomePage() {
    return (
        <DeckPage>
            <HeroSlide />
            <ProductsSlide />
            <ServicesSlide />
            <WorkSlide />
            <ProcessSlide />
            <PricingSlide />
            <StudioSlide />
            <ContactSlide />
        </DeckPage>
    );
}
