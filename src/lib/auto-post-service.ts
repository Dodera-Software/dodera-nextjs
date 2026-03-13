import "server-only";
import OpenAI from "openai";
import * as prismic from "@prismicio/client";
import type { BlogPostDocumentData } from "../../prismicio-types";
import { repositoryName } from "@/lib/prismic";
import {
    SYSTEM_PROMPT,
    getRandomTopicHint,
    parseGeneratedPost,
    type GeneratedPost,
} from "@/app/api/auto-post/prompts";
import { generateImageUrl } from "@/lib/generate-image-service";
import { supabase } from "@/lib/supabase";

const OPENAI_MODEL = process.env.AUTO_POST_OPENAI_MODEL ?? "gpt-4o";

export interface AutoPostOptions {
    publish?: boolean;
    authorName?: string;
    lang?: string;
    saveToPrismic?: boolean;
}

export interface AutoPostServiceResult {
    status: "success" | "error";
    message: string;
    uid?: string;
    generated_post?: GeneratedPost;
    featured_image_url?: string;
}

/* ── Prismic helpers (mirrors blog/route.ts) ─────────────────── */

const SITE_ORIGIN = "https://doderasoft.com";
// Matches **bold** and [link](url) in a single pass
const INLINE_RE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)]+)\)/g;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractInlineSpans(raw: string): { plainText: string; spans: any[] } {
    let plainText = "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spans: any[] = [];
    let lastIndex = 0;
    INLINE_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = INLINE_RE.exec(raw)) !== null) {
        plainText += raw.slice(lastIndex, match.index);
        if (match[1] !== undefined) {
            // **bold**
            const start = plainText.length;
            plainText += match[1];
            spans.push({ type: "strong", start, end: plainText.length });
        } else {
            // [anchor](url)
            const anchorText = match[2];
            const url = match[3];
            const start = plainText.length;
            plainText += anchorText;
            const absoluteUrl = url.startsWith("/") ? `${SITE_ORIGIN}${url}` : url;
            spans.push({ type: "hyperlink", start, end: plainText.length, data: { link_type: "Web", url: absoluteUrl } });
        }
        lastIndex = match.index + match[0].length;
    }
    plainText += raw.slice(lastIndex);
    return { plainText, spans };
}

/**
 * Convert a markdown body string to a Prismic RichTextField.
 * Processes line-by-line so headings are never merged with paragraph content,
 * even when the AI omits the blank line between a heading and the next paragraph.
 * Also handles **bold**, [links](url), - list items, and 1. ordered lists.
 */
function textToRichText(text: string): prismic.RichTextField {
    const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    const nodes: prismic.RTNode[] = [];
    let paragraphBuffer: string[] = [];

    const flushParagraph = () => {
        if (paragraphBuffer.length === 0) return;
        const combined = paragraphBuffer.join(" ").trim();
        if (combined) {
            const { plainText, spans } = extractInlineSpans(combined);
            nodes.push({ type: prismic.RichTextNodeType.paragraph, text: plainText, spans });
        }
        paragraphBuffer = [];
    };

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            flushParagraph();
            continue;
        }
        if (trimmed.startsWith("### ")) {
            flushParagraph();
            nodes.push({ type: prismic.RichTextNodeType.heading3, text: trimmed.slice(4), spans: [] });
        } else if (trimmed.startsWith("## ")) {
            flushParagraph();
            nodes.push({ type: prismic.RichTextNodeType.heading2, text: trimmed.slice(3), spans: [] });
        } else if (trimmed.startsWith("# ")) {
            flushParagraph();
            nodes.push({ type: prismic.RichTextNodeType.heading1, text: trimmed.slice(2), spans: [] });
        } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            flushParagraph();
            const { plainText, spans } = extractInlineSpans(trimmed.slice(2));
            nodes.push({ type: prismic.RichTextNodeType.listItem, text: plainText, spans });
        } else if (/^\d+\.\s+/.test(trimmed)) {
            flushParagraph();
            const { plainText, spans } = extractInlineSpans(trimmed.replace(/^\d+\.\s+/, ""));
            nodes.push({ type: prismic.RichTextNodeType.oListItem, text: plainText, spans });
        } else {
            paragraphBuffer.push(trimmed);
        }
    }
    flushParagraph();

    return nodes as prismic.RichTextField;
}

