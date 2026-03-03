"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Send,
    Loader2,
    Paperclip,
    X,
    Users,
    UserCheck,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Link as LinkIcon,
    Undo,
    Redo,
    CheckCircle2,
    AlertCircle,
    WifiIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AttachedFile {
    file: File;
    id: string;
}

interface SendResult {
    totalRecipients: number;
    accepted: number;
    rejected: number;
    errors: string[];
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

function ToolbarButton({
    active,
    disabled,
    onClick,
    title,
    children,
}: {
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            title={title}
            disabled={disabled}
            onClick={onClick}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors disabled:opacity-40 ${active
                ? "bg-accent text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <div className="w-px h-6 bg-border mx-1" />;
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
    const setLink = useCallback(() => {
        if (!editor) return;
        const prev = editor.getAttributes("link").href as string | undefined;
        const url = window.prompt("URL", prev ?? "https://");
        if (url === null) return;
        if (!url) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/40">
            {/* History */}
            <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                <Undo className="w-[18px] h-[18px]" />
            </ToolbarButton>
            <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                <Redo className="w-[18px] h-[18px]" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Headings + paragraph */}
            <ToolbarButton title="Paragraph" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
                <span className="text-sm font-semibold leading-none">P</span>
            </ToolbarButton>
            <ToolbarButton title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                <span className="text-sm font-semibold leading-none">H1</span>
            </ToolbarButton>
            <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <span className="text-sm font-semibold leading-none">H2</span>
            </ToolbarButton>
            <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                <span className="text-sm font-semibold leading-none">H3</span>
            </ToolbarButton>

            <ToolbarDivider />

            {/* Inline marks */}
            <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
                <span className="text-sm font-bold leading-none">B</span>
            </ToolbarButton>
            <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <span className="text-sm italic leading-none">I</span>
            </ToolbarButton>
            <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <span className="text-sm underline leading-none">U</span>
            </ToolbarButton>
            <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
                <span className="text-sm line-through leading-none">S</span>
            </ToolbarButton>
            <ToolbarButton title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
                <span className="text-sm font-mono leading-none">&lt;/&gt;</span>
            </ToolbarButton>

            <ToolbarDivider />

            {/* Alignment */}
            <ToolbarButton title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                <AlignLeft className="w-[18px] h-[18px]" />
            </ToolbarButton>
            <ToolbarButton title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                <AlignCenter className="w-[18px] h-[18px]" />
            </ToolbarButton>
            <ToolbarButton title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                <AlignRight className="w-[18px] h-[18px]" />
            </ToolbarButton>
            <ToolbarButton title="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
                <AlignJustify className="w-[18px] h-[18px]" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Lists */}
            <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <List className="w-[18px] h-[18px]" />
            </ToolbarButton>
            <ToolbarButton title="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className="w-[18px] h-[18px]" />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Link */}
            <ToolbarButton title="Set link" active={editor.isActive("link")} onClick={setLink}>
                <LinkIcon className="w-[18px] h-[18px]" />
            </ToolbarButton>

        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SendEmailPage() {
    const [recipientMode, setRecipientMode] = useState<"all" | "custom">("all");
    const [customEmails, setCustomEmails] = useState("");
    const [subject, setSubject] = useState("");
    const [attachments, setAttachments] = useState<AttachedFile[]>([]);
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState<SendResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [smtpStatus, setSmtpStatus] = useState<"idle" | "checking" | "ok" | "fail">("idle");
    const [smtpError, setSmtpError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Placeholder.configure({ placeholder: "Write your email message here…" }),
        ],
        content: "",
        editorProps: {
            attributes: {
                class: "tiptap-editor prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4",
            },
        },
    });

    // ── SMTP verify ────────────────────────────────────────
    const checkSmtp = useCallback(async () => {
        setSmtpStatus("checking");
        setSmtpError(null);
        try {
            const res = await fetch("/api/admin/send-email?action=verify");
            const data = await res.json();
            if (data.ok) {
                setSmtpStatus("ok");
            } else {
                setSmtpStatus("fail");
                setSmtpError(data.error ?? "Connection failed");
            }
        } catch {
            setSmtpStatus("fail");
            setSmtpError("Network error");
        }
    }, []);

    useEffect(() => {
        checkSmtp();
    }, [checkSmtp]);

    // ── Attachments ────────────────────────────────────────
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        setAttachments((prev) => [
            ...prev,
            ...files.map((f) => ({ file: f, id: `${f.name}-${Date.now()}-${Math.random()}` })),
        ]);
        e.target.value = "";
    }

    function removeAttachment(id: string) {
        setAttachments((prev) => prev.filter((a) => a.id !== id));
    }

    // ── Send ───────────────────────────────────────────────
    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!editor) return;

