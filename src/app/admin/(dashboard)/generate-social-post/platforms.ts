/* ── Platform types & metadata ───────────────────────────────── */

import { Linkedin, Facebook, Instagram } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SocialPlatform = "linkedin" | "facebook" | "instagram";

export const PLATFORMS: {
    id: SocialPlatform;
    label: string;
    color: string;
    activeColor: string;
    shareColor: string;
    Icon: LucideIcon;
    description: string;
    showImage: boolean;
}[] = [
        {
            id: "linkedin",
            label: "LinkedIn",
            Icon: Linkedin,
            color: "border-[#0A66C2]/30 text-[#0A66C2] bg-[#0A66C2]/5 hover:bg-[#0A66C2]/10",
            activeColor: "border-[#0A66C2] bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90",
            shareColor: "bg-[#0A66C2] hover:bg-[#004182] text-white",
            description: "Professional long-form post with proven hook patterns",
            showImage: true,
        },
        {
            id: "facebook",
            label: "Facebook",
            Icon: Facebook,
            color: "border-[#1877F2]/30 text-[#1877F2] bg-[#1877F2]/5 hover:bg-[#1877F2]/10",
            activeColor: "border-[#1877F2] bg-[#1877F2] text-white hover:bg-[#1877F2]/90",
            shareColor: "bg-[#1877F2] hover:bg-[#0d65d9] text-white",
            description: "Casual, relatable post with a friendly CTA",
            showImage: true,
        },
        {
            id: "instagram",
            label: "Instagram",
            Icon: Instagram,
            color: "border-[#E1306C]/30 text-[#E1306C] bg-[#E1306C]/5 hover:bg-[#E1306C]/10",
            activeColor: "border-[#E1306C] bg-[#E1306C] text-white hover:bg-[#E1306C]/90",
            shareColor: "bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white",
            description: "Caption with hook, body, CTA and hashtags",
            showImage: true,
        },
    ];

/* ── Platform share URLs ────────────────────────────────────────
   Opens the platform ready to paste the copied post text.
   Instagram has no web create-post URL - opens the feed instead.
   ─────────────────────────────────────────────────────────────── */
export function getPlatformShareUrl(platform: SocialPlatform, articleUrl: string): string {
    switch (platform) {
        case "linkedin":
            // Opens the LinkedIn post composer
            return "https://www.linkedin.com/feed/?shareActive=true";
        case "facebook":
            // Opens Facebook share dialog with the article URL pre-attached
            return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
        case "instagram":
            // Instagram has no public web post-creation URL
            return "https://www.instagram.com/";
    }
}
