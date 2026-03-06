"use client";

import { useState } from "react";
import { Send, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EMAIL_RE } from "@/lib/validation";

type Status = "idle" | "loading" | "success" | "error";

/**
 * Self-contained newsletter subscription form.
 * Extracted from Footer to be reusable on other pages too.
 */
export function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmed = email.trim();

        if (!trimmed || trimmed.length > 254 || !EMAIL_RE.test(trimmed)) {
            setStatus("error");
            setErrorMsg("Please enter a valid email address.");
            return;
        }

        setStatus("loading");
        setErrorMsg("");

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: trimmed }),
            });

            const data = await res.json();

            if (!res.ok || data.status === "error") {
                setStatus("error");
                setErrorMsg(data.message ?? "Something went wrong. Please try again.");
                return;
            }

            setStatus("success");
        } catch {
            setStatus("error");
            setErrorMsg("Network error. Please try again.");
        }
    }

    if (status === "success") {
        return (
            <p className="flex items-center gap-2 text-sm text-emerald-600">
                <Send className="size-3.5" />
                Subscribed!
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-2">
            <Input
                type="email"
                name="newsletter-email"
                autoComplete="email"
                placeholder="Enter your email"
                maxLength={254}
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                }}
                aria-label="Email address for newsletter"
                aria-invalid={status === "error"}
                className="border-border"
            />
            {status === "error" && (
                <p className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="size-3 shrink-0" /> {errorMsg}
                </p>
            )}
            <Button
                type="submit"
                variant="default"
                size="sm"
                className="w-full"
                disabled={status === "loading"}
            >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
                <Send className="ml-2 size-3" />
            </Button>
        </form>
    );
}