        const html = editor.getHTML();
        if (!html || html === "<p></p>") {
            setError("Email body is empty.");
            return;
        }

        const to = recipientMode === "all" ? "all" : customEmails.trim();
        if (!to) {
            setError("Please enter at least one recipient email.");
            return;
        }
        if (!subject.trim()) {
            setError("Subject is required.");
            return;
        }

        setError(null);
        setResult(null);
        setSending(true);

        try {
            const form = new FormData();
            form.append("to", to);
            form.append("subject", subject.trim());
            form.append("html", html);
            attachments.forEach((a) => form.append("files[]", a.file));

            const res = await fetch("/api/admin/send-email", {
                method: "POST",
                body: form,
            });

            const data = await res.json();

            if (data.status === "success") {
                setResult(data.data as SendResult);
                // Reset editor
                editor.commands.setContent("");
                setSubject("");
                setAttachments([]);
                if (recipientMode === "custom") setCustomEmails("");
            } else {
                setError(data.message ?? "Failed to send.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSending(false);
        }
    }

    // ── File size display ──────────────────────────────────
    function formatSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Send Email</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Compose and send rich HTML emails to subscribers
                    </p>
                </div>

                {/* SMTP Status */}
                <div className="flex items-center gap-2">
                    {smtpStatus === "checking" && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Checking SMTP…
                        </span>
                    )}
                    {smtpStatus === "ok" && (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-500">
                            <WifiIcon className="w-3.5 h-3.5" />
                            SMTP connected
                        </span>
                    )}
                    {smtpStatus === "fail" && (
                        <span
                            className="flex items-center gap-1.5 text-xs text-destructive cursor-pointer"
                            title={smtpError ?? ""}
                            onClick={checkSmtp}
                        >
                            <AlertCircle className="w-3.5 h-3.5" />
                            SMTP error – retry
                        </span>
                    )}
                </div>
            </div>

            {/* Result banner */}
            {result && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-medium">Email sent!</p>
                        <p className="text-sm text-emerald-300 mt-0.5">
                            {result.accepted} / {result.totalRecipients} delivered
                            {result.rejected > 0 && `, ${result.rejected} rejected`}
                        </p>
                        {result.errors.length > 0 && (
                            <ul className="mt-1 space-y-0.5 text-xs text-emerald-400/70">
                                {result.errors.map((e, i) => (
                                    <li key={i}>• {e}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* Error banner */}
            {error && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Compose form */}
            <form onSubmit={handleSend} className="space-y-5">
                {/* Recipients */}
                <div className="space-y-3">
                    <Label>Recipients</Label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setRecipientMode("all")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${recipientMode === "all"
                                ? "bg-primary/10 border-primary/40 text-primary"
                                : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            All Subscribers
                        </button>
                        <button
                            type="button"
                            onClick={() => setRecipientMode("custom")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${recipientMode === "custom"
                                ? "bg-primary/10 border-primary/40 text-primary"
                                : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                                }`}
                        >
                            <UserCheck className="w-4 h-4" />
                            Specific Emails
                        </button>
                    </div>

                    {recipientMode === "custom" && (
                        <div>
                            <Input
                                placeholder="email@example.com, another@example.com"
                                value={customEmails}
                                onChange={(e) => setCustomEmails(e.target.value)}
                                className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Separate multiple addresses with commas
                            </p>
                        </div>
                    )}
                </div>

                {/* Subject */}
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        placeholder="Your email subject…"
                        value={subject}
                        required
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>

                {/* Rich editor */}
                <div className="space-y-2">
                    <Label>Body</Label>
                    <div className="border border-border rounded-lg overflow-hidden bg-background">
                        <EditorToolbar editor={editor} />
                        <EditorContent editor={editor} />
                    </div>
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                    <Label>Attachments</Label>
                    <div
                        className="border border-dashed border-border rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                        onClick={() => fileRef.current?.click()}
                    >
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            Click to attach files
                        </span>
                        <input
                            ref={fileRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {attachments.length > 0 && (
                        <ul className="space-y-1.5">
                            {attachments.map((a) => (
                                <li
                                    key={a.id}
                                    className="flex items-center justify-between px-3 py-2 rounded-md bg-muted text-sm"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Paperclip className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                        <span className="truncate">{a.file.name}</span>
                                        <span className="text-muted-foreground shrink-0">
                                            ({formatSize(a.file.size)})
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(a.id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        Sent from: <span className="font-mono">news@doderasoft.com</span> via Zoho SMTP
                    </p>
                    <Button type="submit" disabled={sending || smtpStatus === "checking"} className="gap-2">
                        {sending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending…
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Send Email
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
