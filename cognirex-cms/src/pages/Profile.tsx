import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Key, Moon, Save, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { api } from '../utils/api';
import { ImagePickerField } from '../components/ImagePickerField';

export const Profile: React.FC = () => {
  const { user, theme, setTheme, updateUser } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Display name cannot be empty.');
      return;
    }
    setSavingProfile(true);
    try {
      const res = await api.put('/profile', { name: name.trim(), avatar: avatar.trim() });
      if (res.data?.success) {
        updateUser(res.data.user.name, res.data.user.email, res.data.user.avatar);
        toast.success('Profile updated!');
      }
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please enter your current and new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setChangingPass(true);
    try {
      const res = await api.put('/profile', { currentPassword, newPassword });
      if (res.data?.success) {
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Password update failed.';
      toast.error(msg);
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <form
        onSubmit={handleSaveProfile}
        className="bg-white border border-[#E5E1ED] rounded-2xl p-6 space-y-5 shadow-xs cms-card"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-[#1F1B2E] cms-heading">Admin Profile</h1>
            <p className="text-xs text-[#6F6A7C]">
              Signed in as <span className="font-semibold text-[#7C3AED]">{user?.email}</span> ({user?.role})
            </p>
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
          />
        </div>

        <ImagePickerField
          label="Avatar Photo"
          value={avatar}
          onChange={setAvatar}
          usedIn="Admin Avatar"
        />

        <div className="pt-2 border-t border-[#E5E1ED] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#1F1B2E] cms-heading">CMS Workspace Appearance</p>
            <p className="text-[11px] text-[#6F6A7C]">Choose light or dark workspace mode.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#EEE8FA] text-[#7C3AED] border-[#7C3AED]/40'
                  : 'border-[#E5E1ED] text-[#6F6A7C]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                  : 'border-[#E5E1ED] text-[#6F6A7C]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </form>

      <form
        onSubmit={handlePasswordChange}
        className="bg-white border border-[#E5E1ED] rounded-2xl p-6 space-y-4 shadow-xs cms-card"
      >
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-[#7C3AED]" />
          <h2 className="text-base font-extrabold text-[#1F1B2E] cms-heading">
            Update CMS Password
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#6F6A7C] mb-1">Confirm New</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E5E1ED] rounded-xl cms-input"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={changingPass}
            className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            {changingPass ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};
