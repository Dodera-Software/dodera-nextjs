import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

const ALLOWED_STATUSES = ["open", "closed", "draft"] as const;
const ALLOWED_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;

export async function GET() {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    const { data, error } = await supabase
        .from("job_openings")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching job openings:", error);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch job openings." },
            { status: 500 },
        );
    }

    return NextResponse.json({ status: "success", data });
}

export async function POST(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    const body = await request.json();
    const { title, department, location, type, status, description, apply_url, sort_order } = body;

    if (!title?.trim()) {
        return NextResponse.json(
            { status: "error", message: "Title is required." },
            { status: 400 },
        );
    }

    if (status && !ALLOWED_STATUSES.includes(status)) {
        return NextResponse.json(
            { status: "error", message: "Invalid status." },
            { status: 400 },
        );
    }

    if (type && !ALLOWED_TYPES.includes(type)) {
        return NextResponse.json(
            { status: "error", message: "Invalid type." },
            { status: 400 },
        );
    }

    const { data, error } = await supabase
        .from("job_openings")
        .insert({
            title: title.trim(),
            department: department?.trim() || null,
            location: location?.trim() || "Remote",
            type: type || "Full-time",
            status: status || "open",
            description: description?.trim() || null,
            apply_url: apply_url?.trim() || null,
            sort_order: sort_order ?? 0,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating job opening:", error);
        return NextResponse.json(
            { status: "error", message: "Failed to create job opening." },
            { status: 500 },
        );
    }

    return NextResponse.json({ status: "success", data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
        return NextResponse.json(
            { status: "error", message: "Job opening ID is required." },
            { status: 400 },
        );
    }

    if (fields.status && !ALLOWED_STATUSES.includes(fields.status)) {
        return NextResponse.json(
            { status: "error", message: "Invalid status." },
            { status: 400 },
        );
    }

    if (fields.type && !ALLOWED_TYPES.includes(fields.type)) {
        return NextResponse.json(
            { status: "error", message: "Invalid type." },
            { status: 400 },
        );
    }

    const allowedFields = ["title", "department", "location", "type", "status", "description", "apply_url", "sort_order"];
    const updatePayload: Record<string, unknown> = {};
    for (const key of allowedFields) {
        if (key in fields) {
            updatePayload[key] = fields[key];
        }
    }

    if (Object.keys(updatePayload).length === 0) {
        return NextResponse.json(
            { status: "error", message: "No valid fields to update." },
            { status: 400 },
        );
    }

    const { data, error } = await supabase
        .from("job_openings")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating job opening:", error);
        return NextResponse.json(
            { status: "error", message: "Failed to update job opening." },
            { status: 500 },
        );
    }

    return NextResponse.json({ status: "success", data });
}

export async function DELETE(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    const { id } = await request.json();
    if (!id) {
        return NextResponse.json(
            { status: "error", message: "Job opening ID is required." },
            { status: 400 },
        );
    }

    const { error } = await supabase.from("job_openings").delete().eq("id", id);

    if (error) {
        console.error("Error deleting job opening:", error);
        return NextResponse.json(
            { status: "error", message: "Failed to delete job opening." },
            { status: 500 },
        );
    }

    return NextResponse.json({ status: "success" });
}
