"use client";

import { useState } from "react";
import { Shield, Clock, Globe, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import type { HttpMethod, ApiEndpoint } from "@/types/admin";

const METHOD_COLORS: Record<HttpMethod, string> = {
    GET: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    POST: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    PUT: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
    PATCH: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const AUTH_CONFIG = {
    "api-token": {
        label: "API Token",
        icon: Shield,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/20",
        description: "Requires Authorization: Bearer <token> header",
    },
    "cron-secret": {
        label: "Cron Secret",
        icon: Clock,
        color: "text-violet-400",
        bg: "bg-violet-400/10",
        border: "border-violet-400/20",
        description: "CRON_SECRET (set manually in Netlify env vars; was auto-injected on Vercel)",
    },
    "webhook-secret": {
        label: "Webhook Secret",
        icon: Shield,
        color: "text-cyan-400",
        bg: "bg-cyan-400/10",
        border: "border-cyan-400/20",
        description: "Requires ?secret= query parameter",
    },
    none: {
        label: "Public",
        icon: Globe,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/20",
        description: "No authentication required",
    },
};

export interface EndpointCardProps {
    endpoint: ApiEndpoint;
}

export function EndpointCard({ endpoint }: EndpointCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const authInfo = AUTH_CONFIG[endpoint.auth];
    const AuthIcon = authInfo.icon;

    const copyPath = () => {
        navigator.clipboard.writeText(endpoint.path);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="border border-border rounded-xl bg-card overflow-hidden transition-all hover:border-border/80">
            <div
                onClick={() => setExpanded(!expanded)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setExpanded(!expanded);
                    }
                }}
                className="w-full text-left p-4 flex items-start gap-4 cursor-pointer"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                        {endpoint.methods.map((method) => (
                            <span
                                key={method}
                                className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${METHOD_COLORS[method]}`}
                            >
                                {method}
                            </span>
                        ))}
                        <code className="text-sm font-mono text-foreground">
                            {endpoint.path}
                        </code>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                copyPath();
                            }}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="Copy path"
                        >
                            {copied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                                <Copy className="w-3.5 h-3.5" />
                            )}
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {endpoint.description}
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${authInfo.bg} ${authInfo.color} ${authInfo.border}`}
                    >
                        <AuthIcon className="w-3 h-3" />
                        {authInfo.label}
                    </div>
                    {expanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                </div>
            </div>

            {expanded && (
                <div className="px-4 pb-4 pt-0 border-t border-border/50">
                    <div className="pt-4 space-y-4">
                        <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                                Details
                            </h4>
                            <p className="text-sm text-foreground/80 leading-relaxed">
                                {endpoint.details}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                                Authentication
                            </h4>
                            <p className="text-sm text-foreground/80">
                                {authInfo.description}
                            </p>
                        </div>

                        {endpoint.params && endpoint.params.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Parameters
                                </h4>
                                <div className="rounded-lg border border-border overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-muted/30">
                                                <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Name</th>
                                                <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Type</th>
                                                <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Required</th>
                                                <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {endpoint.params.map((param) => (
                                                <tr key={param.name} className="border-t border-border/50">
                                                    <td className="px-3 py-2 font-mono text-xs text-foreground">{param.name}</td>
                                                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{param.type}</td>
                                                    <td className="px-3 py-2">
                                                        {param.required ? (
                                                            <span className="text-xs font-medium text-amber-400">Yes</span>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">No</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs text-muted-foreground">{param.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {endpoint.response && (
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                                    Example Response
                                </h4>
                                <pre className="bg-muted/30 border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground/80 overflow-x-auto">
                                    {endpoint.response}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
