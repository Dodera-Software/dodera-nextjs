import Link from "next/link";
import Image from "next/image";

export interface LogoProps {
    className?: string;
    /** Homepage of the current locale. */
    href?: string;
    /** Accessible name of the link, in the page's language. */
    label?: string;
}

/** Reusable brand mark + wordmark used in Navbar and Footer. */
export function Logo({ className, href = "/", label = "Dodera Software - Home" }: LogoProps) {
    return (
        <Link href={href} aria-label={label} className={className}>
            <Image src="/logo-icon.png" alt="Dodera Software" width={140} height={40} className="h-10 w-auto" priority />
        </Link>
    );
}
