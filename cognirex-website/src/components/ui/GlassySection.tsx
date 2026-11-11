"use client";

import React from "react";

interface GlassySectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export default function GlassySection({
  id,
  children,
  className = "",
}: GlassySectionProps) {
  return (
    <div id={id} className={`w-full ${className}`}>
      {children}
    </div>
  );
}
