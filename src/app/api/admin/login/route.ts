import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { createAdminSession } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
    try {
        /* IP rate limit — prevent brute-force attacks */
        const ip = getClientIp(request);
        const { limited } = await checkRateLimit("admin_login", ip);
        if (limited) {
            return NextResponse.json(
                { status: "error", message: "Too many login attempts. Please try again later." },
                { status: 429 },
            );
        }

        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { status: "error", message: "Email and password are required." },
                { status: 400 },
            );
        }

        // Look up the admin user
        const { data: user, error } = await supabase
            .from("admin_users")
            .select("id, email, name, password_hash")
            .eq("email", email.toLowerCase().trim())
            .single();

        if (error || !user) {
            return NextResponse.json(
                { status: "error", message: "Invalid email or password." },
                { status: 401 },
            );
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return NextResponse.json(
                { status: "error", message: "Invalid email or password." },
                { status: 401 },
            );
        }

        // Update last login
        await supabase
            .from("admin_users")
            .update({ last_login_at: new Date().toISOString() })
            .eq("id", user.id);

        // Create session
        await createAdminSession({
            id: user.id,
            email: user.email,
            name: user.name || "Admin",
        });

        return NextResponse.json({
            status: "success",
            message: "Login successful.",
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch {
        return NextResponse.json(
            { status: "error", message: "Invalid request." },
            { status: 400 },
        );
    }
}
