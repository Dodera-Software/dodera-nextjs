"use client";

import { useQuery } from "@tanstack/react-query";
import { StatGrid, StatTile } from "@/components/admin/StatGrid";
import { AdminQueryKey, AdminRoute } from "@/config/admin";
import { dashboardCopy as copy } from "@/i18n/admin/dashboard";
import { adminCommon } from "@/i18n/admin/common";
import { leadsQuery, tokensQuery, totalQuery } from "@/lib/admin-queries";
import { isTokenActive } from "@/lib/utils";

function shown(n: number | undefined) {
    return n ?? adminCommon.empty;
}

export function DashboardStats() {
    const contacts = useQuery(totalQuery(AdminQueryKey.Contacts, "/api/admin/contacts"));
    const subscribers = useQuery(totalQuery(AdminQueryKey.Subscribers, "/api/admin/subscribers"));
    const leads = useQuery(leadsQuery);
    const tokens = useQuery(tokensQuery);

    return (
        <StatGrid>
            <StatTile label={copy.stats.contacts} value={shown(contacts.data)} loading={contacts.isPending} href={AdminRoute.Contacts} />
            <StatTile label={copy.stats.leads} value={shown(leads.data?.length)} loading={leads.isPending} href={AdminRoute.Leads} />
            <StatTile label={copy.stats.subscribers} value={shown(subscribers.data)} loading={subscribers.isPending} href={AdminRoute.Subscribers} />
            <StatTile
                label={copy.stats.tokens}
                value={shown(tokens.data?.filter(isTokenActive).length)}
                hint={tokens.data && copy.stats.tokensHint(tokens.data.length)}
                loading={tokens.isPending}
                href={AdminRoute.Tokens}
            />
        </StatGrid>
    );
}
