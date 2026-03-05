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
    AlertCircle,
    WifiIcon,
    BookOpen,
    Search,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import type { BlogPostSummary, AttachedFile, BulkSendResult } from "@/types/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EditorToolbar } from "./EditorToolbar";

export default function SendEmailPage() {
    const [recipientMode, setRecipientMode] = useState<"all" | "custom">("all");
    const [customEmails, setCustomEmails] = useState("");
    const [subject, setSubject] = useState("");
    const [attachments, setAttachments] = useState<AttachedFile[]>([]);
    const confirm = useConfirm();
    const [sending, setSending] = useState(false);
    const [smtpStatus, setSmtpStatus] = useState<"idle" | "checking" | "ok" | "fail">("idle");
    const [smtpError, setSmtpError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // ── Blog post picker ───────────────────────────────────
    const [showBlogPicker, setShowBlogPicker] = useState(false);
    const [blogPosts, setBlogPosts] = useState<BlogPostSummary[]>([]);
    const [blogPostsLoading, setBlogPostsLoading] = useState(false);
    const [blogSearch, setBlogSearch] = useState("");
    const [blogPostsError, setBlogPostsError] = useState<string | null>(null);

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

    // ── Blog posts fetch ────────────────────────────────────
    const fetchBlogPosts = useCallback(async () => {
        if (blogPosts.length > 0) return; // already loaded
        setBlogPostsLoading(true);
        setBlogPostsError(null);
        try {
            const res = await fetch("/api/admin/blog-posts");
            const data = await res.json();
            if (data.status === "success") {
                setBlogPosts(data.posts);
            } else {
                setBlogPostsError(data.message ?? "Failed to load posts.");
            }
        } catch {
            setBlogPostsError("Network error.");
        } finally {
            setBlogPostsLoading(false);
        }
    }, [blogPosts.length]);

    function toggleBlogPicker() {
        const next = !showBlogPicker;
        setShowBlogPicker(next);
        if (next) fetchBlogPosts();
    }

    function applyBlogPost(post: BlogPostSummary) {
        if (!editor) return;
        setSubject(`New Post: ${post.title}`);
        const siteOrigin = "https://doderasoft.com";
        const readMoreUrl = `${siteOrigin}/blog/${post.slug}`;
        const html = [
            `<p>Hey there,</p>`,
            `<p>We just published a new article and we think you'll find it really valuable:</p>`,
            `<h2>${post.title}</h2>`,
            `<p>${post.excerpt}</p>`,
            `<p><a href="${readMoreUrl}">Read the full article →</a></p>`,
            `<p>Happy reading!<br/>The Dodera Team</p>`,
        ].join("\n");
        editor.commands.setContent(html);
        setShowBlogPicker(false);
        setBlogSearch("");
    }

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
            toast.error("Email body is empty.");
            return;
        }

        const to = recipientMode === "all" ? "all" : customEmails.trim();
        if (!to) {
            toast.error("Please enter at least one recipient email.");
            return;
        }
        if (!subject.trim()) {
            toast.error("Subject is required.");
            return;
        }

        const ok = await confirm({
            title: "Send email",
            description:
                recipientMode === "all"
                    ? `Send "${subject}" to all subscribers? This cannot be undone.`
                    : `Send "${subject}" to ${customEmails.trim()}? This cannot be undone.`,
            confirmLabel: "Send",
            variant: "default",
        });
        if (ok) doSend();
    }

    async function doSend() {
        if (!editor) return;
        const html = editor.getHTML();
        const to = recipientMode === "all" ? "all" : customEmails.trim();
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
                const r = data.data as BulkSendResult;
                const description = `${r.accepted} / ${r.totalRecipients} delivered${r.rejected > 0 ? `, ${r.rejected} rejected` : ""
                    }`;
                toast.success("Email sent!", { description });
                // Reset editor
                editor.commands.setContent("");
                setSubject("");
                setAttachments([]);
                if (recipientMode === "custom") setCustomEmails("");
            } else {
                toast.error(data.message ?? "Failed to send.");
            }
        } catch {
            toast.error("Network error. Please try again.");
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
        <div className="space-y-6">
            <AdminPageHeader
                title="Send Email"
                subtitle="Compose and send rich HTML emails to subscribers"
                actions={
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
                }
            />

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
                    <div className="flex items-center justify-between">
                        <Label>Body</Label>
                        <button
                            type="button"
                            onClick={toggleBlogPicker}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-rose-500/50 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:border-rose-500 hover:text-white transition-colors font-medium"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            Load from Blog Post
                            {showBlogPicker ? (
                                <ChevronUp className="w-3 h-3 ml-0.5" />
                            ) : (
                                <ChevronDown className="w-3 h-3 ml-0.5" />
                            )}
                        </button>
                    </div>

                    {/* Blog post picker panel */}
                    {showBlogPicker && (
                        <div className="border border-border rounded-lg bg-background overflow-hidden">
                            <div className="p-3 border-b border-border bg-muted/30">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search blog posts…"
                                        value={blogSearch}
                                        onChange={(e) => setBlogSearch(e.target.value)}
                                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                                    />
                                </div>
                            </div>

                            <div className="max-h-64 overflow-y-auto divide-y divide-border">
                                {blogPostsLoading && (
                                    <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Loading posts…
                                    </div>
                                )}

                                {blogPostsError && (
                                    <div className="flex items-center gap-2 p-4 text-sm text-destructive">
                                        <AlertCircle className="w-4 h-4" />
                                        {blogPostsError}
                                    </div>
                                )}

                                {!blogPostsLoading && !blogPostsError && blogPosts.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No blog posts found.
                                    </p>
                                )}

                                {!blogPostsLoading &&
                                    blogPosts
                                        .filter((p) =>
                                            blogSearch.trim() === "" ||
                                            p.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
                                            p.category.toLowerCase().includes(blogSearch.toLowerCase())
                                        )
                                        .map((post) => (
                                            <button
                                                key={post.slug}
                                                type="button"
                                                onClick={() => applyBlogPost(post)}
                                                className="w-full text-left px-4 py-3 hover:bg-accent transition-colors group"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium truncate group-hover:text-foreground">
                                                            {post.title}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                                            {post.excerpt}
                                                        </p>
                                                    </div>
                                                    <span className="shrink-0 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full whitespace-nowrap">
                                                        {post.category}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                            </div>
                        </div>
                    )}

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
