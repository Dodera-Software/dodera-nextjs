"use client";

import { CheckCircle2, ChevronDown, ExternalLink, Info, Lock, Scale, Send } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { outreachRuleFor, OUTREACH_RULES } from "@/config/outreach-rules";
import { leadsCopy as copy } from "@/i18n/admin/leads";
import { cn } from "@/lib/utils";

export function OutreachRuleNote({ country }: { country: string }) {
    const typed = country.trim();
    if (!typed) return null;

    const rule = outreachRuleFor(typed);
    if (!rule) {
        return (
            <p className="flex items-start gap-2 rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3.5 py-2.5 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                <span>{copy.rule.none(typed, OUTREACH_RULES.map((r) => r.name).join(", "))}</span>
            </p>
        );
    }

    const direct = rule.approach === "direct";

    return (
        <div className="space-y-2 rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3.5 py-3 text-xs">
            <p className={cn("flex items-center gap-1.5 font-medium", direct ? "text-emerald-400" : "text-brand-bright")}>
                {direct ? <Send className="size-3.5" /> : <Lock className="size-3.5" />}
                {direct ? copy.rule.direct(rule.name) : copy.rule.askFirst(rule.name)}
            </p>

            {rule.rule ? (
                <p className="flex items-start gap-2 text-amber-400">
                    <Scale className="mt-0.5 size-3.5 shrink-0" />
                    <span>{rule.rule}</span>
                </p>
            ) : (
                <p className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" />
                    {copy.rule.noRule}
                </p>
            )}

            {rule.include.length > 0 && (
                <ul className="list-disc space-y-0.5 pl-5 text-muted-foreground">
                    {rule.include.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            )}

            {rule.sources.length > 0 && (
                <Collapsible className="text-muted-foreground">
                    <CollapsibleTrigger className="group inline-flex items-center gap-1 hover:text-foreground">
                        {copy.rule.sources(rule.sources.length)}
                        <ChevronDown className="size-3 transition-transform group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 space-y-1">
                        <ul className="space-y-0.5">
                            {rule.sources.map((s) => (
                                <li key={s.url}>
                                    <a
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-foreground"
                                    >
                                        {s.label}
                                        <ExternalLink className="size-3" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <p className="opacity-80">{copy.rule.disclaimer}</p>
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
    );
}
