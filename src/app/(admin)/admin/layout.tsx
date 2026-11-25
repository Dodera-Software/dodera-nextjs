import type { Metadata, Viewport } from "next";
import { RootDocument } from "@/components/RootDocument";
import { AdminProviders } from "@/components/admin/AdminProviders";
import { Theme } from "@/config/theme";
import { adminCommon } from "@/i18n/admin/common";
import { siteViewport } from "@/lib/site-metadata";
import "../../globals.css";

export const metadata: Metadata = {
    title: adminCommon.meta.title,
    robots: { index: false, follow: false },
};

export const viewport: Viewport = siteViewport;

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <RootDocument locale="en" theme={Theme.Dark}>
            <AdminProviders>{children}</AdminProviders>
        </RootDocument>
    );
}
