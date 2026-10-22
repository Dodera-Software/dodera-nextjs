import type { Service, ProcessStep, NavLink, FooterLinkGroup } from "@/types";
import type { PricingTier } from "@/config/pricing";
import type { CaseStudy } from "@/config/case-studies";

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
        madeWith: string;
        love: string;
        by: string;
        foundedIn: string;
        emailAria: string;
        visitAria: string;
        location: string;
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
    };
    trustedBy: {
        label: string;
        findUs: string;
        ariaLabel: string;
    };
    industries: {
        label: string;
        items: { emoji: string; sector: string }[];
    };
    caseStudies: {
        label: string;
        titleA: string;
        titleB: string;
        problem: string;
        solution: string;
        readMore: string;
        items: CaseStudy[];
    };
    services: {
        label: string;
        titleA: string;
        titleB: string;
        intro: string;
        core: string;
        learnMore: string;
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
        forFree: string;
        getStarted: string;
        notSure: string;
        tellUs: string;
        suggest: string;
    };
    team: {
        label: string;
        titleA: string;
        titleB: string;
        disciplines: { emoji: string; label: string }[];
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
    servicePage: {
        overviewAria: string;
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
        caseStudyResult: string;
        readCaseStudy: string;
    };
    notFound: {
        title: string;
        text: string;
        back: string;
    };
}
