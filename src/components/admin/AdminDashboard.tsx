import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { RealtimeVisitorMetricCard } from './RealtimeVisitorMetricCard';
import { 
  Users, 
  Layers, 
  MessageSquare, 
  Cpu, 
  TrendingUp, 
  FileText, 
  Eye, 
  ArrowUpRight, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Key
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    portfolio, 
    messages, 
    analytics, 
    setAdminView, 
    resetPortfolioToDefault, 
    togglePreviewMode, 
    isPreviewMode 
  } = usePortfolio();

  const unreadMessagesCount = messages.filter(m => !m.read).length;
  const totalProjectsCount = portfolio.projects.length;
  const totalSkillsCount = portfolio.skills.length;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-1">
            CMS Control Center
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Portfolio Performance & Content Hub
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your developer brand, showcase case studies, and track client inquiries in real time.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={togglePreviewMode}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-2 cursor-pointer ${
              isPreviewMode
                ? 'bg-amber-500 text-neutral-950 border-amber-400'
                : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreviewMode ? 'Preview Active' : 'Test Live Preview'}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all portfolio content and messages to default showcase state?')) {
                resetPortfolioToDefault();
              }
            }}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Real-time Visitor Telemetry Card */}
        <RealtimeVisitorMetricCard />

        {/* Metric 2: Shipped Projects */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-2">
            <span>Active Projects</span>
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 dark:text-neutral-100 tracking-tight tabular-nums">
            {totalProjectsCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            {portfolio.projects.filter(p => p.featured).length} featured case studies
          </div>
        </div>

        {/* Metric 3: Inbound Inquiries */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-2">
            <span>Client Messages</span>
            <MessageSquare className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 dark:text-neutral-100 tracking-tight tabular-nums">
            {messages.length}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            {unreadMessagesCount} unread inquiry{unreadMessagesCount !== 1 ? 'ies' : ''}
          </div>
        </div>

        {/* Metric 4: Resume Downloads */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-2">
            <span>Resume Views</span>
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 dark:text-neutral-100 tracking-tight tabular-nums">
            {analytics.resumeDownloads}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            PDF & JSON exports
          </div>
        </div>

      </div>

      {/* Middle Split: Quick Action Tiles & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Quick Module Shortcuts */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
            Management Modules
          </div>

          <div
            onClick={() => setAdminView('projects')}
            className="p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/70 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-100 group-hover:text-blue-400 transition-colors">
                  Manage Projects & Case Studies
                </div>
                <div className="text-xs text-neutral-500">
                  {totalProjectsCount} items listed · Reorder, edit, tags
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-blue-400 transition-colors" />
          </div>

          <div
            onClick={() => setAdminView('profile')}
            className="p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/70 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-100 group-hover:text-emerald-400 transition-colors">
                  Edit Profile & Bio
                </div>
                <div className="text-xs text-neutral-500">
                  Headline, avatar URL, availability status, socials
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
          </div>

          <div
            onClick={() => setAdminView('skills')}
            className="p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/70 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-100 group-hover:text-purple-400 transition-colors">
                  Skills & Technical Matrix
                </div>
                <div className="text-xs text-neutral-500">
                  {totalSkillsCount} skills · Proficiency sliders & categories
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 transition-colors" />
          </div>

          <div
            onClick={() => setAdminView('messages')}
            className="p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/70 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">
                  Inbound Client Inquiries
                </div>
                <div className="text-xs text-neutral-500">
                  {messages.length} messages received · {unreadMessagesCount} unread
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors" />
          </div>

          <div
            onClick={() => setAdminView('security')}
            className="p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/70 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-100 group-hover:text-rose-400 transition-colors">
                  Admin Gmail & Password Settings
                </div>
                <div className="text-xs text-neutral-500">
                  Update login email, master password & credentials
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-rose-400 transition-colors" />
          </div>

        </div>

        {/* Right: Recent Inbound Inquiries Preview */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
              Recent Inbound Messages
            </span>
            <button
              onClick={() => setAdminView('messages')}
              className="text-xs font-semibold text-blue-400 hover:underline cursor-pointer"
            >
              Open Full Inbox
            </button>
          </div>

          <div className="space-y-3">
            {messages.slice(0, 3).map(msg => (
              <div
                key={msg.id}
                onClick={() => setAdminView('messages')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  !msg.read
                    ? 'border-blue-900/50 bg-blue-950/10 hover:bg-blue-950/20'
                    : 'border-neutral-800 bg-neutral-900/30 hover:bg-neutral-900/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-200">
                      {msg.name}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      ({msg.email})
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs font-semibold text-blue-300 mb-1">
                  {msg.subject}
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {msg.message}
                </p>
                {msg.budget && (
                  <div className="text-[11px] text-neutral-500 mt-2 font-mono">
                    Scope / Budget: <span className="text-neutral-300">{msg.budget}</span>
                  </div>
                )}
              </div>
            ))}

            {messages.length === 0 && (
              <div className="p-8 rounded-xl border border-neutral-800 text-center text-xs text-neutral-500">
                No inquiries received yet. Submit a test message through the public contact form!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
