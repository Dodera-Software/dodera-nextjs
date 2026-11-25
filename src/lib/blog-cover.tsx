import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { COVER_SIZE } from "@/config/blog";
import type { Locale } from "@/i18n/config";
import { loadBlogPost } from "@/lib/blog";
import type { BlogPost } from "@/types";

const ASSETS = path.join(process.cwd(), "src/assets/blog");
const LOGO = path.join(process.cwd(), "public/brand/logo-on-dark.svg");

const COLOR = {
    background: "#0a0a0c",
    foreground: "#f4f4f5",
    muted: "#a1a1aa",
    brand: "#ff3d5e",
} as const;

const dataUri = (bytes: Buffer, type: string) => `data:${type};base64,${bytes.toString("base64")}`;

const loadAssets = async () => {
    const [display, mono, art, logo] = await Promise.all([
        readFile(path.join(ASSETS, "MonaSans-Bold.ttf")),
        readFile(path.join(ASSETS, "JetBrainsMono-Medium.ttf")),
        readFile(path.join(ASSETS, "cover-art.jpg")),
        readFile(LOGO),
    ]);
    return { display, mono, art: dataUri(art, "image/jpeg"), logo: dataUri(logo, "image/svg+xml") };
};

let assets: ReturnType<typeof loadAssets> | undefined;

const titleSize = (title: string) => (title.length <= 40 ? 76 : title.length <= 64 ? 64 : title.length <= 90 ? 54 : 46);

async function renderBlogCover(post: Pick<BlogPost, "title" | "category">) {
    const { display, mono, art, logo } = await (assets ??= loadAssets());

    return new ImageResponse(
        (
            <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: COLOR.background, fontFamily: "Mona Sans" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", background: "radial-gradient(60% 70% at 0% 100%, rgba(196, 28, 56, 0.28), transparent 70%)" }} />
                <img src={art} width={580} height={630} alt="" style={{ position: "absolute", top: 0, right: 0 }} />
                <div style={{ position: "absolute", top: 0, right: 380, width: 200, height: 630, display: "flex", background: `linear-gradient(90deg, ${COLOR.background}, rgba(10, 10, 12, 0))` }} />
                <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700, padding: "88px 0 72px 80px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", fontFamily: "JetBrains Mono", fontSize: 20, letterSpacing: 3, color: COLOR.muted, textTransform: "uppercase" }}>
                            <div style={{ width: 10, height: 10, borderRadius: 999, background: COLOR.brand, marginRight: 16 }} />
                            {post.category || "Blog"}
                        </div>
                        <div style={{ display: "flex", marginTop: 32, fontSize: titleSize(post.title), lineHeight: 1.05, letterSpacing: "-0.03em", color: COLOR.foreground }}>{post.title}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img src={logo} height={32} width={123} alt="" />
                        <div style={{ display: "flex", marginLeft: 32, fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 3, color: COLOR.muted }}>DODERASOFT.COM</div>
                    </div>
                </div>
            </div>
        ),
        {
            ...COVER_SIZE,
            fonts: [
                { name: "Mona Sans", data: display, weight: 700, style: "normal" },
                { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
            ],
            headers: { "Cache-Control": "public, max-age=31536000, immutable" },
        },
    );
}

export async function blogCoverResponse(slug: string, locale: Locale) {
    const post = await loadBlogPost(slug, locale);
    if (!post) return new Response("Not found", { status: 404 });
    return renderBlogCover(post);
}
