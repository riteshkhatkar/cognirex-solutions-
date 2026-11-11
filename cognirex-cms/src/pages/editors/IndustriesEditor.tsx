import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { EditorWorkspace } from '../../components/EditorWorkspace';
import { SectionEditorHeader } from '../../components/SectionEditorHeader';
import { ImagePickerField } from '../../components/ImagePickerField';
import { IconPickerField } from '../../components/IconPickerField';
import { useSectionEditor } from '../../hooks/useSectionEditor';
import { DEFAULT_COGNIR_CONTENT } from '../../utils/defaultCognirexData';
import type { IndustriesSectionData } from '../../types';

export const IndustriesEditor: React.FC = () => {
  const { data, setData, isSaving, save, resetToDefaults } = useSectionEditor<IndustriesSectionData>(
    'industries',
    DEFAULT_COGNIR_CONTENT.industries
  );

  const addIndustry = () => {
    setData({
      ...data,
      items: [
        ...data.items,
        {
          id: `ind-${Date.now()}`,
          title: 'New Industry Sector',
          description: 'Describe tailored digital tools and platforms for this sector.',
          icon: 'Briefcase',
          image: '/images/product-design-ux.jpg',
          keyOutcomes: ['Dedicated web platform', 'Workflow automation'],
        },
      ],
    });
  };

  return (
    <EditorWorkspace section="industries" data={data}>
      <SectionEditorHeader
        title="Industries Solutions"
        subtitle="Add, remove, or reorder industry cards, change photos, and customize Key Solutions bullets."
        isSaving={isSaving}
        onSave={save}
        onReset={resetToDefaults}
      />

      <div className="space-y-5 pb-10">
        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-3 cms-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={data.badge}
              onChange={(e) => setData({ ...data, badge: e.target.value })}
              className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
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
              Industry Sector Cards ({data.items.length})
            </h3>
            <button
              type="button"
              onClick={addIndustry}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Industry
            </button>
          </div>

          {data.items.map((ind, idx) => (
            <div key={ind.id || idx} className="p-4 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] space-y-3 cms-muted-box">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7C3AED]">#{idx + 1} · {ind.title}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (idx === 0) return;
                      const next = [...data.items];
                      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
                      setData({ ...data, items: next });
                    }}
                    className="p-1 text-[#6F6A7C] cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (idx === data.items.length - 1) return;
                      const next = [...data.items];
                      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                      setData({ ...data, items: next });
                    }}
                    className="p-1 text-[#6F6A7C] cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setData({ ...data, items: data.items.filter((_, i) => i !== idx) })
                    }
                    className="p-1 text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <ImagePickerField
                label="Industry Sector Photo"
                value={ind.image}
                onChange={(url) => {
                  const next = [...data.items];
                  next[idx] = { ...next[idx], image: url };
                  setData({ ...data, items: next });
                }}
                usedIn={`Industry: ${ind.title}`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <IconPickerField
                  value={ind.icon}
                  onChange={(val) => {
                    const next = [...data.items];
                    next[idx] = { ...next[idx], icon: val };
                    setData({ ...data, items: next });
                  }}
                />
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6F6A7C] mb-1.5">Industry Title</label>
                  <input
                    type="text"
                    value={ind.title}
                    onChange={(e) => {
                      const next = [...data.items];
                      next[idx] = { ...next[idx], title: e.target.value };
                      setData({ ...data, items: next });
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                  />
                </div>
              </div>

              <textarea
                rows={2}
                value={ind.description}
                onChange={(e) => {
                  const next = [...data.items];
                  next[idx] = { ...next[idx], description: e.target.value };
                  setData({ ...data, items: next });
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
              />

              <div>
                <label className="block text-[11px] font-bold text-[#6F6A7C] mb-1">
                  Key Solutions (one per line)
                </label>
                <textarea
                  rows={3}
                  value={(ind.keyOutcomes || []).join('\n')}
                  onChange={(e) => {
                    const next = [...data.items];
                    next[idx] = {
                      ...next[idx],
                      keyOutcomes: e.target.value.split('\n').filter((line) => line.trim() !== ''),
                    };
                    setData({ ...data, items: next });
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditorWorkspace>
  );
};
