import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Download,
  Loader2,
  Mail,
  MessageSquare,
  Search,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import { api } from '../utils/api';
import type { CmsInquiry } from '../types';

export const Inquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<CmsInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'responded' | 'closed'>('all');
  const [search, setSearch] = useState('');

  const [replyTarget, setReplyTarget] = useState<CmsInquiry | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<CmsInquiry[]>('/inquiries');
      setInquiries(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to fetch project enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleStatusChange = async (id: string, status: CmsInquiry['status']) => {
    try {
      await api.put(`/inquiries/${id}/status`, { status });
      setInquiries((prev) => prev.map((i) => (i._id === id ? { ...i, status } : i)));
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error('Could not update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this enquiry permanently?')) return;
    try {
      await api.delete(`/inquiries/${id}`);
      setInquiries((prev) => prev.filter((i) => i._id !== id));
      toast.success('Enquiry deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const openReply = (inq: CmsInquiry) => {
    setReplyTarget(inq);
    setReplySubject(`Re: ${inq.serviceInterestedIn} Enquiry — Cognirex Solutions`);
    setReplyBody(
      `Hello ${inq.fullName},\n\nThank you for reaching out to Cognirex Solutions regarding ${inq.serviceInterestedIn}.\n\nOur engineering team has reviewed your project overview and would be happy to discuss next steps.\n\nBest regards,\nCognirex Solutions`
    );
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTarget) return;
    setSendingReply(true);
    try {
      const res = await api.post(`/inquiries/${replyTarget._id}/reply`, {
        subject: replySubject,
        message: replyBody,
      });
      toast.success(res.data?.message || 'Reply sent!');
      setInquiries((prev) =>
        prev.map((i) => (i._id === replyTarget._id ? { ...i, status: 'responded' } : i))
      );
      setReplyTarget(null);
    } catch {
      toast.error('Failed to dispatch reply.');
    } finally {
      setSendingReply(false);
    }
  };

  const exportCsv = () => {
    const header = ['Name', 'Company', 'Email', 'Phone', 'Service', 'Budget', 'Status', 'Submitted', 'Description'];
    const rows = filtered.map((i) => [
      i.fullName,
      i.companyName,
      i.workEmail,
      i.phone,
      i.serviceInterestedIn,
      i.projectBudget || '',
      i.status,
      i.submittedAt,
      i.projectDescription.replace(/\s+/g, ' '),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognirex-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = inquiries.filter((i) => {
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      i.fullName.toLowerCase().includes(q) ||
      i.companyName.toLowerCase().includes(q) ||
      i.workEmail.toLowerCase().includes(q) ||
      i.serviceInterestedIn.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs cms-card">
        <div>
          <h1 className="text-xl font-extrabold text-[#1F1B2E] cms-heading">Project Enquiries</h1>
          <p className="text-xs text-[#6F6A7C] mt-0.5 cms-subtext">
            Submissions received from Cognirex Contact Portal ({inquiries.length} total).
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

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-[#E5E1ED] rounded-xl px-3.5 py-2 flex-1 cms-card">
          <Search className="w-4 h-4 text-[#6F6A7C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, email, or service..."
            className="flex-1 text-sm bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-[#E5E1ED] rounded-xl p-1 cms-card">
          {(['all', 'new', 'read', 'responded', 'closed'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                statusFilter === tab
                  ? 'bg-[#7C3AED] text-white'
                  : 'text-[#6F6A7C] hover:text-[#1F1B2E]'
              }`}
            >
              {tab}
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
          <MessageSquare className="w-9 h-9 text-[#A78BFA] mx-auto mb-2.5" />
          <p className="text-sm font-bold text-[#1F1B2E] cms-heading">No matching enquiries</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-[#E5E1ED] rounded-2xl p-5 shadow-xs space-y-3 cms-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-[#1F1B2E] cms-heading">
                      {item.fullName}
                    </h3>
                    <span className="text-xs font-semibold text-[#6F6A7C]">
                      · {item.companyName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'new'
                          ? 'bg-[#EEE8FA] text-[#7C3AED]'
                          : item.status === 'responded'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6F6A7C] mt-1">
                    {item.workEmail} · {item.phone} ·{' '}
                    <span className="font-semibold text-[#7C3AED]">{item.serviceInterestedIn}</span>
                    {item.projectBudget ? ` · Budget: ${item.projectBudget}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value as CmsInquiry['status'])
                    }
                    className="px-2.5 py-1.5 text-xs font-semibold border border-[#E5E1ED] rounded-lg bg-[#F8F7FC] cms-input"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="responded">Responded</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => openReply(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                    title="Delete enquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-[#4B455C] bg-[#F8F7FC] p-3.5 rounded-xl border border-[#E5E1ED] cms-muted-box">
                {item.projectDescription}
              </p>

              <p className="text-[11px] text-[#6F6A7C]">
                Submitted: {new Date(item.submittedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Reply Dialog */}
      {replyTarget && (
        <div className="fixed inset-0 z-50 bg-[#1F1B2E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E1ED] shadow-2xl max-w-lg w-full p-6 cms-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-[#1F1B2E] cms-heading">
                Reply to {replyTarget.fullName}
              </h2>
              <button
                type="button"
                onClick={() => setReplyTarget(null)}
                className="p-1.5 rounded-lg hover:bg-[#EEE8FA] text-[#6F6A7C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={sendReply} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#6F6A7C] mb-1">To</label>
                <input
                  type="text"
                  disabled
                  value={replyTarget.workEmail}
                  className="w-full px-3 py-2 text-xs bg-[#F8F7FC] border border-[#E5E1ED] rounded-xl text-[#6F6A7C]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Message</label>
                <textarea
                  rows={5}
                  required
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6F6A7C] hover:bg-[#F8F7FC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingReply ? 'Sending...' : 'Send Reply'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
