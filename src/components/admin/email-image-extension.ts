import Image from "@tiptap/extension-image";
import { EmailImageAlign } from "@/config/admin-email";

const BASE_STYLE = "max-width:100%;height:auto;";

const ALIGN_STYLE: Record<EmailImageAlign, string> = {
    [EmailImageAlign.None]: BASE_STYLE,
    [EmailImageAlign.Left]: `${BASE_STYLE}display:block;margin-right:auto;`,
    [EmailImageAlign.Center]: `${BASE_STYLE}display:block;margin-left:auto;margin-right:auto;`,
    [EmailImageAlign.Right]: `${BASE_STYLE}display:block;margin-left:auto;`,
};

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
                default: EmailImageAlign.None,
                renderHTML(attrs) {
                    return { style: ALIGN_STYLE[attrs.align as EmailImageAlign] ?? BASE_STYLE };
                },
                parseHTML(element) {
                    const style = element.getAttribute("style") ?? "";
                    const left = /margin-left\s*:\s*auto/.test(style);
                    const right = /margin-right\s*:\s*auto/.test(style);
                    if (left && right) return EmailImageAlign.Center;
                    if (left) return EmailImageAlign.Right;
                    if (right) return EmailImageAlign.Left;
                    return EmailImageAlign.None;
                },
            },
        };
    },
});
