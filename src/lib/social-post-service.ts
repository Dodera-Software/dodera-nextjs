import "server-only";
import OpenAI from "openai";
import {
    buildSystemPrompt,
    buildUserMessage,
    type SocialPlatform,
    type BlogContext,
} from "@/app/api/admin/social-post/prompts";
import { supabase } from "@/lib/supabase";
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
    const { data, error } = await supabase
        .from("social_post_examples")
        .select("content")
        .eq("platform", platform)
        .order("created_at", { ascending: true });

    if (error || !data) return [];
    return data.map((row) => row.content);
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
        temperature: 0.8,
        max_tokens: 1200,
    });

    const post = response.choices?.[0]?.message?.content?.trim();
    if (!post) {
        throw new Error("OpenAI returned an empty response.");
    }

    return { platform, post };
}
