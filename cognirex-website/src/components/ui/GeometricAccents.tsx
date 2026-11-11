import React from "react";

export function HeroGeometricArt() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
      {/* Subtle purple circle background element */}
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#EEE8FA]/70 -z-10" />

      {/* Thin outlined circle */}
      <div className="absolute -bottom-8 -left-8 w-44 h-44 rounded-full border border-[#7C3AED]/20 -z-10" />

      {/* Yellow geometric semicircle accent */}
      <div className="absolute -top-4 left-1/4 w-12 h-6 rounded-t-full bg-[#FACC15] -z-10 opacity-90 shadow-sm" />

      {/* Decorative dot matrix */}
      <div className="absolute bottom-6 right-6 grid grid-cols-4 gap-2 opacity-30 -z-10">
        {[...Array(16)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
        ))}
      </div>
    </div>
  );
}

export function FloatingShape({
  type = "purple-circle",
  className = "",
}: {
  type?: "purple-circle" | "outlined-circle" | "yellow-semicircle" | "rounded-square" | "dots";
  className?: string;
}) {
  if (type === "purple-circle") {
    return <div className={`w-14 h-14 rounded-full bg-[#EEE8FA] ${className}`} aria-hidden="true" />;
  }
  if (type === "outlined-circle") {
    return (
      <div
        className={`w-28 h-28 rounded-full border border-[#7C3AED]/25 ${className}`}
        aria-hidden="true"
      />
    );
  }
  if (type === "yellow-semicircle") {
    return (
      <div
        className={`w-10 h-5 rounded-t-full bg-[#FACC15] ${className}`}
        aria-hidden="true"
      />
    );
  }
  if (type === "rounded-square") {
    return (
      <div
        className={`w-12 h-12 rounded-2xl bg-[#EEE8FA]/60 rotate-12 ${className}`}
        aria-hidden="true"
      />
    );
  }
  if (type === "dots") {
    return (
      <div className={`grid grid-cols-3 gap-2 opacity-25 ${className}`} aria-hidden="true">
        {[...Array(9)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
        ))}
      </div>
    );
  }
  return null;
}
