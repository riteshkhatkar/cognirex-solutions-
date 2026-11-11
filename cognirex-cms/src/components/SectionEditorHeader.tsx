import React from 'react';
import { Loader2, RotateCcw, Save } from 'lucide-react';

interface SectionEditorHeaderProps {
  title: string;
  subtitle: string;
  isSaving: boolean;
  onSave: () => void;
  onReset?: () => void;
}

export const SectionEditorHeader: React.FC<SectionEditorHeaderProps> = ({
  title,
  subtitle,
  isSaving,
  onSave,
  onReset,
}) => {
  return (
    <div className="bg-white border border-[#E5E1ED] rounded-2xl p-4 sm:p-5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs cms-card">
      <div>
        <h1 className="text-lg sm:text-xl font-extrabold text-[#1F1B2E] cms-heading">{title}</h1>
        <p className="text-xs text-[#6F6A7C] mt-0.5 cms-subtext">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E1ED] hover:border-[#7C3AED]/40 text-xs font-semibold text-[#6F6A7C] hover:text-[#1F1B2E] transition-colors cursor-pointer cms-card"
            title="Restore section defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Defaults</span>
          </button>
        )}
        <button
          type="button"
          disabled={isSaving}
          onClick={onSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
        </button>
      </div>
    </div>
  );
};
