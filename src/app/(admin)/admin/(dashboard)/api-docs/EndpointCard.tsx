"use client";

import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CopyButton } from "@/components/ui/copy-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_AUTH_STYLE, HTTP_METHOD_TONE } from "@/config/api-docs";
import { StatusTone } from "@/config/ui";
import { apiDocsCopy as copy } from "@/i18n/admin/api-docs";
import type { ApiEndpoint } from "@/types/admin";

const LABEL = "font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground";

export function EndpointCard({ endpoint }: { endpoint: ApiEndpoint }) {
    const auth = API_AUTH_STYLE[endpoint.auth];
    const AuthIcon = auth.icon;
    const authCopy = copy.auth[endpoint.auth];

    return (
        <Collapsible className="group/endpoint border-b border-foreground/[0.07] last:border-0">
            <div className="flex items-start gap-3 px-6 py-4">
                <CollapsibleTrigger className="flex min-w-0 flex-1 flex-col gap-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <span className="flex flex-wrap items-center gap-2">
                        {endpoint.methods.map((method) => (
                            <Badge key={method} tone={HTTP_METHOD_TONE[method]} className="font-mono text-[0.68rem] font-semibold">
                                {method}
                            </Badge>
                        ))}
                        <code className="break-all font-mono text-sm text-foreground">{endpoint.path}</code>
                    </span>
                    <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                </CollapsibleTrigger>
                <div className="flex shrink-0 items-center gap-1">
                    <Badge tone={auth.tone} className="hidden sm:inline-flex">
                        <AuthIcon />
                        {authCopy.label}
                    </Badge>
                    <CopyButton value={endpoint.path} label={copy.endpoint.copyPath} iconOnly />
                    <CollapsibleTrigger
                        aria-label={copy.endpoint.details}
                        className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                    >
                        <ChevronDown className="size-4 transition-transform group-data-[state=open]/endpoint:rotate-180" />
                    </CollapsibleTrigger>
                </div>
            </div>
            <CollapsibleContent className="space-y-5 px-6 pb-6">
                <section className="space-y-1.5">
                    <h3 className={LABEL}>{copy.endpoint.details}</h3>
                    <p className="text-sm leading-relaxed text-foreground/80">{endpoint.details}</p>
                </section>
                <section className="space-y-1.5">
                    <h3 className={LABEL}>{copy.endpoint.authentication}</h3>
                    <p className="flex items-center gap-2 text-sm text-foreground/80">
                        <Badge tone={auth.tone} className="sm:hidden">
                            <AuthIcon />
                            {authCopy.label}
                        </Badge>
                        {authCopy.description}
                    </p>
                </section>
                {endpoint.params && endpoint.params.length > 0 && (
                    <section className="space-y-2">
                        <h3 className={LABEL}>{copy.endpoint.parameters}</h3>
                        <div className="overflow-x-auto rounded-2xl border border-foreground/10">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{copy.endpoint.columns.name}</TableHead>
                                        <TableHead>{copy.endpoint.columns.type}</TableHead>
                                        <TableHead>{copy.endpoint.columns.required}</TableHead>
                                        <TableHead>{copy.endpoint.columns.description}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {endpoint.params.map((param, index) => (
                                        <TableRow key={`${param.name}-${index}`}>
                                            <TableCell className="whitespace-nowrap font-mono text-xs">{param.name}</TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">{param.type}</TableCell>
                                            <TableCell>
                                                <Badge tone={param.required ? StatusTone.Warning : StatusTone.Neutral}>
                                                    {param.required ? copy.endpoint.required : copy.endpoint.optional}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="min-w-[14rem] text-xs text-muted-foreground">{param.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </section>
                )}
                {endpoint.response && (
                    <section className="space-y-1.5">
                        <h3 className={LABEL}>{copy.endpoint.response}</h3>
                        <pre className="overflow-x-auto rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-4 py-3 font-mono text-xs text-foreground/80">
                            {endpoint.response}
                        </pre>
                    </section>
                )}
            </CollapsibleContent>
        </Collapsible>
    );
}
