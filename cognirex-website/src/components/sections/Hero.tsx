"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import HeroParticleWeb from "@/components/ui/HeroParticleWeb";
import { useCmsContent } from "@/context/CmsContentContext";

export default function Hero() {
  const { content } = useCmsContent();
  const hero = content.hero;

  return (
    <section
      id="hero"
      className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-[#F8F7FC] scroll-mt-20"
      aria-label="Cognirex Solutions Hero"
    >
      {/* Background restrained ambient geometries */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-[1240px] pointer-events-none -z-10">
        <div className="absolute -top-16 -left-12 w-64 h-64 rounded-full bg-[#EEE8FA]/60 blur-2xl" />
        <div className="absolute top-48 right-0 w-80 h-80 rounded-full bg-[#EEE8FA]/40 blur-3xl" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1F1B2E] tracking-tight leading-[1.12] mb-6 font-heading">
              {hero.headlineLine1} <br className="hidden sm:inline" />
              <span className="text-[#7C3AED]">{hero.headlineHighlight}</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-[#6F6A7C] max-w-xl leading-relaxed mb-8">
              {hero.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <Button href={hero.primaryCtaHref || "#solutions"} variant="yellow" size="lg" icon>
                {hero.primaryCtaLabel}
              </Button>
              <Link
                href={hero.secondaryCtaHref || "/contact"}
                className="inline-flex items-center text-sm font-semibold text-[#1F1B2E] hover:text-[#7C3AED] transition-colors py-2 group cursor-pointer"
              >
                <span>{hero.secondaryCtaLabel}</span>
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Composition with Interactive Particle Web Behind Photo */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end self-center my-auto min-h-[460px]">
            {/* Dynamic Constellation Particle Network Layer (Behind Photo) */}
            <div className="absolute -inset-16 sm:-inset-24 flex items-center justify-center pointer-events-none z-0">
              <HeroParticleWeb className="w-full h-full" />
            </div>

            {/* Concentric Subtle Orbital Rings for Depth */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              {/* Outer soft lavender circle */}
              <div
                className="w-[480px] h-[480px] rounded-full border border-[#7C3AED]/20 bg-[#EEE8FA]/25 animate-ripple-pulse"
                aria-hidden="true"
              />
              {/* Mid dashed orbital ring (clockwise) */}
              <div
                className="absolute w-[420px] h-[420px] rounded-full border border-dashed border-[#7C3AED]/30 animate-rotate-orbit"
                aria-hidden="true"
              />
            </div>

            <div className="relative w-full max-w-[390px] sm:max-w-[420px] z-10">
              {/* Floating yellow geometric accent with gentle pulse */}
              <div
                className="absolute top-1/2 -right-3.5 w-8 h-8 rounded-full bg-[#FACC15] shadow-md z-20 flex items-center justify-center animate-bounce duration-1000"
                aria-hidden="true"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#1F1B2E]" />
              </div>

              {/* Decorative small dots */}
              <div className="absolute -bottom-3 right-6 grid grid-cols-4 gap-1.5 opacity-50 z-20 animate-float-slow">
                {[...Array(12)].map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                ))}
              </div>

              {/* Main Image Container with padding & border frame */}
              <div className="relative rounded-2xl border-2 border-[#E5E1ED] shadow-card bg-white z-10 aspect-[4/4.2] group p-2.5">
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#E5E1ED]">
                  <Image
                    src={hero.heroImage || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop"}
                    alt={hero.heroImageAlt || "Cognirex Solutions - Digital Experience"}
                    fill
                    priority
                    unoptimized
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 420px"
                  />
                  {/* Subtle gradient vignette at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1B2E]/65 via-[#1F1B2E]/15 to-transparent opacity-85" />

                  <div className="absolute bottom-4 left-4 right-4 text-white z-20">
                    <span className="inline-block px-2 py-0.5 rounded bg-white/20 backdrop-blur-md text-[10px] font-semibold tracking-wide uppercase text-white mb-1">
                      {hero.imageBadge}
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug">
                      {hero.imageCaption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
