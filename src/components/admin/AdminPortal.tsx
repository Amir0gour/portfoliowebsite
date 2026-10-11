import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminProfileEditor } from './AdminProfileEditor';
import { AdminProjectsManager } from './AdminProjectsManager';
import { AdminSkillsManager } from './AdminSkillsManager';
import { AdminTimelineManager } from './AdminTimelineManager';
import { AdminTestimonialsManager } from './AdminTestimonialsManager';
import { AdminMessagesInbox } from './AdminMessagesInbox';
import { AdminSecuritySettings } from './AdminSecuritySettings';
import { 
  Shield, 
  LayoutDashboard, 
  User, 
  Layers, 
  Cpu, 
  Calendar, 
  Quote, 
  Mail, 
  Eye, 
  LogOut, 
  X,
  ExternalLink,
  ChevronRight,
  Key
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    isAdminOpen, 
    toggleAdminPortal, 
    isAuthenticated, 
    adminEmail, 
    logoutAdmin,
    adminView, 
    setAdminView,
    isPreviewMode,
    togglePreviewMode,
    messages
  } = usePortfolio();

  if (!isAdminOpen) return null;

  const unreadCount = messages.filter(m => !m.read && !m.archived).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto"
    >
      <div className="w-full max-w-6xl min-h-[85vh] max-h-[95vh] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        
        {/* Top Header of Admin Modal */}
        <header className="h-16 border-b border-neutral-800 px-6 flex items-center justify-between gap-4 bg-neutral-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight flex items-center gap-2">
                <span>Devfolio CMS</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                  v2.4
                </span>
              </div>
              {isAuthenticated && (
                <div className="text-[11px] text-neutral-500 font-mono">
                  Logged in as <span className="text-neutral-300">{adminEmail || 'admin@portfolio.dev'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                {/* Live Preview Toggle */}
                <button
                  onClick={togglePreviewMode}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isPreviewMode
                      ? 'bg-amber-500 text-neutral-950'
                      : 'border border-neutral-800 hover:bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isPreviewMode ? 'Previewing Draft' : 'Preview Site'}</span>
                </button>

                {/* Logout */}
                <button
                  onClick={logoutAdmin}
                  className="p-2 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Close Admin Portal */}
            <button
              onClick={() => toggleAdminPortal(false)}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Body */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <AdminLogin />
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-800 p-4 bg-neutral-950/60 flex flex-row md:flex-col gap-1.5 shrink-0 overflow-x-auto">
              
              <button
                onClick={() => setAdminView('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  adminView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 hidden md:block" />
              </button>

              <button
                onClick={() => setAdminView('projects')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  adminView === 'projects'
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4" />
                  <span>Projects & Blueprints</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 hidden md:block" />
              </button>

              <button
                onClick={() => setAdminView('profile')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  adminView === 'profile'
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>Profile & Bio</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 hidden md:block" />
              </button>

              <button
                onClick={() => setAdminView('skills')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  adminView === 'skills'
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4" />
                  <span>Skills Matrix</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 hidden md:block" />
              </button>

              <button
                onClick={() => setAdminView('timeline')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  adminView === 'timeline'
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4" />
                  <span>Experience & Timeline</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 hidden md:block" />
              </button>

              <button
                onClick={() => setAdminView('testimonials')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  adminView === 'testimonials'
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Quote className="w-4 h-4" />
                  <span>Endorsements</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 hidden md:block" />
              </button>

              <button
                onClick={() => setAdminView('messages')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  adminView === 'messages'
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4" />
                  <span>Messages Inbox</span>
                </div>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px]">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminView('security')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  adminView === 'security'
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4" />
                  <span>Security & Credentials</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 hidden md:block" />
              </button>

              <div className="hidden md:block mt-auto pt-4 border-t border-neutral-800/80">
                <button
                  onClick={() => toggleAdminPortal(false)}
                  className="w-full py-2 px-3 rounded-lg border border-neutral-800 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Public Site</span>
                </button>
              </div>

            </aside>

            {/* Main Content Workspace */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
              {adminView === 'dashboard' && <AdminDashboard />}
              {adminView === 'projects' && <AdminProjectsManager />}
              {adminView === 'profile' && <AdminProfileEditor />}
              {adminView === 'skills' && <AdminSkillsManager />}
              {adminView === 'timeline' && <AdminTimelineManager />}
              {adminView === 'testimonials' && <AdminTestimonialsManager />}
              {adminView === 'messages' && <AdminMessagesInbox />}
              {adminView === 'security' && <AdminSecuritySettings />}
            </main>

          </div>
        )}

      </div>
    </div>
  );
};
