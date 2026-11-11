"use client";

import React, { useEffect, useId, useRef } from "react";
import { motion } from "framer-motion";

interface DesktopRoadmapSvgProps {
  isInView: boolean;
  activeStage: number;
  hoveredStage: number | null;
  reducedMotion: boolean;
  platformPulseRefs: React.MutableRefObject<(SVGGElement | null)[]>;
}

const MAIN_ROADMAP_PATH =
  "M 110 144 C 172 144, 192 108, 240 108 C 288 108, 308 144, 360 144 C 412 144, 432 108, 480 108 C 528 108, 548 144, 600 144 C 652 144, 672 108, 720 108 C 768 108, 788 144, 840 144 C 892 144, 912 108, 960 108 C 1008 108, 1028 144, 1090 144";

// Subtle secondary feedback arc connecting later stages back to Stage 02 (Plan & Design)
const FEEDBACK_LOOP_PATH = "M 920 176 C 815 206, 505 206, 360 174";

const BRIDGE_ARROWS = [
  { x: 240, y: 108, stageLeft: 0, stageRight: 1, delay: 0.75 },
  { x: 480, y: 108, stageLeft: 1, stageRight: 2, delay: 0.95 },
  { x: 720, y: 108, stageLeft: 2, stageRight: 3, delay: 1.15 },
  { x: 960, y: 108, stageLeft: 3, stageRight: 4, delay: 1.35 },
];

const PLATFORM_CENTERS_X = [120, 360, 600, 840, 1080];

