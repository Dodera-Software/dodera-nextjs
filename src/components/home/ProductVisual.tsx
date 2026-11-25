import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductVisual as Visual, type Product } from "@/config/products";

const FAN = [
    "-translate-x-[58%] translate-y-[6%] rotate-[-7deg] scale-[0.86] opacity-80",
    "z-10",
    "translate-x-[58%] translate-y-[6%] rotate-[7deg] scale-[0.86] opacity-80",
] as const;

function Chrome({ children, bar }: { children: React.ReactNode; bar: React.ReactNode }) {
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

export function ProductVisual({ product, name }: { product: Product; name: string }) {
    const [first] = product.images;

    if (product.visual === Visual.Phones) {
        return (
            <div className="relative mx-auto grid h-[min(56svh,560px)] min-h-[360px] place-items-center">
                {product.images.map((image, i) => (
                    <div
                        key={image.src}
                        className={cn(
                            "absolute aspect-[460/1000] h-full overflow-hidden rounded-[2.6rem] border-[6px] border-[#1b1b1f] bg-black shadow-[0_40px_100px_-30px_rgb(0_0_0/0.95),0_0_0_1px_rgb(255_255_255/0.08)]",
                            FAN[i],
                        )}
                    >
                        <Image src={image.src} alt={i === 1 ? name : ""} width={image.width} height={image.height} sizes="(min-width: 1024px) 280px, 45vw" className="size-full object-cover" />
                    </div>
                ))}
            </div>
        );
    }

    if (product.visual === Visual.MacWindow) {
        return (
            <div className="overflow-hidden rounded-xl shadow-[0_50px_120px_-30px_rgb(0_0_0/0.95),0_0_0_1px_rgb(255_255_255/0.07)]">
                <Image src={first.src} alt={name} width={first.width} height={first.height} sizes="(min-width: 1024px) 56vw, 100vw" className="w-full" />
            </div>
        );
    }

    if (product.visual === Visual.Browser) {
        return (
            <Chrome
                bar={
                    <span className="mx-auto flex h-6 min-w-0 max-w-[60%] flex-1 items-center justify-center rounded-md bg-foreground/[0.06] px-3 font-mono text-[11px] text-foreground/55">
                        {product.domain}
                    </span>
                }
            >
                <Image src={first.src} alt={name} width={first.width} height={first.height} sizes="(min-width: 1024px) 56vw, 100vw" className="w-full" />
            </Chrome>
        );
    }

    return (
        <Chrome
            bar={
                <span className="truncate font-mono text-[11px] text-foreground/55">
                    <span className="text-brand-bright">›</span> {product.command}
                </span>
            }
        >
            <Image src={first.src} alt={name} width={first.width} height={first.height} unoptimized loading="lazy" className="aspect-video w-full object-cover" />
        </Chrome>
    );
}
