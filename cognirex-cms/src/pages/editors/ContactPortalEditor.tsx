import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { EditorWorkspace } from '../../components/EditorWorkspace';
import { SectionEditorHeader } from '../../components/SectionEditorHeader';
import { IconPickerField } from '../../components/IconPickerField';
import { useSectionEditor } from '../../hooks/useSectionEditor';
import { DEFAULT_COGNIR_CONTENT } from '../../utils/defaultCognirexData';
import type { ContactSectionData } from '../../types';

export const ContactPortalEditor: React.FC = () => {
  const { data, setData, isSaving, save, resetToDefaults } = useSectionEditor<ContactSectionData>(
    'contact_section',
    DEFAULT_COGNIR_CONTENT.contact_section
  );
  const [previewTarget, setPreviewTarget] = useState<'/' | '/contact'>('/contact');

  return (
    <EditorWorkspace section="contact_section" data={data} previewPath={previewTarget}>
      <SectionEditorHeader
        title="Contact CTA & /contact Portal Page"
        subtitle="Customize both the home page Let's Talk section and the dedicated /contact page."
        isSaving={isSaving}
        onSave={save}
        onReset={resetToDefaults}
      />

      <div className="flex items-center gap-2 bg-white border border-[#E5E1ED] p-1.5 rounded-xl mb-5 cms-card">
        <span className="text-[11px] font-bold uppercase text-[#6F6A7C] px-2">Preview Route:</span>
        <button
          type="button"
          onClick={() => setPreviewTarget('/')}
          className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
            previewTarget === '/' ? 'bg-[#7C3AED] text-white' : 'text-[#6F6A7C]'
          }`}
        >
          Home Section (/#contact)
        </button>
        <button
          type="button"
          onClick={() => setPreviewTarget('/contact')}
          className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
            previewTarget === '/contact' ? 'bg-[#7C3AED] text-white' : 'text-[#6F6A7C]'
          }`}
        >
          Full Contact Page (/contact)
        </button>
      </div>

      <div className="space-y-5 pb-10">
        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-3 cms-card">
          <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">Home Page Contact Banner</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={data.homeBadge}
              onChange={(e) => setData({ ...data, homeBadge: e.target.value })}
              className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
            <input
              type="text"
              value={data.homeCtaLabel}
              onChange={(e) => setData({ ...data, homeCtaLabel: e.target.value })}
              className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
          <input
            type="text"
            value={data.homeTitle}
            onChange={(e) => setData({ ...data, homeTitle: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />
          <textarea
            rows={2}
            value={data.homeDescription}
            onChange={(e) => setData({ ...data, homeDescription: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={data.trustBadge1}
              onChange={(e) => setData({ ...data, trustBadge1: e.target.value })}
              className="px-3 py-2 text-xs border border-[#E5E1ED] rounded-xl cms-input"
            />
            <input
              type="text"
              value={data.trustBadge2}
              onChange={(e) => setData({ ...data, trustBadge2: e.target.value })}
              className="px-3 py-2 text-xs border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
        </div>

        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-3 cms-card">
          <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">/contact Portal Header &amp; Info Cards</h3>
          <input
            type="text"
            value={data.portalBadge}
            onChange={(e) => setData({ ...data, portalBadge: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />
          <input
            type="text"
            value={data.portalTitle}
            onChange={(e) => setData({ ...data, portalTitle: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />
          <textarea
            rows={2}
            value={data.portalDescription}
            onChange={(e) => setData({ ...data, portalDescription: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold uppercase text-[#6F6A7C]">Portal Info Cards</span>
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  portalCards: [
                    ...data.portalCards,
                    { icon: 'Globe', title: 'Support Channel', description: 'Details here.' },
                  ],
                })
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Card
            </button>
          </div>

          {data.portalCards.map((card, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] space-y-2 cms-muted-box">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#7C3AED]">Card #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      portalCards: data.portalCards.filter((_, i) => i !== idx),
                    })
                  }
                  className="text-red-500 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <IconPickerField
                  value={card.icon}
                  onChange={(val) => {
                    const next = [...data.portalCards];
                    next[idx] = { ...next[idx], icon: val };
                    setData({ ...data, portalCards: next });
                  }}
                />
                <div>
                  <label className="block text-xs font-bold uppercase text-[#6F6A7C] mb-1.5">Title</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const next = [...data.portalCards];
                      next[idx] = { ...next[idx], title: e.target.value };
                      setData({ ...data, portalCards: next });
                    }}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                  />
                </div>
              </div>
              <textarea
                rows={2}
                value={card.description}
                onChange={(e) => {
                  const next = [...data.portalCards];
                  next[idx] = { ...next[idx], description: e.target.value };
                  setData({ ...data, portalCards: next });
                }}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
              />
            </div>
          ))}

          <div className="pt-2 space-y-2">
            <input
              type="text"
              value={data.confidentialityTitle}
              onChange={(e) => setData({ ...data, confidentialityTitle: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
            <textarea
              rows={2}
              value={data.confidentialityText}
              onChange={(e) => setData({ ...data, confidentialityText: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
        </div>
      </div>
    </EditorWorkspace>
  );
};
