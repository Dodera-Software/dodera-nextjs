"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { EditorRef } from "react-email-editor";
import { Save, Loader2, RotateCcw, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

/* Unlayer editor - client-only (needs window / iframe) */
const EmailEditor = dynamic(
    () => import("react-email-editor"),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center" style={{ height: 640 }}>
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        ),
    },
);

type UnlayerDesign = Record<string, unknown>;

export default function WelcomeEmailPage() {
    const [subject, setSubject] = useState("");
    const [saving, setSaving] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const editorRef = useRef<EditorRef>(null);
    /* Holds a design that arrived before the editor iframe was ready */
    const pendingDesign = useRef<UnlayerDesign | null>(null);

    /* ── Load template from API ────────────────────────────────── */
    const fetchTemplate = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/welcome-email-template");
            const data = await res.json();
            if (data.status !== "success") throw new Error("Failed to load template");

            setSubject(data.subject ?? "");

            if (data.design) {
                const design: UnlayerDesign =
                    typeof data.design === "string" ? JSON.parse(data.design) : data.design;
                /* If the editor iframe is ready, load immediately; otherwise queue */
                if (editorRef.current?.editor) {
                    editorRef.current.editor.loadDesign(design);
                } else {
                    pendingDesign.current = design;
                }
            }
        } catch {
            toast.error("Failed to load welcome email template.");
        }
    }, []);

    useEffect(() => {
        fetchTemplate();
    }, [fetchTemplate]);

    /* ── Called by Unlayer when the iframe editor is ready ─────── */
    const onReady = useCallback(() => {
        setEditorReady(true);
        if (pendingDesign.current && editorRef.current?.editor) {
            editorRef.current.editor.loadDesign(pendingDesign.current);
            pendingDesign.current = null;
        }
    }, []);

    /* ── Save ──────────────────────────────────────────────────── */
    const handleSave = useCallback(() => {
        if (!subject.trim()) {
            toast.error("Subject line is required.");
            return;
        }
        if (!editorRef.current?.editor) {
            toast.error("Editor not ready.");
            return;
        }

        setSaving(true);
        editorRef.current.editor.exportHtml(async ({ design, html }: { design: UnlayerDesign; html: string }) => {
            try {
                const res = await fetch("/api/admin/welcome-email-template", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        subject: subject.trim(),
                        html,
                        design: JSON.stringify(design),
                    }),
                });
                const data = await res.json();
                if (data.status !== "success") throw new Error(data.message ?? "Save failed");
                toast.success("Welcome email template saved!");
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to save template.");
            } finally {
                setSaving(false);
            }
        });
    }, [subject]);

    /* ── Reset: reload design from DB ─────────────────────────── */
    const handleReset = useCallback(async () => {
        await fetchTemplate();
        toast.info("Template reloaded from database.");
    }, [fetchTemplate]);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Welcome Email"
                subtitle="Edit the automated email sent to new newsletter subscribers"
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            disabled={saving}
                        >
                            <RotateCcw className="w-4 h-4 mr-1.5" />Reset
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={saving || !editorReady}
                        >
                            {saving
                                ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                : <Save className="w-4 h-4 mr-1.5" />}
                            Save Template
                        </Button>
                    </div>
                }
            />

            {/* Info banner */}
            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                <MailCheck className="w-4 h-4 mt-0.5 shrink-0 text-foreground/60" />
                <p>
                    This email is automatically sent to new subscribers (only for first-time subscriptions).
                    An unsubscribe link is appended automatically when the email is sent.
                </p>
            </div>

            {/* Subject */}
            <div className="space-y-2">
                <Label htmlFor="welcome-subject">Subject Line</Label>
                <Input
                    id="welcome-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Welcome to the Dodera newsletter!"
                    className="max-w-xl"
                />
            </div>

            {/* Unlayer drag-and-drop editor */}
            <div className="space-y-2">
                <Label>Email Body</Label>
                <div className="rounded-lg border border-border overflow-hidden">
                    <EmailEditor
                        ref={editorRef}
                        onReady={onReady}
                        minHeight="640px"
                        options={{
                            features: {
                                devTab: false,
                            },
                        }}
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    Drag and drop blocks to build your email. An unsubscribe footer is appended automatically when sent.
                </p>
            </div>
        </div>
    );
}


