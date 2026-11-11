"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";

interface IllustrationProps {
  isInView: boolean;
  isActive: boolean;
  isHovered: boolean;
  reducedMotion: boolean;
}

/* ============================================================================
 * STAGE 01 — RESEARCH & UNDERSTAND
 * ========================================================================== */
export function ResearchIllustration({
  isInView,
  isActive,
  isHovered,
  reducedMotion,
}: IllustrationProps) {
  const uid = useId().replace(/:/g, "");
  const docGrad = `res-doc-${uid}`;
  const glassGrad = `res-glass-${uid}`;
  const rimGrad = `res-rim-${uid}`;
  const barGrad = `res-bar-${uid}`;
  const scaleBoost = isHovered ? 1.05 : isActive ? 1.025 : 1;

  return (
    <motion.div
      className="relative w-full h-full flex items-end justify-center select-none pointer-events-none"
      animate={reducedMotion ? undefined : { scale: scaleBoost }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg viewBox="0 0 220 155" className="w-full h-auto overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={docGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EAE4FB" />
          </linearGradient>
          <linearGradient id={glassGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0F7FF" stopOpacity="0.88" />
            <stop offset="65%" stopColor="#B8DCFF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#793BEE" stopOpacity="0.28" />
          </linearGradient>
          <linearGradient id={rimGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6D5DF6" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#17142C" />
          </linearGradient>
          <linearGradient id={barGrad} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#793BEE" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>

        {/* Left floating mini research file tab */}
        <motion.g
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={
            isInView
              ? reducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 1, y: [0, -4, 0] }
              : { opacity: 0, y: 10 }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  opacity: { duration: 0.5, delay: 0.7 },
                  y: { duration: 4.4, repeat: Infinity, ease: "easeInOut" },
                }
          }
        >
          <rect
            x="22"
            y="50"
            width="28"
            height="34"
            rx="5"
            fill="#FFFFFF"
            stroke="#D6CCFA"
            strokeWidth="1"
            style={{ filter: "drop-shadow(0 4px 8px rgba(121,59,238,0.14))" }}
          />
          <rect x="27" y="57" width="16" height="3" rx="1.5" fill="#793BEE" fillOpacity="0.55" />
          <rect x="27" y="64" width="18" height="2.5" rx="1.2" fill="#C4B5FD" />
          <rect x="27" y="70" width="13" height="2.5" rx="1.2" fill="#C4B5FD" />
          <rect x="27" y="76" width="15" height="2.5" rx="1.2" fill="#DDD6FE" />
        </motion.g>

        {/* Right floating analytics mini-chart panel */}
        <motion.g
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={
            isInView
              ? reducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 1, y: [0, -5, 0] }
              : { opacity: 0, y: 12 }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  opacity: { duration: 0.5, delay: 0.85 },
                  y: { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                }
          }
        >
          <rect
            x="156"
            y="38"
            width="42"
            height="36"
            rx="6"
            fill="#FFFFFF"
            fillOpacity="0.92"
            stroke="#D5C8FB"
            strokeWidth="1"
            style={{ filter: "drop-shadow(0 6px 12px rgba(121,59,238,0.15))" }}
          />
          {[
            { x: 163, h: 12, delay: 0 },
            { x: 171, h: 18, delay: 0.18 },
            { x: 179, h: 15, delay: 0.36 },
            { x: 187, h: 22, delay: 0.54 },
          ].map((bar, idx) => (
            <motion.rect
              key={idx}
              x={bar.x}
              y={66 - bar.h}
              width="5"
              height={bar.h}
              rx="2"
              fill={`url(#${barGrad})`}
              style={{ transformOrigin: `${bar.x + 2.5}px 66px` }}
              animate={
                reducedMotion || !isInView
                  ? { scaleY: 1 }
                  : { scaleY: [0.45, 1, 0.72, 1] }
              }
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: bar.delay,
                    }
              }
            />
          ))}
        </motion.g>

        {/* Small floating data indicator pill */}
        <motion.g
          animate={
            reducedMotion || !isInView
              ? undefined
              : { opacity: [0.55, 1, 0.55], y: [0, -3, 0] }
          }
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect
            x="154"
            y="84"
            width="36"
            height="14"
            rx="7"
            fill="#FFFFFF"
            stroke="#D7CCF9"
            strokeWidth="1"
          />
          <circle cx="163" cy="91" r="2.6" fill="#793BEE" />
          <rect x="169" y="89.5" width="15" height="3" rx="1.5" fill="#B69DF8" />
        </motion.g>

        {/* Layered Research Documents resting on platform */}
        <motion.g
          animate={reducedMotion || !isInView ? undefined : { y: [0, -2.5, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M 62 118 L 118 98 L 164 114 L 108 134 Z"
            fill="#FFFFFF"
            stroke="#D6CCFA"
            strokeWidth="1"
            style={{ filter: "drop-shadow(0 6px 10px rgba(23,20,44,0.12))" }}
          />
          <line x1="84" y1="117" x2="122" y2="104" stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="94" y1="122" x2="132" y2="109" stroke="#DDD6FE" strokeWidth="2.5" strokeLinecap="round" />

          <g transform="rotate(-6 105 90)">
            <rect
              x="64"
              y="46"
              width="66"
              height="74"
              rx="7"
              fill={`url(#${docGrad})`}
              stroke="#CFC2FA"
              strokeWidth="1.2"
              style={{ filter: "drop-shadow(0 8px 16px rgba(23,20,44,0.14))" }}
            />
            <circle cx="84" cy="68" r="11" fill="#EEE8FA" stroke="#793BEE" strokeWidth="3.5" strokeDasharray="46 24" />
            <circle cx="84" cy="68" r="4" fill="#38BDF8" />

            {[
              { x: 100, y: 60, w: 22, d: 0.9 },
              { x: 100, y: 67, w: 18, d: 1.05 },
              { x: 100, y: 74, w: 20, d: 1.2 },
              { x: 73, y: 88, w: 46, d: 1.3 },
              { x: 73, y: 96, w: 38, d: 1.45 },
              { x: 73, y: 104, w: 28, d: 1.55 },
            ].map((line, i) => (
              <motion.rect
                key={i}
                x={line.x}
                y={line.y}
                width={line.w}
                height="3.5"
                rx="1.75"
                fill={i < 3 ? "#793BEE" : "#B8A9F5"}
                fillOpacity={i < 3 ? 0.65 : 0.55}
                initial={reducedMotion ? false : { scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                style={{ transformOrigin: `${line.x}px ${line.y}px` }}
                transition={{ duration: 0.45, delay: reducedMotion ? 0 : line.d }}
              />
            ))}
          </g>
        </motion.g>

        {/* Animated Scanning 3D Magnifying Glass */}
        <motion.g
          animate={
            reducedMotion || !isInView
              ? undefined
              : {
                  x: [0, 5, 2, -4, 0],
                  y: [0, -4, 3, -2, 0],
                  rotate: [0, 2.5, -1.5, 1, 0],
                }
          }
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "120px 96px" }}
        >
          <path
            d="M 136 108 L 158 124"
            stroke="#17142C"
            strokeWidth="9"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 4px 6px rgba(23,20,44,0.28))" }}
          />
          <path
            d="M 136 108 L 158 124"
            stroke="#4F46E5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.55"
          />
          <circle
            cx="118"
            cy="94"
            r="24"
            fill={`url(#${glassGrad})`}
            stroke={`url(#${rimGrad})`}
            strokeWidth="5.5"
            style={{ filter: "drop-shadow(0 8px 14px rgba(121,59,238,0.24))" }}
          />
          <path
            d="M 103 84 A 18 18 0 0 1 124 77"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
          <motion.circle
            cx="114"
            cy="96"
            r="3"
            fill="#793BEE"
            animate={
              reducedMotion || !isInView
                ? undefined
                : { opacity: [0.35, 0.9, 0.35], scale: [0.9, 1.25, 0.9] }
            }
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}

/* ============================================================================
 * STAGE 02 — PLAN & DESIGN
 * ========================================================================== */
export function PlanDesignIllustration({
  isInView,
  isActive,
  isHovered,
  reducedMotion,
}: IllustrationProps) {
  const uid = useId().replace(/:/g, "");
  const screenGrad = `plan-screen-${uid}`;
  const gearGrad = `plan-gear-${uid}`;
  const scaleBoost = isHovered ? 1.05 : isActive ? 1.025 : 1;

  return (
    <motion.div
      className="relative w-full h-full flex items-end justify-center select-none pointer-events-none"
      animate={reducedMotion ? undefined : { scale: scaleBoost }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg viewBox="0 0 220 155" className="w-full h-auto overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={screenGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.92" />
            <stop offset="55%" stopColor="#793BEE" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id={gearGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="55%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#17142C" />
          </linearGradient>
        </defs>

        {/* Left floating blueprint tab */}
        <motion.g
          animate={reducedMotion || !isInView ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect
            x="24"
            y="68"
            width="24"
            height="34"
            rx="4"
            fill="#FFFFFF"
            fillOpacity="0.92"
            stroke="#C7D2FE"
            strokeWidth="1"
            style={{ filter: "drop-shadow(0 4px 10px rgba(121,59,238,0.16))" }}
          />
          <rect x="29" y="75" width="14" height="8" rx="2" fill="#818CF8" fillOpacity="0.45" />
          <rect x="29" y="87" width="14" height="3" rx="1.5" fill="#793BEE" fillOpacity="0.5" />
          <rect x="29" y="93" width="10" height="3" rx="1.5" fill="#C4B5FD" />
        </motion.g>

        {/* Upper-right floating mini chart chip */}
        <motion.g
          animate={reducedMotion || !isInView ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          <rect
            x="162"
            y="46"
            width="32"
            height="24"
            rx="5"
            fill="#FFFFFF"
            fillOpacity="0.92"
            stroke="#D6CCFA"
            strokeWidth="1"
            style={{ filter: "drop-shadow(0 5px 10px rgba(121,59,238,0.14))" }}
          />
          <rect x="168" y="58" width="4" height="7" rx="1.5" fill="#793BEE" />
          <rect x="175" y="54" width="4" height="11" rx="1.5" fill="#60A5FA" />
          <rect x="182" y="51" width="4" height="14" rx="1.5" fill="#793BEE" />
        </motion.g>

        {/* Main 3D Angled Blueprint Screen */}
        <motion.g
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.65, delay: reducedMotion ? 0 : 0.7 }}
        >
          <path
            d="M 54 50 L 144 36 L 146 108 L 56 122 Z"
            fill="#FFFFFF"
            fillOpacity="0.65"
            stroke="#C4B5FD"
            strokeWidth="1.2"
          />
          <path
            d="M 62 56 L 152 42 L 154 114 L 64 128 Z"
            fill={`url(#${screenGrad})`}
            stroke="#FFFFFF"
            strokeOpacity="0.7"
            strokeWidth="1.5"
            style={{ filter: "drop-shadow(0 10px 18px rgba(79,70,229,0.28))" }}
          />
          <line x1="64" y1="78" x2="152" y2="64" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="0.8" />
          <line x1="64" y1="98" x2="153" y2="84" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="0.8" />
          <line x1="94" y1="51" x2="96" y2="123" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="0.8" />
          <line x1="122" y1="47" x2="124" y2="119" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="0.8" />

          <motion.path
            d="M 85 74 L 110 70 L 110 92 L 135 88"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reducedMotion ? false : { pathLength: 0, opacity: 0.3 }}
            animate={isInView ? { pathLength: 1, opacity: 0.9 } : { pathLength: 0 }}
            transition={{ duration: 1.1, delay: reducedMotion ? 0 : 1.0, ease: "easeInOut" }}
          />
          <motion.path
            d="M 85 74 L 85 100 L 110 92"
            fill="none"
            stroke="#C4F1FF"
            strokeWidth="1.4"
            strokeLinecap="round"
            initial={reducedMotion ? false : { pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.9, delay: reducedMotion ? 0 : 1.2, ease: "easeInOut" }}
          />

          {[
            { x: 77, y: 69, w: 16, h: 10, delay: 0 },
            { x: 102, y: 64, w: 16, h: 10, delay: 0.35 },
            { x: 102, y: 87, w: 16, h: 10, delay: 0.7 },
            { x: 127, y: 82, w: 16, h: 10, delay: 1.05 },
          ].map((node, i) => (
            <motion.rect
              key={i}
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              rx="2.5"
              fill="#FFFFFF"
              stroke="#C4F1FF"
              strokeWidth="1"
              animate={
                reducedMotion || !isInView
                  ? { fillOpacity: 0.9 }
                  : { fillOpacity: [0.55, 1, 0.55], scale: [1, 1.06, 1] }
              }
              style={{ transformOrigin: `${node.x + 8}px ${node.y + 5}px` }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: node.delay,
              }}
            />
          ))}
        </motion.g>

        {/* Slowly Rotating 3D Cogwheel / Gear */}
        <g transform="translate(154, 108)">
          <motion.g
            animate={reducedMotion || !isInView ? undefined : { rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <rect
                key={angle}
                x="-4.5"
                y="-23"
                width="9"
                height="8"
                rx="2"
                fill={`url(#${gearGrad})`}
                transform={`rotate(${angle})`}
              />
            ))}
            <circle
              cx="0"
              cy="0"
              r="16"
              fill={`url(#${gearGrad})`}
              stroke="#C7D2FE"
              strokeWidth="1.2"
              style={{ filter: "drop-shadow(0 6px 10px rgba(23,20,44,0.28))" }}
            />
            <circle cx="0" cy="0" r="6.5" fill="#EEE8FA" stroke="#4F46E5" strokeWidth="1.5" />
          </motion.g>
        </g>
      </svg>
    </motion.div>
  );
}

