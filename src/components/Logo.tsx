import Link from "next/link";
import Image from "next/image";

interface LogoProps {
    className?: string;
}

/** Reusable brand mark + wordmark used in Navbar and Footer. */
export function Logo({ className }: LogoProps) {
    return (
        <Link href="/" aria-label="Dodera Software - Home" className={className}>
            <Image src="/logo-icon.png" alt="Dodera Software" width={140} height={40} className="h-10 w-auto" priority />
        </Link>
    );
}
