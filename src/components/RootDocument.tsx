import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { PrismicPreviewBar } from "@/components/PrismicPreviewBar";
import { HTML_LANG, type Locale } from "@/i18n/config";

/* latin-ext carries the Romanian diacritics (ș, ț, ă, â, î). */
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

/* Only used by the hero terminal — not worth a preload on every page. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

/**
 * The `<html>`/`<body>` shell shared by every root layout. Each locale has
 * its own root layout (route groups `(en)` and `(ro)`) so `lang` is right.
 */
export function RootDocument({
  locale,
  children,
}: Readonly<{
  locale: Locale;
  children: React.ReactNode;
}>) {
  return (
    <html lang={HTML_LANG[locale]} className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <TooltipProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </TooltipProvider>
        <PrismicPreviewBar />
      </body>
    </html>
  );
}
