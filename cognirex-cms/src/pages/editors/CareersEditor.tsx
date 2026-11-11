import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { EditorWorkspace } from '../../components/EditorWorkspace';
import { SectionEditorHeader } from '../../components/SectionEditorHeader';
import { useSectionEditor } from '../../hooks/useSectionEditor';
import { DEFAULT_COGNIR_CONTENT } from '../../utils/defaultCognirexData';
import type { CareersSectionData } from '../../types';

export const CareersEditor: React.FC = () => {
  const { data, setData, isSaving, save, resetToDefaults } = useSectionEditor<CareersSectionData>(
    'careers',
    DEFAULT_COGNIR_CONTENT.careers
  );

  const addOpening = () => {
    setData({
      ...data,
      openings: [
        ...(data.openings || []),
        {
          id: `job-${Date.now()}`,
          title: 'Full Stack Software Engineer',
          department: 'Engineering',
          type: 'Full-Time',
          location: 'Remote / India',
          description: 'Build reliable Next.js web applications, APIs, and AI-enabled systems.',
          requirements: ['TypeScript / React expertise', 'Strong backend API architecture'],
        },
      ],
    });
  };

  return (
    <EditorWorkspace section="careers" data={data} previewPath="/careers">
      <SectionEditorHeader
        title="Careers Page & Job Openings"
        subtitle="Manage /careers copy and publish or remove open job listings live."
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
            <div>
              <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">
                Open Positions ({data.openings?.length || 0})
              </h3>
              <p className="text-[11px] text-[#6F6A7C]">
                When empty, /careers shows the Talent Network invitation panel below.
              </p>
            </div>
            <button
              type="button"
              onClick={addOpening}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EEE8FA] text-[#7C3AED] text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Job Role
            </button>
          </div>

          {(data.openings || []).map((job, idx) => (
            <div key={job.id || idx} className="p-4 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] space-y-2.5 cms-muted-box">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#7C3AED]">{job.title}</span>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      openings: data.openings.filter((_, i) => i !== idx),
                    })
                  }
                  className="text-red-500 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={job.title}
                  onChange={(e) => {
                    const next = [...data.openings];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setData({ ...data, openings: next });
                  }}
                  placeholder="Role Title"
                  className="px-2.5 py-1.5 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                />
                <input
                  type="text"
                  value={job.department}
                  onChange={(e) => {
                    const next = [...data.openings];
                    next[idx] = { ...next[idx], department: e.target.value };
                    setData({ ...data, openings: next });
                  }}
                  placeholder="Department"
                  className="px-2.5 py-1.5 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                />
                <input
                  type="text"
                  value={job.type}
                  onChange={(e) => {
                    const next = [...data.openings];
                    next[idx] = { ...next[idx], type: e.target.value };
                    setData({ ...data, openings: next });
                  }}
                  placeholder="Full-Time / Contract"
                  className="px-2.5 py-1.5 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                />
                <input
                  type="text"
                  value={job.location}
                  onChange={(e) => {
                    const next = [...data.openings];
                    next[idx] = { ...next[idx], location: e.target.value };
                    setData({ ...data, openings: next });
                  }}
                  placeholder="Location"
                  className="px-2.5 py-1.5 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
                />
              </div>
              <textarea
                rows={2}
                value={job.description}
                onChange={(e) => {
                  const next = [...data.openings];
                  next[idx] = { ...next[idx], description: e.target.value };
                  setData({ ...data, openings: next });
                }}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
              />
              <textarea
                rows={2}
                value={(job.requirements || []).join('\n')}
                onChange={(e) => {
                  const next = [...data.openings];
                  next[idx] = {
                    ...next[idx],
                    requirements: e.target.value.split('\n').filter((line) => line.trim() !== ''),
                  };
                  setData({ ...data, openings: next });
                }}
                placeholder="Requirements (one per line)"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E5E1ED] rounded-lg cms-input"
              />
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 space-y-3 cms-card">
          <h3 className="font-bold text-sm text-[#1F1B2E] cms-heading">Empty Roles Fallback Card</h3>
          <input
            type="text"
            value={data.emptyBadge}
            onChange={(e) => setData({ ...data, emptyBadge: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />
          <input
            type="text"
            value={data.emptyTitle}
            onChange={(e) => setData({ ...data, emptyTitle: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />
          <textarea
            rows={2}
            value={data.emptyDescription}
            onChange={(e) => setData({ ...data, emptyDescription: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />
          <input
            type="text"
            value={data.formPrompt}
            onChange={(e) => setData({ ...data, formPrompt: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />
        </div>
      </div>
    </EditorWorkspace>
  );
};
