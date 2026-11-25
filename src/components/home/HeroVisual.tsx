"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { WEBGL_CLASS } from "@/config/theme";
import { useSlideState } from "@/components/deck/Deck";
import type { HeroField } from "./hero-field";

const MARK_SRC = "/brand/mark-on-dark.svg";
const ARRIVAL_S = 2.8;
const POSTER_FALLBACK_MS = 3000;

enum FieldStatus {
    Idle = "idle",
    Live = "live",
    Failed = "failed",
}

export function HeroVisual() {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fieldRef = useRef<HeroField | null>(null);
    const [status, setStatus] = useState(FieldStatus.Idle);

    useSlideState(rootRef, ({ exit }) => fieldRef.current?.setExit(exit));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !document.documentElement.classList.contains(WEBGL_CLASS)) return;
        let disposed = false;
        let arrival: gsap.core.Tween | null = null;
        const fallback = window.setTimeout(() => setStatus((s) => (s === FieldStatus.Idle ? FieldStatus.Failed : s)), POSTER_FALLBACK_MS);
        import("./hero-field")
            .then(({ HeroField }) => {
                if (disposed) return;
                const field = new HeroField(canvas, {
                    markSrc: MARK_SRC,
                    onReady: () => {
                        window.clearTimeout(fallback);
                        setStatus(FieldStatus.Live);
                        const state = { value: 0 };
                        arrival = gsap.to(state, { value: 1, duration: ARRIVAL_S, ease: "power3.out", onUpdate: () => field.setAssemble(state.value) });
                    },
                });
                fieldRef.current = field;
                return field.load();
            })
            .catch(() => !disposed && setStatus(FieldStatus.Failed));
        return () => {
            disposed = true;
            window.clearTimeout(fallback);
            arrival?.kill();
            fieldRef.current?.dispose();
            fieldRef.current = null;
        };
    }, []);

    return (
        <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_72%_45%,hsl(var(--brand)/0.22),transparent_70%),radial-gradient(40%_40%_at_15%_90%,hsl(var(--brand-deep)/0.18),transparent_70%)]" />
            <div
                className={cn(
                    "hero-poster absolute right-[6%] top-1/2 hidden aspect-square w-[min(40vw,560px)] -translate-y-1/2 transition-opacity duration-1000 lg:block",
                    status === FieldStatus.Live && "opacity-0",
                    status === FieldStatus.Failed && "!opacity-100",
                )}
            >
                <div className="absolute inset-[12%] rounded-full bg-brand/30 blur-[90px]" />
                <Image src={MARK_SRC} alt="" fill unoptimized priority className="drop-shadow-[0_30px_80px_hsl(var(--brand)/0.45)]" />
            </div>
            <canvas
                ref={canvasRef}
                className={cn("absolute inset-0 size-full opacity-0 transition-opacity duration-1000", status === FieldStatus.Live && "opacity-100")}
            />
            <div className="grain" />
        </div>
    );
}
