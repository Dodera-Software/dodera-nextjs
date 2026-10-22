"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type State = "idle" | "loading" | "success" | "error";

export default function UnsubscribeClient() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";
    const token = searchParams.get("token") ?? "";

    const [state, setState] = useState<State>("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const isValidParams = Boolean(email && token);

    async function handleUnsubscribe() {
        setState("loading");
        setErrorMessage("");

        try {
            const res = await fetch("/api/newsletter/unsubscribe", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, token }),
            });

            const data = await res.json();

            if (!res.ok || data.status !== "success") {
                setErrorMessage(data.message ?? "Something went wrong. Please try again.");
                setState("error");
                return;
            }

            setState("success");
        } catch {
            setErrorMessage("Network error. Please check your connection and try again.");
            setState("error");
        }
    }

    /* ── Success state ─────────────────────────────────────────── */
    if (state === "success") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <main className="max-w-md text-center">
                    <div className="mb-6 flex justify-center">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
                            ✓
                        </span>
                    </div>
                    <h1 className="mb-3 text-2xl font-bold text-foreground">
                        You&apos;ve been unsubscribed
                    </h1>
                    <p className="mb-8 text-muted-foreground">
                        <span className="font-medium text-foreground">{email}</span> has been
                        removed from our newsletter. You won&apos;t receive any further emails
                        from us.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                        &larr; Return to Home
                    </Link>
                </main>
            </div>
        );
    }

    /* ── Invalid / missing params ──────────────────────────────── */
    if (!isValidParams) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <main className="max-w-md text-center">
                    <h1 className="mb-3 text-2xl font-bold text-foreground">
                        Invalid unsubscribe link
                    </h1>
                    <p className="mb-8 text-muted-foreground">
                        This link appears to be incomplete or malformed. Please use the
                        unsubscribe link from your email.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                        &larr; Return to Home
                    </Link>
                </main>
            </div>
        );
    }

    /* ── Confirm state ─────────────────────────────────────────── */
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <main className="max-w-md text-center">
                <h1 className="mb-3 text-2xl font-bold text-foreground">
                    Unsubscribe from newsletter
                </h1>
                <p className="mb-2 text-muted-foreground">
                    Are you sure you want to unsubscribe{" "}
                    <span className="font-medium text-foreground">{email}</span> from the
                    Dodera Software newsletter?
                </p>
                <p className="mb-8 text-sm text-muted-foreground">
                    You can always re-subscribe from our website.
                </p>

                {state === "error" && (
                    <p className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {errorMessage}
                    </p>
                )}

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <button
                        onClick={handleUnsubscribe}
                        disabled={state === "loading"}
                        className="inline-flex min-w-[160px] items-center justify-center rounded-md bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {state === "loading" ? "Unsubscribing…" : "Yes, unsubscribe me"}
                    </button>
                    <Link
                        href="/"
                        className="inline-flex min-w-[160px] items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                        Cancel
                    </Link>
                </div>
            </main>
        </div>
    );
}
