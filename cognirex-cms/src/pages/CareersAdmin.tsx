import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Download, ExternalLink, Loader2, Mail, Search, Send, Trash2, UserCheck, X } from 'lucide-react';
import { api } from '../utils/api';
import type { CmsCareerApplication } from '../types';

export const CareersAdmin: React.FC = () => {
  const [apps, setApps] = useState<CmsCareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | CmsCareerApplication['status']>('all');
  const [search, setSearch] = useState('');

  const [emailTarget, setEmailTarget] = useState<CmsCareerApplication | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<CmsCareerApplication[]>('/applications');
      setApps(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load career applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const updateStatus = async (id: string, status: CmsCareerApplication['status']) => {
    try {
      await api.put(`/applications/${id}`, { status });
      setApps((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      toast.success(`Application status set to ${status}`);
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this candidate application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      setApps((prev) => prev.filter((a) => a._id !== id));
      toast.success('Application removed');
    } catch {
      toast.error('Delete failed');
    }
  };

  const sendApplicantEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailTarget) return;
    setSending(true);
    try {
      const res = await api.post(`/applications/${emailTarget._id}/reply`, {
        subject,
        message: body,
      });
      toast.success(res.data?.message || 'Applicant emailed!');
      setEmailTarget(null);
      await load();
    } catch {
      toast.error('Failed to dispatch applicant email');
    } finally {
      setSending(false);
    }
  };

  const filtered = apps.filter((a) => {
    const matchStatus = filter === 'all' || a.status === filter;
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      a.fullName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.positionOfInterest.toLowerCase().includes(q);
    return matchStatus && matchQ;
  });

  const exportCsv = () => {
    const header = ['Name', 'Email', 'Phone', 'Role', 'Experience', 'LinkedIn', 'Status', 'Submitted'];
    const rows = filtered.map((a) => [
      a.fullName,
      a.email,
      a.phone,
      a.positionOfInterest,
      a.experience,
      a.linkedIn || '',
      a.status,
      a.submittedAt,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognirex-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs cms-card">
        <div>
          <h1 className="text-xl font-extrabold text-[#1F1B2E] cms-heading">
            Career Applications
          </h1>
          <p className="text-xs text-[#6F6A7C] mt-0.5 cms-subtext">
            Review applicants submitted from Cognirex Careers Portal.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E1ED] hover:border-[#7C3AED] text-xs font-bold text-[#1F1B2E] transition-colors cursor-pointer cms-card"
        >
          <Download className="w-4 h-4 text-[#7C3AED]" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-[#E5E1ED] rounded-xl px-3.5 py-2 flex-1 cms-card">
          <Search className="w-4 h-4 text-[#6F6A7C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate name, email, or role..."
            className="flex-1 text-sm bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-[#E5E1ED] rounded-xl p-1 flex-wrap cms-card">
          {(['all', 'new', 'shortlisted', 'interviewing', 'hired', 'rejected'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                filter === st ? 'bg-[#7C3AED] text-white' : 'text-[#6F6A7C] hover:text-[#1F1B2E]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-14">
          <Loader2 className="w-7 h-7 animate-spin text-[#7C3AED]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E1ED] rounded-2xl p-10 text-center cms-card">
          <UserCheck className="w-9 h-9 text-[#A78BFA] mx-auto mb-2.5" />
          <p className="text-sm font-bold text-[#1F1B2E] cms-heading">No applications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app._id}
              className="bg-white border border-[#E5E1ED] rounded-2xl p-5 shadow-xs space-y-3 cms-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-[#1F1B2E] cms-heading">
                      {app.fullName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EEE8FA] text-[#7C3AED] text-[11px] font-bold">
                      {app.positionOfInterest}
                    </span>
                    <span className="text-xs font-semibold text-[#6F6A7C]">
                      · {app.experience}
                    </span>
                  </div>
                  <p className="text-xs text-[#6F6A7C] mt-1">
                    {app.email} · {app.phone}
                    {app.resumeFileName ? ` · Resume: ${app.resumeFileName}` : ''}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {app.linkedIn && (
                    <a
                      href={app.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E5E1ED] text-xs font-semibold text-[#7C3AED]"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <select
                    value={app.status}
                    onChange={(e) =>
                      updateStatus(app._id, e.target.value as CmsCareerApplication['status'])
                    }
                    className="px-2.5 py-1.5 text-xs font-semibold border border-[#E5E1ED] rounded-lg bg-[#F8F7FC] cms-input"
                  >
                    <option value="new">New</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailTarget(app);
                      setSubject(`Application Update — Cognirex Solutions`);
                      setBody(
                        `Hello ${app.fullName},\n\nThank you for submitting your interest in joining Cognirex Solutions.\n\nBest regards,\nCognirex Talent Team`
                      );
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(app._id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-[#4B455C] bg-[#F8F7FC] p-3.5 rounded-xl border border-[#E5E1ED] cms-muted-box">
                {app.shortIntroduction}
              </p>
            </div>
          ))}
        </div>
      )}

      {emailTarget && (
        <div className="fixed inset-0 z-50 bg-[#1F1B2E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E1ED] shadow-2xl max-w-lg w-full p-6 cms-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-[#1F1B2E] cms-heading">
                Email Candidate — {emailTarget.fullName}
              </h2>
              <button
                type="button"
                onClick={() => setEmailTarget(null)}
                className="p-1.5 rounded-lg hover:bg-[#EEE8FA] text-[#6F6A7C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={sendApplicantEmail} className="space-y-3">
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
              <textarea
                rows={5}
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEmailTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6F6A7C] hover:bg-[#F8F7FC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? 'Sending...' : 'Send Email'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
