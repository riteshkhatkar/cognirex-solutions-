import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "yellow" | "lavender" | "outline" | "demo";
  className?: string;
}

export function Badge({ children, variant = "lavender", className }: BadgeProps) {
  const variantStyles = {
    purple: "bg-[#7C3AED] text-white",
    yellow: "bg-[#FACC15] text-[#1F1B2E] font-medium",
    lavender: "bg-[#EEE8FA] text-[#7C3AED] font-medium border border-[#E5E1ED]",
    outline: "border border-[#E5E1ED] text-[#6F6A7C] bg-white",
    demo: "bg-amber-100 text-amber-900 border border-amber-300 font-semibold tracking-wide uppercase text-[10px]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

