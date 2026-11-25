"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

enum UnsubscribeState {
    Idle = "idle",
    Loading = "loading",
    Success = "success",
    Error = "error",
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_30%,hsl(var(--brand)/0.18),transparent_70%)]" />
                <div className="grain" aria-hidden="true" />
                <div className="wrap relative flex justify-center py-32">
                    <div className="glass w-full max-w-lg rounded-3xl p-10 text-center">
                        <h1 className="display-md">{title}</h1>
                        {children}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function HomeLink() {
    return (
        <Button size="pill" variant="glass" asChild>
            <Link href="/">
                <ArrowLeft aria-hidden="true" />
                Back to home
            </Link>
        </Button>
    );
}

export default function UnsubscribeClient() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";
    const token = searchParams.get("token") ?? "";
    const [state, setState] = useState(UnsubscribeState.Idle);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleUnsubscribe() {
        setState(UnsubscribeState.Loading);
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
                setState(UnsubscribeState.Error);
                return;
            }
            setState(UnsubscribeState.Success);
        } catch {
            setErrorMessage("Network error. Please check your connection and try again.");
            setState(UnsubscribeState.Error);
        }
    }

    if (state === UnsubscribeState.Success) {
        return (
            <Shell title="You've been unsubscribed">
                <span className="mx-auto mt-8 grid size-14 place-items-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
                    <Check className="size-6 text-emerald-400" aria-hidden="true" />
                </span>
                <p className="mt-6 text-muted-foreground">
                    <span className="font-medium text-foreground">{email}</span> has been removed from our newsletter. You won&apos;t receive any further emails from us.
                </p>
                <div className="mt-8 flex justify-center">
                    <HomeLink />
                </div>
            </Shell>
        );
    }

    if (!email || !token) {
        return (
            <Shell title="Invalid unsubscribe link">
                <p className="mt-6 text-muted-foreground">This link appears to be incomplete or malformed. Please use the unsubscribe link from your email.</p>
                <div className="mt-8 flex justify-center">
                    <HomeLink />
                </div>
            </Shell>
        );
    }

    return (
        <Shell title="Unsubscribe from newsletter">
            <p className="mt-6 text-muted-foreground">
                Are you sure you want to unsubscribe <span className="font-medium text-foreground">{email}</span> from the Dodera Software newsletter?
            </p>
            <p className="mt-2 text-sm text-muted-foreground">You can always re-subscribe from our website.</p>
            {state === UnsubscribeState.Error && (
                <p role="alert" className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                    {errorMessage}
                </p>
            )}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button size="pill" onClick={handleUnsubscribe} disabled={state === UnsubscribeState.Loading}>
                    {state === UnsubscribeState.Loading ? "Unsubscribing…" : "Yes, unsubscribe me"}
                </Button>
                <Button size="pill" variant="glass" asChild>
                    <Link href="/">Cancel</Link>
                </Button>
            </div>
        </Shell>
    );
}
