"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Upload, FileText, X, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/ui/field-error";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".rtf", ".odt", ".txt"];
const ALLOWED_ACCEPT = [
    ".pdf", ".doc", ".docx", ".rtf", ".odt", ".txt",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/rtf", "text/rtf",
    "application/vnd.oasis.opendocument.text",
    "text/plain",
].join(",");

export interface ApplyJobInfo {
    id: number;
    title: string;
}

interface Props {
    job: ApplyJobInfo;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FieldErrors {
    full_name?: string;
    email?: string;
    cv?: string;
    gdpr_consent?: string;
}

export function ApplyModal({ job, open, onOpenChange }: Props) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [gdpr, setGdpr] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function reset() {
        setFullName("");
        setEmail("");
        setFile(null);
        setGdpr(false);
        setErrors({});
        setServerError(null);
        setSubmitting(false);
        setSubmitted(false);
        setDragging(false);
    }

    function handleOpenChange(val: boolean) {
        if (!val) reset();
        onOpenChange(val);
    }

    function handleFileSelect(selected: File | null) {
        if (!selected) return;
        const ext = selected.name.slice(selected.name.lastIndexOf(".")).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            setErrors((e) => ({ ...e, cv: "Only PDF, DOC, and DOCX files are accepted." }));
            return;
        }
        if (selected.size > MAX_FILE_SIZE) {
            setErrors((e) => ({ ...e, cv: "File must be smaller than 2 MB." }));
            return;
        }
        setFile(selected);
        setErrors((e) => ({ ...e, cv: undefined }));
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0] ?? null;
        handleFileSelect(dropped);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Client-side validation
        const newErrors: FieldErrors = {};
        if (!fullName.trim() || fullName.trim().length < 2) newErrors.full_name = "Full name is required.";
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = "A valid email is required.";
        if (!file) newErrors.cv = "Please upload your CV.";
        if (!gdpr) newErrors.gdpr_consent = "You must agree to the privacy policy.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setServerError(null);
        setSubmitting(true);

        try {
            const fd = new FormData();
            fd.append("job_id", String(job.id));
            fd.append("job_title", job.title);
            fd.append("full_name", fullName.trim());
            fd.append("email", email.trim());
            fd.append("gdpr_consent", "true");
            fd.append("cv", file!);

            const res = await fetch("/api/careers/apply", { method: "POST", body: fd });
            const data = await res.json();

            if (!res.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    setServerError(data.message ?? "Something went wrong. Please try again.");
                }
                return;
            }

            setSubmitted(true);
        } catch {
            setServerError("Network error. Please check your connection and try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Apply for {job.title}</DialogTitle>
                    <DialogDescription>
                        Fill in your details and upload your CV. We&apos;ll get back to you soon.
                    </DialogDescription>
                </DialogHeader>

                {submitted ? (
                    <div className="flex flex-col items-center gap-4 py-6 text-center">
                        <div className="flex size-14 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                            <CheckCircle2 className="size-7 text-emerald-600" />
                        </div>
                        <div>
                            <p className="font-semibold">Application submitted!</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Thank you, {fullName.split(" ")[0]}. We&apos;ll review your application and reach out if there&apos;s a good fit.
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => handleOpenChange(false)}>
                            Close
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        {/* Full name */}
                        <div className="space-y-1.5">
                            <label htmlFor="apply-name" className="text-sm font-medium">
                                Full Name <span className="text-destructive">*</span>
                            </label>
                            <Input
                                id="apply-name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Jane Doe"
                                maxLength={120}
                                aria-invalid={!!errors.full_name}
                            />
                            <FieldError message={errors.full_name} />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="apply-email" className="text-sm font-medium">
                                Email Address <span className="text-destructive">*</span>
                            </label>
                            <Input
                                id="apply-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                maxLength={254}
                                aria-invalid={!!errors.email}
                            />
                            <FieldError message={errors.email} />
                        </div>

                        {/* CV upload */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">
                                CV / Resume <span className="text-destructive">*</span>
                                <span className="ml-1 font-normal text-muted-foreground">(PDF, DOC, DOCX, RTF, ODT, TXT · max 2 MB)</span>
                            </label>

                            {file ? (
                                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
                                    <FileText className="size-5 shrink-0 text-primary" />
                                    <span className="flex-1 truncate text-sm">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="shrink-0 text-muted-foreground hover:text-foreground"
                                        aria-label="Remove file"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={handleDrop}
                                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${dragging
                                        ? "border-primary bg-primary/5"
                                        : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
                                        } ${errors.cv ? "border-destructive" : ""}`}
                                >
                                    <Upload className="size-6 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        <span className="font-medium text-foreground">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, RTF, ODT, TXT up to 2 MB</p>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={ALLOWED_ACCEPT}
                                className="hidden"
                                onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                            />
                            <FieldError message={errors.cv} />
                        </div>

                        {/* GDPR consent */}
                        <div className="space-y-1.5">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={gdpr}
                                    onChange={(e) => setGdpr(e.target.checked)}
                                    className="mt-0.5 size-4 shrink-0 accent-primary"
                                    aria-invalid={!!errors.gdpr_consent}
                                />
                                <span className="text-xs leading-relaxed text-muted-foreground">
                                    I have read and agree to the{" "}
                                    <Link
                                        href="/privacy-policy"
                                        target="_blank"
                                        className="text-primary underline underline-offset-2"
                                    >
                                        Privacy Policy
                                    </Link>
                                    . I consent to Dodera Software S.R.L. processing my personal data
                                    (including my CV) for recruitment purposes.
                                </span>
                            </label>
                            <FieldError message={errors.gdpr_consent} />
                        </div>

                        {serverError && (
                            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                <AlertCircle className="size-4 shrink-0" />
                                {serverError}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                                <Send className="mr-2 size-4" />
                            )}
                            {submitting ? "Submitting…" : "Submit Application"}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
