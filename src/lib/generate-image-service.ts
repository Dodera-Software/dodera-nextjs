import "server-only";
import OpenAI from "openai";
import { buildImagePrompt } from "@/app/api/generate-image/prompts";
import { IMAGE_SIZES, type ImageSize } from "@/lib/image-sizes";

const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL ?? "dall-e-3";

const VALID_SIZES = IMAGE_SIZES.map((s) => s.value);

const VALID_MODELS = ["dall-e-3", "dall-e-2", "gpt-image-1"] as const;
type ImageModel = (typeof VALID_MODELS)[number];

/**
 * Generate an image via DALL-E and return its temporary CDN URL.
 * Can accept either a raw `prompt` string or blog post fields —
 * same shape as /api/generate-image.
 *
 * Pass `size` to override the default 1792x1024.
 */
export async function generateImageUrl(
    body: Record<string, unknown>,
): Promise<{ url: string; prompt: string; size: string; model: string }> {
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

    const requestedModel: ImageModel =
        typeof body.model === "string" && VALID_MODELS.includes(body.model as ImageModel)
            ? (body.model as ImageModel)
            : (OPENAI_IMAGE_MODEL as ImageModel);

    const openai = new OpenAI({ apiKey: openaiKey });

    console.log(`[generate-image-service] Model: ${requestedModel} | Size: ${requestedSize} — prompt: "${imagePrompt.slice(0, 100)}…"`);

    // Each model has different supported parameters:
    // - dall-e-3: supports quality + response_format
    // - dall-e-2: no quality param, supports response_format url
    // - gpt-image-1: no quality/response_format params, always returns b64_json
    let url: string | undefined;

    if (requestedModel === "gpt-image-1") {
        // gpt-image-1 supports: 1024x1024, 1024x1536, 1536x1024, auto
        const gptSizeMap: Record<ImageSize, "1024x1024" | "1024x1536" | "1536x1024"> = {
            "1792x1024": "1536x1024",
            "1024x1024": "1024x1024",
            "1024x1792": "1024x1536",
        };
        const gptSize = gptSizeMap[requestedSize] ?? "1536x1024";
        const response = await openai.images.generate({
            model: requestedModel,
            prompt: imagePrompt,
            n: 1,
            size: gptSize,
        });
        const b64 = response.data?.[0]?.b64_json;
        if (!b64) throw new Error("OpenAI returned no image data.");
        url = `data:image/png;base64,${b64}`;
    } else if (requestedModel === "dall-e-2") {
        // dall-e-2 only supports up to 1024x1024; all our sizes fall back to 1024x1024 except the square
        const dall2Size: "1024x1024" = "1024x1024";
        const response = await openai.images.generate({
            model: requestedModel,
            prompt: imagePrompt,
            n: 1,
            size: dall2Size,
            response_format: "url",
        });
        url = response.data?.[0]?.url;
        if (!url) throw new Error("OpenAI returned no image URL.");
    } else {
        // dall-e-3
        const response = await openai.images.generate({
            model: requestedModel,
            prompt: imagePrompt,
            n: 1,
            size: requestedSize,
            quality: "standard",
            response_format: "url",
        });
        url = response.data?.[0]?.url;
        if (!url) throw new Error("OpenAI returned no image URL.");
    }

    return { url, prompt: imagePrompt, size: requestedSize, model: requestedModel };
}
