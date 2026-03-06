import { SOCIAL_LINKS } from "@/config/site";
import { cn } from "@/lib/utils";

export interface SocialIconListProps {
    /** "sm" = 8-unit button  "md" = 9-unit button (default) */
    size?: "sm" | "md";
    className?: string;
}

/**
 * Renders the shared social media icon row.
 * Used in Navbar, Footer, and TrustedBy sections.
 */
export function SocialIconList({ size = "md", className }: SocialIconListProps) {
    const btnSize = size === "sm" ? "size-8" : "size-9";
    const iconSize = size === "sm" ? "size-3.5" : "size-4";

    return (
        <div className={cn("flex gap-3", className)}>
            {SOCIAL_LINKS.map((social) => (
                <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={cn(
                        btnSize,
                        "flex items-center justify-center rounded-md border border-border bg-muted/50 transition-all hover:bg-muted",
                    )}
                >
                    <social.icon
                        className={cn(
                            iconSize,
                            "text-muted-foreground transition-colors hover:text-foreground",
                        )}
                    />
                </a>
            ))}
        </div>
    );
}
