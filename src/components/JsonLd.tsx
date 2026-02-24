/**
 * Renders JSON-LD structured data as a `<script>` tag.
 * Can be used in Server Components (no "use client" needed).
 */

interface JsonLdProps {
    data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
    const items = Array.isArray(data) ? data : [data];

    return (
        <>
            {items.map((item, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
                />
            ))}
        </>
    );
}
