import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Cpu,
  GitBranch,
  Globe,
  Image as ImageIcon,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Type,
  UserCheck,
  Users,
} from 'lucide-react';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import type {
  CmsActivityItem,
  CmsCareerApplication,
  CmsConsultation,
  CmsInquiry,
  CmsMediaAsset,
} from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [inquiriesCount, setInquiriesCount] = useState(0);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);
  const [consultationsCount, setConsultationsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);
  const [activities, setActivities] = useState<CmsActivityItem[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [inqRes, conRes, appRes, medRes, actRes] = await Promise.all([
          api.get<CmsInquiry[]>('/inquiries'),
          api.get<CmsConsultation[]>('/consultations'),
          api.get<CmsCareerApplication[]>('/applications'),
          api.get<CmsMediaAsset[]>('/media'),
          api.get<CmsActivityItem[]>('/activities'),
        ]);

        const inqs = Array.isArray(inqRes.data) ? inqRes.data : [];
        const cons = Array.isArray(conRes.data) ? conRes.data : [];
        const apps = Array.isArray(appRes.data) ? appRes.data : [];
        const meds = Array.isArray(medRes.data) ? medRes.data : [];
        const acts = Array.isArray(actRes.data) ? actRes.data : [];

        setInquiriesCount(inqs.length);
        setNewInquiriesCount(inqs.filter((i) => i.status === 'new').length);
        setConsultationsCount(cons.length);
        setApplicationsCount(apps.length);
        setMediaCount(meds.length);
        setActivities(acts.slice(0, 10));
      } catch {
        // leave zero counts gracefully
      } finally {
        setLoading(false);
      }
    };
    void loadStats();
  }, []);

  const statCards = [
    {
      label: 'Project Enquiries',
      value: inquiriesCount,
      sub: `${newInquiriesCount} awaiting reply`,
      icon: MessageSquare,
      to: '/inquiries',
      accent: 'bg-[#EEE8FA] text-[#7C3AED]',
    },
    {
      label: 'Consultations',
      value: consultationsCount,
      sub: 'Scheduled appointments',
      icon: Calendar,
      to: '/bookings',
      accent: 'bg-[#FACC15]/25 text-[#1F1B2E]',
    },
    {
      label: 'Career Applications',
      value: applicationsCount,
      sub: 'Candidate submissions',
      icon: UserCheck,
      to: '/applications',
      accent: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Image Library',
      value: mediaCount,
      sub: 'Hosted photos & media',
      icon: ImageIcon,
      to: '/images',
      accent: 'bg-sky-50 text-sky-700',
    },
  ];

  const sectionShortcuts = [
    { name: 'Brand & Navigation', desc: 'Logo subtitle, navbar links, footer copy & socials', path: '/editors/brand', icon: Globe },
    { name: 'Hero & Strip', desc: 'Main headline, CTAs, hero photo & marquee cards', path: '/editors/hero', icon: Type },
    { name: 'About & Culture', desc: 'Story photo, mission, vision, values & 4 discipline cards', path: '/editors/about', icon: Users },
    { name: 'Solutions & Services', desc: 'Primary service cards & business-need tiles', path: '/editors/solutions', icon: Briefcase },
    { name: 'Why Choose Us', desc: 'Section heading & 4 differentiator pillars', path: '/editors/why-choose-us', icon: ShieldCheck },
    { name: '5-Stage Process', desc: 'Interactive 3D roadmap heading & all 5 stage labels', path: '/editors/process', icon: GitBranch },
    { name: 'Industries', desc: 'Add/edit/remove industry sector cards & photos', path: '/editors/industries', icon: Building2 },
    { name: 'Innovation & AI', desc: 'Emerging tech grid & responsible engineering pillars', path: '/editors/innovation', icon: Cpu },
    { name: 'Contact & Portal', desc: 'Home CTA section + full /contact page cards', path: '/editors/contact', icon: PhoneCall },
    { name: 'Careers & Roles', desc: 'Manage open job listings & application prompt', path: '/editors/careers', icon: Sparkles },
  ];

  return (
    <div className="space-y-7">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1F1B2E] via-[#2A2342] to-[#4C1D95] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-[#7C3AED]/30 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full text-[#FACC15] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cognirex Solutions Control Center</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name || 'Admin'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1.5 max-w-2xl">
              Edit website copy, swap or upload photos, add or remove section cards with instant live preview, and respond to client enquiries on the exact same domain.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link
              to="/editors/hero"
              className="px-4 py-2.5 rounded-xl bg-[#FACC15] text-[#1F1B2E] text-xs font-extrabold hover:bg-[#fde047] transition-colors shadow-sm"
            >
              Open Live Editor
            </Link>
            <Link
              to="/images"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors border border-white/20"
            >
              Manage Photos
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.to}
              className="bg-white border border-[#E5E1ED] hover:border-[#7C3AED]/40 rounded-2xl p-5 shadow-xs transition-all hover:-translate-y-0.5 flex items-center justify-between cms-card"
            >
              <div>
                <p className="text-xs font-semibold text-[#6F6A7C] cms-subtext">{card.label}</p>
                <p className="text-2xl font-extrabold text-[#1F1B2E] mt-1 cms-heading">
                  {loading ? '—' : card.value}
                </p>
                <p className="text-[11px] text-[#6F6A7C] mt-1">{card.sub}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.accent}`}>
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Split: Quick Section Editors + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-[#E5E1ED] rounded-2xl p-5 sm:p-6 shadow-xs cms-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-[#1F1B2E] cms-heading">
                Website Content Editors
              </h2>
              <p className="text-xs text-[#6F6A7C] cms-subtext">
                Select any Cognirex section below to modify text, add/delete items, or upload photos with real-time preview.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sectionShortcuts.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="p-3.5 rounded-xl bg-[#F8F7FC] hover:bg-[#EEE8FA]/70 border border-[#E5E1ED] hover:border-[#7C3AED]/40 transition-all flex items-center justify-between gap-3 group cms-muted-box"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#E5E1ED] flex items-center justify-center text-[#7C3AED] shrink-0 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1F1B2E] truncate cms-heading">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#6F6A7C] truncate cms-subtext">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#7C3AED] shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Audit Trail */}
        <div className="lg:col-span-4 bg-white border border-[#E5E1ED] rounded-2xl p-5 sm:p-6 shadow-xs cms-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-[#1F1B2E] cms-heading">
              Recent Activity
            </h2>
            <Clock className="w-4 h-4 text-[#7C3AED]" />
          </div>

          {activities.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center py-8 text-xs text-[#6F6A7C]">
              No edits or logins logged yet. Your publish history will appear here.
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
              {activities.map((act, idx) => (
                <div
                  key={act._id || idx}
                  className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-xs cms-muted-box"
                >
                  <p className="font-semibold text-[#1F1B2E] leading-snug cms-heading">
                    {act.action}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#6F6A7C] mt-1.5">
                    <span className="truncate max-w-[160px]">{act.actorEmail || 'System'}</span>
                    <span>{new Date(act.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
