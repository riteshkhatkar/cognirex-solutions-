"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { CMS_SECTIONS, DEFAULT_COGNIR_CONTENT } from "@/data/cmsDefaults";
import type { CmsSectionKey, CognirexContentBundle } from "@/types/cms";

interface CmsContentContextValue {
  content: CognirexContentBundle;
  isLoaded: boolean;
  isPreviewMode: boolean;
  refreshContent: () => Promise<void>;
}

const CmsContentContext = createContext<CmsContentContextValue>({
  content: DEFAULT_COGNIR_CONTENT,
  isLoaded: false,
  isPreviewMode: false,
  refreshContent: async () => {},
});

const SECTION_DOM_ANCHORS: Partial<Record<CmsSectionKey, string>> = {
  hero: "hero",
  about: "about",
  solutions: "solutions",
  why_choose_us: "why-us",
  process: "approach",
  industries: "industries",
  innovation: "innovation",
  contact_section: "contact",
  careers: "careers",
};

export function CmsContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<CognirexContentBundle>(DEFAULT_COGNIR_CONTENT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const liveEditedSectionsRef = useRef<Set<CmsSectionKey>>(new Set());

  const refreshContent = async () => {
    try {
      const res = await fetch(`/api/public/content/all?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const incoming = (await res.json()) as Partial<CognirexContentBundle>;
      if (!incoming || typeof incoming !== "object") return;

      setContent((prev) => {
        const next = { ...prev };
        for (const key of CMS_SECTIONS) {
          if (liveEditedSectionsRef.current.has(key)) continue;
          if (incoming[key] && typeof incoming[key] === "object") {
            next[key] = { ...DEFAULT_COGNIR_CONTENT[key], ...incoming[key] } as never;
          }
        }
        return next;
      });
    } catch {
      // Fallback seamlessly to DEFAULT_COGNIR_CONTENT
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    void refreshContent();

    const params = new URLSearchParams(window.location.search);
    if (params.get("cmsPreview") === "1") {
      setIsPreviewMode(true);
    }

    let lastScrolledSection = "";

    const handleMessage = (event: MessageEvent) => {
      const msg = event.data;
      if (!msg || typeof msg !== "object") return;

      if (msg.type === "CMS_LIVE_PREVIEW" && msg.section && msg.data) {
        const key = msg.section as CmsSectionKey;
        if (!CMS_SECTIONS.includes(key)) return;

        liveEditedSectionsRef.current.add(key);
        setIsPreviewMode(true);
        setContent((prev) => ({
          ...prev,
          [key]: { ...DEFAULT_COGNIR_CONTENT[key], ...msg.data },
        }));

        const anchorId = SECTION_DOM_ANCHORS[key];
        if (anchorId && lastScrolledSection !== key) {
          lastScrolledSection = key;
          const el = document.getElementById(anchorId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      } else if (msg.type === "CMS_REFRESH_CONTENT") {
        liveEditedSectionsRef.current.clear();
        void refreshContent();
      }
    };

    window.addEventListener("message", handleMessage);
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "CMS_PREVIEW_READY" }, "*");
    }
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <CmsContentContext.Provider value={{ content, isLoaded, isPreviewMode, refreshContent }}>
      {children}
    </CmsContentContext.Provider>
  );
}

export function useCmsContent() {
  return useContext(CmsContentContext);
}
