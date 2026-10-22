import type { Metadata, Viewport } from "next";
import { RootDocument } from "@/components/RootDocument";
import { baseMetadata, siteViewport } from "@/lib/site-metadata";
import { RO_DEFAULT_META } from "./seo";
import "../../globals.css";

/* ── Metadate globale (română) ──────────────────────────── */
export const metadata: Metadata = baseMetadata("ro", RO_DEFAULT_META);

export const viewport: Viewport = siteViewport;

/* ── Root Layout (română) — <html lang="ro"> ────────────── */
export default function RootLayoutRo({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <RootDocument locale="ro">{children}</RootDocument>;
}
