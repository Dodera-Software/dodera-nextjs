import { adminCommon } from "@/i18n/admin/common";
import { SocialPlatform } from "@/config/social-post";

export const socialCopy = {
    eyebrow: "Content",
    title: "Social post",
    description: "Pick a published blog post and get a ready-to-post text for LinkedIn, Facebook or Instagram.",
    posts: {
        title: "Published posts",
        search: "Search by title, category, tag…",
        empty: "No published posts found.",
        count: (shown: number, total: number) => `${shown} of ${adminCommon.plural(total, "post", "posts")}`,
    },
    pick: {
        title: "Select a blog post",
        description: "Pick an article from the list to generate LinkedIn, Facebook or Instagram content.",
    },
    article: {
        open: "Open article",
    },
    platforms: {
        title: "Platform",
        description: "Each platform has its own AI agent tuned for that audience and format.",
        ready: "Ready",
    },
    platform: {
        [SocialPlatform.LinkedIn]: { label: "LinkedIn", description: "Professional long-form post with proven hook patterns" },
        [SocialPlatform.Facebook]: { label: "Facebook", description: "Casual, relatable post with a friendly CTA" },
        [SocialPlatform.Instagram]: { label: "Instagram", description: "Caption with hook, body, CTA and hashtags" },
    } satisfies Record<SocialPlatform, { label: string; description: string }>,
    output: {
        title: (platform: string) => `${platform} post`,
        generating: "Writing your post…",
        failed: "Generation failed",
        regenerate: "Regenerate",
        featuredImage: "Featured image",
        openImage: "Open original",
        share: (platform: string) => `Post to ${platform}`,
        shareHint: (platform: string) => `Copies the text to your clipboard, then opens ${platform}.`,
        shared: (platform: string) => `Text copied. Paste it into ${platform}.`,
    },
    examples: {
        title: "Style examples",
        description: (platform: string) =>
            `Paste real ${platform} posts that performed well. The AI mirrors their hook style, rhythm and CTA structure; it never copies content.`,
        toggleOpen: "Manage",
        toggleClose: "Hide",
        placeholder: (platform: string) => `Paste a ${platform} post here…`,
        add: "Add example",
        added: "Example saved",
        tooShort: (min: number) => `Use at least ${min} characters.`,
        empty: "No examples yet. Add the first one above.",
        expand: "Show all",
        collapse: "Show less",
        adding: "Adding…",
        removed: "Example deleted",
    },
} as const;
