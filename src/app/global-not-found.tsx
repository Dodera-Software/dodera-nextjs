import type { Metadata } from "next";
import { RootDocument } from "@/components/RootDocument";
import { NotFoundPage } from "@/components/NotFoundPage";
import { getDictionary } from "@/i18n/dictionaries";
import "./globals.css";

export const metadata: Metadata = {
    title: `${getDictionary("en").notFound.title} | Dodera Software`,
    robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
    return (
        <RootDocument locale="en">
            <NotFoundPage alternate={{ label: getDictionary("ro").notFound.back, href: "/ro", lang: "ro" }} />
        </RootDocument>
    );
}
