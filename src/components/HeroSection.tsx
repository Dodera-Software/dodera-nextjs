"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal } from "@/components/Terminal";
import { fadeInUp, fadeInUpLg } from "@/lib/animations";

export function HeroSection() {
    return (
        <section aria-label="Hero" className="relative min-h-[100dvh] w-full overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 grid-bg" />

            <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl items-center px-6 py-24 pt-28 sm:pt-24">
                <div className="grid w-full gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Left - Copy */}
                    <div className="flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
                        <motion.h1
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.4, delay: 0.08 }}
                            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                        >
                            Software that{" "}
                            <span className="text-primary">Means&nbsp;Business.</span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.4, delay: 0.16 }}
                            className="max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground"
                        >
                            We offer premium IT consultancy specializing in high-performance AI
                            infrastructure, custom SaaS launches, and smart technical
                            documentation for visionary enterprises.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            transition={{ duration: 0.4, delay: 0.24 }}
                            className="flex flex-wrap justify-center gap-3 lg:justify-start"
                        >
                            <Button size="lg" asChild>
                                <Link href="/#contact">
                                    Start a Project
                                    <ArrowRight className="ml-1 size-4" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/#services">View Services</Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right - Terminal */}
                    <motion.div
                        variants={fadeInUpLg}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Terminal />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
