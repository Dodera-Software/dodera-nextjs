"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, viewportOnce } from "@/lib/animations";
import { TESTIMONIALS } from "@/config/testimonials";


function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`size-4 ${i < rating
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted"
                        }`}
                />
            ))}
        </div>
    );
}

export function TestimonialsSection() {
    const autoplayRef = useRef(
        Autoplay({ delay: 4500, stopOnInteraction: true })
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "center",
            slidesToScroll: 1,
        },
        [autoplayRef.current]
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        onSelect();
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback(
        (index: number) => emblaApi?.scrollTo(index),
        [emblaApi]
    );

    return (
        <section
            aria-labelledby="testimonials-heading"
            className="overflow-hidden py-20"
        >
            <div className="mx-auto max-w-7xl px-6">
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mb-12 text-center"
                >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Client Stories
                    </p>
                    <h2
                        id="testimonials-heading"
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                    >
                        Testimonials
                    </h2>
                </motion.div>
            </div>

            {/* Carousel */}
            <div className="relative">
                {/* Prev button */}
                <button
                    onClick={scrollPrev}
                    aria-label="Previous testimonial"
                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex size-9 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary sm:left-4 lg:left-8"
                >
                    <ChevronLeft className="size-4" />
                </button>

                {/* Embla viewport */}
                <div
                    className="overflow-hidden"
                    ref={emblaRef}
                    onMouseEnter={() => autoplayRef.current.stop()}
                    onMouseLeave={() => autoplayRef.current.play()}
                >
                    <div className="flex">
                        {TESTIMONIALS.map((t, index) => {
                            const isCenter = index === selectedIndex;
                            return (
                                <div
                                    key={t.name}
                                    className="min-w-0 flex-[0_0_85%] px-3 sm:flex-[0_0_60%] md:flex-[0_0_44%] lg:flex-[0_0_34%]"
                                >
                                    <div
                                        className={`flex h-full flex-col rounded-xl border p-6 transition-all duration-300 ${isCenter
                                            ? "border-border bg-card shadow-lg"
                                            : "border-transparent bg-card/30 opacity-50 blur-[0.5px]"
                                            }`}
                                    >
                                        {/* Quote mark */}
                                        <span
                                            className={`mb-4 font-serif text-5xl leading-none ${isCenter
                                                ? "text-primary"
                                                : "text-muted-foreground/30"
                                                }`}
                                            aria-hidden="true"
                                        >
                                            &ldquo;
                                        </span>

                                        {/* Review text */}
                                        <p
                                            className={`mb-5 flex-1 text-center text-sm leading-relaxed ${isCenter
                                                ? "text-foreground/80"
                                                : "text-muted-foreground"
                                                }`}
                                        >
                                            {t.review}
                                        </p>

                                        {/* Stars */}
                                        <div className="mb-3 flex justify-center">
                                            <StarRating rating={t.rating} />
                                        </div>

                                        {/* Name & role */}
                                        <div className="text-center">
                                            <p
                                                className={`text-sm font-semibold ${isCenter
                                                    ? "text-foreground"
                                                    : "text-muted-foreground"
                                                    }`}
                                            >
                                                {t.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {t.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Next button */}
                <button
                    onClick={scrollNext}
                    aria-label="Next testimonial"
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex size-9 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary sm:right-4 lg:right-8"
                >
                    <ChevronRight className="size-4" />
                </button>
            </div>

            {/* Dot indicators */}
            <div className="mt-8 flex justify-center gap-2">
                {scrollSnaps.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
                        className={`size-2 rounded-full transition-all duration-200 ${index === selectedIndex
                            ? "w-5 bg-primary"
                            : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
