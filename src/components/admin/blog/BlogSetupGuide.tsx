"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { CopyButton } from "@/components/ui/copy-button";
import { AdminRoute } from "@/config/admin";
import { SITE } from "@/config/seo";
import { blogCopy } from "@/i18n/admin/blog";

const copy = blogCopy.guide;
const TOKEN_STEP = 0;
const ENV_STEP = 1;

const subscribeNever = () => () => {};

export function BlogSetupGuide() {
    const origin = useSyncExternalStore(subscribeNever, () => window.location.origin, () => SITE.url);
    const env = `BLOG_API_URL=${origin}\nBLOG_API_TOKEN=${copy.envToken}`;

    return (
        <AdminPanel eyebrow={copy.eyebrow} title={copy.title} description={copy.description} footer={<p className="text-xs text-muted-foreground">{copy.drafts}</p>}>
            <ol className="space-y-5">
                {copy.steps.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-foreground/15 font-mono text-xs text-brand-bright">{i + 1}</span>
                        <div className="min-w-0 flex-1 space-y-2 text-sm">
                            <p className="font-medium">{step.title}</p>
                            <p className="leading-relaxed text-muted-foreground">
                                {step.text}
                                {i === TOKEN_STEP && (
                                    <>
                                        {" "}
                                        <Link href={AdminRoute.Tokens} className="text-brand-bright underline underline-offset-4">
                                            {copy.openTokens}
                                        </Link>
                                    </>
                                )}
                            </p>
                            {i === ENV_STEP && (
                                <div className="flex items-start gap-2">
                                    <pre className="min-w-0 flex-1 overflow-x-auto rounded-2xl border border-foreground/10 bg-background/60 px-4 py-3 font-mono text-xs leading-relaxed">{env}</pre>
                                    <CopyButton value={env} iconOnly />
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </AdminPanel>
    );
}
