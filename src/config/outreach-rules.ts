/**
 * Cold-outreach rules for the countries we contact (Admin → Leads).
 *
 * Shown when a country is picked on a lead, so the first message follows the
 * local rules for unsolicited commercial messages (email and social-media
 * DMs). Each entry is a short summary of the official source linked with it;
 * it is guidance for the team, not legal advice. Countries without a
 * relevant rule have `rule: null` and show no warning.
 *
 * `approach` drives the mock policy:
 *   "direct"    — the mock link goes with the first message.
 *   "ask-first" — first message without the link; send it once they reply
 *                 positively.
 *
 * Researched September 2026. Re-check the sources before relying on an
 * entry for a new campaign.
 */

export type OutreachApproach = "direct" | "ask-first";

export interface OutreachSource {
    label: string;
    url: string;
}

export interface OutreachRule {
    /** ISO 3166-1 alpha-2. */
    code: string;
    name: string;
    /** Lower-case, accent-free spellings that map to this country. */
    aliases: string[];
    approach: OutreachApproach;
    /** What the law says about an unsolicited offer, in one or two sentences — null when nothing relevant applies. */
    rule: string | null;
    /** What every message should contain / how to behave, per the source. */
    include: string[];
    sources: OutreachSource[];
}

export const OUTREACH_RULES: readonly OutreachRule[] = [
    {
        code: "ES",
        name: "Spain",
        aliases: ["spain", "espana", "es"],
        approach: "ask-first",
        rule:
            "Unsolicited promotional messages by email or an equivalent electronic channel (DMs included) are banned " +
            "unless the recipient asked for or expressly authorised them — this applies to companies too (LSSI art. 21).",
        include: [
            "Make clear it's a commercial message and who it's from (LSSI art. 20)",
            "Offer an easy way to say no, and stop if they do",
        ],
        sources: [{ label: "Ley 34/2002 (LSSI), arts. 20–21 — BOE", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758" }],
    },
    {
        code: "IT",
        name: "Italy",
        aliases: ["italy", "italia", "it"],
        approach: "ask-first",
        rule:
            "Promotional messages by email, SMS or social-network messages need the recipient's prior consent, companies " +
            "included (Privacy Code art. 130). The Garante explicitly covers private messages on Facebook.",
        include: ["Say who you are", "Stop if they say no"],
        sources: [
            {
                label: "Garante Privacy — guidelines on promotional activity and spam (2013)",
                url: "https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/2542348",
            },
        ],
    },
    {
        code: "RO",
        name: "Romania",
        aliases: ["romania", "ro"],
        approach: "ask-first",
        rule:
            "Commercial communications by email or any other public electronic communication service need the " +
            "recipient's prior express consent — explicitly including companies (Law 506/2004, art. 12).",
        include: ["Say who you are", "Stop if they say no"],
        sources: [{ label: "Legea 506/2004, art. 12 — Portal Legislativ", url: "https://legislatie.just.ro/Public/DetaliiDocument/56973" }],
    },
    {
        code: "CH",
        name: "Switzerland",
        aliases: ["switzerland", "schweiz", "suisse", "svizzera", "ch"],
        approach: "direct",
        rule:
            "Prior consent is required for mass advertising only (UWG art. 3 para. 1 let. o). Individually written " +
            "messages are fine, but each one must name the real sender and offer a free, easy way to refuse more.",
        include: ["Write each message individually — no bulk sends", "Name yourself / Dodera", "Add a line on how to opt out"],
        sources: [
            { label: "BAKOM — when is mass sending allowed?", url: "https://www.bakom.admin.ch/de/wann-ist-der-massenversand-erlaubt" },
            { label: "UWG (SR 241), art. 3 — Fedlex", url: "https://www.fedlex.admin.ch/eli/cc/1988/223_223_223/de" },
        ],
    },
    {
        code: "NL",
        name: "Netherlands",
        aliases: ["netherlands", "the netherlands", "nederland", "holland", "nl"],
        approach: "ask-first",
        rule:
            "The spam ban (Telecommunicatiewet art. 11.7) has covered companies as well as people since 2009: ads by " +
            "email, WhatsApp or other electronic messages need prior consent. ACM has fined B2B email senders.",
        include: ["Use your real business name — no alias", "Offer a quick, free way to unsubscribe in every message"],
        sources: [
            { label: "ACM — preventing spam in your advertising", url: "https://www.acm.nl/nl/verkoop-aan-consumenten/reclame-en-verleiden/spam-voorkomen-uw-reclame" },
            {
                label: "ACM — fine for B2B e-mail spam (Companeo)",
                url: "https://www.acm.nl/sites/default/files/old_publication/publicaties/10416_Boetebesluit%20e-mailspam%20Companeo.pdf",
            },
        ],
    },
    {
        code: "AE",
        name: "United Arab Emirates",
        aliases: ["united arab emirates", "uae", "dubai", "ae"],
        approach: "direct",
        rule: null,
        include: [],
        sources: [],
    },
    {
        code: "US",
        name: "United States",
        aliases: ["united states", "united states of america", "usa", "us", "america"],
        approach: "direct",
        rule: null,
        include: ["If you email them (CAN-SPAM): add your postal address and an opt-out line"],
        sources: [
            { label: "FTC — CAN-SPAM compliance guide", url: "https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business" },
        ],
    },
    {
        code: "CA",
        name: "Canada",
        aliases: ["canada", "ca"],
        approach: "ask-first",
        rule:
            "CASL needs consent for every commercial electronic message (email, DM, text), and a message asking for " +
            "consent counts as one. Consent is implied if the business published this address or account publicly, " +
            "without a “no solicitation” note, and your offer relates to their business.",
        include: [
            "Check their profile / site doesn't say they don't want offers",
            "Your name, contact details and a way to unsubscribe in every message",
        ],
        sources: [
            { label: "CASL (S.C. 2010, c. 23), ss. 1(3), 6, 10(9)(b) — Justice Laws", url: "https://laws-lois.justice.gc.ca/eng/acts/E-1.6/" },
            {
                label: "ISED — getting consent to send email",
                url: "https://ised-isde.canada.ca/site/canada-anti-spam-legislation/en/getting-consent-send-email",
            },
        ],
    },
    {
        code: "GB",
        name: "United Kingdom",
        aliases: ["united kingdom", "uk", "great britain", "britain", "england", "scotland", "wales", "northern ireland", "gb"],
        approach: "direct",
        rule:
            "Limited companies and LLPs can be messaged without consent (DMs count as electronic mail). Sole traders " +
            "and most partnerships need consent first — check Companies House for Ltd / LLP.",
        include: [
            "Don't hide who you are, and give a way to opt out",
            "Tell them where you got their details (UK GDPR)",
        ],
        sources: [
            {
                label: "ICO — business-to-business marketing",
                url: "https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/",
            },
        ],
    },
    {
        code: "DE",
        name: "Germany",
        aliases: ["germany", "deutschland", "de"],
        approach: "ask-first",
        rule:
            "Advertising by email or electronic messages needs prior express consent from every recipient, businesses " +
            "included (UWG § 7(2)); the BGH counts even a business enquiry by email as advertising. A phone call to a " +
            "business is allowed where their interest can be presumed.",
        include: ["Consider calling first, then send the preview once they agree"],
        sources: [
            { label: "UWG § 7 — gesetze-im-internet.de", url: "https://www.gesetze-im-internet.de/uwg_2004/__7.html" },
            {
                label: "BGH press release 136/2008 — e-mail enquiries",
                url: "https://www.bundesgerichtshof.de/SharedDocs/Pressemitteilungen/DE/2008/2008136.html",
            },
        ],
    },
    {
        code: "AT",
        name: "Austria",
        aliases: ["austria", "osterreich", "at"],
        approach: "ask-first",
        rule:
            "Electronic mail (incl. SMS) for direct marketing needs the recipient's prior consent, whether a person or a " +
            "company (TKG 2021 § 174). Hiding your identity is never allowed.",
        include: ["Say who you are", "Give a real address where they can opt out"],
        sources: [
            {
                label: "TKG 2021 § 174 — RIS",
                url: "https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20011678&Paragraf=174",
            },
        ],
    },
];

function normalizeCountry(input: string): string {
    return input
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

/** The outreach rule for a typed country ("Dubai", "UK", "România"…), or null when it isn't one we cover. */
export function outreachRuleFor(country: string | null | undefined): OutreachRule | null {
    if (!country) return null;
    const key = normalizeCountry(country);
    return OUTREACH_RULES.find((r) => r.aliases.includes(key)) ?? null;
}

/**
 * Wording for the preview link (every country). No law requires this exact
 * text; it keeps the message honest: the preview is unlisted (not indexed —
 * mockups are served with X-Robots-Tag: noindex) but anyone with the link can
 * open it, it uses their own public photos, and it's removed on request.
 */
export const PREVIEW_LINK_NOTE =
    "This is a private preview I made just for you — it isn't published or listed anywhere and search engines " +
    "don't index it, so only people with this link can open it. The photos and logo come from your public pages " +
    "and remain yours. It isn't affiliated with or approved by your business, and I'll take it down whenever you ask.";
