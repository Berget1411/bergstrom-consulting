"use client";

import { useEffect, useRef } from "react";
import { ScrambleTextOnHover } from "@/components/scramble-text";
import {
  SplitFlapText,
  SplitFlapMuteToggle,
  SplitFlapAudioProvider,
} from "@/components/split-flap-text";
import { AnimatedNoise } from "@/components/animated-noise";
import { BitmapChevron } from "@/components/bitmap-chevron";
import { ThemeToggle } from "@/components/theme-toggle";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center pl-4 md:pl-28 pr-4 md:pr-12"
    >
      <AnimatedNoise opacity={0.03} />

      {/* Left vertical label — desktop only */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:block">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          BERGSTROM LABS
        </span>
      </div>

      {/* Main content */}
      <div
        ref={contentRef}
        className="flex-1 w-full max-w-full overflow-hidden"
      >
        <SplitFlapAudioProvider>
          <div className="relative">
            <div className="max-w-full overflow-hidden flex flex-col">
              <SplitFlapText text="BERGSTROM" speed={80} />
              <SplitFlapText text="LABS" speed={80} />
            </div>
            <div className="mt-4 flex items-center gap-6">
              <SplitFlapMuteToggle />
              <span className="h-3 w-[1px] bg-border" aria-hidden="true" />
              <ThemeToggle />
            </div>
          </div>
        </SplitFlapAudioProvider>

        <h2 className="font-[var(--font-bebas)] text-muted-foreground/60 text-[clamp(1rem,3vw,2rem)] mt-4 tracking-wide">
          Fullstack, Design, AI
        </h2>

        <p className="mt-12 max-w-md font-mono text-sm text-muted-foreground leading-relaxed">
          Designing and building AI-first software solutions for businesses and
          organizations using the latest technologies.
        </p>

        <div className="mt-16 flex items-center gap-8">
          <a
            href="#correspondence"
            className="group inline-flex items-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
          >
            <ScrambleTextOnHover text="Get in touch" as="span" duration={0.6} />
            <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
          </a>
          <a
            href="#work"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Latest Work
          </a>
        </div>
      </div>

      {/* Floating info tag */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
        <div className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Stockholm / Remote
        </div>
      </div>
    </section>
  );
}
