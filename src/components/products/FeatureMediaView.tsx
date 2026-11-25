import Image from "next/image";
import { cn } from "@/lib/utils";
import { MediaKind, type FeatureMedia, type Product } from "@/config/products";
import { AddressBar, CommandBar, PhoneFrame, SCREEN_SHADOW, WindowChrome } from "./frames";

const SKELETON_WIDTHS = ["w-4/5", "w-3/5", "w-2/3", "w-2/5"] as const;

export function FeatureMediaView({ media, product, alt }: { media: FeatureMedia; product: Product; alt: string }) {
    const image = media.image;

    if (media.kind === MediaKind.Phone && image) {
        return <PhoneFrame image={image} alt={alt} className="mx-auto h-[min(64svh,600px)] min-h-[380px]" sizes="(min-width: 1024px) 300px, 60vw" />;
    }

    if (media.kind === MediaKind.Window && image) {
        return (
            <div className={cn("overflow-hidden rounded-2xl", SCREEN_SHADOW)}>
                <Image src={image.src} alt={alt} width={image.width} height={image.height} sizes="(min-width: 1024px) 50vw, 100vw" className="w-full" />
            </div>
        );
    }

    if (media.kind === MediaKind.Browser && image) {
        return (
            <WindowChrome bar={<AddressBar>{product.domain}</AddressBar>}>
                <Image src={image.src} alt={alt} width={image.width} height={image.height} sizes="(min-width: 1024px) 50vw, 100vw" className="w-full" />
            </WindowChrome>
        );
    }

    if (media.kind === MediaKind.Film && image) {
        return (
            <WindowChrome bar={media.command && <CommandBar command={media.command} />}>
                <Image src={image.src} alt={alt} width={image.width} height={image.height} unoptimized loading="lazy" className="aspect-video w-full object-cover" />
            </WindowChrome>
        );
    }

    return (
        <WindowChrome bar={<AddressBar>{product.name}</AddressBar>}>
            <div className="space-y-5 p-8 font-mono text-sm" aria-label={alt} role="img">
                <p className="text-foreground/85">
                    <span className="text-brand-bright">›</span> {media.command}
                    <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-foreground/70" aria-hidden="true" />
                </p>
                <div className="space-y-3" aria-hidden="true">
                    {SKELETON_WIDTHS.map((width) => (
                        <span key={width} className={cn("block h-2.5 rounded-full bg-foreground/[0.07]", width)} />
                    ))}
                </div>
            </div>
        </WindowChrome>
    );
}
