import React from "react";
import Image from "next/image";
import { conceptProjects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";

export default function ProjectsShowcase() {
  return (
    <section id="projects" className="py-20 md:py-24 bg-white border-b border-[#E5E1ED] relative scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="MADE TO BE EXPERIENCED"
          title="Real Work. Useful Experiences."
          description="Explore selected websites, applications and intelligent solutions that show what thoughtful technology can make possible."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {conceptProjects.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E5E1ED] hover:border-[#7C3AED]/40 rounded-2xl overflow-hidden shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* Photo preview with padding & rounded border */}
              <div className="p-2.5 bg-white">
                <div className="relative h-44 w-full bg-[#EEE8FA] overflow-hidden rounded-xl border border-[#E5E1ED]">
                  <Image
                    src={item.image}
                    alt={`${item.title} demonstration`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 380px"
                  />
                  <div className="absolute inset-0 bg-[#1F1B2E]/30 transition-opacity group-hover:bg-[#1F1B2E]/15" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#7C3AED] px-2.5 py-0.5 rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs font-semibold drop-shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content in exact original UI */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-[#1F1B2E] mb-2 group-hover:text-[#7C3AED] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#6F6A7C] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0EDF7] space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7C3AED] block mb-2">
                    Key Features
                  </span>
                  {item.tags.map((tag, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#1F1B2E]">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#EEE8FA] text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
