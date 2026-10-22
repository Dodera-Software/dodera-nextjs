import { notFound } from "next/navigation";

/* Any unknown /ro/... URL renders the Romanian 404 (ro/not-found.tsx) instead of the global English one. */
export default function UnknownRoPage() {
    notFound();
}
