"use client";

import { useCallback, useEffect, useState } from "react";
import { BrainCircuit, KeyRound, Loader2, Save, Send, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IntelilangSettings } from "@/types/admin";

/**
 * Where mockup deployments are sent in InteliLang. The address is shown as saved; the
 * secret is write-only: once stored (encrypted) only its last four characters come back.
 */
export function IntelilangSettingsCard() {
    const [settings, setSettings] = useState<IntelilangSettings | null>(null);
    const [url, setUrl] = useState("");
    const [secret, setSecret] = useState("");
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);

    const load = useCallback(async () => {
        const res = await fetch("/api/admin/intelilang");
        const body = await res.json().catch(() => null);
        if (body?.status === "success") {
            setSettings(body.data);
            setUrl(body.data.url);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const dirty = settings !== null && (url.trim() !== settings.url || secret.trim() !== "");

    async function save() {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/intelilang", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim(), secret: secret.trim() || undefined }),
            });
            const body = await res.json().catch(() => null);
            if (body?.status === "success") {
                setSettings(body.data);
                setUrl(body.data.url);
                setSecret("");
                toast.success(body.message);
            } else {
                toast.error(body?.message ?? "Failed to save the InteliLang settings.");
            }
        } finally {
            setSaving(false);
        }
    }

    async function test() {
        setTesting(true);
        try {
            const res = await fetch("/api/admin/intelilang/test", { method: "POST" });
            const body = await res.json().catch(() => null);
            if (body?.status === "success") toast.success(body.message);
            else toast.error(body?.message ?? "The test message couldn't be sent.");
        } finally {
            setTesting(false);
        }
    }

    return (
        <section className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BrainCircuit className="w-4 h-4 text-primary" />
                </div>
                <div>
                    <h2 className="font-medium text-sm">InteliLang</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Mockup deployments with &ldquo;Send to InteliLang&rdquo; ticked go to one InteliLang project, so its
                        chat knows what went live where. In InteliLang: Sources → Add a source → &ldquo;Another app
                        (webhook)&rdquo;, then paste its address and secret here.
                    </p>
                </div>
            </div>

            {!settings ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading…
                </div>
            ) : (
                <>
                    {!settings.can_store_secret && (
                        <p className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-600">
                            <ShieldAlert className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            The server has no APP_ENCRYPTION_KEY, so a secret can&apos;t be stored safely yet. Add it to the
                            environment (openssl rand -base64 32) and redeploy.
                        </p>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="intelilang-url" className="text-xs">Webhook address</Label>
                            <Input
                                id="intelilang-url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://intelilang.com/api/webhooks/incoming/…"
                                className="font-mono text-xs h-9"
                                autoComplete="off"
                            />
                            <p className="text-xs text-muted-foreground">Empty turns sending off.</p>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="intelilang-secret" className="text-xs">Signing secret</Label>
                            <Input
                                id="intelilang-secret"
                                type="password"
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                placeholder={settings.secret_set ? "Paste a new secret to replace it" : "whsec_…"}
                                className="font-mono text-xs h-9"
                                autoComplete="new-password"
                                disabled={!settings.can_store_secret}
                            />
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <KeyRound className="w-3 h-3" />
                                {settings.secret_set
                                    ? <>Stored encrypted, ends in <span className="font-mono">••••{settings.secret_tail}</span>. It is never shown again.</>
                                    : "Not set. Stored encrypted and never shown again."}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button size="sm" onClick={save} disabled={!dirty || saving}>
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={test} disabled={!settings.configured || dirty || testing}>
                            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            Send a test
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            {settings.configured ? "Connected: deployments can be sent." : "Not connected yet."}
                        </span>
                    </div>
                </>
            )}
        </section>
    );
}
