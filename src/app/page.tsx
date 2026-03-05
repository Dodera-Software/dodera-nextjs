import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrustedBy } from "@/components/TrustedBy";
import { TestimonialsSection } from "@/components/TestimonialsSection";
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
import { SITE, DEFAULT_META } from "@/config/seo";

export const metadata: Metadata = {
  title: {
    absolute: DEFAULT_META.title,
  },
  description: DEFAULT_META.description,
  keywords: [...DEFAULT_META.keywords],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: DEFAULT_META.title,
    description: DEFAULT_META.description,
    url: SITE.url,
    type: "website",
    siteName: SITE.name,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_META.title,
    description: DEFAULT_META.description,
    images: [SITE.ogImage],
  },
};

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
        <TestimonialsSection />
        <ServicesSection />
        <ProcessSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
