import { blogCoverResponse } from "@/lib/blog-cover";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
    return blogCoverResponse((await params).slug, "ro");
}
