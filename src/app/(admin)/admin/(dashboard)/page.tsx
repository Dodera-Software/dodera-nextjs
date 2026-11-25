"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminPage } from "@/components/admin/AdminPage";
import { AutoPostPanel } from "@/components/admin/dashboard/AutoPostPanel";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { QuickLinks } from "@/components/admin/dashboard/QuickLinks";
import { dashboardCopy as copy } from "@/i18n/admin/dashboard";
import { sessionQuery } from "@/lib/admin-queries";

export default function AdminDashboardPage() {
    const session = useQuery(sessionQuery);
    return (
        <AdminPage
            eyebrow={copy.eyebrow}
            title={session.data ? copy.title(session.data.name) : copy.eyebrow}
            description={copy.description}
        >
            <DashboardStats />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
                <AutoPostPanel />
                <QuickLinks />
            </div>
        </AdminPage>
    );
}
