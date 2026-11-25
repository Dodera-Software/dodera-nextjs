import type { Metadata, Viewport } from "next";
import { RootDocument } from "@/components/RootDocument";
import { Theme } from "@/config/theme";
import { siteViewport } from "@/lib/site-metadata";
import "../../globals.css";

export const metadata: Metadata = {
    title: "Admin Dashboard | Dodera Software",
    robots: { index: false, follow: false },
};

export const viewport: Viewport = siteViewport;

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <RootDocument locale="en" theme={Theme.Light}>
            {children}
        </RootDocument>
    );
}
