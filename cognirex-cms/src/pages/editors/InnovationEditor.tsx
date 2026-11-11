import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { EditorWorkspace } from '../../components/EditorWorkspace';
import { SectionEditorHeader } from '../../components/SectionEditorHeader';
import { IconPickerField } from '../../components/IconPickerField';
import { useSectionEditor } from '../../hooks/useSectionEditor';
import { DEFAULT_COGNIR_CONTENT } from '../../utils/defaultCognirexData';
import type { InnovationSectionData } from '../../types';

export const InnovationEditor: React.FC = () => {
  const { data, setData, isSaving, save, resetToDefaults } = useSectionEditor<InnovationSectionData>(
    'innovation',
    DEFAULT_COGNIR_CONTENT.innovation
  );

  return (
    <EditorWorkspace section="innovation" data={data}>
      <SectionEditorHeader
        title="Innovation & Responsible AI"
        subtitle="Manage Explore What's Possible technology cards and Integrity pillars."
        isSaving={isSaving}
        onSave={save}
        onReset={resetToDefaults}
      />

      <div className="space-y-5 pb-10">
        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-4 cms-card">
          <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">Emerging Technologies</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={data.exploreBadge}
              onChange={(e) => setData({ ...data, exploreBadge: e.target.value })}
              className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
            <input
              type="text"
              value={data.exploreTitle}
              onChange={(e) => setData({ ...data, exploreTitle: e.target.value })}
              className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
          <textarea
            rows={2}
            value={data.exploreDescription}
            onChange={(e) => setData({ ...data, exploreDescription: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold uppercase text-[#6F6A7C]">
              Tech Cards ({data.emergingTechs.length})
            </span>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  emergingTechs: [
                    ...data.emergingTechs,
                    { name: 'New Technology', description: 'Describe capability.', icon: 'Cpu' },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Tech
            </button>
          </div>

          {data.emergingTechs.map((tech, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] space-y-2 cms-muted-box">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#7C3AED]">{tech.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      emergingTechs: data.emergingTechs.filter((_, i) => i !== idx),
                    })
                  }
                  className="text-red-500 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <IconPickerField
                  value={tech.icon}
                  onChange={(val) => {
                    const next = [...data.emergingTechs];
                    next[idx] = { ...next[idx], icon: val };
                    setData({ ...data, emergingTechs: next });
                  }}
                />
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6F6A7C] mb-1.5">Title</label>
                  <input
                    type="text"
                    value={tech.name}
                    onChange={(e) => {
                      const next = [...data.emergingTechs];
                      next[idx] = { ...next[idx], name: e.target.value };
                      setData({ ...data, emergingTechs: next });
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                  />
                </div>
              </div>
              <textarea
                rows={2}
                value={tech.description}
                onChange={(e) => {
                  const next = [...data.emergingTechs];
                  next[idx] = { ...next[idx], description: e.target.value };
                  setData({ ...data, emergingTechs: next });
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
              />
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-4 cms-card">
          <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">Responsible Engineering Pillars</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={data.integrityBadge}
              onChange={(e) => setData({ ...data, integrityBadge: e.target.value })}
              className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
            <input
              type="text"
              value={data.integrityTitle}
              onChange={(e) => setData({ ...data, integrityTitle: e.target.value })}
              className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
          <textarea
            rows={2}
            value={data.integrityDescription}
            onChange={(e) => setData({ ...data, integrityDescription: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold uppercase text-[#6F6A7C]">
              Integrity Pillars ({data.responsiblePillars.length})
            </span>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  responsiblePillars: [
                    ...data.responsiblePillars,
                    { title: 'New Principle', description: 'Describe safeguard.', icon: 'ShieldCheck' },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Pillar
            </button>
          </div>

          {data.responsiblePillars.map((pillar, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] space-y-2 cms-muted-box">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#7C3AED]">{pillar.title}</span>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      responsiblePillars: data.responsiblePillars.filter((_, i) => i !== idx),
                    })
                  }
                  className="text-red-500 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <IconPickerField
                  value={pillar.icon}
                  onChange={(val) => {
                    const next = [...data.responsiblePillars];
                    next[idx] = { ...next[idx], icon: val };
                    setData({ ...data, responsiblePillars: next });
                  }}
                />
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6F6A7C] mb-1.5">Title</label>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => {
                      const next = [...data.responsiblePillars];
                      next[idx] = { ...next[idx], title: e.target.value };
                      setData({ ...data, responsiblePillars: next });
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                  />
                </div>
              </div>
              <textarea
                rows={2}
                value={pillar.description}
                onChange={(e) => {
                  const next = [...data.responsiblePillars];
                  next[idx] = { ...next[idx], description: e.target.value };
                  setData({ ...data, responsiblePillars: next });
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