/* ============================================================================
 * STAGE 03 — BUILD A PROTOTYPE
 * ========================================================================== */
export function PrototypeIllustration({
  isInView,
  isActive,
  isHovered,
  reducedMotion,
}: IllustrationProps) {
  const uid = useId().replace(/:/g, "");
  const screenGrad = `proto-screen-${uid}`;
  const codeGrad = `proto-code-${uid}`;
  const scaleBoost = isHovered ? 1.05 : isActive ? 1.025 : 1;

  return (
    <motion.div
      className="relative w-full h-full flex items-end justify-center select-none pointer-events-none"
      animate={reducedMotion ? undefined : { scale: scaleBoost }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg viewBox="0 0 220 155" className="w-full h-auto overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={screenGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.25" />
            <stop offset="35%" stopColor="#60A5FA" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#793BEE" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id={codeGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#5B21B6" />
          </linearGradient>
        </defs>

        {/* Left subtle floating interface tab */}
        <motion.g
          animate={reducedMotion || !isInView ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect
            x="22"
            y="84"
            width="24"
            height="18"
            rx="4"
            fill="#FFFFFF"
            fillOpacity="0.88"
            stroke="#D6CCFA"
            strokeWidth="1"
          />
          <rect x="26" y="89" width="16" height="3" rx="1.5" fill="#793BEE" fillOpacity="0.5" />
          <rect x="26" y="95" width="11" height="2.5" rx="1.2" fill="#C4B5FD" />
        </motion.g>

        {/* 3D Open Laptop */}
        <g style={{ filter: "drop-shadow(0 10px 18px rgba(23,20,44,0.18))" }}>
          <path
            d="M 52 50 L 142 38 L 146 98 L 58 110 Z"
            fill="#17142C"
            stroke="#3B355B"
            strokeWidth="1.5"
          />
          <motion.path
            d="M 57 54 L 138 43 L 141 94 L 62 105 Z"
            fill={`url(#${screenGrad})`}
            animate={
              reducedMotion || !isInView
                ? { opacity: 1 }
                : { opacity: [0.85, 1, 0.85] }
            }
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />

          <g>
            <path d="M 60 59 L 135 49 L 135.5 55 L 60.5 65 Z" fill="#FFFFFF" fillOpacity="0.3" />
            <circle cx="65" cy="60.5" r="1.5" fill="#FFFFFF" />
            <circle cx="70" cy="59.8" r="1.5" fill="#FFC914" />

            <motion.g
              initial={reducedMotion ? false : { opacity: 0, x: -6 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
              transition={{ duration: 0.6, delay: reducedMotion ? 0 : 0.95 }}
            >
              <path d="M 63 69 L 97 64 L 98 93 L 65 98 Z" fill="#FFFFFF" fillOpacity="0.92" />
              <path d="M 66 72 L 94 68 L 94.5 81 L 67 85 Z" fill="#818CF8" fillOpacity="0.35" />
              <polygon points="70,82 77,73 83,80 87,76 92,80" fill="#793BEE" fillOpacity="0.6" />
              <line x1="68" y1="89" x2="92" y2="85.5" stroke="#793BEE" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
              <line x1="68" y1="93.5" x2="86" y2="91" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
            </motion.g>

            <motion.g
              initial={reducedMotion ? false : { opacity: 0, x: 6 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 6 }}
              transition={{ duration: 0.6, delay: reducedMotion ? 0 : 1.15 }}
            >
              <path d="M 102 63 L 134 59 L 135 88 L 103 92 Z" fill="#FFFFFF" fillOpacity="0.92" />
              <path d="M 105 66 L 131 62.5 L 131.5 75 L 105.5 78.5 Z" fill="#60A5FA" fillOpacity="0.35" />
              <polygon points="108,76 115,67 120,73 124,69 129,74" fill="#4F46E5" fillOpacity="0.6" />
              <line x1="106" y1="82.5" x2="128" y2="79.5" stroke="#793BEE" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
              <line x1="106" y1="87" x2="123" y2="84.8" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
          </g>

          <path
            d="M 58 110 L 146 98 L 178 113 L 90 128 Z"
            fill="#EAE5F9"
            stroke="#C7B9F7"
            strokeWidth="1.2"
          />
          <path d="M 58 110 L 90 128 L 90 132 L 58 114 Z" fill="#C7B9F7" />
          <path d="M 90 128 L 178 113 L 178 117 L 90 132 Z" fill="#D8CEFA" />
          <path d="M 74 111 L 141 102 L 159 111 L 92 121 Z" fill="#272245" fillOpacity="0.85" />
          <path d="M 112 120 L 132 117 L 139 120.5 L 119 123.5 Z" fill="#CFC4F7" />
        </g>

        {/* Floating Violet </> Code Badge */}
        <motion.g
          animate={
            reducedMotion || !isInView
              ? undefined
              : { y: [0, -5, 0], scale: [1, 1.04, 1] }
          }
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "173px 82px" }}
        >
          <rect
            x="154"
            y="64"
            width="38"
            height="34"
            rx="8"
            fill={`url(#${codeGrad})`}
            stroke="#C4B5FD"
            strokeWidth="1.2"
            style={{ filter: "drop-shadow(0 8px 14px rgba(121,59,238,0.34))" }}
          />
          <text
            x="173"
            y="86"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="14"
            fontWeight="700"
            fontFamily="monospace"
          >
            {"</>"}
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
}

/* ============================================================================
 * STAGE 04 — DEVELOP & TEST
 * ========================================================================== */
export function DevelopTestIllustration({
  isInView,
  isActive,
  isHovered,
  reducedMotion,
}: IllustrationProps) {
  const uid = useId().replace(/:/g, "");
  const srvGrad = `dev-srv-${uid}`;
  const shieldGrad = `dev-shield-${uid}`;
  const scaleBoost = isHovered ? 1.05 : isActive ? 1.025 : 1;

  return (
    <motion.div
      className="relative w-full h-full flex items-end justify-center select-none pointer-events-none"
      animate={reducedMotion ? undefined : { scale: scaleBoost }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg viewBox="0 0 220 155" className="w-full h-auto overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={srvGrad} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#17142C" />
            <stop offset="50%" stopColor="#4338CA" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>
          <linearGradient id={shieldGrad} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5EEAD4" />
            <stop offset="45%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#793BEE" />
          </linearGradient>
        </defs>

        <motion.path
          d="M 42 74 L 74 88"
          fill="none"
          stroke="#793BEE"
          strokeWidth="1.4"
          strokeDasharray="4 4"
          strokeOpacity="0.65"
          animate={reducedMotion || !isInView ? undefined : { strokeDashoffset: [16, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 150 92 L 180 78"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.4"
          strokeDasharray="4 4"
          strokeOpacity="0.7"
          animate={reducedMotion || !isInView ? undefined : { strokeDashoffset: [16, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />

        <motion.g
          animate={reducedMotion || !isInView ? undefined : { y: [0, -3.5, 0] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect
            x="22"
            y="60"
            width="28"
            height="18"
            rx="4"
            fill="#FFFFFF"
            stroke="#C7D2FE"
            strokeWidth="1"
            style={{ filter: "drop-shadow(0 4px 8px rgba(121,59,238,0.14))" }}
          />
          <circle cx="29" cy="69" r="2.2" fill="#38BDF8" />
          <rect x="34" y="67.5" width="12" height="3" rx="1.5" fill="#793BEE" fillOpacity="0.55" />
        </motion.g>

        <motion.g
          animate={reducedMotion || !isInView ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 4.9, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          <rect
            x="170"
            y="66"
            width="28"
            height="20"
            rx="4"
            fill="#FFFFFF"
            stroke="#BAE6FD"
            strokeWidth="1"
            style={{ filter: "drop-shadow(0 4px 8px rgba(56,189,248,0.16))" }}
          />
          <rect x="175" y="72" width="18" height="3" rx="1.5" fill="#793BEE" fillOpacity="0.6" />
          <rect x="175" y="78" width="12" height="2.5" rx="1.2" fill="#38BDF8" fillOpacity="0.7" />
        </motion.g>

        {/* Stacked 3D Cylindrical Database / Server Tiers */}
        <g style={{ filter: "drop-shadow(0 8px 14px rgba(23,20,44,0.22))" }}>
          {[
            { y: 105, delay: 0 },
            { y: 90, delay: 0.35 },
            { y: 75, delay: 0.7 },
          ].map((tier, idx) => (
            <g key={idx}>
              <path
                d={`M 68 ${tier.y} L 68 ${tier.y + 11} A 22 7 0 0 0 112 ${tier.y + 11} L 112 ${tier.y} Z`}
                fill={`url(#${srvGrad})`}
                stroke="#6366F1"
                strokeWidth="0.7"
              />
              <ellipse
                cx="90"
                cy={tier.y}
                rx="22"
                ry="7"
                fill="#4F46E5"
                stroke="#A5B4FC"
                strokeWidth="0.8"
              />
              <motion.circle
                cx="78"
                cy={tier.y + 7}
                r="1.8"
                fill="#5EEAD4"
                animate={
                  reducedMotion || !isInView
                    ? { opacity: 0.9 }
                    : { opacity: [0.3, 1, 0.3] }
                }
                transition={{
                  duration: 2.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: tier.delay,
                }}
              />
              <motion.rect
                x="84"
                y={tier.y + 6}
                width="14"
                height="2.2"
                rx="1.1"
                fill="#C4B5FD"
                animate={
                  reducedMotion || !isInView
                    ? { opacity: 0.8 }
                    : { opacity: [0.3, 0.95, 0.3] }
                }
                transition={{
                  duration: 2.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: tier.delay + 0.12,
                }}
              />
            </g>
          ))}
        </g>

        {/* Glossy 3D Validation Shield with Animated Checkmark */}
        <motion.g
          animate={reducedMotion || !isInView ? undefined : { y: [0, -3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.ellipse
            cx="134"
            cy="92"
            rx="28"
            ry="32"
            fill="#38BDF8"
            animate={
              reducedMotion || !isInView
                ? { opacity: 0.14 }
                : { opacity: [0.1, 0.28, 0.1] }
            }
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <path
            d="M 134 52 L 160 62 V 86 C 160 105 147 118 134 124 C 121 118 108 105 108 86 V 62 Z"
            fill={`url(#${shieldGrad})`}
            stroke="#FFFFFF"
            strokeWidth="2"
            style={{ filter: "drop-shadow(0 8px 16px rgba(56,189,248,0.34))" }}
          />
          <path
            d="M 134 56 L 156 64.5 V 86 C 156 102 145 113 134 119 V 56 Z"
            fill="#FFFFFF"
            fillOpacity="0.16"
          />
          <motion.path
            d="M 122 87 L 131 96 L 147 78"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={
              isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 0.75, delay: reducedMotion ? 0 : 1.15, ease: "easeOut" }}
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}

/* ============================================================================
 * STAGE 05 — LAUNCH & IMPROVE (WITH CHOREOGRAPHED ROCKET LAUNCH SEQUENCE)
 * ========================================================================== */
export function LaunchRocketIllustration({
  isInView,
  isActive,
  isHovered,
  reducedMotion,
}: IllustrationProps) {
  const uid = useId().replace(/:/g, "");
  const padGlow = `launch-pad-${uid}`;
  const rocketBody = `launch-body-${uid}`;
  const flameGrad = `launch-flame-${uid}`;
  const trailGrad = `launch-trail-${uid}`;
  const growthGrad = `launch-growth-${uid}`;

  const [launchCount, setLaunchCount] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const prevTriggerRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const shouldTrigger = isInView && (isActive || isHovered);

    if (shouldTrigger && !prevTriggerRef.current && !isLaunching) {
      setIsLaunching(true);
      setLaunchCount((c) => c + 1);
      timerRef.current = setTimeout(() => {
        setIsLaunching(false);
      }, 4200);
    }
    prevTriggerRef.current = shouldTrigger;
  }, [isInView, isActive, isHovered, isLaunching, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !isInView) return;
    const initialTimer = setTimeout(() => {
      setIsLaunching(true);
      setLaunchCount((c) => c + 1);
      timerRef.current = setTimeout(() => {
        setIsLaunching(false);
      }, 4200);
    }, 1700);
    return () => {
      clearTimeout(initialTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isInView, reducedMotion]);

  const scaleBoost = isHovered ? 1.05 : isActive ? 1.025 : 1;

  return (
    <motion.div
      className="relative w-full h-full flex items-end justify-center select-none pointer-events-none"
      animate={reducedMotion ? undefined : { scale: scaleBoost }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg viewBox="0 0 220 168" className="w-full h-auto overflow-visible" aria-hidden="true">
        <defs>
          <radialGradient id={padGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFC914" stopOpacity="0.72" />
            <stop offset="45%" stopColor="#793BEE" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#793BEE" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={rocketBody} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#EAE4FB" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
          <linearGradient id={flameGrad} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFC914" />
            <stop offset="80%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#793BEE" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={trailGrad} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#793BEE" stopOpacity="0" />
            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFC914" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id={growthGrad} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#793BEE" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#9D6BFF" />
          </linearGradient>
        </defs>

        {/* Circular Launchpad Ring on top of Platform 05 */}
        <ellipse
          cx="102"
          cy="132"
          rx="45"
          ry="14"
          fill="#FFFFFF"
          stroke="#C4B5FD"
          strokeWidth="1.2"
        />
        <ellipse cx="102" cy="132" rx="34" ry="10" fill={`url(#${padGlow})`} />

        {/* Rising Growth Bar Chart & Sweeping Upward Arrow on the Right */}
        <g>
          {[
            { x: 162, h: 20, delay: 0 },
            { x: 173, h: 31, delay: 0.12 },
            { x: 184, h: 44, delay: 0.24 },
          ].map((bar, idx) => (
            <motion.rect
              key={idx}
              x={bar.x}
              y={134 - bar.h}
              width="7.5"
              height={bar.h}
              rx="2.5"
              fill={`url(#${growthGrad})`}
              style={{ transformOrigin: `${bar.x + 3.75}px 134px` }}
              animate={
                reducedMotion || !isInView
                  ? { scaleY: 1 }
                  : isLaunching
                  ? { scaleY: [0.55, 1.08, 1] }
                  : { scaleY: [0.85, 1, 0.85] }
              }
              transition={{
                duration: isLaunching ? 1.4 : 3.6,
                repeat: isLaunching ? 0 : Infinity,
                ease: "easeInOut",
                delay: bar.delay,
              }}
            />
          ))}

          <motion.path
            d="M 140 118 Q 168 110 192 78"
            fill="none"
            stroke="#793BEE"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={reducedMotion ? false : { pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.9, delay: reducedMotion ? 0 : 1.1 }}
          />
          <motion.polygon
            points="196,72 184,76 193,85"
            fill="#793BEE"
            animate={
              reducedMotion || !isInView
                ? undefined
                : isLaunching
                ? { scale: [1, 1.25, 1] }
                : undefined
            }
            style={{ transformOrigin: "191px 78px" }}
            transition={{ duration: 0.8 }}
          />
        </g>

        {/* Soft Glowing Trail following Rocket movement */}
        {!reducedMotion && (
          <motion.path
            key={`trail-${launchCount}`}
            d="M 92 118 L 116 74"
            stroke={`url(#${trailGrad})`}
            strokeWidth="13"
            strokeLinecap="round"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={
              isLaunching
                ? { opacity: [0, 0.78, 0.65, 0], pathLength: [0, 1, 1, 0] }
                : { opacity: 0 }
            }
            transition={{ duration: 3.8, times: [0, 0.35, 0.72, 1], ease: "easeInOut" }}
          />
        )}

        {/* Fluffy White/Lavender Launch Clouds at Base */}
        <motion.g
          animate={
            reducedMotion || !isInView
              ? undefined
              : isLaunching
              ? { scale: [1, 1.09, 1], opacity: [0.95, 1, 0.95] }
              : { scale: [1, 1.02, 1] }
          }
          style={{ transformOrigin: "96px 126px" }}
          transition={{ duration: isLaunching ? 2.4 : 4.5, repeat: isLaunching ? 0 : Infinity }}
        >
          <circle cx="68" cy="126" r="12" fill="#FFFFFF" stroke="#E9E2FA" strokeWidth="0.9" />
          <circle cx="84" cy="121" r="16" fill="#FFFFFF" stroke="#E9E2FA" strokeWidth="0.9" />
          <circle cx="104" cy="127" r="13" fill="#F8F7FC" stroke="#E9E2FA" strokeWidth="0.9" />
          <circle cx="123" cy="128" r="11" fill="#FFFFFF" stroke="#E9E2FA" strokeWidth="0.9" />
          <ellipse cx="96" cy="131" rx="38" ry="9" fill="#FFFFFF" />
        </motion.g>

        {/* Small Exhaust Particles during ignition/ascent */}
        {!reducedMotion &&
          [
            { cx: 88, cy: 122, dx: -11, dy: 9, color: "#FFC914", r: 2.5 },
            { cx: 95, cy: 125, dx: 4, dy: 12, color: "#793BEE", r: 2.2 },
            { cx: 103, cy: 121, dx: 12, dy: 7, color: "#FFC914", r: 2 },
            { cx: 92, cy: 118, dx: -6, dy: 13, color: "#EEE8FA", r: 2.6 },
          ].map((p, idx) => (
            <motion.circle
              key={`exh-${launchCount}-${idx}`}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={p.color}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
              animate={
                isLaunching
                  ? {
                      opacity: [0, 0.95, 0],
                      x: [0, p.dx],
                      y: [0, p.dy],
                      scale: [0.4, 1.2, 0.2],
                    }
                  : { opacity: 0 }
              }
              transition={{
                duration: 1.4,
                delay: 0.25 + idx * 0.14,
                repeat: isLaunching ? 1 : 0,
                ease: "easeOut",
              }}
            />
          ))}

        {/* Rocket Group (Angled gracefully upward-right, launches & returns smoothly inside section) */}
        <motion.g
          key={`rocket-${launchCount}`}
          initial={{ x: 0, y: 0 }}
          animate={
            reducedMotion
              ? { x: 0, y: 0 }
              : isLaunching
              ? {
                  x: [0, 0, 13, 15, 0],
                  y: [0, 1.5, -36, -38, 0],
                }
              : {
                  y: [0, -2.5, 0],
                }
          }
          transition={
            isLaunching
              ? {
                  duration: 3.9,
                  times: [0, 0.16, 0.52, 0.68, 1],
                  ease: [0.22, 1, 0.36, 1],
                }
              : {
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          <g transform="translate(107, 82) scale(1.12) rotate(22)">
            <motion.path
              d="M -6 22 Q 0 46 6 22 Z"
              fill={`url(#${flameGrad})`}
              style={{ transformOrigin: "0px 22px" }}
              animate={
                reducedMotion
                  ? { scaleY: 0.9 }
                  : isLaunching
                  ? { scaleY: [0.7, 1.45, 1.35, 0.85], opacity: [0.75, 1, 1, 0.85] }
                  : { scaleY: [0.85, 1.05, 0.85], opacity: [0.8, 0.95, 0.8] }
              }
              transition={{
                duration: isLaunching ? 3.8 : 1.6,
                repeat: isLaunching ? 0 : Infinity,
                ease: "easeInOut",
              }}
            />
            <path d="M -11 6 L -20 20 L -9 18 Z" fill="#17142C" />
            <path d="M 11 6 L 20 20 L 9 18 Z" fill="#793BEE" />
            <path
              d="M 0 -28 C 12 -14 14 6 10 21 L -10 21 C -14 6 -12 -14 0 -28 Z"
              fill={`url(#${rocketBody})`}
              stroke="#C4B5FD"
              strokeWidth="0.9"
              style={{ filter: "drop-shadow(0 6px 12px rgba(23,20,44,0.2))" }}
            />
            <path d="M 0 -28 C 6 -21 9 -14 10 -10 L -10 -10 C -9 -14 -6 -21 0 -28 Z" fill="#17142C" />
            <rect x="-7" y="19" width="14" height="4" rx="1.5" fill="#17142C" />
            <circle cx="0" cy="-1" r="6" fill="#793BEE" stroke="#FFFFFF" strokeWidth="1.8" />
            <circle cx="-1.5" cy="-2.5" r="2" fill="#BAE6FD" fillOpacity="0.9" />
          </g>
        </motion.g>
      </svg>
    </motion.div>
  );
}
