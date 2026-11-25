import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProductPage } from "@/components/products/ProductPage";
import { findProductId, productJsonLd, productMetadata, productSlugs } from "@/lib/product-pages";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
    return productSlugs();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const id = findProductId((await params).slug);
    return id ? productMetadata(id, "en") : {};
}

export default async function ProductRoute({ params }: PageProps) {
    const id = findProductId((await params).slug);
    if (!id) notFound();
    return (
        <>
            <JsonLd data={productJsonLd(id, "en")} />
            <ProductPage id={id} />
        </>
    );
}
