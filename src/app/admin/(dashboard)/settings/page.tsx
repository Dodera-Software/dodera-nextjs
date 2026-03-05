"use client";

import { useEffect, useState, useCallback } from "react";
import { Settings, Loader2, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { ConfigRow } from "@/types/admin";

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
                setRows(data.data);
                setEdits(Object.fromEntries(data.data.map((r: ConfigRow) => [r.key, r.value])));
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
                    {rows.map((row) => {
                        const saving = savingKey === row.key;
                        const dirty = isDirty(row.key);

                        return (
                            <div key={row.key} className="p-5 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-0.5 min-w-0">
                                        <p className="font-mono text-sm font-medium">{row.key}</p>
                                        {row.description && (
                                            <p className="text-xs text-muted-foreground">{row.description}</p>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground shrink-0 pt-0.5">
                                        Updated {new Date(row.updated_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Input
                                        value={edits[row.key] ?? ""}
                                        onChange={(e) =>
                                            setEdits((prev) => ({ ...prev, [row.key]: e.target.value }))
                                        }
                                        className="font-mono text-sm h-9 max-w-sm"
                                        placeholder="(empty = disabled)"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && dirty) handleSave(row.key);
                                        }}
                                    />

                                    <Button
                                        size="sm"
                                        onClick={() => handleSave(row.key)}
                                        disabled={!dirty || saving}
                                        variant={dirty ? "default" : "outline"}
                                    >
                                        {saving ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Save className="w-3.5 h-3.5" />
                                        )}
                                        Save
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-3">
                <Settings className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-1 text-xs text-muted-foreground">
                    <p><span className="font-medium text-foreground">contact_followup_enabled</span> — Whether to generate AI follow-up suggestions (<code className="bg-muted px-1 rounded">true</code> / <code className="bg-muted px-1 rounded">false</code>).</p>
                    <p><span className="font-medium text-foreground">contact_followup_model</span> — OpenAI model for AI lead follow-ups. Use <code className="bg-muted px-1 rounded">gpt-4o-mini</code> (cheap) or <code className="bg-muted px-1 rounded">gpt-4o</code> (best quality). Empty string disables the feature.</p>
                    <p><span className="font-medium text-foreground">contact_followup_daily_limit</span> — Max AI calls per day (UTC). <code className="bg-muted px-1 rounded">0</code> = unlimited.</p>
                    <p><span className="font-medium text-foreground">contact_rate_limit_max</span> — Max contact form submissions allowed per IP within the time window.</p>
                    <p><span className="font-medium text-foreground">contact_rate_limit_window_minutes</span> — Rolling window in minutes for the contact form IP rate limit.</p>
                </div>
            </div>
        </div>
    );
}
