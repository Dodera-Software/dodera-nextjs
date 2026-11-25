import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

enum Command {
    List = "list",
    Check = "check",
    Push = "push",
}

const LANGS = ["en", "ro"] as const;
type Lang = (typeof LANGS)[number];

const BANNED: Record<Lang, string[]> = {
    en: [
        "delve", "landscape", "tapestry", "testament to", "game-changer", "game changer", "in today's", "fast-paced", "ever-evolving",
        "navigate the", "unlock", "unleash", "harness the power", "seamless", "leverage", "elevate", "revolutionize", "robust",
        "cutting-edge", "in the realm", "it's worth noting", "it is important to note", "in conclusion", "let's dive", "dive into",
        "buckle up", "the future is here", "paradigm shift", "at the end of the day", "not just", "here's the thing", "here's why",
        "the bottom line", "stay tuned", "embark", "furthermore", "moreover", "crucial", "pivotal", "vibrant", "plethora",
    ],
    ro: [
        "în era digitală", "în peisajul", "peisajul actual", "este crucial", "joacă un rol", "rol esențial", "nu doar", "ci și",
        "în concluzie", "hai să ne scufundăm", "revoluționa", "de ultimă generație", "fără cusur", "o adevărată revoluție",
        "în lumea de azi", "în ziua de azi", "merită menționat", "este important de menționat", "pe de altă parte", "mai mult decât atât",
    ],
};

const MAX_EM_DASHES = 2;
const WORDS = { min: 450, max: 1400 } as const;

const env = (name: string) => {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is missing. Add it to .env.local (see .env.example).`);
    return value.replace(/\/$/, "");
};

async function api(pathname: string, init?: RequestInit) {
    const res = await fetch(`${env("BLOG_API_URL")}${pathname}`, {
        ...init,
        headers: { Authorization: `Bearer ${env("BLOG_API_TOKEN")}`, "Content-Type": "application/json", ...init?.headers },
    });
    const data = await res.json().catch(() => ({ message: res.statusText }));
    if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data, null, 2)}`);
    return data;
}

async function loadPost(dir: string) {
    const meta = JSON.parse(await readFile(path.join(dir, "post.json"), "utf8"));
    for (const lang of LANGS) meta[lang].body = await readFile(path.join(dir, `${lang}.md`), "utf8");
    return meta;
}

function check(post: Record<Lang, { title: string; excerpt: string; body: string }>) {
    const problems: string[] = [];
    for (const lang of LANGS) {
        const { title, excerpt, body } = post[lang];
        const text = `${title}\n${excerpt}\n${body}`;
        const lower = text.toLowerCase();
        for (const phrase of BANNED[lang]) if (lower.includes(phrase)) problems.push(`${lang}: uses "${phrase}"`);
        const dashes = (text.match(/—/g) ?? []).length;
        if (dashes > MAX_EM_DASHES) problems.push(`${lang}: ${dashes} em dashes (max ${MAX_EM_DASHES})`);
        const words = body.split(/\s+/).filter(Boolean).length;
        if (words < WORDS.min || words > WORDS.max) problems.push(`${lang}: ${words} words (aim for ${WORDS.min}–${WORDS.max})`);
        if (/^#\s/m.test(body)) problems.push(`${lang}: body has an H1; the title is the only H1, use ## for sections`);
        if (/[\u{1F300}-\u{1FAFF}]/u.test(text)) problems.push(`${lang}: contains emoji`);
    }
    return problems;
}

async function main() {
    if (existsSync(".env.local")) process.loadEnvFile(".env.local");
    const [command, dir] = process.argv.slice(2);

    if (command === Command.List) {
        const { posts } = await api("/api/blog");
        for (const p of posts) console.log(`${p.status.padEnd(9)} ${p.locale}  ${(p.publishedAt ?? p.createdAt).slice(0, 10)}  ${p.title}  [${p.tags.join(", ")}]`);
        return;
    }

    if ((command === Command.Check || command === Command.Push) && dir) {
        const post = await loadPost(dir);
        const problems = check(post);
        if (problems.length) {
            console.error(`Fix these before pushing:\n- ${problems.join("\n- ")}`);
            process.exit(1);
        }
        if (command === Command.Check) return console.log("Looks good.");
        console.log(JSON.stringify(await api("/api/blog", { method: "POST", body: JSON.stringify(post) }), null, 2));
        return;
    }

    console.log("Usage: npm run blog -- list | check <folder> | push <folder>");
    process.exit(1);
}

main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
});
