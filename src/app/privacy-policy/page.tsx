import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PRIVACY_META } from "./seo";
import { COMPANY } from "@/config/site";

export const metadata: Metadata = {
    title: PRIVACY_META.title,
    description: PRIVACY_META.description,
    alternates: { canonical: PRIVACY_META.canonical },
    robots: { index: true, follow: true },
};

const LAST_UPDATED = "March 17, 2026";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
                <div className="mb-12">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Legal
                    </p>
                    <h1 className="mb-4 text-4xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="text-sm text-muted-foreground">
                        Last updated: {LAST_UPDATED}
                    </p>
                </div>

                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-foreground/80 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-li:text-foreground/80 prose-strong:text-foreground prose-hr:border-border">

                    <p>
                        {COMPANY.name} ({COMPANY.legalName}) (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates{" "}
                        <a href={COMPANY.url}>{COMPANY.url}</a>. This page explains what personal data we
                        collect, how we use it, and your rights under applicable data-protection
                        legislation, including the EU General Data Protection Regulation (GDPR).
                    </p>

                    <hr />

                    <h2>1. Data We Collect</h2>
                    <p>We collect the minimum data necessary to operate the services described on this website:</p>
                    <ul>
                        <li>
                            <strong>Contact form submissions</strong> — name, email address, company name,
                            phone number (optional), and project description you provide when you
                            reach out to us.
                        </li>
                        <li>
                            <strong>Job applications</strong> — full name, email address, and CV/résumé
                            file you upload when applying for an open position. This data is used
                            exclusively for recruitment purposes.
                        </li>
                        <li>
                            <strong>Newsletter subscriptions</strong> — email address you provide when
                            you subscribe to our newsletter.
                        </li>
                        <li>
                            <strong>Usage data</strong> — anonymised analytics such as pages visited,
                            time on page, and referral source. We do not use cookies for advertising
                            or cross-site tracking.
                        </li>
                    </ul>

                    <h2>2. How We Use Your Data</h2>
                    <ul>
                        <li>To respond to your enquiries and provide the services you requested.</li>
                        <li>To send newsletters or project updates you have explicitly opted in to.</li>
                        <li>To improve our website and services based on aggregate usage patterns.</li>
                        <li>To comply with legal obligations.</li>
                    </ul>
                    <p>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>

                    <h2>3. Legal Basis for Processing (GDPR)</h2>
                    <ul>
                        <li><strong>Consent</strong> — newsletter subscriptions and job application processing.</li>
                        <li><strong>Legitimate interest</strong> — responding to contact form submissions and maintaining website security.</li>
                        <li><strong>Legal obligation</strong> — compliance with Romanian and EU law.</li>
                    </ul>

                    <h2>4. Data Retention</h2>
                    <p>
                        Contact enquiries and newsletter subscriber emails are retained indefinitely
                        to support ongoing business relationships and communication history. You may
                        request deletion of your data at any time by emailing{" "}
                        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> and we will remove
                        your records promptly.
                    </p>
                    <p>
                        Job application data (personal details and CV files) is retained for a
                        maximum of <strong>12 months</strong> from the date of submission. After
                        this period, both the database record and the uploaded CV file are
                        permanently deleted. You may request earlier deletion at any time by
                        contacting us at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
                    </p>

                    <h2>5. Your Rights</h2>
                    <p>Under GDPR you have the right to:</p>
                    <ul>
                        <li>Access the personal data we hold about you.</li>
                        <li>Request correction of inaccurate data.</li>
                        <li>Request erasure of your data (&quot;right to be forgotten&quot;).</li>
                        <li>Object to or restrict certain types of processing.</li>
                        <li>Data portability — receive a copy of your data in a machine-readable format.</li>
                        <li>Lodge a complaint with your local supervisory authority.</li>
                    </ul>
                    <p>
                        To exercise any of these rights, contact us at{" "}
                        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
                    </p>

                    <h2>6. Cookies</h2>
                    <p>
                        This website does <strong>not</strong> set any cookies for regular visitors.
                        We do not use analytics cookies, advertising cookies, third-party tracking
                        pixels, or fingerprinting of any kind.
                    </p>

                    <h2>7. Third-Party Services</h2>
                    <p>
                        We use the following third-party processors, each bound by their own privacy
                        policies and GDPR data-processing agreements:
                    </p>
                    <ul>
                        <li><strong>Vercel</strong> — website hosting and edge delivery.</li>
                        <li><strong>Supabase</strong> — contact form data storage, newsletter subscriber list, job application records, and CV file storage (private, access-controlled bucket).</li>
                        <li><strong>SMTP / Nodemailer</strong> — transactional email delivery via our configured mail provider.</li>
                    </ul>

                    <h2>8. Data Security</h2>
                    <p>
                        We implement industry-standard security measures including HTTPS-only
                        communication, restricted database access, and rate limiting on all public
                        endpoints. No method of transmission over the internet is 100% secure; we
                        cannot guarantee absolute security.
                    </p>

                    <h2>9. Children&apos;s Privacy</h2>
                    <p>
                        Our services are not directed to anyone under the age of 16. We do not
                        knowingly collect personal data from children.
                    </p>

                    <h2>10. Changes to This Policy</h2>
                    <p>
                        We may update this policy periodically. Material changes will be reflected
                        by an updated &quot;Last updated&quot; date above. Continued use of the website
                        after changes constitutes acceptance of the revised policy.
                    </p>

                    <h2>11. Contact</h2>
                    <p>
                        For any privacy-related questions or requests, please contact:
                    </p>
                    <p>
                        <strong>{COMPANY.legalName}</strong><br />
                        {COMPANY.address}<br />
                        {COMPANY.location}<br />
                        {COMPANY.taxId && (<>
                            CUI: {COMPANY.taxId}<br />
                        </>)}
                        {COMPANY.registrationNumber && (<>
                            Registration No: {COMPANY.registrationNumber}<br />
                        </>)}

                        <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}>{COMPANY.phone}</a><br />
                        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                    </p>
                </div>

                <div className="mt-12 flex gap-4 text-sm">
                    <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
