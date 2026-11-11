"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";

interface PlatformBaseProps {
  stageIndex: number;
  isActive: boolean;
  isHovered: boolean;
  reducedMotion: boolean;
  pulseLayerRef?: (el: SVGGElement | null) => void;
}

/**
 * Generates an isometric rounded-square path centered at (cx, cy) with
 * horizontal half-diagonal `rx`, vertical half-diagonal `ry`, and corner radius `corner`.
 */
function buildIsometricDiamondPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  corner = 0.16
): string {
  const top = { x: cx, y: cy - ry };
  const right = { x: cx + rx, y: cy };
  const bottom = { x: cx, y: cy + ry };
  const left = { x: cx - rx, y: cy };

  const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  });

  const tL = lerp(top, left, corner);
  const tR = lerp(top, right, corner);
  const rT = lerp(right, top, corner);
  const rB = lerp(right, bottom, corner);
  const bR = lerp(bottom, right, corner);
  const bL = lerp(bottom, left, corner);
  const lB = lerp(left, bottom, corner);
  const lT = lerp(left, top, corner);

  return [
    `M ${tR.x.toFixed(1)} ${tR.y.toFixed(1)}`,
    `L ${rT.x.toFixed(1)} ${rT.y.toFixed(1)}`,
    `Q ${right.x} ${right.y} ${rB.x.toFixed(1)} ${rB.y.toFixed(1)}`,
    `L ${bR.x.toFixed(1)} ${bR.y.toFixed(1)}`,
    `Q ${bottom.x} ${bottom.y} ${bL.x.toFixed(1)} ${bL.y.toFixed(1)}`,
    `L ${lB.x.toFixed(1)} ${lB.y.toFixed(1)}`,
    `Q ${left.x} ${left.y} ${lT.x.toFixed(1)} ${lT.y.toFixed(1)}`,
    `L ${tL.x.toFixed(1)} ${tL.y.toFixed(1)}`,
    `Q ${top.x} ${top.y} ${tR.x.toFixed(1)} ${tR.y.toFixed(1)}`,
    "Z",
  ].join(" ");
}

export default function PlatformBase({
  stageIndex,
  isActive,
  isHovered,
  reducedMotion,
  pulseLayerRef,
}: PlatformBaseProps) {
  const uid = useId().replace(/:/g, "");
  const idPrefix = `plat-${stageIndex}-${uid}`;
  const cx = 120;

  // Isometric diamond layers from bottom to top
  const lowerSkirt = buildIsometricDiamondPath(cx, 74, 96, 34, 0.16);
  const glowBand = buildIsometricDiamondPath(cx, 63, 93, 33, 0.16);
  const upperWall = buildIsometricDiamondPath(cx, 54, 95, 34, 0.16);
  const upperDeck = buildIsometricDiamondPath(cx, 44, 95, 34, 0.16);
  const innerInset = buildIsometricDiamondPath(cx, 44, 83, 29, 0.16);

  const elevated = isActive || isHovered;

  return (
    <motion.div
      className="relative w-full pointer-events-none select-none"
      animate={
        reducedMotion
          ? undefined
          : {
              y: isHovered ? -6 : isActive ? -3 : 0,
            }
      }
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        viewBox="0 0 240 130"
        className="w-full h-auto overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${idPrefix}-floorGlow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#793BEE" stopOpacity={elevated ? "0.42" : "0.24"} />
            <stop offset="60%" stopColor="#793BEE" stopOpacity={elevated ? "0.14" : "0.08"} />
            <stop offset="100%" stopColor="#EEE8FA" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={`${idPrefix}-skirtGrad`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D8CEF2" />
            <stop offset="50%" stopColor="#F5F2FC" />
            <stop offset="100%" stopColor="#E1D8F6" />
          </linearGradient>

          <linearGradient id={`${idPrefix}-glowBandGrad`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6524DF" />
            <stop offset="50%" stopColor="#9A68FF" />
            <stop offset="100%" stopColor="#793BEE" />
          </linearGradient>

          <linearGradient id={`${idPrefix}-wallGrad`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DCD3F3" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E6DFFA" />
          </linearGradient>

          <linearGradient id={`${idPrefix}-deckGrad`} x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F8F7FC" />
            <stop offset="100%" stopColor="#EEE8FA" />
          </linearGradient>
        </defs>

        {/* Concentric floor glow & subtle halo rings */}
        <ellipse cx={cx} cy={88} rx={116} ry={34} fill={`url(#${idPrefix}-floorGlow)`} />
        <ellipse
          cx={cx}
          cy={88}
          rx={112}
          ry={31}
          fill="none"
          stroke="#793BEE"
          strokeWidth={elevated ? "1.3" : "0.9"}
          strokeOpacity={elevated ? "0.35" : "0.18"}
        />
        <ellipse
          cx={cx}
          cy={87}
          rx={100}
          ry={27}
          fill="none"
          stroke="#793BEE"
          strokeWidth="0.9"
          strokeOpacity={elevated ? "0.48" : "0.24"}
        />

        {/* Subtle moving highlight pulse layer controlled via RAF when particles arrive */}
        <g ref={pulseLayerRef} style={{ opacity: 0.15 }}>
          <ellipse
            cx={cx}
            cy={86}
            rx={106}
            ry={29}
            fill="none"
            stroke="#793BEE"
            strokeWidth="2.4"
          />
          <ellipse cx={cx} cy={70} rx={86} ry={22} fill="#793BEE" fillOpacity="0.22" />
        </g>

        {/* Lower base slab */}
        <path
          d={lowerSkirt}
          fill={`url(#${idPrefix}-skirtGrad)`}
          stroke="#DCD4F2"
          strokeWidth="0.8"
        />

        {/* Illuminated violet core layer */}
        <path
          d={glowBand}
          fill={`url(#${idPrefix}-glowBandGrad)`}
          stroke="#B492FF"
          strokeWidth="0.9"
          style={{
            filter: elevated
              ? "drop-shadow(0 0 8px rgba(121, 59, 238, 0.55))"
              : "drop-shadow(0 0 4px rgba(121, 59, 238, 0.3))",
          }}
        />

        {/* Upper platform side bevel */}
        <path
          d={upperWall}
          fill={`url(#${idPrefix}-wallGrad)`}
          stroke="#E4DCF7"
          strokeWidth="0.8"
        />

        {/* Top deck surface */}
        <path
          d={upperDeck}
          fill={`url(#${idPrefix}-deckGrad)`}
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />

        {/* Subtle recessed inner deck highlight */}
        <path
          d={innerInset}
          fill="none"
          stroke="#793BEE"
          strokeOpacity={elevated ? "0.22" : "0.12"}
          strokeWidth="0.9"
        />
      </svg>
    </motion.div>
  );
}
