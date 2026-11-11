"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";

interface AtmosphericBackgroundProps {
  isInView: boolean;
  reducedMotion: boolean;
}

function CloudShape({
  className,
  delay = 0,
  driftX = 14,
  duration = 20,
  isInView,
  reducedMotion,
}: {
  className: string;
  delay?: number;
  driftX?: number;
  duration?: number;
  isInView: boolean;
  reducedMotion: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const gradId = `cloud-g-${uid}`;

  return (
    <motion.div
      className={`pointer-events-none select-none absolute ${className}`}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
      animate={
        isInView
          ? reducedMotion
            ? { opacity: 0.9, scale: 1 }
            : {
                opacity: 0.92,
                scale: 1,
                x: [0, driftX, 0],
                y: [0, -5, 0],
              }
          : { opacity: 0 }
      }
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              opacity: { duration: 0.9, delay: 0.1 + delay },
              scale: { duration: 0.9, delay: 0.1 + delay },
              x: { duration, repeat: Infinity, ease: "easeInOut", delay },
              y: { duration: duration * 0.75, repeat: Infinity, ease: "easeInOut", delay },
            }
      }
      aria-hidden="true"
    >
      <svg viewBox="0 0 180 80" className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="65%" stopColor="#F4F0FC" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#DDD3F7" stopOpacity="0.88" />
          </linearGradient>
        </defs>
        <path
          d="M 28 64 C 14 64, 6 54, 10 42 C 13 33, 23 29, 32 31 C 36 16, 52 8, 69 12 C 80 14, 88 21, 93 29 C 101 23, 113 21, 124 26 C 135 31, 141 41, 140 50 C 150 49, 160 54, 160 61 C 160 66, 152 68, 142 68 L 32 68 C 29 68, 28 66, 28 64 Z"
          fill={`url(#${gradId})`}
          style={{ filter: "drop-shadow(0 8px 18px rgba(121, 59, 238, 0.08))" }}
        />
      </svg>
    </motion.div>
  );
}

const DECORATIVE_ORBS = [
  { top: "24%", left: "16%", size: 10, delay: 0, dur: 7 },
  { top: "55%", left: "22%", size: 11, delay: 1.2, dur: 8.5 },
  { top: "48%", left: "59%", size: 9, delay: 0.6, dur: 7.8 },
  { top: "78%", left: "58%", size: 10, delay: 1.8, dur: 9 },
  { top: "63%", left: "3%", size: 10, delay: 0.4, dur: 8.2 },
  { top: "28%", right: "8%", size: 8, delay: 1.5, dur: 7.4 },
];

export default function AtmosphericBackground({
  isInView,
  reducedMotion,
}: AtmosphericBackgroundProps) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.7 }}
      aria-hidden="true"
    >
      {/* Primary light lavender & white atmospheric washes */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 65% at 50% 30%, #FFFFFF 0%, #F8F7FC 48%, #EEE8FA 100%)",
        }}
      />

      {/* Soft moving ambient violet light bloom */}
      <motion.div
        className="absolute -top-24 left-1/4 w-[520px] h-[360px] rounded-full bg-[#EEE8FA]/70 blur-3xl"
        animate={
          reducedMotion || !isInView
            ? undefined
            : { x: [-20, 30, -20], opacity: [0.45, 0.7, 0.45] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/5 w-[480px] h-[280px] rounded-full bg-[#793BEE]/[0.07] blur-3xl"
        animate={
          reducedMotion || !isInView
            ? undefined
            : { x: [20, -25, 20], opacity: [0.4, 0.65, 0.4] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sweeping delicate atmospheric wave ribbons matching reference backdrop */}
      <svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full opacity-60"
      >
        <path
          d="M -60 220 C 260 60, 560 40, 880 170 C 1140 275, 1310 195, 1500 80"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        <path
          d="M -60 480 C 240 340, 520 530, 860 420 C 1140 330, 1300 440, 1500 360"
          fill="none"
          stroke="#793BEE"
          strokeOpacity="0.08"
          strokeWidth="1.5"
        />
        <path
          d="M 100 120 C 420 260, 740 120, 1120 240"
          fill="none"
          stroke="#793BEE"
          strokeOpacity="0.07"
          strokeWidth="1.2"
        />
      </svg>

      {/* Soft decorative clouds positioned faithfully like the reference */}
      <CloudShape
        className="top-16 sm:top-20 left-[4%] md:left-[12%] w-24 sm:w-32 opacity-85"
        delay={0}
        driftX={12}
        duration={24}
        isInView={isInView}
        reducedMotion={reducedMotion}
      />
      <CloudShape
        className="top-20 sm:top-24 right-[3%] md:right-[5%] w-20 sm:w-28 opacity-80"
        delay={0.2}
        driftX={-12}
        duration={22}
        isInView={isInView}
        reducedMotion={reducedMotion}
      />
      <CloudShape
        className="bottom-6 left-[12%] md:left-[15%] w-24 sm:w-32 opacity-80"
        delay={0.35}
        driftX={10}
        duration={26}
        isInView={isInView}
        reducedMotion={reducedMotion}
      />
      <CloudShape
        className="top-[46%] right-[16%] hidden md:block w-24 opacity-85"
        delay={0.45}
        driftX={-10}
        duration={25}
        isInView={isInView}
        reducedMotion={reducedMotion}
      />
      <CloudShape
        className="bottom-5 right-[34%] hidden lg:block w-20 opacity-75"
        delay={0.55}
        driftX={8}
        duration={27}
        isInView={isInView}
        reducedMotion={reducedMotion}
      />

      {/* Small decorative floating glossy spheres / orbs */}
      {DECORATIVE_ORBS.map((orb, idx) => (
        <motion.span
          key={idx}
          className="absolute rounded-full hidden sm:block"
          style={{
            top: orb.top,
            left: orb.left,
            right: orb.right,
            width: orb.size,
            height: orb.size,
            background:
              "radial-gradient(circle at 32% 32%, #FFFFFF 0%, #8B5CF6 48%, #4C1D95 100%)",
            boxShadow: "0 4px 10px rgba(121, 59, 238, 0.25)",
          }}
          animate={
            reducedMotion || !isInView
              ? { opacity: 0.7 }
              : {
                  y: [0, -7, 0],
                  opacity: [0.55, 0.9, 0.55],
                }
          }
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </motion.div>
  );
}
