"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminPage } from "@/components/admin/AdminPage";
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
            <QuickLinks />
        </AdminPage>
    );
}
