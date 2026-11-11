import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { EditorWorkspace } from '../../components/EditorWorkspace';
import { SectionEditorHeader } from '../../components/SectionEditorHeader';
import { IconPickerField } from '../../components/IconPickerField';
import { useSectionEditor } from '../../hooks/useSectionEditor';
import { DEFAULT_COGNIR_CONTENT } from '../../utils/defaultCognirexData';
import type { WhyChooseUsSectionData } from '../../types';

export const WhyChooseUsEditor: React.FC = () => {
  const { data, setData, isSaving, save, resetToDefaults } = useSectionEditor<WhyChooseUsSectionData>(
    'why_choose_us',
    DEFAULT_COGNIR_CONTENT.why_choose_us
  );

  const addReason = () => {
    setData({
      ...data,
      reasons: [
        ...data.reasons,
        { title: 'New Differentiator', description: 'Explain client impact clearly.', icon: 'Zap' },
      ],
    });
  };

  return (
    <EditorWorkspace section="why_choose_us" data={data}>
      <SectionEditorHeader
        title="Why Choose Us Section"
        subtitle="Edit section headline and add/edit/remove differentiator pillars."
        isSaving={isSaving}
        onSave={save}
        onReset={resetToDefaults}
      />

      <div className="space-y-5 pb-10">
        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-3 cms-card">
          <input
            type="text"
            value={data.badge}
            onChange={(e) => setData({ ...data, badge: e.target.value })}
            placeholder="Eyebrow Badge"
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="Section Heading"
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />
          <textarea
            rows={2}
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />
        </div>

        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-4 cms-card">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">
              Value Pillars ({data.reasons.length})
            </h3>
            <button
              type="button"
              onClick={addReason}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Pillar
            </button>
          </div>

          {data.reasons.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] space-y-2.5 cms-muted-box">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#7C3AED]">Pillar #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => setData({ ...data, reasons: data.reasons.filter((_, i) => i !== idx) })}
                  className="text-red-500 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <IconPickerField
                  value={item.icon}
                  onChange={(val) => {
                    const next = [...data.reasons];
                    next[idx] = { ...next[idx], icon: val };
                    setData({ ...data, reasons: next });
                  }}
                />
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6F6A7C] mb-1.5">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...data.reasons];
                      next[idx] = { ...next[idx], title: e.target.value };
                      setData({ ...data, reasons: next });
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                  />
                </div>
              </div>
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) => {
                  const next = [...data.reasons];
                  next[idx] = { ...next[idx], description: e.target.value };
                  setData({ ...data, reasons: next });
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
              />
            </div>
          ))}
        </div>
      </div>
    </EditorWorkspace>
  );
};
