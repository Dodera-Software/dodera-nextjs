import Image from "@tiptap/extension-image";

/**
 * Extended TipTap Image node that supports email-safe alignment via an
 * `align` attribute ("none" | "left" | "center" | "right").
 *
 * allowBase64: true - ensures base64 data URLs survive setContent() on reload.
 * Alignment is rendered as inline CSS so it works in all email clients.
 * Used by both the Send Email and Welcome Email editors.
 */
export const EmailImage = Image.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: this.parent?.()?.HTMLAttributes ?? {},
            resize: this.parent?.()?.resize ?? false,
            allowBase64: true,
            inline: false,
        };
    },
    addAttributes() {
        return {
            ...this.parent?.(),
            align: {
                default: "none",
                renderHTML(attrs) {
                    const base = "max-width:100%;height:auto;";
                    const map: Record<string, string> = {
                        left: base + "display:block;margin-right:auto;",
                        center: base + "display:block;margin-left:auto;margin-right:auto;",
                        right: base + "display:block;margin-left:auto;",
                        none: base,
                    };
                    return { style: map[attrs.align as string] ?? base };
                },
                parseHTML(element) {
                    const style = element.getAttribute("style") ?? "";
                    const hasMarginLeft = /margin-left\s*:\s*auto/.test(style);
                    const hasMarginRight = /margin-right\s*:\s*auto/.test(style);
                    if (hasMarginLeft && hasMarginRight) return "center";
                    if (hasMarginLeft) return "right";
                    if (hasMarginRight) return "left";
                    return "none";
                },
            },
        };
    },
});
