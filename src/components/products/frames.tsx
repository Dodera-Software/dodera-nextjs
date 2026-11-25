import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/config/products";

export const SCREEN_SHADOW = "shadow-[0_50px_120px_-30px_rgb(0_0_0/0.95),0_0_0_1px_rgb(255_255_255/0.07)]";

export function WindowChrome({ children, bar }: { children: React.ReactNode; bar?: React.ReactNode }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-[#0e0e11] shadow-[0_50px_120px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.03)_inset]">
            <div className="flex h-10 items-center gap-3 border-b border-foreground/[0.07] bg-foreground/[0.03] px-4">
                <span className="flex gap-1.5" aria-hidden="true">
                    <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="size-2.5 rounded-full bg-[#febc2e]" />
                    <span className="size-2.5 rounded-full bg-[#28c840]" />
                </span>
                {bar}
            </div>
            {children}
        </div>
    );
}

export function AddressBar({ children }: { children: React.ReactNode }) {
    return <span className="mx-auto flex h-6 min-w-0 max-w-[60%] flex-1 items-center justify-center truncate rounded-md bg-foreground/[0.06] px-3 font-mono text-[11px] text-foreground/55">{children}</span>;
}

export function CommandBar({ command }: { command: string }) {
    return (
        <span className="truncate font-mono text-[11px] text-foreground/55">
            <span className="text-brand-bright">›</span> {command}
        </span>
    );
}

export function PhoneFrame({ image, alt, className, sizes = "(min-width: 1024px) 280px, 45vw" }: { image: ProductImage; alt: string; className?: string; sizes?: string }) {
    return (
        <div className={cn("aspect-[460/1000] overflow-hidden rounded-[2.6rem] border-[6px] border-[#1b1b1f] bg-black shadow-[0_40px_100px_-30px_rgb(0_0_0/0.95),0_0_0_1px_rgb(255_255_255/0.08)]", className)}>
            <Image src={image.src} alt={alt} width={image.width} height={image.height} sizes={sizes} className="size-full object-cover" />
        </div>
    );
}
