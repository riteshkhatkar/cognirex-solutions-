import React from "react";
import { Badge } from "./Badge";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  isDark?: boolean;
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  className,
  isDark = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col mb-12 sm:mb-16",
        align === "center" ? "items-center text-center max-w-3xl mx-auto" : "items-start text-left max-w-2xl",
        className
      )}
    >
      {badge && (
        <div className="mb-3.5">
          <Badge variant="lavender">{badge}</Badge>
        </div>
      )}
      <h2
        className={cn(
          "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15]",
          isDark ? "text-white" : "text-[#1F1B2E]"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base sm:text-lg leading-relaxed",
            isDark ? "text-gray-300" : "text-[#6F6A7C]"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

