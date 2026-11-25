import { SITE } from "@/config/seo";
import { LOCALES } from "@/i18n/config";
import { absoluteUrl } from "@/i18n/routes";
import { MARKDOWN_HEADERS, fullMarkdown } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
    const body = `# ${SITE.name}

> ${SITE.name} (${SITE.legalName}) is a software development company from Romania that builds custom software, AI agents, automations and websites for clients in Romania and abroad, and ships products of its own. Contact: ${SITE.email}, ${SITE.phoneIntl}. Summary: ${absoluteUrl("/llms.txt")}

${LOCALES.map(fullMarkdown).join("\n\n")}
`;
    return new Response(body, { headers: MARKDOWN_HEADERS });
}
