import type { Metadata, Viewport } from "next";
import { RootDocument } from "@/components/RootDocument";
import { baseMetadata, siteViewport, DEFAULT_META } from "@/lib/site-metadata";
import "../globals.css";

/* ── Global metadata (English) ──────────────────────────── */
export const metadata: Metadata = {
  ...baseMetadata("en", DEFAULT_META),
  keywords: [...DEFAULT_META.keywords],
  classification: "Software Development, AI Development",
};

export const viewport: Viewport = siteViewport;

/* ── Root Layout (English) ──────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
