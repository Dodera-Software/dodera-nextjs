import Script from "next/script";
import { Inter, JetBrains_Mono, Mona_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { PrismicPreviewBar } from "@/components/PrismicPreviewBar";
import { HTML_LANG, type Locale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { ANALYTICS } from "@/config/analytics";
import { MOTION_QUERY, MotionMode, Theme, WEBGL_CLASS } from "@/config/theme";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const monaSans = Mona_Sans({
    subsets: ["latin"],
    axes: ["wdth"],
    variable: "--font-display",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    display: "swap",
    preload: false,
});

const NOTIFICATIONS_LABEL: Record<Locale, string> = {
    en: "Notifications",
    ro: "Notificări",
};

const motionScript = `(function(){var d=document.documentElement,c=navigator.connection;if(!matchMedia(${JSON.stringify(MOTION_QUERY)}).matches||(c&&c.saveData))return;d.classList.add(${JSON.stringify(MotionMode.Full)});try{var g=document.createElement("canvas").getContext("webgl2");if(g){d.classList.add(${JSON.stringify(WEBGL_CLASS)});var x=g.getExtension("WEBGL_lose_context");x&&x.loseContext()}}catch(e){}})()`;

export function RootDocument({
    locale,
    theme = Theme.Dark,
    children,
}: Readonly<{
    locale: Locale;
    theme?: Theme;
    children: React.ReactNode;
}>) {
    return (
        <html lang={HTML_LANG[locale]} data-theme={theme} suppressHydrationWarning>
            <head>{theme === Theme.Dark && <script dangerouslySetInnerHTML={{ __html: motionScript }} />}</head>
            <body className={`${inter.variable} ${monaSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}>
                <link rel="describedby" type="text/markdown" href="/llms.txt" title="llms.txt" />
                <link rel="describedby" type="text/markdown" href="/llms-full.txt" title="llms-full.txt" />
                <TooltipProvider>
                    <LocaleProvider locale={locale}>{children}</LocaleProvider>
                    <Toaster
                        position="top-center"
                        containerAriaLabel={NOTIFICATIONS_LABEL[locale]}
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
                <Script
                    src={ANALYTICS.src}
                    data-website-id={ANALYTICS.websiteId}
                    data-domains={ANALYTICS.domains}
                    data-do-not-track="true"
                    strategy="afterInteractive"
                />
            </body>
        </html>
    );
}
