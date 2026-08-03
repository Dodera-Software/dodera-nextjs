import "server-only";
import OpenAI from "openai";
import {
    buildSystemPrompt,
    buildUserMessage,
    type SocialPlatform,
    type BlogContext,
} from "@/app/api/admin/social-post/prompts";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { socialPostExamples } from "@/db/schema";
import { getSocialPostModel } from "@/lib/app-config";

export interface GenerateSocialPostOptions {
    platform: SocialPlatform;
    blog: BlogContext;
}

export interface GenerateSocialPostResult {
    platform: SocialPlatform;
    post: string;
}

async function getExamples(platform: SocialPlatform): Promise<string[]> {
    try {
        const rows = await db
            .select({ content: socialPostExamples.content })
            .from(socialPostExamples)
            .where(eq(socialPostExamples.platform, platform))
            .orderBy(asc(socialPostExamples.createdAt));

        return rows.map((row) => row.content);
    } catch {
        return [];
    }
}

/**
 * Generate a social media post for the given platform based on blog context.
 */
/** o-series reasoning models do not accept a temperature parameter. */
function isReasoningModel(model: string): boolean {
    return /^o[1-9]/.test(model);
}

export async function generateSocialPost(
    options: GenerateSocialPostOptions,
): Promise<GenerateSocialPostResult> {
    const { platform, blog } = options;

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey || openaiKey.startsWith("sk-your-")) {
        throw new Error("OpenAI API key is not configured.");
    }

    const openai = new OpenAI({ apiKey: openaiKey });
    const [examples, model] = await Promise.all([getExamples(platform), getSocialPostModel()]);
    const systemPrompt = buildSystemPrompt(platform, examples);
    const userMessage = buildUserMessage(platform, blog);

    console.log(
        `[social-post-service] Generating ${platform} post for: "${blog.title.slice(0, 60)}" (${examples.length} examples) model: ${model}`,
    );

    const response = await openai.chat.completions.create({
        model,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
        ],
        ...(!isReasoningModel(model) && { temperature: 0.8 }),
        max_completion_tokens: 1200,
    });

    const post = response.choices?.[0]?.message?.content?.trim();
    if (!post) {
        throw new Error("OpenAI returned an empty response.");
    }

    return { platform, post };
}
