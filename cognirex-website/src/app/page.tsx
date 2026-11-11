import React from "react";
import Hero from "@/components/sections/Hero";
import AboutSection from "@/components/sections/AboutSection";
import ServicesOverview from "@/components/sections/ServicesOverview";
import ApproachProcess from "@/components/sections/ApproachProcess";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import IndustriesSection from "@/components/sections/IndustriesSection";
import ContactSection from "@/components/sections/ContactSection";
import GlassySection from "@/components/ui/GlassySection";

export default function SinglePageWebsite() {
  return (
    <>
      {/* 1. Hero Section (Home Landing with Centered Cognirex Solutions Name Animation) */}
      <GlassySection id="hero-wrap">
        <Hero />
      </GlassySection>

      {/* 2. About Cognirex Solutions (Narrative, Mission, North Star) */}
      <GlassySection id="about-wrap">
        <AboutSection />
      </GlassySection>

      {/* 3. Solutions / Services Overview (Single Source of Truth for Services) */}
      <GlassySection id="solutions-wrap">
        <ServicesOverview />
      </GlassySection>

      {/* 4. Our Approach Process (Interactive 5-Stage Engineering Roadmap) */}
      <GlassySection id="approach-wrap">
        <ApproachProcess />
      </GlassySection>

      {/* 5. Featured Work & Concept Showcases (Tangible Demonstrations) */}
      <GlassySection id="projects-wrap">
        <ProjectsShowcase />
      </GlassySection>

      {/* 6. Industries & Sectors */}
      <GlassySection id="industries-wrap">
        <IndustriesSection />
      </GlassySection>

      {/* 7. Contact & Consultation Scheduling */}
      <GlassySection id="contact-wrap">
        <ContactSection />
      </GlassySection>
    </>
  );
}
