import type { Metadata } from "next";
import { BlogPostRoute, blogPostMetadata } from "@/components/blog/BlogPostRoute";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return blogPostMetadata((await params).slug, "en");
}

export default async function BlogPostPage({ params }: PageProps) {
    return <BlogPostRoute slug={(await params).slug} locale="en" />;
}
