"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Save, Loader2, Eye, EyeOff, Code2, Pencil, MailCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EditorToolbar } from "@/app/admin/(dashboard)/send-email/EditorToolbar";

/* ─── Default fallback (only shown if DB has no value yet) ─── */
const DEFAULT_SUBJECT = "Welcome to the Dodera newsletter! 🎉";
const DEFAULT_HTML =
    '<h2 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;">Welcome aboard! 🎉</h2>' +
    '<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Thank you for subscribing to the <strong>Dodera Software</strong> newsletter. We\'re excited to have you!</p>' +
    '<p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">— The Dodera Team</p>';

type EditorMode = "visual" | "html";

export default function WelcomeEmailPage() {
    const [subject, setSubject] = useState("");
    const [rawHtml, setRawHtml] = useState("");
    const [mode, setMode] = useState<EditorMode>("visual");
    const [showPreview, setShowPreview] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    /* ── TipTap editor ─────────────────────────────────────────── */
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Placeholder.configure({ placeholder: "Write your welcome email body here…" }),
            Image.configure({ inline: false, HTMLAttributes: { style: "max-width:100%;height:auto;" } }),
        ],
        content: "",
        editorProps: {
            attributes: {
                class: "tiptap-editor prose prose-sm max-w-none focus:outline-none min-h-[320px] p-4",
            },
        },
        onUpdate: ({ editor }) => {
            setRawHtml(editor.getHTML());
        },
    });

    /* ── Load config from API ──────────────────────────────────── */
    const fetchTemplate = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/config");
            const data = await res.json();
            if (data.status !== "success") throw new Error("Failed to load config");

            const rows: { key: string; value: string }[] = data.data;
            const subjRow = rows.find((r) => r.key === "welcome_email_subject");
            const htmlRow = rows.find((r) => r.key === "welcome_email_html");

            const subjectVal = subjRow?.value ?? DEFAULT_SUBJECT;
            const htmlVal = htmlRow?.value ?? DEFAULT_HTML;

            setSubject(subjectVal);
            setRawHtml(htmlVal);
            editor?.commands.setContent(htmlVal);
        } catch {
            toast.error("Failed to load welcome email template.");
        } finally {
            setLoading(false);
        }
    }, [editor]);

    useEffect(() => {
        if (editor) fetchTemplate();
    }, [editor, fetchTemplate]);

    /* ── Mode switching ────────────────────────────────────────── */
    function switchToHtml() {
        if (editor) setRawHtml(editor.getHTML());
        setMode("html");
        setShowPreview(false);
    }

    function switchToVisual() {
        if (editor) editor.commands.setContent(rawHtml);
        setMode("visual");
        setShowPreview(false);
    }

    /* ── Preview ───────────────────────────────────────────────── */
    const currentHtml = mode === "visual" ? (editor?.getHTML() ?? rawHtml) : rawHtml;

    const previewDocument = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;
                      border:1px solid #e5e7eb;padding:32px 40px;">
          <tr>
            <td>
              ${currentHtml}
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;border-top:1px solid #e5e7eb;">
                <tr>
                  <td align="center" style="padding:20px 16px 24px;font-family:Arial,sans-serif;font-size:12px;color:#9ca3af;">
                    <p style="margin:0 0 6px;">You're receiving this email because you subscribed to the <strong style="color:#6b7280;">Dodera Software</strong> newsletter.</p>
                    <p style="margin:0;">Don't want to receive these emails?&nbsp;<a href="#" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    function togglePreview() {
        setShowPreview((v) => !v);
    }

    useEffect(() => {
        if (showPreview && iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();
                doc.write(previewDocument);
                doc.close();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showPreview, currentHtml]);

    /* ── Save ──────────────────────────────────────────────────── */
    async function handleSave() {
        if (!subject.trim()) {
            toast.error("Subject line is required.");
            return;
        }
        const html = mode === "visual" ? (editor?.getHTML() ?? rawHtml) : rawHtml;
        if (!html || html === "<p></p>") {
            toast.error("Email body is empty.");
            return;
        }

        setSaving(true);
        try {
            const [subjectRes, htmlRes] = await Promise.all([
                fetch("/api/admin/config", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ key: "welcome_email_subject", value: subject.trim() }),
                }),
                fetch("/api/admin/config", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ key: "welcome_email_html", value: html }),
                }),
            ]);

            if (!subjectRes.ok || !htmlRes.ok) {
                throw new Error("Save failed");
            }
            toast.success("Welcome email template saved!");
        } catch {
            toast.error("Failed to save template. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    /* ── Reset to defaults ─────────────────────────────────────── */
    function handleReset() {
        setSubject(DEFAULT_SUBJECT);
        setRawHtml(DEFAULT_HTML);
        editor?.commands.setContent(DEFAULT_HTML);
        toast.info("Reset to default template. Save to apply.");
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

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
                            onClick={togglePreview}
                        >
                            {showPreview ? (
                                <><EyeOff className="w-4 h-4 mr-1.5" />Hide Preview</>
                            ) : (
                                <><Eye className="w-4 h-4 mr-1.5" />Preview</>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            title="Reset to default template"
                        >
                            <RotateCcw className="w-4 h-4 mr-1.5" />Reset
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={saving}>
                            {saving ? (
                                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-1.5" />
                            )}
                            Save Template
                        </Button>
                    </div>
                }
            />

            {/* Info banner */}
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40 px-4 py-3 text-sm text-blue-800 dark:text-blue-300">
                <MailCheck className="w-4 h-4 mt-0.5 shrink-0" />
                <p>
                    This email is automatically sent to new subscribers (only for first-time subscriptions).
                    An unsubscribe link is appended automatically.
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

            {/* Editor */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Email Body</Label>
                    {/* Mode toggle */}
                    <div className="flex items-center gap-1 rounded-md border border-border p-0.5 text-xs">
                        <button
                            type="button"
                            onClick={switchToVisual}
                            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${mode === "visual"
                                ? "bg-accent text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Pencil className="w-3 h-3" />
                            Visual
                        </button>
                        <button
                            type="button"
                            onClick={switchToHtml}
                            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${mode === "html"
                                ? "bg-accent text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Code2 className="w-3 h-3" />
                            HTML
                        </button>
                    </div>
                </div>

                <div className="rounded-lg border border-border overflow-hidden">
                    {mode === "visual" ? (
                        <>
                            <EditorToolbar editor={editor} />
                            <EditorContent editor={editor} />
                        </>
                    ) : (
                        <textarea
                            value={rawHtml}
                            onChange={(e) => setRawHtml(e.target.value)}
                            spellCheck={false}
                            className="w-full min-h-[380px] p-4 bg-background text-foreground font-mono text-sm resize-y focus:outline-none"
                            placeholder="<p>Your HTML here…</p>"
                        />
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    Write the body of the email. An unsubscribe footer is appended automatically when the email is sent.
                </p>
            </div>

            {/* Preview */}
            {showPreview && (
                <div className="space-y-2">
                    <Label>Email Preview</Label>
                    <div className="rounded-lg border border-border overflow-hidden">
                        <iframe
                            ref={iframeRef}
                            title="Welcome email preview"
                            sandbox="allow-same-origin"
                            className="w-full"
                            style={{ height: "600px", border: "none" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
