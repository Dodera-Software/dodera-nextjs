import "server-only";
import OpenAI from "openai";
import { buildImagePrompt } from "@/app/api/generate-image/prompts";

const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL ?? "dall-e-3";

/**
 * Generate an image via DALL-E and return its temporary CDN URL.
 * Can accept either a raw `prompt` string or blog post fields —
 * same shape as /api/generate-image.
 */
export async function generateImageUrl(
    body: Record<string, unknown>,
): Promise<{ url: string; prompt: string }> {
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

    const openai = new OpenAI({ apiKey: openaiKey });

    console.log(`[generate-image-service] Generating — prompt: "${imagePrompt.slice(0, 100)}…"`);

    const response = await openai.images.generate({
        model: OPENAI_IMAGE_MODEL,
        prompt: imagePrompt,
        n: 1,
        size: "1792x1024",
        quality: "standard",
        response_format: "url",
    });

    const url = response.data?.[0]?.url;
    if (!url) throw new Error("OpenAI returned no image URL.");

    return { url, prompt: imagePrompt };
}
