import React from 'react';
import { EditorWorkspace } from '../../components/EditorWorkspace';
import { SectionEditorHeader } from '../../components/SectionEditorHeader';
import { useSectionEditor } from '../../hooks/useSectionEditor';
import { DEFAULT_COGNIR_CONTENT } from '../../utils/defaultCognirexData';
import type { ProcessSectionData } from '../../types';

export const ProcessEditor: React.FC = () => {
  const { data, setData, isSaving, save, resetToDefaults } = useSectionEditor<ProcessSectionData>(
    'process',
    DEFAULT_COGNIR_CONTENT.process
  );

  return (
    <EditorWorkspace section="process" data={data}>
      <SectionEditorHeader
        title="5-Stage Animated Process Roadmap"
        subtitle="Update the OUR PROCESS header and the 5 floating stage panels shown on the 3D roadmap."
        isSaving={isSaving}
        onSave={save}
        onReset={resetToDefaults}
      />

      <div className="space-y-5 pb-10">
        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-3 cms-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Eyebrow Label</label>
              <input
                type="text"
                value={data.badge}
                onChange={(e) => setData({ ...data, badge: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Main Heading</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Supporting Description</label>
            <textarea
              rows={2}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
        </div>

        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-3 cms-card">
          <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">
            Roadmap Stage Panels ({data.stages.length})
          </h3>
          {data.stages.map((st, idx) => (
            <div key={st.id || idx} className="p-3.5 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] space-y-2 cms-muted-box">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {st.number}
                </span>
                <input
                  type="text"
                  value={st.title}
                  onChange={(e) => {
                    const next = [...data.stages];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setData({ ...data, stages: next });
                  }}
                  className="flex-1 px-2.5 py-1.5 text-sm font-bold bg-white border border-[#E5E1ED] rounded-lg cms-input"
                />
              </div>
              <input
                type="text"
                value={st.description}
                onChange={(e) => {
                  const next = [...data.stages];
                  next[idx] = { ...next[idx], description: e.target.value };
                  setData({ ...data, stages: next });
                }}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
              />
            </div>
          ))}
        </div>
      </div>
    </EditorWorkspace>
  );
};
