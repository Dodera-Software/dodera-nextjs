import { Facebook, Instagram, Linkedin, type LucideIcon } from "lucide-react";

export const AGENT_IDENTITY = {
    company:
        "Dodera, a software development agency that specialises in automation, AI integrations, and custom web/mobile development",
};

export enum SocialPlatform {
    LinkedIn = "linkedin",
    Facebook = "facebook",
    Instagram = "instagram",
}

export interface SocialPlatformConfig {
    id: SocialPlatform;
    icon: LucideIcon;
    shareUrl: (articleUrl: string) => string;
}

export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
    {
        id: SocialPlatform.LinkedIn,
        icon: Linkedin,
        shareUrl: () => "https://www.linkedin.com/feed/?shareActive=true",
    },
    {
        id: SocialPlatform.Facebook,
        icon: Facebook,
        shareUrl: (articleUrl) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
    },
    {
        id: SocialPlatform.Instagram,
        icon: Instagram,
        shareUrl: () => "https://www.instagram.com/",
    },
];

export const SOCIAL_EXAMPLE_MIN_LENGTH = 10;
