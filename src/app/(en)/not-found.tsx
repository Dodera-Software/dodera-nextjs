import type { Metadata } from "next";
import { NotFoundPage } from "@/components/NotFoundPage";
import { getDictionary } from "@/i18n/dictionaries";

export const metadata: Metadata = {
    title: getDictionary("en").notFound.title,
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return <NotFoundPage />;
}
