import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { EMAIL_RE } from "@/lib/validation";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/rtf",
    "text/rtf",
    "application/vnd.oasis.opendocument.text",
    "text/plain",
]);
const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx", ".rtf", ".odt", ".txt"]);

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    const { limited } = await checkRateLimit("apply", ip);
    if (limited) {
        return NextResponse.json(
            { status: "error", message: "Too many applications submitted. Please try again later." },
            { status: 429 },
        );
    }

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json({ status: "error", message: "Invalid form data." }, { status: 400 });
    }

    const jobId = formData.get("job_id") as string | null;
    const jobTitle = ((formData.get("job_title") as string | null) ?? "").trim();
    const fullName = ((formData.get("full_name") as string | null) ?? "").trim();
    const email = ((formData.get("email") as string | null) ?? "").trim();
    const gdpr = formData.get("gdpr_consent");
    const file = formData.get("cv") as File | null;

    // Validate inputs
    const errors: Record<string, string> = {};

    if (!fullName || fullName.length < 2 || fullName.length > 120) {
        errors.full_name = "Full name is required (2–120 characters).";
    }
    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
        errors.email = "A valid email address is required.";
    }
    if (gdpr !== "true") {
        errors.gdpr_consent = "You must agree to the privacy policy to submit your application.";
    }
    if (!jobTitle) {
        errors.job_title = "Job title is missing.";
    }

    if (!file || file.size === 0) {
        errors.cv = "Please upload your CV.";
    } else if (file.size > MAX_FILE_SIZE) {
        errors.cv = "File must be smaller than 2 MB.";
    } else {
        const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_TYPES.has(file.type)) {
            errors.cv = "Only PDF, DOC, and DOCX files are accepted.";
        }
    }

    if (Object.keys(errors).length > 0) {
        return NextResponse.json({ status: "error", errors }, { status: 422 });
    }

    // Build storage path
    const ext = file!.name.slice(file!.name.lastIndexOf(".")).toLowerCase();
    const safeName = fullName.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 40);
    const folder = jobId ? String(Number(jobId)) : "general";
    const storagePath = `${folder}/${Date.now()}-${safeName}${ext}`;

    // Determine content type — multipart upload sometimes sends empty string
    const MIME_BY_EXT: Record<string, string> = {
        ".pdf": "application/pdf",
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".rtf": "application/rtf",
        ".odt": "application/vnd.oasis.opendocument.text",
        ".txt": "text/plain",
    };
    const contentType = file!.type || MIME_BY_EXT[ext] || "application/octet-stream";

    // Upload CV to Supabase Storage (private bucket "cvs")
    const fileBuffer = Buffer.from(await file!.arrayBuffer());
    const { error: storageError } = await supabase.storage
        .from("cvs")
        .upload(storagePath, fileBuffer, {
            contentType,
            upsert: false,
        });

    if (storageError) {
        console.error("CV upload error:", storageError.message, storageError);
        return NextResponse.json(
            { status: "error", message: `Storage error: ${storageError.message}` },
            { status: 500 },
        );
    }

    // Insert application record
    const { error: dbError } = await supabase.from("job_applications").insert({
        job_id: jobId ? Number(jobId) : null,
        job_title: jobTitle,
        full_name: fullName,
        email,
        cv_path: storagePath,
        gdpr_consent: true,
    });

    if (dbError) {
        console.error("Application insert error:", dbError);
        // Best-effort rollback: remove the uploaded file
        await supabase.storage.from("cvs").remove([storagePath]);
        return NextResponse.json(
            { status: "error", message: "Failed to submit application. Please try again." },
            { status: 500 },
        );
    }

    return NextResponse.json({ status: "success" }, { status: 201 });
}
