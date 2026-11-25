import "server-only";
import { Marked, type Tokens } from "marked";
import { SITE } from "@/config/seo";

const SAFE_HREF = /^(https?:\/\/|mailto:|\/|#)/i;

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const isExternal = (href: string) => /^https?:\/\//i.test(href) && !href.startsWith(SITE.url);

const marked = new Marked({
    gfm: true,
    renderer: {
        html: ({ text }: Tokens.HTML | Tokens.Tag) => escapeHtml(text),
        link(token: Tokens.Link) {
            const text = this.parser.parseInline(token.tokens);
            if (!SAFE_HREF.test(token.href)) return text;
            const rel = isExternal(token.href) ? ' target="_blank" rel="noopener"' : "";
            return `<a href="${escapeHtml(token.href)}"${rel}>${text}</a>`;
        },
        image(token: Tokens.Image) {
            if (!/^(https:\/\/|\/)/i.test(token.href)) return escapeHtml(token.text);
            return `<img src="${escapeHtml(token.href)}" alt="${escapeHtml(token.text)}" loading="lazy" />`;
        },
    },
});

export const renderMarkdown = (markdown: string) => marked.parse(markdown, { async: false });

export const countWords = (markdown: string) => markdown.replace(/[#*_>`[\]()-]/g, " ").split(/\s+/).filter(Boolean).length;
