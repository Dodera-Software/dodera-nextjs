import type { Metadata } from "next";
import { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";

export const metadata: Metadata = {
    title: "Unsubscribe | Dodera Software",
    description: "Unsubscribe from the Dodera Software newsletter.",
    robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
    return (
        <Suspense>
            <UnsubscribeClient />
        </Suspense>
    );
}
