import { SITE } from "@/config/seo";
import { LOCALES } from "@/i18n/config";
import { absoluteUrl } from "@/i18n/routes";
import { connection } from "next/server";
import { MARKDOWN_HEADERS, fullMarkdown, llmsPosts } from "@/lib/llms";

export async function GET() {
    await connection();
    const posts = await Promise.all(LOCALES.map(llmsPosts));
    const body = `# ${SITE.name}

> ${SITE.name} (${SITE.legalName}) is a software development company from Romania that builds custom software, AI agents, automations and websites for clients in Romania and abroad, and ships products of its own. Contact: ${SITE.email}, ${SITE.phoneIntl}. Summary: ${absoluteUrl("/llms.txt")}

${LOCALES.map((locale, i) => fullMarkdown(locale, posts[i])).join("\n\n")}
`;
    return new Response(body, { headers: MARKDOWN_HEADERS });
}
