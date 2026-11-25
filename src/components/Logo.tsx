import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LogoProps {
    className?: string;
    href?: string;
    label?: string;
}

const LOGO = { src: "/brand/logo-on-dark.svg", width: 1223, height: 317 } as const;

export function Logo({ className, href = "/", label = "Dodera Software - Home" }: LogoProps) {
    return (
        <Link href={href} aria-label={label} className={cn("inline-flex shrink-0", className)}>
            <Image src={LOGO.src} alt="Dodera Software" width={LOGO.width} height={LOGO.height} className="h-8 w-auto" priority unoptimized />
        </Link>
    );
}
