import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Calendar, Download, Loader2, Mail, Save, Search, Trash2, X } from 'lucide-react';
import { api } from '../utils/api';
import type { CmsConsultation } from '../types';

export const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<CmsConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | CmsConsultation['status']>('all');
  const [search, setSearch] = useState('');
  const [noteModal, setNoteModal] = useState<CmsConsultation | null>(null);
  const [notesText, setNotesText] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get<CmsConsultation[]>('/consultations');
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load consultation bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const updateStatus = async (id: string, status: CmsConsultation['status']) => {
    try {
      await api.put(`/consultations/${id}/status`, { status });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
      toast.success(`Consultation updated: ${status}`);
    } catch {
      toast.error('Status update failed');
    }
  };

  const saveNotes = async () => {
    if (!noteModal) return;
    try {
      await api.put(`/consultations/${noteModal._id}/notes`, { adminNotes: notesText });
      setBookings((prev) =>
        prev.map((b) => (b._id === noteModal._id ? { ...b, adminNotes: notesText } : b))
      );
      toast.success('Consultation notes saved');
      setNoteModal(null);
    } catch {
      toast.error('Failed to save notes');
    }
  };

  const sendConfirmationEmail = async (booking: CmsConsultation) => {
    try {
      const res = await api.post(`/consultations/${booking._id}/email`, {});
      toast.success(res.data?.message || 'Confirmation email sent');
    } catch {
      toast.error('Email dispatch failed');
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm('Delete this consultation booking?')) return;
    try {
      await api.delete(`/consultations/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success('Booking deleted');
    } catch {
      toast.error('Failed to delete booking');
    }
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      b.fullName.toLowerCase().includes(q) ||
      b.workEmail.toLowerCase().includes(q) ||
      b.meetingType.toLowerCase().includes(q);
    return matchStatus && matchQ;
  });

  const exportCsv = () => {
    const header = ['Name', 'Email', 'Phone', 'Date', 'Time', 'Type', 'Status', 'Admin Notes'];
    const rows = filtered.map((b) => [
      b.fullName,
      b.workEmail,
      b.phone,
      b.preferredDate,
      b.preferredTime,
      b.meetingType,
      b.status,
      b.adminNotes || '',
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognirex-consultations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#E5E1ED] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs cms-card">
        <div>
          <h1 className="text-xl font-extrabold text-[#1F1B2E] cms-heading">
            Consultation Bookings
          </h1>
          <p className="text-xs text-[#6F6A7C] mt-0.5 cms-subtext">
            Scheduled consultation appointments with double-booking prevention.
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
            placeholder="Search bookings by name, email, or meeting topic..."
            className="flex-1 text-sm bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-[#E5E1ED] rounded-xl p-1 flex-wrap cms-card">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#7C3AED] text-white'
                  : 'text-[#6F6A7C] hover:text-[#1F1B2E]'
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
          <Calendar className="w-9 h-9 text-[#A78BFA] mx-auto mb-2.5" />
          <p className="text-sm font-bold text-[#1F1B2E] cms-heading">No consultations scheduled</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div
              key={b._id}
              className="bg-white border border-[#E5E1ED] rounded-2xl p-5 shadow-xs space-y-3 cms-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-[#1F1B2E] cms-heading">
                      {b.fullName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EEE8FA] text-[#7C3AED] text-[11px] font-bold">
                      {b.preferredDate} at {b.preferredTime}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FACC15]/25 text-[#1F1B2E] text-[10px] font-bold uppercase">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6F6A7C] mt-1">
                    {b.workEmail} · {b.phone} · {b.meetingType}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <select
                    value={b.status}
                    onChange={(e) =>
                      updateStatus(b._id, e.target.value as CmsConsultation['status'])
                    }
                    className="px-2.5 py-1.5 text-xs font-semibold border border-[#E5E1ED] rounded-lg bg-[#F8F7FC] cms-input"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setNoteModal(b);
                      setNotesText(b.adminNotes || '');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E1ED] hover:border-[#7C3AED] text-xs font-bold text-[#1F1B2E] cursor-pointer cms-card"
                  >
                    Notes
                  </button>
                  <button
                    type="button"
                    onClick={() => sendConfirmationEmail(b)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Client</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBooking(b._id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                    title="Delete booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {b.additionalNotes && (
                <p className="text-xs text-[#4B455C] bg-[#F8F7FC] p-3 rounded-xl border border-[#E5E1ED] cms-muted-box">
                  <span className="font-bold">Client Notes:</span> {b.additionalNotes}
                </p>
              )}

              {b.adminNotes && (
                <p className="text-xs text-[#7C3AED] bg-[#EEE8FA]/60 p-3 rounded-xl border border-[#7C3AED]/20">
                  <span className="font-bold">Internal Admin Notes:</span> {b.adminNotes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {noteModal && (
        <div className="fixed inset-0 z-50 bg-[#1F1B2E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E1ED] shadow-2xl max-w-md w-full p-6 cms-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-base text-[#1F1B2E] cms-heading">
                Consultation Notes — {noteModal.fullName}
              </h2>
              <button
                type="button"
                onClick={() => setNoteModal(null)}
                className="p-1.5 rounded-lg hover:bg-[#EEE8FA] text-[#6F6A7C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={4}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Meeting link, agenda notes, or follow-up action items..."
              className="w-full px-3.5 py-2.5 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setNoteModal(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6F6A7C] hover:bg-[#F8F7FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveNotes}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
