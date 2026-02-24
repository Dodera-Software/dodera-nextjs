import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrustedBy } from "@/components/TrustedBy";
import { ServicesSection } from "@/components/ServicesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ScrollManager } from "@/components/ScrollManager";
import {
  organizationSchema,
  webSiteSchema,
  professionalServiceSchema,
  breadcrumbSchema,
} from "@/lib/structured-data";
import { SITE } from "@/config/seo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          organizationSchema(),
          webSiteSchema(),
          professionalServiceSchema(),
          breadcrumbSchema([{ name: "Home", url: SITE.url }]),
        ]}
      />
      <ScrollManager />
      <Navbar />
      <main>
        <HeroSection />
        <TrustedBy />
        <ServicesSection />
        <ProcessSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
