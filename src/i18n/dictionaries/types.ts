import type { Service, ProcessStep, NavLink, FooterLinkGroup } from "@/types";
import type { PricingTier } from "@/config/pricing";
import type { CaseStudy } from "@/config/case-studies";
import type { ProductId } from "@/config/products";
import type { HomeSlide } from "@/config/home";

export interface ProductCopy {
    kind: string;
    title: string;
    lede: string;
    points: string[];
    cta: string;
    metaTitle: string;
    metaDescription: string;
    features: { title: string; body: string }[];
    facts: { label: string; value: string }[];
}

/**
 * Shape of a locale dictionary: UI strings plus the localized copies of the
 * site data the shared components render.
 */
export interface Dictionary {
    /** Paths every component links to. */
    links: {
        home: string;
        contact: string;
        services: string;
        process: string;
        privacy: string;
        blog: string;
        about: string;
        caseStudies: string;
    };
    nav: {
        services: string;
        links: NavLink[];
        getStarted: string;
        openMenu: string;
        closeMenu: string;
        expandSub: string;
        collapseSub: string;
        mainNavigation: string;
    };
    languageSwitch: {
        /** Label of the link to the *other* language. */
        label: string;
        ariaLabel: string;
    };
    footer: {
        tagline: string;
        groups: FooterLinkGroup[];
        newsletterHeading: string;
        newsletterText: string;
        rights: string;
        foundedIn: string;
        emailAria: string;
        location: string;
        productsHeading: string;
        cta: string;
        contactButton: string;
        country: string;
        openInMaps: string;
        phoneLabel: string;
        phoneDisplay: string;
    };
    newsletter: {
        placeholder: string;
        aria: string;
        subscribe: string;
        subscribing: string;
        invalidEmail: string;
        genericError: string;
        networkError: string;
        success: string;
    };
    hero: {
        titleA: string;
        titleB: string;
        text: string;
        primaryCta: string;
        secondaryCta: string;
        ariaLabel: string;
        facts: string[];
    };
    deck: {
        next: string;
        backToTop: string;
        nextAria: (label: string, index: number, total: number) => string;
        backToTopAria: string;
        slides: Record<HomeSlide, string>;
    };
    products: {
        label: string;
        titleA: string;
        titleB: string;
        intro: string;
        railAria: string;
        items: Record<ProductId, ProductCopy>;
    };
    productPage: {
        products: string;
        featuresLabel: string;
        factsTitle: string;
        talk: string;
        learnMore: string;
        builtTitle: (name: string) => string;
        builtText: (name: string) => string;
        builtCta: string;
        moreTitle: string;
        indexTitle: string;
        indexHighlight: string;
        indexLead: string;
        indexMetaTitle: string;
        indexMetaDescription: string;
    };
    studio: {
        label: string;
        titleA: string;
        titleB: string;
        text: string;
        foundedLabel: string;
        disciplinesLabel: string;
        disciplines: string[];
        industriesLabel: string;
        industries: string[];
        stackLabel: string;
        aboutCta: string;
    };
    caseStudies: {
        label: string;
        titleA: string;
        titleB: string;
        readMore: string;
        items: CaseStudy[];
    };
    services: {
        label: string;
        titleA: string;
        titleB: string;
        intro: string;
        exploreAria: (title: string) => string;
        cta: string;
        items: Service[];
    };
    process: {
        label: string;
        titleA: string;
        titleB: string;
        steps: ProcessStep[];
    };
    pricing: {
        label: string;
        titleA: string;
        titleB: string;
        tiers: PricingTier[];
        getStarted: string;
        notSure: string;
        tellUs: string;
        suggest: string;
    };
    cta: {
        label: string;
        titleA: string;
        titleB: string;
        textBefore: string;
        free: string;
        textAfter: string;
    };
    contactForm: {
        formAria: string;
        name: string;
        namePlaceholder: string;
        email: string;
        emailPlaceholder: string;
        company: string;
        companyPlaceholder: string;
        phone: string;
        phonePlaceholder: string;
        optional: string;
        serviceType: string;
        servicePlaceholder: string;
        /** value is what the API/admin receives — keep the English values. */
        serviceOptions: { value: string; label: string }[];
        details: string;
        detailsPlaceholder: string;
        consentBefore: string;
        privacyPolicy: string;
        consentAfter: string;
        send: string;
        sending: string;
        sentTitle: string;
        sentText: string;
        errors: {
            nameRequired: string;
            minChars: (n: number) => string;
            maxChars: (n: number) => string;
            nameChars: string;
            emailRequired: string;
            emailInvalid: string;
            invalidChars: string;
            phoneInvalid: string;
            messageRequired: string;
            consent: string;
            generic: string;
            network: string;
        };
    };
    breadcrumb: {
        home: string;
        services: string;
        ariaLabel: string;
    };
    blogIndex: {
        eyebrow: string;
        title: string;
        highlight: string;
        lead: string;
        latest: string;
        tagged: (tag: string) => string;
        all: string;
        more: string;
        filterAria: string;
        noneForTag: string;
        emptyTitle: string;
        emptyText: string;
        emptyLink?: { label: string; href: string };
        readMore: string;
        pinnedTags: string[];
    };
    blogPost: {
        dateLocale: string;
        back: string;
        updated: string;
        article: string;
        comingSoon: string;
        ctaTitle: string;
        ctaText: string;
        ctaButton: string;
        moreBy: string;
    };
    careers: {
        eyebrow: string;
        title: string;
        highlight: string;
        lead: string;
        openTitle: string;
        noneTitle: string;
        noneText: string;
        contact: string;
        apply: string;
        whyLabel: string;
        whyTitle: string;
        why: { title: string; body: string }[];
    };
    about: {
        eyebrow: string;
        title: string;
        highlight: string;
        lead: string;
        stats: { value: string; label: string }[];
        founderLabel: string;
        storyLabel: string;
        storyTitle: string;
        story: string[];
        valuesLabel: string;
        valuesTitle: string;
        values: { title: string; body: string }[];
        capabilitiesLabel: string;
        capabilitiesTitle: string;
        capabilities: { title: string; description: string; tags: string[]; service?: string }[];
        faqLabel: string;
        faqTitle: string;
        faq: { question: string; answer: string }[];
    };
    caseStudyPage: {
        hub: string;
        hubTitle: string;
        hubHighlight: string;
        hubLead: string;
        readCase: string;
        client: string;
        stack: string;
        timeline: string;
        result: string;
        problem: string;
        solution: string;
        outcome: string;
        services: string;
        cta: string;
        ctaText: string;
        ctaButton: string;
        lead: (cs: CaseStudy) => string;
        description: (cs: CaseStudy) => string;
    };
    contactPage: {
        eyebrow: string;
        title: string;
        highlight: string;
        lead: string;
        detailsTitle: string;
        address: string;
        phone: string;
        email: string;
        hours: string;
        weekdays: string;
        maps: string;
        registration: string;
        taxId: string;
        country: string;
        howTitle: string;
        how: string[];
        formTitle: string;
    };
    servicesIndex: {
        eyebrow: string;
        title: string;
        highlight: string;
        intro: string;
        subServices: string;
        learnMore: string;
        ctaTitle: string;
        ctaText: string;
        ctaButton: string;
    };
    servicePage: {
        discuss: string;
        ourProcess: string;
        subServicesTitle: (label: string) => string;
        learnMore: string;
        faqLabel: string;
        faqTitle: string;
        relatedTitle: string;
        ctaTitle: string;
        ctaBefore: string;
        ctaFree: string;
        ctaAfter: string;
        startProject: string;
        pricingTitle: string;
        caseStudyTitle: string;
        caseStudyProblem: string;
        caseStudySolution: string;
        readCaseStudy: string;
    };
    notFound: {
        title: string;
        text: string;
        back: string;
    };
}
