import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Deck } from "@/components/deck/Deck";

export function DeckPage({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>
                <Deck>{children}</Deck>
            </main>
            <Footer />
        </>
    );
}
