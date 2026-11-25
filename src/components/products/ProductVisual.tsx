import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProductVisual as Visual, type Product } from "@/config/products";
import { AddressBar, CommandBar, PhoneFrame, SCREEN_SHADOW, WindowChrome } from "./frames";

const FAN = [
    "-translate-x-[58%] translate-y-[6%] rotate-[-7deg] scale-[0.86] opacity-80",
    "z-10",
    "translate-x-[58%] translate-y-[6%] rotate-[7deg] scale-[0.86] opacity-80",
] as const;

export function ProductVisual({ product, name }: { product: Product; name: string }) {
    const [first] = product.images;

    if (product.visual === Visual.Phones) {
        return (
            <div className="relative mx-auto grid h-[min(56svh,560px)] min-h-[360px] place-items-center">
                {product.images.map((image, i) => (
                    <PhoneFrame key={image.src} image={image} alt={i === 1 ? name : ""} className={cn("absolute h-full", FAN[i])} />
                ))}
            </div>
        );
    }

    if (product.visual === Visual.MacWindow) {
        return (
            <div className={cn("overflow-hidden rounded-xl", SCREEN_SHADOW)}>
                <Image src={first.src} alt={name} width={first.width} height={first.height} sizes="(min-width: 1024px) 56vw, 100vw" className="w-full" />
            </div>
        );
    }

    if (product.visual === Visual.Browser) {
        return (
            <WindowChrome bar={<AddressBar>{product.domain}</AddressBar>}>
                <Image src={first.src} alt={name} width={first.width} height={first.height} sizes="(min-width: 1024px) 56vw, 100vw" className="w-full" />
            </WindowChrome>
        );
    }

    return (
        <WindowChrome bar={product.command && <CommandBar command={product.command} />}>
            <Image src={first.src} alt={name} width={first.width} height={first.height} unoptimized loading="lazy" className="aspect-video w-full object-cover" />
        </WindowChrome>
    );
}
