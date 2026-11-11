"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, ChevronDown, Cpu, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { orbitalCardsData, OrbitalCardData } from "@/data/orbitalCards";

// Ring radii definition for desktop (scaled responsively)
const DESKTOP_RADII = [310, 420, 530, 650, 780];

export default function OrbitalHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animation phase states
  const [entrancePhase, setEntrancePhase] = useState<"logo" | "assemble" | "expand" | "ready">("logo");
  const [reducedMotion, setReducedMotion] = useState(false);

  // Mouse Parallax references
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const isVisibleRef = useRef(true);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // Entrance choreography sequence
  useEffect(() => {
    if (reducedMotion) {
      setEntrancePhase("ready");
      return;
    }

    // 0.0s - 0.7s: Initial brand mark appears
    const t1 = setTimeout(() => setEntrancePhase("assemble"), 700);

    // 0.7s - 1.6s: "COGNIREX SOLUTIONS" letters assemble from center
    const t2 = setTimeout(() => setEntrancePhase("expand"), 1600);

    // 1.6s - 2.8s: Circles reveal & cards scale into orbital positions
    const t3 = setTimeout(() => setEntrancePhase("ready"), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reducedMotion]);

  // Track visibility to pause animation loop when scrolled offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mouse Parallax listener
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to -1 ... 1
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    mouseRef.current.targetX = normX * 10;
    mouseRef.current.targetY = normY * 10;
  };

  const handlePointerLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  // Continuous Orbital Physics Loop
  useEffect(() => {
    if (reducedMotion) return;

    let animFrameId: number;
    let startTime: number | null = null;

    const updateOrbits = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedSeconds = (timestamp - startTime) / 1000;

      // Smooth mouse lerp
      mouseRef.current.currentX += (mouseRef.current.targetX - mouseRef.current.currentX) * 0.06;
      mouseRef.current.currentY += (mouseRef.current.targetY - mouseRef.current.currentY) * 0.06;

      if (isVisibleRef.current && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Responsive scale factor for radii
        const responsiveFactor = Math.max(0.48, Math.min(1.0, containerWidth / 1400));

        orbitalCardsData.forEach((card, index) => {
          const el = cardElementsRef.current[index];
          if (!el) return;

          const baseRadius = DESKTOP_RADII[card.ringIndex] || 400;
          const currentRadius = baseRadius * responsiveFactor;

          // Compute angle in radians: startAngle + elapsed * degreesPerSec
          const currentAngleDeg = card.initialAngle + elapsedSeconds * card.degreesPerSecond;
          const angleRad = (currentAngleDeg * Math.PI) / 180;

          // Center offsets
          const x = currentRadius * Math.cos(angleRad) + mouseRef.current.currentX * card.depth;
          const y = (currentRadius * 0.72) * Math.sin(angleRad) + mouseRef.current.currentY * card.depth;

          // Responsive scale adjustment
          const cardScale = card.scale * (containerWidth < 768 ? 0.75 : 1.0);

          // Apply direct hardware transform — CARD STAYS UPRIGHT (NO ROTATION ON CARD)
          el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${cardScale.toFixed(3)})`;
        });
      }

      animFrameId = requestAnimationFrame(updateOrbits);
    };

    animFrameId = requestAnimationFrame(updateOrbits);

    return () => cancelAnimationFrame(animFrameId);
  }, [reducedMotion]);

  const wordmarkLetters = "COGNIREX SOLUTIONS".split("");

  return (
    <section
      ref={containerRef}
      id="hero"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#F8F7FC] select-none scroll-mt-20 pt-16 pb-20"
      aria-label="Cognirex Solutions Hero"
    >
      {/* =========================================================================
          1. BACKGROUND AMBIENT GLOW MESH
      ========================================================================== */}
      <div className="absolute inset-0 pointer-events-none -z-20 overflow-hidden" aria-hidden="true">
        {/* Soft violet/lavender gradient top left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#EEE8FA]/80 blur-3xl" />
        {/* Deep tech blue accent bottom right */}
        <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full bg-[#7C3AED]/10 blur-3xl" />
        {/* Center subtle warm radiance */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full bg-gradient-to-tr from-[#EEE8FA]/40 via-white/80 to-[#FACC15]/10 blur-2xl" />
      </div>

      {/* =========================================================================
          2. CONCENTRIC ORBITAL RINGS (SVG)
      ========================================================================== */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none -z-10 transition-opacity duration-1000 ${
          entrancePhase === "logo" ? "opacity-0 scale-90" : "opacity-100 scale-100"
        }`}
        aria-hidden="true"
      >
        <svg
          viewBox="-800 -600 1600 1200"
          className="w-[180vw] sm:w-[150vw] lg:w-[1400px] h-[120vw] sm:h-[100vw] lg:h-[900px] max-w-none overflow-visible"
        >
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="arcAccent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FACC15" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Render 5 Concentric Technical Orbital Ellipses */}
          {DESKTOP_RADII.map((r, i) => (
            <g key={r}>
              {/* Main Hairline Orbital Path */}
              <ellipse
                cx="0"
                cy="0"
                rx={r}
                ry={r * 0.72}
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth={i === 2 ? "1.5" : "1"}
                strokeDasharray={i % 2 === 1 ? "4 6" : undefined}
                className="transition-all duration-700"
              />

              {/* Technical Radial Tick Marks / Partial Accent Arcs */}
              {i === 1 && (
                <ellipse
                  cx="0"
                  cy="0"
                  rx={r}
                  ry={r * 0.72}
                  fill="none"
                  stroke="url(#arcAccent)"
                  strokeWidth="2"
                  strokeDasharray="40 180"
                  strokeLinecap="round"
                />
              )}

              {i === 3 && (
                <ellipse
                  cx="0"
                  cy="0"
                  rx={r}
                  ry={r * 0.72}
                  fill="none"
                  stroke="#7C3AED"
                  strokeOpacity="0.2"
                  strokeWidth="1.5"
                  strokeDasharray="20 120"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* =========================================================================
          3. CONTINUOUS ORBITING MEDIA CARDS (HORIZONTALLY UPRIGHT)
      ========================================================================== */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none -z-5 transition-all duration-1000 ${
          entrancePhase === "ready" || reducedMotion
            ? "opacity-100"
            : "opacity-0 scale-75"
        }`}
        aria-hidden="true"
      >
        {orbitalCardsData.map((card, idx) => {
          // On mobile, show only a curated subset of 8 cards to avoid visual clutter
          const isMobileHidden = idx > 7;

          return (
            <div
              key={card.id}
              ref={(el) => {
                cardElementsRef.current[idx] = el;
              }}
              style={{
                width: `${card.width}px`,
                opacity: card.opacity,
              }}
              className={`absolute top-1/2 left-1/2 -mt-12 -ml-20 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-xs border border-[#E5E1ED] shadow-subtle hover:shadow-card-hover transition-shadow duration-300 pointer-events-auto group ${
                isMobileHidden ? "hidden sm:block" : "block"
              }`}
            >
              {/* Landscape 16:9 Thumbnail Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EEE8FA]">
                <img
                  src={card.image}
                  alt={card.altText}
                  loading={idx < 4 ? "eager" : "lazy"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1B2E]/65 via-transparent to-transparent" />

                {/* Pill Tag */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-semibold text-white tracking-wide">
                  <span className="truncate max-w-[85px] px-1.5 py-0.5 rounded-md bg-[#1F1B2E]/70 backdrop-blur-xs border border-white/10">
                    {card.tag}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                </div>
              </div>

              {/* Card Label Bar */}
              <div className="px-2.5 py-1.5 bg-white border-t border-[#F0EDF7] flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#1F1B2E] truncate group-hover:text-[#7C3AED] transition-colors">
                  {card.title}
                </span>
                <span className="text-[8px] font-mono text-[#7C3AED]">0{card.ringIndex + 1}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          4. CENTRAL READING MASK (PROTECTS CONTRAST FOR MAIN COPY)
      ========================================================================== */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] sm:w-[620px] lg:w-[740px] h-[520px] rounded-full pointer-events-none -z-2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(248, 247, 252, 0.96) 35%, rgba(248, 247, 252, 0.75) 60%, rgba(248, 247, 252, 0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* =========================================================================
          5. HERO CENTRAL CONTENT & ENTRANCE CHOREOGRAPHY
      ========================================================================== */}
      <div className="relative z-20 max-w-[840px] mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Phase A: Brand Mark Reveal (0.0s - 0.7s) */}
        <div
          className={`transition-all duration-700 ease-out mb-4 ${
            entrancePhase === "logo"
              ? "opacity-100 scale-100"
              : entrancePhase === "assemble"
              ? "opacity-90 scale-95"
              : "opacity-100 scale-90 mb-3"
          }`}
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#7C3AED] flex items-center justify-center text-white font-bold text-2xl shadow-md relative overflow-hidden mx-auto transition-transform hover:scale-105">
            <span className="font-heading">C</span>
            <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FACC15]" />
          </div>
        </div>

        {/* Phase B: Central Wordmark Assembly & Expansion (0.7s - 1.6s) */}
        <div
          className="mb-4 overflow-hidden"
          role="heading"
          aria-level={1}
          aria-label="Cognirex Solutions"
        >
          <div className="flex items-center justify-center flex-wrap gap-x-1 sm:gap-x-1.5 tracking-tight">
            {wordmarkLetters.map((char, i) => {
              const isSpace = char === " ";
              if (isSpace) {
                return <span key={`space-${i}`} className="w-2.5 sm:w-4" aria-hidden="true" />;
              }

              // Center-outwards stagger delay calculation
              const centerIndex = 8.5; // Middle of 18 chars
              const distanceFromCenter = Math.abs(i - centerIndex);
              const delayMs = reducedMotion ? 0 : Math.round(distanceFromCenter * 50);

              const isAssembled =
                entrancePhase === "assemble" ||
                entrancePhase === "expand" ||
                entrancePhase === "ready" ||
                reducedMotion;

              // Cognirex in midnight navy, Solutions in signature purple
              const isSolutions = i >= 9;

              return (
                <span
                  key={`letter-${i}`}
                  style={{
                    transitionDelay: `${delayMs}ms`,
                  }}
                  className={`inline-block font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl transition-all duration-600 ease-out ${
                    isSolutions ? "text-[#7C3AED]" : "text-[#1F1B2E]"
                  } ${
                    isAssembled
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-4 scale-75"
                  }`}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Phase C & D: Value Proposition & CTAs Reveal (1.8s - 3.0s) */}
        <div
          className={`transition-all duration-800 ease-out flex flex-col items-center ${
            entrancePhase === "expand" || entrancePhase === "ready" || reducedMotion
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          {/* Introductory Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEE8FA] border border-[#7C3AED]/20 text-xs font-bold uppercase tracking-wider text-[#7C3AED] mb-5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Intelligence Engineered • Next-Gen AI &amp; Digital Solutions</span>
          </div>

          {/* Main Hero Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1F1B2E] tracking-tight leading-[1.12] mb-5 font-heading">
            We Turn Your Business <br className="hidden sm:inline" />
            <span className="text-[#7C3AED]">into an Intelligent Digital Reality.</span>
          </h2>

          {/* Subtitle Value Copy */}
          <p className="text-base sm:text-lg md:text-xl text-[#6F6A7C] max-w-2xl mx-auto leading-relaxed mb-8">
            Harness next-generation web platforms, bespoke software architectures, and autonomous AI automation engineered to scale your operations and accelerate enterprise growth.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
            <Button
              href="/contact"
              variant="yellow"
              size="lg"
              icon
              className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all text-base cursor-pointer"
            >
              Let&apos;s Talk
            </Button>

            <a
              href="#ai-capabilities"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-[#EEE8FA] text-[#1F1B2E] hover:text-[#7C3AED] border border-[#E5E1ED] hover:border-[#7C3AED]/40 transition-all shadow-xs"
            >
              <Cpu className="w-4 h-4 text-[#7C3AED]" />
              <span>Explore AI Capabilities</span>
            </a>
          </div>

          {/* Key Value Metrics */}
          <div className="grid grid-cols-3 gap-6 sm:gap-12 pt-6 border-t border-[#E5E1ED]/80 w-full max-w-lg mx-auto text-center">
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#1F1B2E]">99.8%</p>
              <p className="text-[11px] font-medium text-[#6F6A7C] mt-0.5 uppercase tracking-wide">
                System Reliability
              </p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#7C3AED]">AI Native</p>
              <p className="text-[11px] font-medium text-[#6F6A7C] mt-0.5 uppercase tracking-wide">
                Engineered Models
              </p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#1F1B2E]">Enterprise</p>
              <p className="text-[11px] font-medium text-[#6F6A7C] mt-0.5 uppercase tracking-wide">
                Security &amp; NDA
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator Prompt */}
        <div
          className={`mt-10 transition-opacity duration-1000 ${
            entrancePhase === "ready" || reducedMotion ? "opacity-100" : "opacity-0"
          }`}
        >
          <a
            href="#capability-strip"
            className="inline-flex flex-col items-center gap-1 text-[11px] font-semibold text-[#8F8A9C] hover:text-[#7C3AED] transition-colors"
            aria-label="Scroll to capabilities"
          >
            <span>SCROLL TO DISCOVER</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#7C3AED]" />
          </a>
        </div>
      </div>
    </section>
  );
}
