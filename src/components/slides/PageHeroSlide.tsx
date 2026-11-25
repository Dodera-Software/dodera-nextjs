import Image from "next/image";
import { Slide } from "@/components/deck/Slide";
import { Breadcrumb, type BreadcrumbItem } from "@/components/Breadcrumb";

export interface PageHeroSlideProps {
    id: string;
    label: string;
    title: string;
    highlight?: string;
    description?: React.ReactNode;
    breadcrumb?: BreadcrumbItem[];
    actions?: React.ReactNode;
    aside?: React.ReactNode;
    children?: React.ReactNode;
}

const MARK_SRC = "/brand/mark-on-dark.svg";

export function PageHeroSlide({ id, label, title, highlight, description, breadcrumb, actions, aside, children }: PageHeroSlideProps) {
    return (
        <Slide id={id} label={label} labelledBy={`${id}-title`} fit>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_85%_20%,hsl(var(--brand)/0.2),transparent_70%),radial-gradient(40%_50%_at_0%_100%,hsl(var(--brand-deep)/0.12),transparent_70%)]" />
            <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_80%_at_75%_30%,black,transparent)]" />
            {!aside && (
                <div aria-hidden="true" className="pointer-events-none absolute -right-[6vw] top-1/2 hidden aspect-square w-[min(38vw,560px)] -translate-y-1/2 opacity-[0.08] lg:block">
                    <Image src={MARK_SRC} alt="" fill unoptimized />
                </div>
            )}
            <div className="grain" aria-hidden="true" />
            <div className="wrap relative pb-20 pt-32 lg:pb-28 lg:pt-40">
                {breadcrumb && <Breadcrumb items={breadcrumb} className="mb-10" />}
                <div className={aside ? "grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16" : undefined}>
                    <div>
                        <h1 id={`${id}-title`} className="display-lg max-w-[16ch]">
                            {title}
                            {highlight && (
                                <>
                                    {" "}
                                    <span className="bg-gradient-to-r from-brand-bright to-[hsl(20_100%_70%)] bg-clip-text pr-[0.04em] text-transparent">{highlight}</span>
                                </>
                            )}
                        </h1>
                        {description && <p className="lede mt-8 max-w-[62ch]">{description}</p>}
                        {actions && <div className="mt-10 flex flex-wrap gap-3">{actions}</div>}
                        {children}
                    </div>
                    {aside}
                </div>
            </div>
        </Slide>
    );
}
