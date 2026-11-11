import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { LivePreviewFrame } from './LivePreviewFrame';

interface EditorWorkspaceProps {
  section: string;
  data: unknown;
  previewPath?: string;
  children: React.ReactNode;
}

export const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({
  section,
  data,
  previewPath = '/',
  children,
}) => {
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('cms:preview-toggle', { detail: { isPreview: showPreview } })
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent('cms:preview-toggle', { detail: { isPreview: false } })
      );
    };
  }, [showPreview]);

  return (
    <div className="flex flex-col lg:flex-row gap-5 min-h-[calc(100vh-140px)]">
      {/* Form Column */}
      <div
        className={`flex flex-col min-w-0 transition-all duration-300 ${
          showPreview ? 'w-full lg:w-[46%] xl:w-[44%]' : 'w-full max-w-5xl mx-auto'
        }`}
      >
        <div className="flex justify-end mb-2.5">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              showPreview
                ? 'bg-[#EEE8FA] text-[#7C3AED] border-[#7C3AED]/30 shadow-xs'
                : 'bg-white text-[#1F1B2E] border-[#E5E1ED] hover:border-[#7C3AED]/40 cms-card'
            }`}
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Hide Live Preview</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Show Live Preview</span>
              </>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">{children}</div>
      </div>

      {/* Live Website Iframe Column */}
      {showPreview && (
        <div className="hidden lg:block lg:w-[54%] xl:w-[56%] sticky top-20 h-[calc(100vh-120px)]">
          <LivePreviewFrame section={section} data={data} previewPath={previewPath} />
        </div>
      )}
    </div>
  );
};
