"use client";

import { useEffect, useState, useCallback } from "react";
import { Settings, Loader2, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { ConfigRow } from "@/types/admin";
import { OPENAI_TEXT_MODELS, IMAGE_MODELS } from "@/config/ai-models";

const BOOLEAN_KEYS = new Set(["contact_followup_enabled"]);

// Keys managed by their own dedicated admin pages — hide from generic settings list
const HIDDEN_KEYS = new Set(["welcome_email_subject", "welcome_email_html"]);

function isBooleanKey(key: string) {
    return BOOLEAN_KEYS.has(key);
}

const SELECT_OPTIONS: Record<string, { value: string; label: string }[]> = {
    contact_followup_model: OPENAI_TEXT_MODELS,
    social_post_model: OPENAI_TEXT_MODELS,
    image_generation_model: IMAGE_MODELS,
};

function getSelectOptions(key: string) {
    return SELECT_OPTIONS[key] ?? null;
}

export default function SettingsPage() {
    const [rows, setRows] = useState<ConfigRow[]>([]);
    const [edits, setEdits] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [savingKey, setSavingKey] = useState<string | null>(null);

    const fetchConfig = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/config");
            const data = await res.json();
            if (data.status === "success") {
                const filtered = data.data.filter((r: ConfigRow) => !HIDDEN_KEYS.has(r.key));
                setRows(filtered);
                setEdits(Object.fromEntries(filtered.map((r: ConfigRow) => [r.key, r.value])));
            }
        } catch {
            console.error("Failed to load config");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchConfig(); }, [fetchConfig]);

    async function handleSave(key: string) {
        setSavingKey(key);
        try {
            const res = await fetch("/api/admin/config", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, value: edits[key] }),
            });
            const data = await res.json();
            if (data.status === "success") {
                toast.success(`"${key}" saved`);
                setRows((prev) =>
                    prev.map((r) =>
                        r.key === key
                            ? { ...r, value: edits[key], updated_at: new Date().toISOString() }
                            : r,
                    ),
                );
            } else {
                toast.error(`Failed to save "${key}"`);
            }
        } catch {
            toast.error(`Failed to save "${key}"`);
        } finally {
            setSavingKey(null);
        }
    }

    function isDirty(key: string) {
        const original = rows.find((r) => r.key === key)?.value ?? "";
        return edits[key] !== original;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Runtime configuration stored in the database
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchConfig} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading…
                </div>
            ) : rows.length === 0 ? (
                <p className="text-sm text-muted-foreground">No config rows found. Run the app_config.sql migration first.</p>
            ) : (
                <div className="rounded-xl border border-border bg-card divide-y divide-border">
                    {/* Header */}
                    <div className="grid grid-cols-[2fr_1fr_3fr_auto] gap-3 px-4 py-2 bg-muted/30">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key</span>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Updated</span>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value</span>
                        <span className="sr-only">Actions</span>
                    </div>

                    {rows.map((row) => {
                        const saving = savingKey === row.key;
                        const dirty = isDirty(row.key);
                        const isBoolean = isBooleanKey(row.key);
                        const selectOptions = getSelectOptions(row.key);

                        return (
                            <div key={row.key} className="grid grid-cols-[2fr_1fr_3fr_auto] items-center gap-3 px-4 py-3">
                                {/* Key + description */}
                                <div className="min-w-0">
                                    <p className="font-mono text-sm font-medium truncate">{row.key}</p>
                                    {row.description && (
                                        <p className="text-xs text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                                            {row.description}
                                        </p>
                                    )}
                                </div>

                                {/* Updated date */}
                                <p className="text-xs text-muted-foreground">
                                    {new Date(row.updated_at).toLocaleDateString()}
                                </p>

                                {/* Value input */}
                                {isBoolean ? (
                                    <Select
                                        value={edits[row.key] ?? ""}
                                        onValueChange={(val) =>
                                            setEdits((prev) => ({ ...prev, [row.key]: val }))
                                        }
                                    >
                                        <SelectTrigger className="h-8 text-sm font-mono w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">true</SelectItem>
                                            <SelectItem value="false">false</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : selectOptions ? (
                                    <Select
                                        value={edits[row.key] ?? ""}
                                        onValueChange={(val) =>
                                            setEdits((prev) => ({ ...prev, [row.key]: val }))
                                        }
                                    >
                                        <SelectTrigger className="h-8 text-sm font-mono">
                                            <SelectValue placeholder="Select a model…" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value} className="font-mono text-sm">
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        value={edits[row.key] ?? ""}
                                        onChange={(e) =>
                                            setEdits((prev) => ({ ...prev, [row.key]: e.target.value }))
                                        }
                                        className="font-mono text-sm h-8"
                                        placeholder="(empty = disabled)"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && dirty) handleSave(row.key);
                                        }}
                                    />
                                )}

                                {/* Save button */}
                                <Button
                                    size="sm"
                                    onClick={() => handleSave(row.key)}
                                    disabled={!dirty || saving}
                                    variant={dirty ? "default" : "outline"}
                                    className="h-8 px-3"
                                >
                                    {saving ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Save className="w-3.5 h-3.5" />
                                    )}
                                    <span className="sr-only">Save</span>
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
                <Settings className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-1 text-xs text-muted-foreground">
                    <p><span className="font-medium text-foreground">contact_followup_enabled</span> — Whether to generate AI follow-up suggestions (<code className="bg-muted px-1 rounded">true</code> / <code className="bg-muted px-1 rounded">false</code>).</p>
                    <p><span className="font-medium text-foreground">contact_followup_model</span> — OpenAI model for AI lead follow-ups. Choose from the dropdown (e.g. <code className="bg-muted px-1 rounded">gpt-4o-mini</code> for cost efficiency, <code className="bg-muted px-1 rounded">gpt-4o</code> or <code className="bg-muted px-1 rounded">gpt-5</code> for best quality).</p>
                    <p><span className="font-medium text-foreground">social_post_model</span> — OpenAI model used when generating social posts.</p>
                    <p><span className="font-medium text-foreground">image_generation_model</span> — Model used for AI image generation (e.g. <code className="bg-muted px-1 rounded">dall-e-3</code> or <code className="bg-muted px-1 rounded">gpt-image-1</code>).</p>
                    <p><span className="font-medium text-foreground">contact_followup_daily_limit</span> — Max AI calls per day (UTC). <code className="bg-muted px-1 rounded">0</code> = unlimited.</p>
                    <p><span className="font-medium text-foreground">contact_rate_limit_max</span> — Max contact form submissions allowed per IP within the time window.</p>
                    <p><span className="font-medium text-foreground">contact_rate_limit_window_minutes</span> — Rolling window in minutes for the contact form IP rate limit.</p>
                </div>
            </div>
        </div>
    );
}
