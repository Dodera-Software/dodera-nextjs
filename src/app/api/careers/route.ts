import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("job_openings")
        .select("id, title, department, location, type, description, apply_url, sort_order")
        .eq("status", "open")
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
