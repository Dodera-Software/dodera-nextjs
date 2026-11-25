"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { SearchInput, Toolbar } from "@/components/admin/SearchInput";
import { StatGrid, StatTile } from "@/components/admin/StatGrid";
import { API_AUTH_ORDER, ApiAuth } from "@/config/api-docs";
import { apiDocsCopy as copy } from "@/i18n/admin/api-docs";
import { EndpointCard } from "./EndpointCard";

const STAT_AUTHS = [ApiAuth.ApiToken, ApiAuth.AdminSession, ApiAuth.None] as const;

function countBy(auth: ApiAuth): number {
    return copy.endpoints.filter((endpoint) => endpoint.auth === auth).length;
}

export default function ApiDocsPage() {
    const [search, setSearch] = useState("");
    const query = search.trim().toLowerCase();
    const matches = query
        ? copy.endpoints.filter(
            (endpoint) => endpoint.path.toLowerCase().includes(query) || endpoint.description.toLowerCase().includes(query),
        )
        : copy.endpoints;
    const sections = API_AUTH_ORDER.map((auth) => ({
        auth,
        endpoints: matches.filter((endpoint) => endpoint.auth === auth),
    })).filter((section) => section.endpoints.length > 0);

    return (
        <AdminPage eyebrow={copy.eyebrow} title={copy.title} description={copy.description(copy.endpoints.length)}>
            <StatGrid>
                <StatTile label={copy.stats.total} value={copy.endpoints.length} />
                {STAT_AUTHS.map((auth) => (
                    <StatTile key={auth} label={copy.stats[auth]} value={countBy(auth)} />
                ))}
            </StatGrid>

            <div className="space-y-6">
                <Toolbar>
                    <SearchInput value={search} onChange={setSearch} placeholder={copy.search} />
                </Toolbar>
                {sections.length === 0 ? (
                    <AdminPanel>
                        <EmptyState icon={SearchX} {...copy.empty} />
                    </AdminPanel>
                ) : (
                    sections.map((section) => (
                        <AdminPanel
                            key={section.auth}
                            eyebrow={section.endpoints.length}
                            title={copy.auth[section.auth].section}
                            description={copy.auth[section.auth].description}
                            flush
                        >
                            {section.endpoints.map((endpoint) => (
                                <EndpointCard key={endpoint.path} endpoint={endpoint} />
                            ))}
                        </AdminPanel>
                    ))
                )}
            </div>
        </AdminPage>
    );
}
