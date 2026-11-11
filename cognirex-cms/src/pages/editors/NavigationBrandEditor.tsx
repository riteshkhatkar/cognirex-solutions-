import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { EditorWorkspace } from '../../components/EditorWorkspace';
import { SectionEditorHeader } from '../../components/SectionEditorHeader';
import { useSectionEditor } from '../../hooks/useSectionEditor';
import { DEFAULT_COGNIR_CONTENT } from '../../utils/defaultCognirexData';
import type { SiteBrandSection } from '../../types';

export const NavigationBrandEditor: React.FC = () => {
  const { data, setData, isSaving, save, resetToDefaults } = useSectionEditor<SiteBrandSection>(
    'site_brand',
    DEFAULT_COGNIR_CONTENT.site_brand
  );

  const updateNavItem = (idx: number, field: string, value: string | boolean) => {
    const next = [...data.navItems];
    next[idx] = { ...next[idx], [field]: value };
    setData({ ...data, navItems: next });
  };

  const addNavItem = () => {
    setData({
      ...data,
      navItems: [...data.navItems, { title: 'New Link', href: '/#solutions', isCta: false }],
    });
  };

  const removeNavItem = (idx: number) => {
    setData({ ...data, navItems: data.navItems.filter((_, i) => i !== idx) });
  };

  const moveNavItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= data.navItems.length) return;
    const next = [...data.navItems];
    [next[idx], next[target]] = [next[target], next[idx]];
    setData({ ...data, navItems: next });
  };

  return (
    <EditorWorkspace section="site_brand" data={data}>
      <SectionEditorHeader
        title="Brand Identity, Navbar & Footer"
        subtitle="Manage Cognirex wordmark subtitle, header links, footer statement, and social URLs."
        isSaving={isSaving}
        onSave={save}
        onReset={resetToDefaults}
      />

      <div className="space-y-5 pb-10">
        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-4 cms-card">
          <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">Brand Copy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Company Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Header Subtitle</label>
              <input
                type="text"
                value={data.headerSubtitle}
                onChange={(e) => setData({ ...data, headerSubtitle: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Brand Tagline</label>
            <input
              type="text"
              value={data.tagline}
              onChange={(e) => setData({ ...data, tagline: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Footer Description</label>
            <textarea
              rows={2}
              value={data.footerDescription}
              onChange={(e) => setData({ ...data, footerDescription: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Engineering Hub Location</label>
              <input
                type="text"
                value={data.locationLabel}
                onChange={(e) => setData({ ...data, locationLabel: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Office Hours</label>
              <input
                type="text"
                value={data.officeHours}
                onChange={(e) => setData({ ...data, officeHours: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-4 cms-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">Header Navigation Links</h3>
              <p className="text-[11px] text-[#6F6A7C]">
                Add, remove, or reorder header links and the primary CTA button.
              </p>
            </div>
            <button
              type="button"
              onClick={addNavItem}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold hover:bg-[#7C3AED] hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {data.navItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center cms-muted-box"
              >
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateNavItem(idx, 'title', e.target.value)}
                  placeholder="Label"
                  className="sm:col-span-4 px-2.5 py-1.5 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                />
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => updateNavItem(idx, 'href', e.target.value)}
                  placeholder="/#about or /contact"
                  className="sm:col-span-4 px-2.5 py-1.5 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                />
                <label className="sm:col-span-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#6F6A7C]">
                  <input
                    type="checkbox"
                    checked={Boolean(item.isCta)}
                    onChange={(e) => updateNavItem(idx, 'isCta', e.target.checked)}
                    className="accent-[#7C3AED]"
                  />
                  CTA
                </label>
                <div className="sm:col-span-2 flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => moveNavItem(idx, -1)}
                    className="p-1 rounded hover:bg-white text-[#6F6A7C] cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveNavItem(idx, 1)}
                    className="p-1 rounded hover:bg-white text-[#6F6A7C] cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeNavItem(idx)}
                    className="p-1 rounded hover:bg-red-50 text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EditorWorkspace>
  );
};
