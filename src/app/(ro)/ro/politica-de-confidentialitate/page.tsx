import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { COMPANY } from "@/config/site";
import { SITE } from "@/config/seo";
import { STATIC_PATHS } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema } from "@/lib/structured-data";
import { RO_META } from "../seo";

/*
 * Traducerea fidelă a /privacy-policy. Orice modificare de fond trebuie
 * făcută în ambele limbi, cu aceeași dată de actualizare.
 * TODO(owner): o verificare juridică a textului în română.
 */

export const metadata: Metadata = {
    title: RO_META.privacy.title,
    description: RO_META.privacy.description,
    alternates: alternatesFor("privacy", "ro"),
    robots: { index: true, follow: true },
};

const LAST_UPDATED = "17 martie 2026";

export default function PrivacyPolicyRo() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={breadcrumbSchema([
                    { name: "Acasă", url: absoluteUrl("/ro") },
                    { name: "Politica de confidențialitate", url: absoluteUrl(STATIC_PATHS.privacy.ro) },
                ])}
            />
            <Navbar />

            <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
                <div className="mb-12">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Informații legale
                    </p>
                    <h1 className="mb-4 text-4xl font-bold tracking-tight">Politica de confidențialitate</h1>
                    <p className="text-sm text-muted-foreground">
                        Ultima actualizare: {LAST_UPDATED}
                    </p>
                </div>

                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-p:text-foreground/80 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-li:text-foreground/80 prose-strong:text-foreground prose-hr:border-border">

                    <p>
                        {COMPANY.name} ({COMPANY.legalName}) („noi”) administrează site-ul{" "}
                        <a href={COMPANY.url}>{COMPANY.url}</a>. Această pagină explică ce date personale
                        colectăm, cum le folosim și ce drepturi aveți conform legislației privind protecția
                        datelor, inclusiv Regulamentul general privind protecția datelor (GDPR) al Uniunii Europene.
                    </p>

                    <hr />

                    <h2>1. Ce date colectăm</h2>
                    <p>Colectăm doar datele strict necesare pentru serviciile descrise pe acest site:</p>
                    <ul>
                        <li>
                            <strong>Mesaje trimise prin formularul de contact</strong>: numele, adresa de email,
                            numele companiei, numărul de telefon (opțional) și descrierea proiectului pe care
                            ni le transmiteți când ne contactați.
                        </li>
                        <li>
                            <strong>Aplicații la posturi</strong>: numele complet, adresa de email și fișierul
                            CV pe care îl încărcați când aplicați la un post. Aceste date sunt folosite
                            exclusiv în scop de recrutare.
                        </li>
                        <li>
                            <strong>Abonări la newsletter</strong>: adresa de email pe care o furnizați când vă
                            abonați la newsletter.
                        </li>
                        <li>
                            <strong>Date de utilizare</strong>: statistici anonimizate, precum paginile vizitate,
                            timpul petrecut pe pagină și sursa vizitei. Nu folosim cookie-uri pentru publicitate
                            sau pentru urmărirea dumneavoastră pe alte site-uri.
                        </li>
                    </ul>

                    <h2>2. Cum folosim datele</h2>
                    <ul>
                        <li>Pentru a vă răspunde la solicitări și pentru a furniza serviciile cerute.</li>
                        <li>Pentru a vă trimite newsletterul sau noutăți despre proiecte, dacă v-ați abonat explicit.</li>
                        <li>Pentru a îmbunătăți site-ul și serviciile, pe baza tiparelor agregate de utilizare.</li>
                        <li>Pentru a respecta obligațiile legale.</li>
                    </ul>
                    <p>Nu vindem, nu închiriem și nu transmitem datele dumneavoastră personale către terți în scopuri de marketing.</p>

                    <h2>3. Temeiul legal al prelucrării (GDPR)</h2>
                    <ul>
                        <li><strong>Consimțământul</strong>: abonările la newsletter și prelucrarea aplicațiilor la posturi.</li>
                        <li><strong>Interesul legitim</strong>: răspunsul la mesajele trimise prin formularul de contact și securitatea site-ului.</li>
                        <li><strong>Obligația legală</strong>: respectarea legislației din România și a Uniunii Europene.</li>
                    </ul>

                    <h2>4. Perioada de păstrare</h2>
                    <p>
                        Mesajele primite prin formularul de contact și adresele de email ale abonaților la
                        newsletter sunt păstrate pe durată nedeterminată, pentru a susține relațiile de afaceri
                        și istoricul comunicării. Puteți cere oricând ștergerea datelor scriindu-ne la{" "}
                        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>, iar noi vom șterge
                        înregistrările fără întârziere.
                    </p>
                    <p>
                        Datele din aplicațiile la posturi (datele personale și fișierele CV) sunt păstrate cel
                        mult <strong>12 luni</strong> de la data trimiterii. După această perioadă, atât
                        înregistrarea din baza de date, cât și fișierul CV sunt șterse automat și definitiv din
                        sistemele noastre. Puteți cere ștergerea mai devreme, oricând, la{" "}
                        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
                    </p>

                    <h2>5. Drepturile dumneavoastră</h2>
                    <p>Conform GDPR, aveți dreptul:</p>
                    <ul>
                        <li>să aveți acces la datele personale pe care le deținem despre dumneavoastră;</li>
                        <li>să cereți rectificarea datelor inexacte;</li>
                        <li>să cereți ștergerea datelor („dreptul de a fi uitat”);</li>
                        <li>să vă opuneți anumitor prelucrări sau să cereți restricționarea lor;</li>
                        <li>la portabilitatea datelor, adică să primiți o copie a datelor într-un format care poate fi citit automat;</li>
                        <li>
                            să depuneți o plângere la autoritatea de supraveghere; în România aceasta este
                            Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP).
                        </li>
                    </ul>
                    <p>
                        Pentru a vă exercita oricare dintre aceste drepturi, scrieți-ne la{" "}
                        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
                    </p>

                    <h2>6. Cookie-uri</h2>
                    <p>
                        Acest site <strong>nu</strong> setează cookie-uri pentru vizitatorii obișnuiți. Nu folosim
                        cookie-uri de analiză sau de publicitate, pixeli de urmărire ai terților și nicio formă
                        de amprentare a dispozitivului (fingerprinting).
                    </p>

                    <h2>7. Servicii terțe</h2>
                    <p>
                        Folosim următorii furnizori, fiecare obligat prin propria politică de confidențialitate
                        și prin acorduri de prelucrare a datelor conforme GDPR:
                    </p>
                    <ul>
                        <li><strong>Hetzner Online GmbH (Germania, UE)</strong>: găzduirea site-ului și a bazei de date, în care sunt stocate mesajele din formularul de contact, lista abonaților la newsletter, aplicațiile la posturi și fișierele CV (private, cu acces controlat).</li>
                        <li><strong>SMTP / Nodemailer</strong>: trimiterea emailurilor tranzacționale prin furnizorul de email configurat.</li>
                    </ul>

                    <h2>8. Securitatea datelor</h2>
                    <p>
                        Aplicăm măsuri de securitate standard în industrie, inclusiv comunicare exclusiv prin
                        HTTPS, acces restricționat la baza de date și limitarea numărului de cereri pe toate
                        punctele publice. Nicio metodă de transmitere prin internet nu este sigură în proporție
                        de 100%, așa că nu putem garanta securitatea absolută.
                    </p>

                    <h2>9. Datele copiilor</h2>
                    <p>
                        Serviciile noastre nu se adresează persoanelor sub 16 ani. Nu colectăm în mod
                        intenționat date personale de la copii.
                    </p>

                    <h2>10. Modificări ale acestei politici</h2>
                    <p>
                        Putem actualiza periodic această politică. Modificările importante vor fi semnalate prin
                        actualizarea datei „Ultima actualizare” de mai sus. Continuarea utilizării site-ului după
                        modificări înseamnă acceptarea politicii revizuite.
                    </p>

                    <h2>11. Contact</h2>
                    <p>
                        Pentru orice întrebări sau solicitări legate de confidențialitate, ne puteți contacta la:
                    </p>
                    <p>
                        <strong>{COMPANY.legalName}</strong><br />
                        {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}, România<br />
                        CUI: {COMPANY.taxId}<br />
                        Nr. Reg. Com.: {COMPANY.registrationNumber}<br />
                        <a href={`tel:${SITE.phoneE164}`}>{SITE.phone}</a><br />
                        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                    </p>

                    <p>
                        Varianta în limba engleză a acestei politici este disponibilă la{" "}
                        <Link href={STATIC_PATHS.privacy.en} hrefLang="en">Privacy Policy</Link>.
                    </p>
                </div>

                <div className="mt-12 flex gap-4 text-sm">
                    <Link href="/ro" className="text-primary hover:underline">← Înapoi la pagina principală</Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
