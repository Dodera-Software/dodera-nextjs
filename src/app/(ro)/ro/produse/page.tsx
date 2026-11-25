import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ProductsIndex } from "@/components/products/ProductsIndex";
import { productsIndexJsonLd, productsIndexMetadata } from "@/lib/product-pages";

export const metadata: Metadata = productsIndexMetadata("ro");

export default function ProductsPage() {
    return (
        <>
            <JsonLd data={productsIndexJsonLd("ro")} />
            <ProductsIndex />
        </>
    );
}