export function DesktopRoadmapSvg({
  isInView,
  activeStage,
  hoveredStage,
  reducedMotion,
  platformPulseRefs,
}: DesktopRoadmapSvgProps) {
  const uid = useId().replace(/:/g, "");
  const ribbonGradId = `roadmap-ribbon-${uid}`;
  const sweepGradId = `roadmap-sweep-${uid}`;
  const particleGlowId = `roadmap-pglow-${uid}`;

  const mainPathRef = useRef<SVGPathElement | null>(null);
  const feedbackPathRef = useRef<SVGPathElement | null>(null);
  const particleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const particleHaloRefs = useRef<(SVGCircleElement | null)[]>([]);
  const feedbackParticleRefs = useRef<(SVGCircleElement | null)[]>([]);

  // 60 FPS imperatively updated path-following particle loop (zero React re-renders)
  useEffect(() => {
    if (reducedMotion || !isInView) return;
    const mainPath = mainPathRef.current;
    if (!mainPath) return;

    const totalLen = mainPath.getTotalLength();
    const feedbackPath = feedbackPathRef.current;
    const feedbackLen = feedbackPath ? feedbackPath.getTotalLength() : 0;

    let rafId = 0;
    let startTs = 0;

    const particleOffsets = [0, 0.25, 0.5, 0.75];
    const feedbackOffsets = [0, 0.5];

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const elapsedSec = (ts - startTs) / 1000;

      // Track peak proximity to each platform for smooth arrival pulse
      const platformGlow = [0.14, 0.14, 0.14, 0.14, 0.14];

      // Main roadmap travelling particles (speed ~ 10.5s per full traversal)
      const baseProgress = (elapsedSec / 10.5) % 1;
      for (let i = 0; i < particleOffsets.length; i++) {
        const t = (baseProgress + particleOffsets[i]) % 1;
        const pt = mainPath.getPointAtLength(t * totalLen);

        const dot = particleRefs.current[i];
        const halo = particleHaloRefs.current[i];
        // Fade gently at very start/end of curve
        const edgeFade = Math.min(1, Math.min(t * 14, (1 - t) * 14));

        if (dot) {
          dot.setAttribute("cx", pt.x.toFixed(1));
          dot.setAttribute("cy", pt.y.toFixed(1));
          dot.setAttribute("opacity", (0.95 * edgeFade).toFixed(2));
        }
        if (halo) {
          halo.setAttribute("cx", pt.x.toFixed(1));
          halo.setAttribute("cy", pt.y.toFixed(1));
          halo.setAttribute("opacity", (0.45 * edgeFade).toFixed(2));
        }

        // Check arrival proximity at each platform
        for (let p = 0; p < PLATFORM_CENTERS_X.length; p++) {
          const dx = Math.abs(pt.x - PLATFORM_CENTERS_X[p]);
          if (dx < 52) {
            const strength = (1 - dx / 52) * 0.78;
            if (strength > platformGlow[p]) {
              platformGlow[p] = strength;
            }
          }
        }
      }

      // Apply light pulse to platform halo layers directly
      for (let p = 0; p < platformPulseRefs.current.length; p++) {
        const el = platformPulseRefs.current[p];
        if (el) {
          el.style.opacity = platformGlow[p].toFixed(2);
        }
      }

      // Secondary continuous feedback particles (Stage 04/05 -> Stage 02)
      if (feedbackPath && feedbackLen > 0) {
        const fbBase = (elapsedSec / 9.0) % 1;
        for (let i = 0; i < feedbackOffsets.length; i++) {
          const ft = (fbBase + feedbackOffsets[i]) % 1;
          const fpt = feedbackPath.getPointAtLength(ft * feedbackLen);
          const fEl = feedbackParticleRefs.current[i];
          const edgeFade = Math.min(1, Math.min(ft * 8, (1 - ft) * 8));
          if (fEl) {
            fEl.setAttribute("cx", fpt.x.toFixed(1));
            fEl.setAttribute("cy", fpt.y.toFixed(1));
            fEl.setAttribute("opacity", (0.7 * edgeFade).toFixed(2));
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isInView, reducedMotion, platformPulseRefs]);

  const anyHover = hoveredStage !== null;

  return (
    <svg
      viewBox="0 0 1200 210"
      className="w-full h-auto overflow-visible select-none pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        {/* Main violet 3D roadmap gradient */}
        <linearGradient id={ribbonGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6D28D9" />
          <stop offset="25%" stopColor="#793BEE" />
          <stop offset="50%" stopColor="#9459F8" />
          <stop offset="75%" stopColor="#793BEE" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>

        {/* Animated glowing shimmer overlay */}
        <linearGradient id={sweepGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="45%" stopColor="#EEE8FA" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="55%" stopColor="#EEE8FA" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          {!reducedMotion && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1 0"
              to="1 0"
              dur="4.5s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>

        <radialGradient id={particleGlowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#793BEE" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Subtle Secondary Continuous Feedback Loop (Stage 04/05 -> Stage 02) */}
      <g>
        <motion.path
          ref={feedbackPathRef}
          d={FEEDBACK_LOOP_PATH}
          fill="none"
          stroke="#793BEE"
          strokeWidth="1.5"
          strokeOpacity="0.26"
          strokeDasharray="4 6"
          strokeLinecap="round"
          initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={
            isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration: 1.2, delay: reducedMotion ? 0 : 1.5, ease: "easeOut" }}
        />
        {/* Tiny arrow tip pointing back into Stage 02 */}
        <motion.path
          d="M 356 181 L 360 173 L 368 178"
          fill="none"
          stroke="#793BEE"
          strokeWidth="1.5"
          strokeOpacity="0.38"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: reducedMotion ? 0 : 2.3 }}
        />
        {/* Secondary travelling feedback particles */}
        {!reducedMotion &&
          [0, 1].map((idx) => (
            <circle
              key={`fb-p-${idx}`}
              ref={(el) => {
                feedbackParticleRefs.current[idx] = el;
              }}
              cx="920"
              cy="176"
              r="3"
              fill="#793BEE"
              opacity="0"
            />
          ))}
      </g>

      {/* Subtle moving ground ambient glow beneath the main roadmap */}
      <motion.path
        d={MAIN_ROADMAP_PATH}
        fill="none"
        stroke="#793BEE"
        strokeWidth={anyHover ? "32" : "26"}
        strokeLinecap="round"
        strokeOpacity={anyHover ? "0.22" : "0.14"}
        style={{ filter: "blur(8px)" }}
        initial={reducedMotion ? false : { pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.25, delay: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Base shadow edge of 3D violet ribbon */}
      <motion.path
        d={MAIN_ROADMAP_PATH}
        transform="translate(0, 4)"
        fill="none"
        stroke="#4C1D95"
        strokeWidth="22"
        strokeLinecap="round"
        strokeOpacity="0.28"
        initial={reducedMotion ? false : { pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.25, delay: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Primary Continuous Violet Roadmap Ribbon (ref used by getPointAtLength) */}
      <motion.path
        ref={mainPathRef}
        d={MAIN_ROADMAP_PATH}
        fill="none"
        stroke={`url(#${ribbonGradId})`}
        strokeWidth="20"
        strokeLinecap="round"
        initial={reducedMotion ? false : { pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.25, delay: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Animated Glowing Gradient Sweep along the Path */}
      <motion.path
        d={MAIN_ROADMAP_PATH}
        fill="none"
        stroke={`url(#${sweepGradId})`}
        strokeWidth="12"
        strokeLinecap="round"
        initial={reducedMotion ? false : { pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.25, delay: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Crisp White Top Rim Reflection inside the Ribbon */}
      <motion.path
        d={MAIN_ROADMAP_PATH}
        transform="translate(0, -3.5)"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.32"
        initial={reducedMotion ? false : { pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.25, delay: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Sequential Illuminated White Double-Chevron Arrows (>>) */}
      {BRIDGE_ARROWS.map((arrow, idx) => {
        const isLit =
          hoveredStage === arrow.stageLeft ||
          hoveredStage === arrow.stageRight ||
          activeStage >= arrow.stageRight;

        return (
          <g key={idx} transform={`translate(${arrow.x}, ${arrow.y})`}>
            <motion.g
              initial={reducedMotion ? false : { opacity: 0, scale: 0.75 }}
              animate={
                isInView
                  ? {
                      opacity: isLit ? 1 : 0.88,
                      scale: isLit ? 1.12 : 1,
                    }
                  : { opacity: 0, scale: 0.75 }
              }
              transition={{ duration: 0.45, delay: reducedMotion ? 0 : arrow.delay }}
            >
              {/* Subtle glow behind chevrons */}
              <ellipse cx="0" cy="0" rx="18" ry="10" fill="#FFFFFF" fillOpacity={isLit ? "0.32" : "0.14"} />
              <motion.g
                animate={
                  reducedMotion || !isInView
                    ? undefined
                    : { x: [0, 3, 0], opacity: [0.78, 1, 0.78] }
                }
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.35,
                }}
              >
                <path
                  d="M -8 -4.5 L -3 0 L -8 4.5"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 1 -4.5 L 6 0 L 1 4.5"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>
            </motion.g>
          </g>
        );
      })}

      {/* Travelling Violet/White Light Particles following the exact curved path */}
      {!reducedMotion &&
        [0, 1, 2, 3].map((idx) => (
          <g key={`p-grp-${idx}`}>
            <circle
              ref={(el) => {
                particleHaloRefs.current[idx] = el;
              }}
              cx="110"
              cy="144"
              r="9"
              fill={`url(#${particleGlowId})`}
              opacity="0"
            />
            <circle
              ref={(el) => {
                particleRefs.current[idx] = el;
              }}
              cx="110"
              cy="144"
              r="3.2"
              fill="#FFFFFF"
              stroke="#C4B5FD"
              strokeWidth="1"
              opacity="0"
            />
          </g>
        ))}
    </svg>
  );
}

/* ============================================================================
 * MOBILE VERTICAL CONNECTED ROADMAP CONNECTOR
 * ========================================================================== */
interface MobileConnectorProps {
  index: number;
  isInView: boolean;
  isActive: boolean;
  reducedMotion: boolean;
}

export function MobileVerticalConnector({
  index,
  isInView,
  isActive,
  reducedMotion,
}: MobileConnectorProps) {
  const uid = useId().replace(/:/g, "");
  const mobGradId = `mob-road-${index}-${uid}`;
  const pathRef = useRef<SVGPathElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);

  const curveD =
    index % 2 === 0
      ? "M 40 2 C 52 20, 28 42, 40 62"
      : "M 40 2 C 28 20, 52 42, 40 62";

  useEffect(() => {
    if (reducedMotion || !isInView) return;
    const p = pathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    let rafId = 0;
    let startTs = 0;

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = (((ts - startTs) / 1000) / 2.6 + index * 0.25) % 1;
      const pt = p.getPointAtLength(t * len);
      const dot = dotRef.current;
      if (dot) {
        dot.setAttribute("cx", pt.x.toFixed(1));
        dot.setAttribute("cy", pt.y.toFixed(1));
        dot.setAttribute("opacity", Math.min(1, Math.min(t * 8, (1 - t) * 8)).toFixed(2));
      }
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [index, isInView, reducedMotion]);

  return (
    <div className="flex justify-center -my-2 relative z-10 pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 80 64" className="w-20 h-14 overflow-visible">
        <defs>
          <linearGradient id={mobGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#793BEE" />
            <stop offset="50%" stopColor="#9459F8" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>

        <motion.path
          d={curveD}
          fill="none"
          stroke="#793BEE"
          strokeWidth="16"
          strokeOpacity={isActive ? "0.22" : "0.12"}
          strokeLinecap="round"
          style={{ filter: "blur(5px)" }}
          initial={reducedMotion ? false : { pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.25 + index * 0.12 }}
        />

        <motion.path
          ref={pathRef}
          d={curveD}
          fill="none"
          stroke={`url(#${mobGradId})`}
          strokeWidth="11"
          strokeLinecap="round"
          initial={reducedMotion ? false : { pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.25 + index * 0.12 }}
        />

        {/* Downward white >> chevrons */}
        <g transform="translate(40, 32)">
          <path
            d="M -3.5 -5 L 0 -1.5 L 3.5 -5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M -3.5 1.5 L 0 5 L 3.5 1.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {!reducedMotion && (
          <circle
            ref={dotRef}
            cx="40"
            cy="2"
            r="3"
            fill="#FFFFFF"
            stroke="#793BEE"
            strokeWidth="1"
            opacity="0"
          />
        )}
      </svg>
    </div>
  );
}
