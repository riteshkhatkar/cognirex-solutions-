import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { api, WEBSITE_ORIGIN } from '../utils/api';
import {
  LayoutDashboard,
  Type,
  Users,
  Briefcase,
  Cpu,
  Globe,
  ShieldCheck,
  GitBranch,
  Building2,
  PhoneCall,
  Sparkles,
  Image as ImageIcon,
  MessageSquare,
  Calendar,
  UserCheck,
  Settings,
  User as UserIcon,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
  ChevronRight,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import type { CmsInquiry, CmsConsultation, CmsCareerApplication } from '../types';

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const { user, logout, theme, setTheme } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const [newInquiries, setNewInquiries] = useState(0);
  const [pendingConsults, setPendingConsults] = useState(0);
  const [newApps, setNewApps] = useState(0);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsPreviewActive(Boolean(detail?.isPreview));
    };
    window.addEventListener('cms:preview-toggle', handleToggle);
    return () => window.removeEventListener('cms:preview-toggle', handleToggle);
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [inqRes, conRes, appRes] = await Promise.all([
          api.get<CmsInquiry[]>('/inquiries'),
          api.get<CmsConsultation[]>('/consultations'),
          api.get<CmsCareerApplication[]>('/applications'),
        ]);
        if (Array.isArray(inqRes.data)) {
          setNewInquiries(inqRes.data.filter((i) => i.status === 'new').length);
        }
        if (Array.isArray(conRes.data)) {
          setPendingConsults(
            conRes.data.filter((b) => b.status === 'pending' || b.status === 'confirmed').length
          );
        }
        if (Array.isArray(appRes.data)) {
          setNewApps(appRes.data.filter((a) => a.status === 'new').length);
        }
      } catch {
        // silent fail on badge counts
      }
    };
    void fetchCounts();
    const timer = setInterval(fetchCounts, 30000);
    return () => clearInterval(timer);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out of Cognirex CMS');
    navigate('/login');
  };

  const navGroups = [
    {
      label: 'Overview',
      items: [{ name: 'Dashboard', path: '/', icon: LayoutDashboard }],
    },
    {
      label: 'Website Sections',
      items: [
        { name: 'Brand & Nav', path: '/editors/brand', icon: Globe },
        { name: 'Hero & Strip', path: '/editors/hero', icon: Type },
        { name: 'About & Culture', path: '/editors/about', icon: Users },
        { name: 'Solutions', path: '/editors/solutions', icon: Briefcase },
        { name: 'Why Choose Us', path: '/editors/why-choose-us', icon: ShieldCheck },
        { name: '5-Stage Process', path: '/editors/process', icon: GitBranch },
        { name: 'Industries', path: '/editors/industries', icon: Building2 },
        { name: 'Innovation & AI', path: '/editors/innovation', icon: Cpu },
        { name: 'Contact & Portal', path: '/editors/contact', icon: PhoneCall },
        { name: 'Careers Page', path: '/editors/careers', icon: Sparkles },
      ],
    },
    {
      label: 'Inbox & Media',
      items: [
        { name: 'Image Library', path: '/images', icon: ImageIcon },
        { name: 'Enquiries', path: '/inquiries', icon: MessageSquare, badge: newInquiries },
        { name: 'Consultations', path: '/bookings', icon: Calendar, badge: pendingConsults },
        { name: 'Applications', path: '/applications', icon: UserCheck, badge: newApps },
      ],
    },
    {
      label: 'Administration',
      items: [
        { name: 'Settings & SMTP', path: '/settings', icon: Settings },
        { name: 'My Profile', path: '/profile', icon: UserIcon },
      ],
    },
  ];

  const isCollapsed = isPreviewActive && !sidebarHovered;
  const currentBreadcrumb =
    navGroups
      .flatMap((g) => g.items)
      .find((i) => (i.path === '/' ? location.pathname === '/' : location.pathname.startsWith(i.path)))
      ?.name || 'CMS Console';

  const totalAlerts = newInquiries + pendingConsults + newApps;

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#1F1B2E] flex cms-shell">
      {/* Desktop Sidebar */}
      <aside
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        className={`hidden md:flex flex-col border-r border-[#E5E1ED] bg-white transition-all duration-300 sticky top-0 h-screen z-30 cms-sidebar ${
          isCollapsed ? 'w-[76px]' : 'w-64'
        }`}
      >
        <div
          className={`h-16 flex items-center border-b border-[#E5E1ED] shrink-0 ${
            isCollapsed ? 'justify-center px-2' : 'px-5 gap-3'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-[#7C3AED] flex items-center justify-center text-white font-bold text-lg shadow-sm relative shrink-0">
            <span>C</span>
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-extrabold tracking-tight text-[#1F1B2E] truncate cms-heading">
                COGNIREX <span className="text-[#7C3AED]">CMS</span>
              </p>
              <p className="text-[10px] font-semibold text-[#6F6A7C] uppercase tracking-wider truncate">
                Site Admin Portal
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!isCollapsed ? (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6F6A7C]">
                  {group.label}
                </p>
              ) : (
                <div className="mx-3 mb-2 h-px bg-[#E5E1ED]" />
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={item.name}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cms-nav-item ${
                        active
                          ? 'bg-[#7C3AED] text-white shadow-sm'
                          : 'text-[#4B455C] hover:bg-[#EEE8FA]/70 hover:text-[#7C3AED] cms-subtext'
                      } ${isCollapsed ? 'justify-center px-2' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span className="truncate">{item.name}</span>}
                      </div>
                      {!isCollapsed && item.badge ? (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            active
                              ? 'bg-white/25 text-white'
                              : 'bg-[#7C3AED] text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-[#E5E1ED] shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-[#E5E1ED] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 cms-topbar">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-[#1F1B2E] hover:bg-[#EEE8FA] cursor-pointer"
              aria-label="Open CMS menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
              <span className="font-semibold text-[#6F6A7C] hidden sm:inline">Cognirex CMS</span>
              <ChevronRight className="w-4 h-4 text-[#6F6A7C] hidden sm:inline shrink-0" />
              <span className="font-bold text-[#1F1B2E] truncate cms-heading">
                {currentBreadcrumb}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={WEBSITE_ORIGIN || '/'}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEE8FA] hover:bg-[#7C3AED] text-[#7C3AED] hover:text-white text-xs font-bold transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Theme Switch */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-xl border border-[#E5E1ED] hover:border-[#7C3AED]/40 text-[#6F6A7C] hover:text-[#7C3AED] transition-colors cursor-pointer"
              title="Toggle Light / Dark CMS Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#FACC15]" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl border border-[#E5E1ED] hover:border-[#7C3AED]/40 text-[#6F6A7C] hover:text-[#7C3AED] transition-colors cursor-pointer"
                title="Lead & Applicant Alerts"
              >
                <Bell className="w-4 h-4" />
                {totalAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold flex items-center justify-center">
                    {totalAlerts > 9 ? '9+' : totalAlerts}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5E1ED] rounded-2xl shadow-xl p-3 z-40 cms-card">
                  <p className="text-xs font-bold text-[#1F1B2E] px-2 pb-2 border-b border-[#E5E1ED] cms-heading">
                    Active Queue Summary
                  </p>
                  <div className="py-1.5 space-y-1 text-xs">
                    <Link
                      to="/inquiries"
                      onClick={() => setNotifOpen(false)}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[#EEE8FA]"
                    >
                      <span>Unread Enquiries</span>
                      <span className="font-bold text-[#7C3AED]">{newInquiries}</span>
                    </Link>
                    <Link
                      to="/bookings"
                      onClick={() => setNotifOpen(false)}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[#EEE8FA]"
                    >
                      <span>Active Consultations</span>
                      <span className="font-bold text-[#7C3AED]">{pendingConsults}</span>
                    </Link>
                    <Link
                      to="/applications"
                      onClick={() => setNotifOpen(false)}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[#EEE8FA]"
                    >
                      <span>New Career Applications</span>
                      <span className="font-bold text-[#7C3AED]">{newApps}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-[#E5E1ED] hover:border-[#7C3AED]/40 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    (user?.name || 'C').charAt(0).toUpperCase()
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-[#1F1B2E] max-w-[120px] truncate cms-heading">
                  {user?.name || 'Admin'}
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E1ED] rounded-2xl shadow-xl p-2 z-40 cms-card">
                  <div className="px-3 py-2 border-b border-[#E5E1ED] mb-1">
                    <p className="text-xs font-bold text-[#1F1B2E] truncate cms-heading">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-[#6F6A7C] truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-[#EEE8FA]"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-[#EEE8FA]"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Global Settings</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 mt-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#1F1B2E]/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative w-72 bg-white h-full flex flex-col shadow-2xl z-10 cms-sidebar">
            <div className="h-16 px-5 border-b border-[#E5E1ED] flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#1F1B2E] cms-heading">
                COGNIREX <span className="text-[#7C3AED]">CMS</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#EEE8FA] text-[#6F6A7C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-5">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#6F6A7C]">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active =
                        item.path === '/'
                          ? location.pathname === '/'
                          : location.pathname.startsWith(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                            active
                              ? 'bg-[#7C3AED] text-white'
                              : 'text-[#4B455C] hover:bg-[#EEE8FA]'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4" />
                            {item.name}
                          </span>
                          {item.badge ? (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/25">
                              {item.badge}
                            </span>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
};
