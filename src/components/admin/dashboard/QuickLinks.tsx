import { ArrowUpRight } from "lucide-react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { ADMIN_LINKS } from "@/config/admin";
import { dashboardCopy } from "@/i18n/admin/dashboard";

const copy = dashboardCopy.links;

interface QuickLink {
    label: string;
    hint: string;
    url: string | undefined;
}

const LINKS = ([
    { label: copy.coolify, hint: copy.coolifyHint, url: ADMIN_LINKS.coolify },
    { label: copy.prismic, hint: copy.prismicHint, url: ADMIN_LINKS.prismicMigration },
] satisfies QuickLink[]).filter((link) => !!link.url);

export function QuickLinks() {
    if (LINKS.length === 0) return null;
    return (
        <AdminPanel eyebrow={copy.eyebrow} title={copy.title} flush>
            <ul className="divide-y divide-foreground/[0.07]">
                {LINKS.map((link) => (
                    <li key={link.label}>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-foreground/[0.03]"
                        >
                            <span>
                                <span className="block text-sm font-medium">{link.label}</span>
                                <span className="block text-xs text-muted-foreground">{link.hint}</span>
                            </span>
                            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-bright" />
                        </a>
                    </li>
                ))}
            </ul>
        </AdminPanel>
    );
}
