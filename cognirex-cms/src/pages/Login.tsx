import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { api, WEBSITE_ORIGIN } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { ThreeBackground } from '../components/ThreeBackground';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (cfg: { client_id: string; callback: (res: { credential: string }) => void }) => void;
          renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithToken, isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [googleClientId, setGoogleClientId] = useState(
    (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || ''
  );

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get<{ googleClientId?: string }>('/auth/config');
        if (res.data?.googleClientId) {
          setGoogleClientId(res.data.googleClientId);
        }
      } catch {
        // Keep Vite env fallback
      }
    };
    void fetchConfig();
  }, []);

  useEffect(() => {
    const btnContainer = document.getElementById('cognirex-google-btn');
    if (!googleClientId || !window.google?.accounts?.id || !btnContainer) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        if (!response?.credential) return;
        setIsLoading(true);
        try {
          const res = await api.post('/auth/google', { credential: response.credential });
          if (res.data?.success && res.data?.token) {
            loginWithToken(res.data.token, res.data.user);
            toast.success(`Welcome back, ${res.data.user.name}!`);
            navigate('/');
          } else {
            toast.error(res.data?.error || 'Google Sign-In rejected.');
          }
        } catch (err: unknown) {
          const msg =
            (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
            'Unauthorized Google account.';
          toast.error(msg);
        } finally {
          setIsLoading(false);
        }
      },
    });

    btnContainer.innerHTML = '';
    window.google.accounts.id.renderButton(btnContainer, {
      theme: 'outline',
      size: 'large',
      width: 340,
      text: 'continue_with',
    });
  }, [googleClientId, loginWithToken, navigate]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter your authorized email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      if (res.data?.success && res.data?.token) {
        loginWithToken(res.data.token, res.data.user);
        toast.success(`Welcome to Cognirex CMS, ${res.data.user.name}`);
        navigate('/');
      } else {
        toast.error(res.data?.error || 'Authentication failed');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Invalid credentials or unauthorized email.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevLocalSignIn = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/google', { credential: 'dev_local_token' });
      if (res.data?.success && res.data?.token) {
        loginWithToken(res.data.token, res.data.user);
        toast.success(`Signed in as ${res.data.user.email}`);
        navigate('/');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Local development sign-in is disabled in production.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error('Enter your admin email address.');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail.trim() });
      toast.success(res.data?.message || 'Recovery guidance dispatched.');
      setShowForgotModal(false);
    } catch {
      toast.error('Could not dispatch recovery message.');
    } finally {
      setForgotLoading(false);
    }
  };

  const isLocalhost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <ThreeBackground />

      <div className="w-full max-w-md relative z-10">
        {/* Top Back Link */}
        <div className="mb-5 flex items-center justify-between">
          <a
            href={WEBSITE_ORIGIN || '/'}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6F6A7C] hover:text-[#7C3AED] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cognirex Website</span>
          </a>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#7C3AED] bg-[#EEE8FA] px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Admin</span>
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-md border border-[#E5E1ED] rounded-3xl p-7 sm:p-8 shadow-xl">
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] flex items-center justify-center text-white font-extrabold text-xl shadow-md relative mb-3">
              <span>C</span>
              <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FACC15]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F1B2E] tracking-tight">
              COGNIREX <span className="text-[#7C3AED]">CMS</span>
            </h1>
            <p className="text-xs text-[#6F6A7C] mt-1">
              Sign in to manage website content, media library, and enquiries.
            </p>
          </div>

          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6A7C] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7C3AED] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cognirexsolutions.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F8F7FC] border border-[#E5E1ED] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6F6A7C]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] font-semibold text-[#7C3AED] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7C3AED] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#F8F7FC] border border-[#E5E1ED] rounded-xl focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6A7C] hover:text-[#1F1B2E] cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to CMS Console</span>
                </>
              )}
            </button>
          </form>

          {googleClientId && (
            <div className="mt-5 pt-5 border-t border-[#E5E1ED] flex flex-col items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6F6A7C]">
                Or Sign In with Whitelisted Google Account
              </span>
              <div id="cognirex-google-btn" />
            </div>
          )}

          {!googleClientId && isLocalhost && (
            <div className="mt-5 pt-5 border-t border-[#E5E1ED] text-center space-y-2">
              <p className="text-[11px] text-[#6F6A7C]">
                Local Development Workspace Ready
              </p>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleDevLocalSignIn}
                className="w-full py-2.5 px-4 rounded-xl bg-[#EEE8FA] hover:bg-[#E2D6FA] text-[#7C3AED] text-xs font-bold transition-colors cursor-pointer"
              >
                One-Click Local Super Admin Sign-In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-[#1F1B2E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E1ED] shadow-2xl max-w-sm w-full p-6">
            <h2 className="text-lg font-bold text-[#1F1B2E] mb-1">Admin Password Assistance</h2>
            <p className="text-xs text-[#6F6A7C] mb-4">
              Enter your whitelisted CMS administrator email to receive recovery instructions.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="admin@cognirexsolutions.com"
                className="w-full px-3.5 py-2.5 text-sm bg-[#F8F7FC] border border-[#E5E1ED] rounded-xl focus:outline-none focus:border-[#7C3AED]"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6F6A7C] hover:bg-[#F8F7FC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] cursor-pointer disabled:opacity-50"
                >
                  {forgotLoading ? 'Sending...' : 'Send Guidance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
