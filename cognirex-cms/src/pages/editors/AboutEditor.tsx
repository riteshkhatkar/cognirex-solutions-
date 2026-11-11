import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { EditorWorkspace } from '../../components/EditorWorkspace';
import { SectionEditorHeader } from '../../components/SectionEditorHeader';
import { ImagePickerField } from '../../components/ImagePickerField';
import { IconPickerField } from '../../components/IconPickerField';
import { useSectionEditor } from '../../hooks/useSectionEditor';
import { DEFAULT_COGNIR_CONTENT } from '../../utils/defaultCognirexData';
import type { AboutSectionData } from '../../types';

export const AboutEditor: React.FC = () => {
  const { data, setData, isSaving, save, resetToDefaults } = useSectionEditor<AboutSectionData>(
    'about',
    DEFAULT_COGNIR_CONTENT.about
  );
  const [tab, setTab] = useState<'overview' | 'mission' | 'values' | 'capabilities'>('overview');

  return (
    <EditorWorkspace section="about" data={data}>
      <SectionEditorHeader
        title="About, Culture & Core Disciplines"
        subtitle="Edit About story, collaborative photo, Mission & Vision cards, Core Values, and Engineering Disciplines."
        isSaving={isSaving}
        onSave={save}
        onReset={resetToDefaults}
      />

      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap gap-1.5 bg-white border border-[#E5E1ED] p-1.5 rounded-xl mb-5 cms-card">
        {(
          [
            ['overview', 'Overview & Photo'],
            ['mission', 'Mission, Vision & Banner'],
            ['values', 'Core Values'],
            ['capabilities', 'Disciplines Grid'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              tab === key ? 'bg-[#7C3AED] text-white' : 'text-[#6F6A7C] hover:text-[#1F1B2E]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-5 pb-10">
        {tab === 'overview' && (
          <>
            <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-4 cms-card">
              <ImagePickerField
                label="About Feature Photo"
                value={data.aboutImage}
                onChange={(url) => setData({ ...data, aboutImage: url })}
                usedIn="About Section"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Floating Badge Title</label>
                  <input
                    type="text"
                    value={data.floatingBadgeTitle}
                    onChange={(e) => setData({ ...data, floatingBadgeTitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Floating Badge Subtitle</label>
                  <input
                    type="text"
                    value={data.floatingBadgeSubtitle}
                    onChange={(e) => setData({ ...data, floatingBadgeSubtitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Section Badge</label>
                <input
                  type="text"
                  value={data.badge}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Heading Line 1</label>
                  <input
                    type="text"
                    value={data.headingLine1}
                    onChange={(e) => setData({ ...data, headingLine1: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Purple Highlight</label>
                  <input
                    type="text"
                    value={data.headingHighlight}
                    onChange={(e) => setData({ ...data, headingHighlight: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6F6A7C] mb-1">About Story Paragraph</label>
                <textarea
                  rows={4}
                  value={data.storyText}
                  onChange={(e) => setData({ ...data, storyText: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
                />
              </div>
            </div>

            <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-3 cms-card">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">Top 3 Highlight Cards</h3>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      highlights: [
                        ...data.highlights,
                        { icon: 'Sparkles', title: 'New Highlight', desc: 'Brief summary.' },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              {data.highlights.map((h, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] space-y-2 cms-muted-box">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#7C3AED]">Highlight #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setData({ ...data, highlights: data.highlights.filter((_, i) => i !== idx) })
                      }
                      className="text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <IconPickerField
                      value={h.icon}
                      onChange={(val) => {
                        const next = [...data.highlights];
                        next[idx] = { ...next[idx], icon: val };
                        setData({ ...data, highlights: next });
                      }}
                    />
                    <input
                      type="text"
                      value={h.title}
                      onChange={(e) => {
                        const next = [...data.highlights];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setData({ ...data, highlights: next });
                      }}
                      placeholder="Title"
                      className="px-2.5 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                    />
                    <input
                      type="text"
                      value={h.desc}
                      onChange={(e) => {
                        const next = [...data.highlights];
                        next[idx] = { ...next[idx], desc: e.target.value };
                        setData({ ...data, highlights: next });
                      }}
                      placeholder="Short description"
                      className="px-2.5 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'mission' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-3 cms-card">
              <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">Mission Card</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={data.missionBadge}
                  onChange={(e) => setData({ ...data, missionBadge: e.target.value })}
                  placeholder="Badge"
                  className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
                />
                <input
                  type="text"
                  value={data.missionTitle}
                  onChange={(e) => setData({ ...data, missionTitle: e.target.value })}
                  placeholder="Title"
                  className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
                />
              </div>
              <textarea
                rows={2}
                value={data.missionQuote}
                onChange={(e) => setData({ ...data, missionQuote: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
              <textarea
                rows={2}
                value={data.missionSubtext}
                onChange={(e) => setData({ ...data, missionSubtext: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>

            <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-3 cms-card">
              <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">Vision Card</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={data.visionBadge}
                  onChange={(e) => setData({ ...data, visionBadge: e.target.value })}
                  className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
                />
                <input
                  type="text"
                  value={data.visionTitle}
                  onChange={(e) => setData({ ...data, visionTitle: e.target.value })}
                  className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
                />
              </div>
              <textarea
                rows={2}
                value={data.visionQuote}
                onChange={(e) => setData({ ...data, visionQuote: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
              <textarea
                rows={2}
                value={data.visionSubtext}
                onChange={(e) => setData({ ...data, visionSubtext: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>

            <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-3 cms-card">
              <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">Dark Innovation Callout Banner</h3>
              <input
                type="text"
                value={data.calloutEyebrow}
                onChange={(e) => setData({ ...data, calloutEyebrow: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
              <textarea
                rows={2}
                value={data.calloutQuote}
                onChange={(e) => setData({ ...data, calloutQuote: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
              <textarea
                rows={3}
                value={data.calloutDescription}
                onChange={(e) => setData({ ...data, calloutDescription: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
          </div>
        )}

        {tab === 'values' && (
          <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-4 cms-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={data.valuesBadge}
                onChange={(e) => setData({ ...data, valuesBadge: e.target.value })}
                className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
              <input
                type="text"
                value={data.valuesTitle}
                onChange={(e) => setData({ ...data, valuesTitle: e.target.value })}
                className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>
            <textarea
              rows={2}
              value={data.valuesDescription}
              onChange={(e) => setData({ ...data, valuesDescription: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />

            <div className="flex items-center justify-between pt-2">
              <h4 className="font-bold text-xs uppercase text-[#6F6A7C]">Value Cards ({data.values.length})</h4>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    values: [...data.values, { name: 'New Value', desc: 'Description here', icon: 'Lightbulb' }],
                  })
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Value
              </button>
            </div>

            {data.values.map((v, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] space-y-2.5 cms-muted-box">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#7C3AED]">{v.name || `Value #${idx + 1}`}</span>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, values: data.values.filter((_, i) => i !== idx) })}
                    className="text-red-500 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <IconPickerField
                    value={v.icon}
                    onChange={(val) => {
                      const next = [...data.values];
                      next[idx] = { ...next[idx], icon: val };
                      setData({ ...data, values: next });
                    }}
                  />
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6A7C] mb-1.5">Title</label>
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => {
                        const next = [...data.values];
                        next[idx] = { ...next[idx], name: e.target.value };
                        setData({ ...data, values: next });
                      }}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                    />
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={v.desc}
                  onChange={(e) => {
                    const next = [...data.values];
                    next[idx] = { ...next[idx], desc: e.target.value };
                    setData({ ...data, values: next });
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                />
              </div>
            ))}
          </div>
        )}

        {tab === 'capabilities' && (
          <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-4 cms-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={data.capabilitiesBadge}
                onChange={(e) => setData({ ...data, capabilitiesBadge: e.target.value })}
                className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
              <input
                type="text"
                value={data.capabilitiesTitle}
                onChange={(e) => setData({ ...data, capabilitiesTitle: e.target.value })}
                className="px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <h4 className="font-bold text-xs uppercase text-[#6F6A7C]">
                Engineering Discipline Cards ({data.capabilities.length})
              </h4>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    capabilities: [
                      ...data.capabilities,
                      {
                        id: `cap-${Date.now()}`,
                        title: 'New Practice Area',
                        description: 'Discipline description.',
                        icon: 'Code2',
                        image: '/images/product-design-ux.jpg',
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Discipline
              </button>
            </div>

            {data.capabilities.map((cap, idx) => (
              <div key={cap.id || idx} className="p-4 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] space-y-3 cms-muted-box">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#7C3AED]">{cap.title}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setData({ ...data, capabilities: data.capabilities.filter((_, i) => i !== idx) })
                    }
                    className="text-red-500 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <ImagePickerField
                  label="Discipline Card Photo"
                  value={cap.image}
                  onChange={(url) => {
                    const next = [...data.capabilities];
                    next[idx] = { ...next[idx], image: url };
                    setData({ ...data, capabilities: next });
                  }}
                  usedIn={`About: ${cap.title}`}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <IconPickerField
                    value={cap.icon}
                    onChange={(val) => {
                      const next = [...data.capabilities];
                      next[idx] = { ...next[idx], icon: val };
                      setData({ ...data, capabilities: next });
                    }}
                  />
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6A7C] mb-1.5">Title</label>
                    <input
                      type="text"
                      value={cap.title}
                      onChange={(e) => {
                        const next = [...data.capabilities];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setData({ ...data, capabilities: next });
                      }}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                    />
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={cap.description}
                  onChange={(e) => {
                    const next = [...data.capabilities];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setData({ ...data, capabilities: next });
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </EditorWorkspace>
  );
};
