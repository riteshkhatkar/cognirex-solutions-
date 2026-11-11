import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { EditorWorkspace } from '../../components/EditorWorkspace';
import { SectionEditorHeader } from '../../components/SectionEditorHeader';
import { IconPickerField } from '../../components/IconPickerField';
import { useSectionEditor } from '../../hooks/useSectionEditor';
import { DEFAULT_COGNIR_CONTENT } from '../../utils/defaultCognirexData';
import type { SolutionsSectionData } from '../../types';

export const SolutionsEditor: React.FC = () => {
  const { data, setData, isSaving, save, resetToDefaults } = useSectionEditor<SolutionsSectionData>(
    'solutions',
    DEFAULT_COGNIR_CONTENT.solutions
  );

  const addService = () => {
    setData({
      ...data,
      primaryServices: [
        ...data.primaryServices,
        {
          id: `srv-${Date.now()}`,
          title: 'New Solution Offering',
          shortLine: 'Digital capability',
          description: 'Describe how this service helps Cognirex clients succeed.',
          icon: 'Globe',
          ctaLabel: 'Explore Solution',
          includes: ['Custom architecture', 'Dedicated deployment'],
        },
      ],
    });
  };

  const addNeed = () => {
    setData({
      ...data,
      businessNeeds: [
        ...data.businessNeeds,
        {
          title: 'Solve another challenge',
          serviceTitle: 'Custom Software',
          desc: 'Short explanation of client benefit.',
        },
      ],
    });
  };

  return (
    <EditorWorkspace section="solutions" data={data}>
      <SectionEditorHeader
        title="Solutions & Business Needs"
        subtitle="Manage WHAT WE DO service cards and START WITH WHAT YOU NEED quick tiles."
        isSaving={isSaving}
        onSave={save}
        onReset={resetToDefaults}
      />

      <div className="space-y-5 pb-10">
        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-3 cms-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Eyebrow Badge</label>
              <input
                type="text"
                value={data.badge}
                onChange={(e) => setData({ ...data, badge: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Section Title</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Section Description</label>
            <textarea
              rows={2}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
        </div>

        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-4 cms-card">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">
              Primary Service Cards ({data.primaryServices.length})
            </h3>
            <button
              type="button"
              onClick={addService}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Service Card
            </button>
          </div>

          {data.primaryServices.map((srv, idx) => (
            <div key={srv.id || idx} className="p-4 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] space-y-3 cms-muted-box">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7C3AED]">#{idx + 1} · {srv.title}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (idx === 0) return;
                      const next = [...data.primaryServices];
                      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
                      setData({ ...data, primaryServices: next });
                    }}
                    className="p-1 text-[#6F6A7C] cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (idx === data.primaryServices.length - 1) return;
                      const next = [...data.primaryServices];
                      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                      setData({ ...data, primaryServices: next });
                    }}
                    className="p-1 text-[#6F6A7C] cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        primaryServices: data.primaryServices.filter((_, i) => i !== idx),
                      })
                    }
                    className="p-1 text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <IconPickerField
                  value={srv.icon}
                  onChange={(val) => {
                    const next = [...data.primaryServices];
                    next[idx] = { ...next[idx], icon: val };
                    setData({ ...data, primaryServices: next });
                  }}
                />
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6F6A7C] mb-1.5">Tagline</label>
                  <input
                    type="text"
                    value={srv.shortLine}
                    onChange={(e) => {
                      const next = [...data.primaryServices];
                      next[idx] = { ...next[idx], shortLine: e.target.value };
                      setData({ ...data, primaryServices: next });
                    }}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6F6A7C] mb-1.5">CTA Text</label>
                  <input
                    type="text"
                    value={srv.ctaLabel}
                    onChange={(e) => {
                      const next = [...data.primaryServices];
                      next[idx] = { ...next[idx], ctaLabel: e.target.value };
                      setData({ ...data, primaryServices: next });
                    }}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                  />
                </div>
              </div>

              <input
                type="text"
                value={srv.title}
                onChange={(e) => {
                  const next = [...data.primaryServices];
                  next[idx] = { ...next[idx], title: e.target.value };
                  setData({ ...data, primaryServices: next });
                }}
                placeholder="Service Title"
                className="w-full px-3 py-2 text-sm font-semibold bg-white border border-[#E5E1ED] rounded-lg cms-input"
              />

              <textarea
                rows={2}
                value={srv.description}
                onChange={(e) => {
                  const next = [...data.primaryServices];
                  next[idx] = { ...next[idx], description: e.target.value };
                  setData({ ...data, primaryServices: next });
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
              />
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-4 cms-card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={data.businessNeedsBadge}
              onChange={(e) => setData({ ...data, businessNeedsBadge: e.target.value })}
              className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
            <input
              type="text"
              value={data.businessNeedsTitle}
              onChange={(e) => setData({ ...data, businessNeedsTitle: e.target.value })}
              className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <h4 className="font-bold text-xs uppercase text-[#6F6A7C]">
              Business Need Cards ({data.businessNeeds.length})
            </h4>
            <button
              type="button"
              onClick={addNeed}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Need Card
            </button>
          </div>

          {data.businessNeeds.map((need, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] space-y-2 cms-muted-box">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#7C3AED]">{need.title}</span>
                <button
                  type="button"
                  onClick={() =>
                    setData({ ...data, businessNeeds: data.businessNeeds.filter((_, i) => i !== idx) })
                  }
                  className="text-red-500 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={need.title}
                  onChange={(e) => {
                    const next = [...data.businessNeeds];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setData({ ...data, businessNeeds: next });
                  }}
                  placeholder="User Goal Title"
                  className="px-2.5 py-1.5 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                />
                <input
                  type="text"
                  value={need.serviceTitle}
                  onChange={(e) => {
                    const next = [...data.businessNeeds];
                    next[idx] = { ...next[idx], serviceTitle: e.target.value };
                    setData({ ...data, businessNeeds: next });
                  }}
                  placeholder="Linked Service Category"
                  className="px-2.5 py-1.5 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                />
              </div>
              <textarea
                rows={2}
                value={need.desc}
                onChange={(e) => {
                  const next = [...data.businessNeeds];
                  next[idx] = { ...next[idx], desc: e.target.value };
                  setData({ ...data, businessNeeds: next });
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
