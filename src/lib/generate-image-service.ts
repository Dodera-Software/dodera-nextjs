import "server-only";
import OpenAI from "openai";
import { buildImagePrompt } from "@/app/api/generate-image/prompts";
import { IMAGE_SIZES, type ImageSize } from "@/lib/image-sizes";

const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL ?? "dall-e-3";

const VALID_SIZES = IMAGE_SIZES.map((s) => s.value);

/**
 * Generate an image via DALL-E and return its temporary CDN URL.
 * Can accept either a raw `prompt` string or blog post fields —
 * same shape as /api/generate-image.
 *
 * Pass `size` to override the default 1792x1024.
 */
export async function generateImageUrl(
    body: Record<string, unknown>,
): Promise<{ url: string; prompt: string; size: string }> {
    const imagePrompt = buildImagePrompt(body);
    if (!imagePrompt) {
        throw new Error(
            "Request must include either a 'prompt' string or blog post fields (at minimum 'title').",
        );
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey || openaiKey.startsWith("sk-your-")) {
        throw new Error("OpenAI API key is not configured.");
    }

    const requestedSize =
        typeof body.size === "string" && VALID_SIZES.includes(body.size as ImageSize)
            ? (body.size as ImageSize)
            : "1792x1024";

    const openai = new OpenAI({ apiKey: openaiKey });

    console.log(`[generate-image-service] Generating ${requestedSize} — prompt: "${imagePrompt.slice(0, 100)}…"`);

    const response = await openai.images.generate({
        model: OPENAI_IMAGE_MODEL,
        prompt: imagePrompt,
        n: 1,
        size: requestedSize,
        quality: "standard",
        response_format: "url",
    });

    const url = response.data?.[0]?.url;
    if (!url) throw new Error("OpenAI returned no image URL.");

    return { url, prompt: imagePrompt, size: requestedSize };
}
