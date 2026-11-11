"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import AtmosphericBackground from "./process/AtmosphericBackground";
import PlatformBase from "./process/PlatformBase";
import { DesktopRoadmapSvg, MobileVerticalConnector } from "./process/RoadmapSvg";
import {
  DevelopTestIllustration,
  LaunchRocketIllustration,
  PlanDesignIllustration,
  PrototypeIllustration,
  ResearchIllustration,
} from "./process/StageIllustrations";
import { PROCESS_STAGES } from "./process/processData";
import { useCmsContent } from "@/context/CmsContentContext";

const STAGE_ILLUSTRATIONS = [
  ResearchIllustration,
  PlanDesignIllustration,
  PrototypeIllustration,
  DevelopTestIllustration,
  LaunchRocketIllustration,
] as const;

export default function ApproachProcess() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const platformPulseRefs = useRef<(SVGGElement | null)[]>([]);
  const prefersReduced = useReducedMotion();
  const reducedMotion = Boolean(prefersReduced);

  const { content } = useCmsContent();
  const processData = content.process;
  const stages = (processData.stages?.length ? processData.stages : PROCESS_STAGES).map((st, idx) => ({
    ...st,
    panelOffsetClass: st.panelOffsetClass ?? PROCESS_STAGES[idx]?.panelOffsetClass ?? "",
  }));

  const isInView = useInView(sectionRef, { once: true, amount: 0.08 });
  const [activeStage, setActiveStage] = useState<number>(0);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  // Natural scroll-triggered stage tracking without hijacking browser scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.72", "end 0.32"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!isInView) return;
    const clamped = Math.max(0, Math.min(0.999, progress));
    const nextStage = Math.min(4, Math.floor(clamped * 5));
    setActiveStage((prev) => (prev === nextStage ? prev : nextStage));
  });

  return (
    <section
      ref={sectionRef}
      id="approach"
      aria-label="Our Process — Cognirex Solutions"
      className="relative py-16 sm:py-20 md:py-24 bg-[#F8F7FC] border-b border-[#E5E1ED] overflow-x-clip scroll-mt-20"
    >
      {/* Atmospheric lavender/white sky, drifting clouds & micro-particles */}
      <AtmosphericBackground isInView={isInView} reducedMotion={reducedMotion} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Centered Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 md:mb-16">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: reducedMotion ? 0 : 0.15 }}
            className="mb-4"
          >
            <span className="inline-flex items-center justify-center px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.1em] text-[#793BEE] bg-white/85 backdrop-blur-xs border border-[#793BEE]/60 shadow-[0_2px_10px_rgba(121,59,238,0.08)]">
              {processData.badge}
            </span>
          </motion.div>

          <motion.h2
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{
              duration: 0.6,
              delay: reducedMotion ? 0 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-heading font-bold text-3xl sm:text-4xl md:text-[44px] text-[#17142C] tracking-tight leading-[1.15] mb-3.5"
          >
            {processData.title}
          </motion.h2>

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{
              duration: 0.55,
              delay: reducedMotion ? 0 : 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-sm sm:text-base md:text-[17px] text-[#6F6A7C] leading-relaxed max-w-2xl mx-auto"
          >
            {processData.description}
          </motion.p>
        </div>

        {/* ====================================================================
            DESKTOP & TABLET HORIZONTAL 5-PLATFORM 3D JOURNEY (>= md)
           ================================================================== */}
        <div className="hidden md:block relative pt-4 pb-6">
          {/* Continuous Flowing Violet Roadmap SVG behind the 5 platforms */}
          <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none">
            <DesktopRoadmapSvg
              isInView={isInView}
              activeStage={activeStage}
              hoveredStage={hoveredStage}
              reducedMotion={reducedMotion}
              platformPulseRefs={platformPulseRefs}
            />
          </div>

          {/* Five Columns: Floating Stage Panel + 3D Illustration + Elevated Platform */}
          <div className="grid grid-cols-5 gap-2.5 lg:gap-4 items-end relative z-20">
            {stages.map((stage, idx) => {
              const Illustration = STAGE_ILLUSTRATIONS[idx % STAGE_ILLUSTRATIONS.length];
              const isHovered = hoveredStage === idx;
              const isActive = activeStage === idx;
              const isHighlighted = isHovered || isActive;

              return (
                <div
                  key={stage.id}
                  tabIndex={0}
                  role="group"
                  aria-label={`${stage.number} ${stage.title}: ${stage.description}`}
                  aria-current={isActive ? "step" : undefined}
                  onMouseEnter={() => setHoveredStage(idx)}
                  onMouseLeave={() => setHoveredStage(null)}
                  onFocus={() => setHoveredStage(idx)}
                  onBlur={() => setHoveredStage(null)}
                  onClick={() => setActiveStage(idx)}
                  className="flex flex-col items-center cursor-pointer focus-visible:outline-none group"
                >
                  {/* Floating Stage Info Panel */}
                  <motion.div
                    initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{
                      duration: 0.55,
                      delay: reducedMotion ? 0 : 0.6 + idx * 0.13,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`w-full mb-3 lg:mb-4 transition-transform duration-300 ${stage.panelOffsetClass}`}
                  >
                    <div
                      className={`relative pt-5 pb-3.5 px-2.5 lg:px-4 rounded-2xl backdrop-blur-md border transition-all duration-300 text-center min-h-[84px] lg:min-h-[92px] flex flex-col justify-center ${
                        isHighlighted
                          ? "bg-white/95 border-[#793BEE]/45 shadow-[0_14px_32px_rgba(121,59,238,0.16)] -translate-y-1"
                          : "bg-white/80 border-white/90 shadow-[0_8px_24px_rgba(23,20,44,0.06)]"
                      }`}
                    >
                      {/* Centered Circular Stage Badge */}
                      <motion.div
                        animate={
                          reducedMotion
                            ? undefined
                            : { scale: isHighlighted ? 1.1 : 1 }
                        }
                        transition={{ duration: 0.25 }}
                        className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-[11px] lg:text-xs font-bold text-white font-heading shadow-md transition-all duration-300 ${
                          isHighlighted
                            ? "bg-[#793BEE] ring-4 ring-[#793BEE]/25 shadow-[0_4px_14px_rgba(121,59,238,0.5)]"
                            : "bg-[#793BEE]"
                        }`}
                      >
                        {stage.number}
                      </motion.div>

                      <h3 className="font-heading font-bold text-[12px] lg:text-[15px] text-[#17142C] leading-snug mb-1">
                        {stage.title}
                      </h3>
                      <p className="text-[10.5px] lg:text-xs text-[#6F6A7C] leading-snug">
                        {stage.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* 3D Stage Illustration + Elevated Platform Pedestal */}
                  <motion.div
                    initial={reducedMotion ? false : { opacity: 0, y: 28 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }
                    }
                    transition={{
                      duration: 0.65,
                      delay: reducedMotion ? 0 : 0.45 + idx * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="w-full flex flex-col items-center relative"
                  >
                    {/* Illustration resting on top of the 3D platform deck */}
                    <motion.div
                      initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
                      animate={
                        isInView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.92 }
                      }
                      transition={{
                        duration: 0.55,
                        delay: reducedMotion ? 0 : 0.75 + idx * 0.14,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="w-[88%] lg:w-[90%] relative z-20 -mb-12 lg:-mb-16"
                    >
                      <Illustration
                        isInView={isInView}
                        isActive={isActive}
                        isHovered={isHovered}
                        reducedMotion={reducedMotion}
                      />
                    </motion.div>

                    {/* 3D Elevated Platform */}
                    <div className="w-full relative z-10">
                      <PlatformBase
                        stageIndex={idx}
                        isActive={isActive}
                        isHovered={isHovered}
                        reducedMotion={reducedMotion}
                        pulseLayerRef={(el) => {
                          platformPulseRefs.current[idx] = el;
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ====================================================================
            MOBILE CONNECTED VERTICAL 5-STAGE JOURNEY (< md)
           ================================================================== */}
        <div className="md:hidden relative pl-4">
          {/* Subtle vertical continuous feedback rail connecting Stage 05 -> Stage 02 */}
          <div
            className="absolute left-1 top-[24%] bottom-[16%] w-px border-l border-dashed border-[#793BEE]/30 pointer-events-none"
            aria-hidden="true"
          >
            <span className="absolute -top-1 -left-[3.5px] w-2 h-2 border-t border-l border-[#793BEE]/45 rotate-45" />
          </div>

          <div className="flex flex-col items-center">
            {stages.map((stage, idx) => {
              const Illustration = STAGE_ILLUSTRATIONS[idx % STAGE_ILLUSTRATIONS.length];
              const isActive = activeStage === idx;

              return (
                <React.Fragment key={stage.id}>
                  <motion.div
                    initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setActiveStage(idx)}
                    className="w-full max-w-[330px] flex flex-col items-center relative z-20"
                  >
                    {/* Floating Info Panel */}
                    <div
                      className={`relative w-full pt-5 pb-3.5 px-5 rounded-2xl bg-white/90 backdrop-blur-sm border text-center transition-all duration-300 mb-2 ${
                        isActive
                          ? "border-[#793BEE]/45 shadow-[0_12px_28px_rgba(121,59,238,0.14)]"
                          : "border-[#EEE8FA] shadow-[0_6px_20px_rgba(23,20,44,0.05)]"
                      }`}
                    >
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#793BEE] text-white text-xs font-bold font-heading flex items-center justify-center shadow-md">
                        {stage.number}
                      </div>
                      <h3 className="font-heading font-bold text-base text-[#17142C] mb-1">
                        {stage.title}
                      </h3>
                      <p className="text-xs text-[#6F6A7C] leading-relaxed">
                        {stage.description}
                      </p>
                    </div>

                    {/* 3D Illustration + Platform */}
                    <div className="w-[220px] relative z-20 -mb-16">
                      <Illustration
                        isInView={isInView}
                        isActive={isActive}
                        isHovered={false}
                        reducedMotion={reducedMotion}
                      />
                    </div>
                    <div className="w-[240px] relative z-10">
                      <PlatformBase
                        stageIndex={idx + 10}
                        isActive={isActive}
                        isHovered={false}
                        reducedMotion={reducedMotion}
                      />
                    </div>
                  </motion.div>

                  {/* Connected vertical roadmap segment between stages */}
                  {idx < PROCESS_STAGES.length - 1 && (
                    <MobileVerticalConnector
                      index={idx}
                      isInView={isInView}
                      isActive={activeStage >= idx}
                      reducedMotion={reducedMotion}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
