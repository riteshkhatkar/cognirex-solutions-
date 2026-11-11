import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, MailCheck, Plus, Save, Shield, Trash2 } from 'lucide-react';
import { api } from '../utils/api';

export const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [savingContact, setSavingContact] = useState(false);
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);

  const [superAdminEmail, setSuperAdminEmail] = useState('');
  const [authorizedEmails, setAuthorizedEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');

  const [contactInfo, setContactInfo] = useState({
    companyEmail: '',
    phone: '',
    location: '',
    officeHours: '',
    linkedinUrl: '',
    twitterUrl: '',
    githubUrl: '',
  });

  const [smtp, setSmtp] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    user: '',
    pass: '',
    from: '',
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      if (res.data?.contactInfo) setContactInfo(res.data.contactInfo);
      if (Array.isArray(res.data?.authorizedEmails)) setAuthorizedEmails(res.data.authorizedEmails);
      if (res.data?.smtp) setSmtp(res.data.smtp);
      if (res.data?.superAdminEmail) setSuperAdminEmail(res.data.superAdminEmail);
    } catch {
      toast.error('Failed to load CMS settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const saveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      await api.put('/settings/contact', contactInfo);
      toast.success('Global contact & social links updated!');
    } catch {
      toast.error('Failed to save contact settings.');
    } finally {
      setSavingContact(false);
    }
  };

  const addEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    try {
      const res = await api.post('/settings/authorized-emails', { email: newEmail.trim() });
      setAuthorizedEmails(res.data.authorizedEmails || []);
      setNewEmail('');
      toast.success('Authorized admin email added.');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Could not add email.';
      toast.error(msg);
    }
  };

  const removeEmail = async (email: string) => {
    try {
      const res = await api.delete('/settings/authorized-emails', { data: { email } });
      setAuthorizedEmails(res.data.authorizedEmails || []);
      toast.success(`Removed ${email}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Could not remove email.';
      toast.error(msg);
    }
  };

  const saveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSmtp(true);
    try {
      await api.put('/settings/smtp', smtp);
      toast.success('SMTP transport configuration saved!');
    } catch {
      toast.error('Failed to save SMTP config.');
    } finally {
      setSavingSmtp(false);
    }
  };

  const testSmtp = async () => {
    setTestingSmtp(true);
    try {
      const res = await api.post('/settings/smtp/test', smtp);
      toast.success(res.data?.message || 'SMTP verified cleanly!');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'SMTP verification failed.';
      toast.error(msg);
    } finally {
      setTestingSmtp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-7 h-7 animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Global Contact & Social */}
      <form
        onSubmit={saveContact}
        className="bg-white border border-[#E5E1ED] rounded-2xl p-6 space-y-4 shadow-xs cms-card"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#1F1B2E] cms-heading">
              Global Headquarters &amp; Socials
            </h2>
            <p className="text-xs text-[#6F6A7C]">
              Syncs location, office hours, and social profiles with website Header &amp; Footer.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingContact}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingContact ? 'Saving...' : 'Save Contact'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Company Email</label>
            <input
              type="text"
              value={contactInfo.companyEmail}
              onChange={(e) => setContactInfo({ ...contactInfo, companyEmail: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Location Label</label>
            <input
              type="text"
              value={contactInfo.location}
              onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Office Hours</label>
            <input
              type="text"
              value={contactInfo.officeHours}
              onChange={(e) => setContactInfo({ ...contactInfo, officeHours: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">LinkedIn URL</label>
            <input
              type="text"
              value={contactInfo.linkedinUrl}
              onChange={(e) => setContactInfo({ ...contactInfo, linkedinUrl: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">X / Twitter URL</label>
            <input
              type="text"
              value={contactInfo.twitterUrl}
              onChange={(e) => setContactInfo({ ...contactInfo, twitterUrl: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">GitHub URL</label>
            <input
              type="text"
              value={contactInfo.githubUrl}
              onChange={(e) => setContactInfo({ ...contactInfo, githubUrl: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
        </div>
      </form>

      {/* Authorized Whitelist */}
      <div className="bg-white border border-[#E5E1ED] rounded-2xl p-6 space-y-4 shadow-xs cms-card">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#7C3AED]" />
          <div>
            <h2 className="text-lg font-extrabold text-[#1F1B2E] cms-heading">
              Authorized CMS Admin Whitelist
            </h2>
            <p className="text-xs text-[#6F6A7C]">
              Only emails listed here can access Cognirex CMS via Google OAuth or Credentials.
            </p>
          </div>
        </div>

        <form onSubmit={addEmail} className="flex gap-2">
          <input
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="teammate@cognirexsolutions.com"
            className="flex-1 px-3.5 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Authorize Email</span>
          </button>
        </form>

        <div className="space-y-2">
          {authorizedEmails.map((em) => {
            const isSuper = em.toLowerCase() === superAdminEmail.toLowerCase();
            return (
              <div
                key={em}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-xs cms-muted-box"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1F1B2E] cms-heading">{em}</span>
                  {isSuper && (
                    <span className="px-2 py-0.5 rounded-full bg-[#EEE8FA] text-[#7C3AED] text-[10px] font-bold">
                      Primary Super Admin
                    </span>
                  )}
                </div>
                {!isSuper && (
                  <button
                    type="button"
                    onClick={() => removeEmail(em)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                    title="Revoke access"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SMTP Configuration */}
      <form
        onSubmit={saveSmtp}
        className="bg-white border border-[#E5E1ED] rounded-2xl p-6 space-y-4 shadow-xs cms-card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#1F1B2E] cms-heading">
              SMTP Email Dispatch Configuration
            </h2>
            <p className="text-xs text-[#6F6A7C]">
              Used when replying to enquiries, confirming consultations, or emailing job applicants.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={testingSmtp}
              onClick={testSmtp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E1ED] hover:border-[#7C3AED] text-xs font-bold cursor-pointer cms-card"
            >
              <MailCheck className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>{testingSmtp ? 'Testing...' : 'Test SMTP'}</span>
            </button>
            <button
              type="submit"
              disabled={savingSmtp}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSmtp ? 'Saving...' : 'Save SMTP'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">SMTP Host</label>
            <input
              type="text"
              value={smtp.host}
              onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">SMTP Port</label>
            <input
              type="number"
              value={smtp.port}
              onChange={(e) => setSmtp({ ...smtp, port: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">SMTP Username</label>
            <input
              type="text"
              value={smtp.user}
              onChange={(e) => setSmtp({ ...smtp, user: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">SMTP Password / App Key</label>
            <input
              type="password"
              value={smtp.pass}
              onChange={(e) => setSmtp({ ...smtp, pass: e.target.value })}
              placeholder="••••••••••••••••"
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
