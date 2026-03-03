import "server-only";
import OpenAI from "openai";
import {
    buildSystemPrompt,
    buildUserMessage,
    type SocialPlatform,
    type BlogContext,
} from "@/app/api/admin/social-post/prompts";

const OPENAI_MODEL = process.env.SOCIAL_POST_OPENAI_MODEL ?? "gpt-4o";

export interface GenerateSocialPostOptions {
    platform: SocialPlatform;
    blog: BlogContext;
}

export interface GenerateSocialPostResult {
    platform: SocialPlatform;
    post: string;
}

/**
 * Generate a social media post for the given platform based on blog context.
 */
export async function generateSocialPost(
    options: GenerateSocialPostOptions,
): Promise<GenerateSocialPostResult> {
    const { platform, blog } = options;

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey || openaiKey.startsWith("sk-your-")) {
        throw new Error("OpenAI API key is not configured.");
    }

    const openai = new OpenAI({ apiKey: openaiKey });

    const systemPrompt = buildSystemPrompt(platform);
    const userMessage = buildUserMessage(platform, blog);

    console.log(
        `[social-post-service] Generating ${platform} post for: "${blog.title.slice(0, 60)}"`,
    );

    const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
        ],
        temperature: 0.8,
        max_tokens: 1200,
    });

    const post = response.choices?.[0]?.message?.content?.trim();
    if (!post) {
        throw new Error("OpenAI returned an empty response.");
    }

    return { platform, post };
}
