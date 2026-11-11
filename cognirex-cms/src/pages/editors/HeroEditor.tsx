import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { EditorWorkspace } from '../../components/EditorWorkspace';
import { SectionEditorHeader } from '../../components/SectionEditorHeader';
import { ImagePickerField } from '../../components/ImagePickerField';
import { IconPickerField } from '../../components/IconPickerField';
import { useSectionEditor } from '../../hooks/useSectionEditor';
import { DEFAULT_COGNIR_CONTENT } from '../../utils/defaultCognirexData';
import type { HeroSectionData } from '../../types';

export const HeroEditor: React.FC = () => {
  const { data, setData, isSaving, save, resetToDefaults } = useSectionEditor<HeroSectionData>(
    'hero',
    DEFAULT_COGNIR_CONTENT.hero
  );

  const updateStripItem = (idx: number, field: string, value: string) => {
    const next = [...data.capabilityStrip];
    next[idx] = { ...next[idx], [field]: value };
    setData({ ...data, capabilityStrip: next });
  };

  const addStripItem = () => {
    setData({
      ...data,
      capabilityStrip: [
        ...data.capabilityStrip,
        { icon: 'Zap', title: 'New Capability', desc: 'Short capability summary.' },
      ],
    });
  };

  const removeStripItem = (idx: number) => {
    setData({
      ...data,
      capabilityStrip: data.capabilityStrip.filter((_, i) => i !== idx),
    });
  };

  const moveStripItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= data.capabilityStrip.length) return;
    const next = [...data.capabilityStrip];
    [next[idx], next[target]] = [next[target], next[idx]];
    setData({ ...data, capabilityStrip: next });
  };

  return (
    <EditorWorkspace section="hero" data={data}>
      <SectionEditorHeader
        title="Hero Banner & Capability Strip"
        subtitle="Update hero headline, description, action buttons, main photo, and scrolling marquee."
        isSaving={isSaving}
        onSave={save}
        onReset={resetToDefaults}
      />

      <div className="space-y-5 pb-10">
        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-4 cms-card">
          <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">Hero Headlines &amp; CTAs</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Headline Line 1</label>
              <input
                type="text"
                value={data.headlineLine1}
                onChange={(e) => setData({ ...data, headlineLine1: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Purple Highlight Text</label>
              <input
                type="text"
                value={data.headlineHighlight}
                onChange={(e) => setData({ ...data, headlineHighlight: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Hero Description</label>
            <textarea
              rows={3}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Primary CTA Label</label>
              <input
                type="text"
                value={data.primaryCtaLabel}
                onChange={(e) => setData({ ...data, primaryCtaLabel: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Primary CTA Link</label>
              <input
                type="text"
                value={data.primaryCtaHref}
                onChange={(e) => setData({ ...data, primaryCtaHref: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Secondary CTA Label</label>
              <input
                type="text"
                value={data.secondaryCtaLabel}
                onChange={(e) => setData({ ...data, secondaryCtaLabel: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Secondary CTA Link</label>
              <input
                type="text"
                value={data.secondaryCtaHref}
                onChange={(e) => setData({ ...data, secondaryCtaHref: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-4 cms-card">
          <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">Hero Visual Photo &amp; Overlay</h3>
          <ImagePickerField
            label="Hero Featured Image"
            value={data.heroImage}
            onChange={(url) => setData({ ...data, heroImage: url })}
            usedIn="Hero Section"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Overlay Badge</label>
              <input
                type="text"
                value={data.imageBadge}
                onChange={(e) => setData({ ...data, imageBadge: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Image Alt Text</label>
              <input
                type="text"
                value={data.heroImageAlt}
                onChange={(e) => setData({ ...data, heroImageAlt: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Bottom Overlay Caption</label>
            <input
              type="text"
              value={data.imageCaption}
              onChange={(e) => setData({ ...data, imageCaption: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
        </div>

        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-4 cms-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">Scrolling Capability Strip</h3>
              <p className="text-[11px] text-[#6F6A7C]">Items shown in the continuous marquee below Hero.</p>
            </div>
            <button
              type="button"
              onClick={addStripItem}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold hover:bg-[#7C3AED] hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pill</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.capabilityStrip.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] space-y-2.5 cms-muted-box"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7C3AED]">Item #{idx + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveStripItem(idx, -1)}
                      className="p-1 rounded hover:bg-white text-[#6F6A7C] cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStripItem(idx, 1)}
                      className="p-1 rounded hover:bg-white text-[#6F6A7C] cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStripItem(idx)}
                      className="p-1 rounded hover:bg-red-50 text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <IconPickerField
                    label="Icon"
                    value={item.icon}
                    onChange={(val) => updateStripItem(idx, 'icon', val)}
                  />
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6A7C] mb-1.5">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateStripItem(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6A7C] mb-1.5">Subtitle</label>
                    <input
                      type="text"
                      value={item.desc}
                      onChange={(e) => updateStripItem(idx, 'desc', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EditorWorkspace>
  );
};