/* ── Main service function ───────────────────────────────────── */

export async function autoPost(options: AutoPostOptions = {}): Promise<AutoPostServiceResult> {
    const {
        publish = false,
        authorName = "Dodera Team",
        lang = "en-us",
        saveToPrismic = true,
    } = options;

    /* 1. Validate OpenAI key */
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey || openaiKey.startsWith("sk-your-")) {
        return { status: "error", message: "OpenAI API key is not configured." };
    }

    /* 1b. Fetch recent posts from Supabase for topic deduplication */
    let recentPostsContext = "";
    try {
        const { data: recentPosts, error: dbError } = await supabase
            .from("auto_generated_blog_posts")
            .select("title, category, uid")
            .order("created_at", { ascending: false })
            .limit(20);

        if (dbError) {
            console.warn("[auto-post-service] Supabase fetch error — proceeding without deduplication:", dbError.message);
        } else if (recentPosts && recentPosts.length > 0) {
            const list = recentPosts
                .map((p, i) => `${i + 1}. "${p.title}" (${p.category ?? "uncategorised"}) [uid: ${p.uid}]`)
                .join("\n");
            recentPostsContext = `\n\nRECENT POSTS — DO NOT repeat these topics, titles, or close variations of them:\n${list}`;
            console.log(`[auto-post-service] Loaded ${recentPosts.length} recent post(s) for deduplication.`);
        } else {
            console.log("[auto-post-service] No previous posts in Supabase — first generation.");
        }
    } catch (dbErr) {
        console.warn("[auto-post-service] Could not fetch recent posts — proceeding without deduplication:", dbErr);
    }

    /* 1c. Fetch blog post examples for style guidance */
    let examplesContext = "";
    try {
        const { data: exampleRows, error: exErr } = await supabase
            .from("blog_post_examples")
            .select("content")
            .order("created_at", { ascending: true });

        if (exErr) {
            console.warn("[auto-post-service] Could not fetch blog post examples:", exErr.message);
        } else if (exampleRows && exampleRows.length > 0) {
            const formatted = exampleRows
                .map((e, i) => `--- EXAMPLE ${i + 1} ---\n${e.content}`)
                .join("\n\n");
            examplesContext = `\n\nSTYLE EXAMPLES — The following are blog posts whose structure, tone, length, word choices, and internal linking style you MUST closely mirror. Do NOT copy the topic or content — only replicate the writing style:\n\n${formatted}`;
            console.log(`[auto-post-service] Loaded ${exampleRows.length} blog post example(s) for style guidance.`);
        }
    } catch (examplesErr) {
        console.warn("[auto-post-service] Could not fetch blog post examples — proceeding without style guidance:", examplesErr);
    }

    /* 2. Generate post content */
    let generatedPost: GeneratedPost;
    try {
        const openai = new OpenAI({ apiKey: openaiKey });
        console.log(`[auto-post-service] Calling ${OPENAI_MODEL}…`);
        const completion = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            response_format: { type: "json_object" },
            temperature: 0.9,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: `${getRandomTopicHint()}\n\nPick the single most trending, share-worthy topic in the technology space right now and write the full blog post. Output only the JSON object.${recentPostsContext}${examplesContext}`,
                },
            ],
        });
        const raw = completion.choices[0]?.message?.content ?? "";
        if (!raw) throw new Error("OpenAI returned an empty response.");
        generatedPost = parseGeneratedPost(raw);
        console.log(`[auto-post-service] Generated — uid="${generatedPost.uid}" title="${generatedPost.title}"`);
    } catch (err) {
        return {
            status: "error",
            message: "Failed to generate blog post via OpenAI.",
        };
    }

    /* 3. Generate featured image */
    let featuredImageUrl: string | undefined;
    try {
        const { url } = await generateImageUrl({
            title: generatedPost.title,
            excerpt: generatedPost.excerpt,
            category: generatedPost.category,
            tags: generatedPost.tags,
        });
        featuredImageUrl = url;
        console.log(`[auto-post-service] Image URL: ${url.slice(0, 80)}…`);
    } catch (imgErr) {
        console.warn("[auto-post-service] Image generation failed — continuing without image:", imgErr);
    }

    if (!saveToPrismic) {
        return {
            status: "success",
            message: "Blog post generated (not saved to Prismic).",
            uid: generatedPost.uid,
            generated_post: generatedPost,
            ...(featuredImageUrl && { featured_image_url: featuredImageUrl }),
        };
    }

    /* 4. Post to Prismic */
    try {
        const writeToken = process.env.PRISMIC_WRITE_TOKEN;
        if (!writeToken) throw new Error("PRISMIC_WRITE_TOKEN is not set.");

        const writeClient = prismic.createWriteClient(repositoryName, {
            writeToken,
            accessToken: process.env.PRISMIC_ACCESS_TOKEN || undefined,
        });

        const migration = prismic.createMigration();

        const fileCache = new Map<string, File>();
        async function fetchAsFile(url: string, filename: string): Promise<File> {
            if (fileCache.has(url)) return fileCache.get(url)!;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to fetch asset: ${res.statusText}`);
            const buffer = await res.arrayBuffer();
            const contentType = res.headers.get("content-type") ?? "image/png";
            const ext = contentType.split("/")[1]?.split(";")[0] ?? "png";
            const safeFilename = filename.endsWith(`.${ext}`) ? filename : `${filename}.${ext}`;
            const file = new File([buffer], safeFilename, { type: contentType });
            fileCache.set(url, file);
            return file;
        }

        let featuredImage;
        let ogImage;
        if (featuredImageUrl) {
            const file = await fetchAsFile(featuredImageUrl, generatedPost.title);
            featuredImage = migration.createAsset(file, file.name, { alt: generatedPost.title });
            ogImage = featuredImage;
        }

        const bodyRichText = textToRichText(generatedPost.body);
        const tags = generatedPost.tags.map((tag) => ({ tag })) as BlogPostDocumentData["tags"];

        migration.createDocument(
            {
                type: "blog_post",
                uid: generatedPost.uid,
                lang,
                data: {
                    title: generatedPost.title,
                    excerpt: generatedPost.excerpt || null,
                    date: new Date().toISOString().slice(0, 10),
                    updated_at: null,
                    read_time: generatedPost.read_time || null,
                    category: generatedPost.category || null,
                    tags,
                    featured_image: featuredImage ?? undefined,
                    author_name: authorName,
                    author_avatar: undefined,
                    body: bodyRichText,
                    meta_title: generatedPost.meta_title || null,
                    meta_description: generatedPost.meta_description || null,
                    og_image: ogImage ?? undefined,
                },
            },
            generatedPost.title,
        );

        await writeClient.migrate(migration, {
            reporter: (event) => console.log(`[Prismic Migration] ${JSON.stringify(event)}`),
        });

        /* Record in Supabase for future deduplication */
        try {
            const { error: insertError } = await supabase.from("auto_generated_blog_posts").insert({
                uid: generatedPost.uid,
                title: generatedPost.title,
                category: generatedPost.category,
                tags: generatedPost.tags,
            });
            if (insertError) {
                console.warn("[auto-post-service] Supabase insert warning:", insertError.message);
            } else {
                console.log(`[auto-post-service] Post recorded in Supabase — uid="${generatedPost.uid}"`);
            }
        } catch (insertErr) {
            console.warn("[auto-post-service] Supabase insert failed — non-critical:", insertErr);
        }

        if (publish) {
            // Note: the Prismic Migration API creates documents as drafts.
            // Publishing requires the Documents API which is separate.
            console.log("[auto-post-service] Post created as draft. Manual publish required if needed.");
        }

        return {
            status: "success",
            message: `Blog post "${generatedPost.title}" generated and saved to Prismic.`,
            uid: generatedPost.uid,
            generated_post: generatedPost,
            ...(featuredImageUrl && { featured_image_url: featuredImageUrl }),
        };
    } catch (err) {
        console.error("[auto-post-service] Prismic error:", err);
        return {
            status: "error",
            message: "Post generated but failed to save to Prismic.",
            generated_post: generatedPost,
        };
    }
}
