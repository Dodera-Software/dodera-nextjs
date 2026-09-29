"use client";

import { CheckCircle2, ExternalLink, Info, Scale, Send, Lock } from "lucide-react";
import { outreachRuleFor, OUTREACH_RULES } from "@/config/outreach-rules";

/**
 * What the lead's country allows for a cold offer: whether the mock link can
 * go with the first message, the rule behind it (with its official source),
 * and what each message must contain. Nothing alarming for countries without
 * a relevant rule.
 */
export function OutreachRuleNote({ country }: { country: string }) {
    const typed = country.trim();
    if (!typed) return null;

    const rule = outreachRuleFor(typed);
    if (!rule) {
        return (
            <p className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>
                    No outreach notes for {typed}. Rules are listed for{" "}
                    {OUTREACH_RULES.map((r) => r.name).join(", ")}.
                </span>
            </p>
        );
    }

    const direct = rule.approach === "direct";

    return (
        <div className="rounded-lg border border-border px-3 py-2.5 space-y-2 text-xs">
            <p className={`flex items-center gap-1.5 font-medium ${direct ? "text-emerald-500" : "text-violet-400"}`}>
                {direct ? <Send className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                {rule.name}: {direct ? "send the mock link with the first message" : "first message without the link — send it once they reply positively"}
            </p>

            {rule.rule ? (
                <p className="flex items-start gap-2 text-amber-500">
                    <Scale className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{rule.rule}</span>
                </p>
            ) : (
                <p className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    No specific rule on offers to businesses by DM — contact them openly.
                </p>
            )}

            {rule.include.length > 0 && (
                <ul className="space-y-0.5 text-muted-foreground list-disc pl-5">
                    {rule.include.map((item) => <li key={item}>{item}</li>)}
                </ul>
            )}

            {rule.sources.length > 0 && (
                <details className="text-muted-foreground">
                    <summary className="cursor-pointer select-none hover:text-foreground">Official source{rule.sources.length > 1 ? "s" : ""}</summary>
                    <ul className="mt-1 space-y-0.5">
                        {rule.sources.map((s) => (
                            <li key={s.url}>
                                <a
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 hover:text-foreground underline underline-offset-2"
                                >
                                    {s.label}
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-1 opacity-80">A summary for guidance, not legal advice.</p>
                </details>
            )}
        </div>
    );
}
