import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { PortfolioData, Project, ContactMessage, AnalyticsStats } from '../types/portfolio';
import { initialPortfolioData, initialAnalytics } from '../data/initialPortfolio';
import { apiService } from '../services/api';

interface PortfolioContextType {
  portfolio: PortfolioData;
  publishedPortfolio: PortfolioData;
  isLoading: boolean;
  isAdminOpen: boolean;
  adminView: 'dashboard' | 'profile' | 'projects' | 'skills' | 'timeline' | 'testimonials' | 'messages' | 'security';
  setAdminView: (view: 'dashboard' | 'profile' | 'projects' | 'skills' | 'timeline' | 'testimonials' | 'messages' | 'security') => void;
  isAuthenticated: boolean;
  adminEmail: string | null;
  selectedProject: Project | null;
  isResumeOpen: boolean;
  isPreviewMode: boolean; // if true, public view renders current draft portfolio
  messages: ContactMessage[];
  analytics: AnalyticsStats;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (msg: string, type?: 'success' | 'error' | 'info') => void;
  // Actions
  updatePortfolioData: (updater: (prev: PortfolioData) => PortfolioData) => void;
  savePortfolio: (dataToSave?: PortfolioData) => Promise<boolean>;
  resetPortfolioToDefault: () => Promise<void>;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  updateCredentials: (payload: { newEmail?: string; currentPassword?: string; newPassword?: string }) => Promise<{ success: boolean; error?: string }>;
  openCaseStudy: (project: Project) => void;
  closeCaseStudy: () => void;
  openResume: () => void;
  closeResume: () => void;
  toggleAdminPortal: (open?: boolean) => void;
  togglePreviewMode: () => void;
  refreshMessages: () => Promise<void>;
  updateMessageStatus: (id: string, updates: Partial<Pick<ContactMessage, 'read' | 'starred' | 'archived' | 'replied'>>) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publishedPortfolio, setPublishedPortfolio] = useState<PortfolioData>(initialPortfolioData);
  const [draftPortfolio, setDraftPortfolio] = useState<PortfolioData>(initialPortfolioData);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminView, setAdminView] = useState<'dashboard' | 'profile' | 'projects' | 'skills' | 'timeline' | 'testimonials' | 'messages' | 'security'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!apiService.getToken());
  const [adminEmail, setAdminEmail] = useState<string | null>(() => apiService.getAdminUser());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsStats>(initialAnalytics);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        const [portfolioData, analyticsData] = await Promise.all([
          apiService.getPortfolio(),
          apiService.getAnalytics()
        ]);
        if (isMounted) {
          setPublishedPortfolio(portfolioData);
          setDraftPortfolio(portfolioData);
          setAnalytics(analyticsData);
          apiService.trackVisit();
        }
      } catch (err) {
        console.error('Data load error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for /admin or #admin in URL and global keyboard shortcut (Ctrl+Shift+A / Cmd+Shift+A)
  useEffect(() => {
    const handleUrlRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || hash.startsWith('#admin/') || path === '/admin' || path.startsWith('/admin/')) {
        setIsAdminOpen(true);
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);

    const handleKeyShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyShortcut);

    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('keydown', handleKeyShortcut);
    };
  }, []);

  // Fetch messages if authenticated
  const refreshMessages = useCallback(async () => {
    if (isAuthenticated) {
      const msgs = await apiService.getMessages();
      setMessages(msgs);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshMessages();
    }
  }, [isAuthenticated, refreshMessages]);

  // Update in-memory draft
  const updatePortfolioData = useCallback((updater: (prev: PortfolioData) => PortfolioData) => {
    setDraftPortfolio(prev => {
      const next = updater(prev);
      return next;
    });
  }, []);

  // Save / Publish portfolio changes
  const savePortfolio = async (dataToSave?: PortfolioData): Promise<boolean> => {
    const target = dataToSave || draftPortfolio;
    const res = await apiService.updatePortfolio(target);
    if (res.success && res.data) {
      setPublishedPortfolio(res.data);
      setDraftPortfolio(res.data);
      showNotification('Portfolio changes published successfully!', 'success');
      return true;
    } else {
      showNotification(res.error || 'Failed to save changes', 'error');
      return false;
    }
  };

  // Reset to default seed
  const resetPortfolioToDefault = async () => {
    const resetData = await apiService.resetToDefaults();
    setPublishedPortfolio(resetData);
    setDraftPortfolio(resetData);
    showNotification('Portfolio reset to default demo data', 'info');
  };

  const loginAdmin = async (email: string, pass: string) => {
    const res = await apiService.login(email, pass);
    if (res.success) {
      setIsAuthenticated(true);
      setAdminEmail(email);
      showNotification('Welcome to Admin CMS Portal', 'success');
      await refreshMessages();
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const logoutAdmin = () => {
    apiService.clearAuth();
    setIsAuthenticated(false);
    setAdminEmail(null);
    setIsAdminOpen(false);
    setIsPreviewMode(false);
    // Remove #admin from hash if present
    if (window.location.hash.toLowerCase().includes('admin')) {
      history.replaceState(null, '', window.location.pathname);
    }
    showNotification('Logged out of Admin Portal', 'info');
  };

  const updateCredentials = async (payload: { newEmail?: string; currentPassword?: string; newPassword?: string }) => {
    const res = await apiService.updateCredentials(payload);
    if (res.success) {
      if (res.adminEmail) {
        setAdminEmail(res.adminEmail);
      }
      showNotification(res.message || 'Admin credentials updated successfully!', 'success');
      return { success: true };
    } else {
      showNotification(res.error || 'Failed to update credentials', 'error');
      return { success: false, error: res.error };
    }
  };

  const openCaseStudy = (project: Project) => {
    setSelectedProject(project);
  };

  const closeCaseStudy = () => {
    setSelectedProject(null);
  };

  const openResume = () => {
    setIsResumeOpen(true);
    apiService.trackResumeDownload();
  };

  const closeResume = () => {
    setIsResumeOpen(false);
  };

  const toggleAdminPortal = (open?: boolean) => {
    setIsAdminOpen(prev => (typeof open === 'boolean' ? open : !prev));
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(prev => {
      const next = !prev;
      showNotification(next ? 'Live Preview Active: showing unsaved draft changes' : 'Live Preview Disabled: showing published site', 'info');
      return next;
    });
  };

  const updateMessageStatus = async (
    id: string,
    updates: Partial<Pick<ContactMessage, 'read' | 'starred' | 'archived' | 'replied'>>
  ) => {
    const ok = await apiService.updateMessage(id, updates);
    if (ok) {
      setMessages(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
    }
  };

  const deleteMessage = async (id: string) => {
    const ok = await apiService.deleteMessage(id);
    if (ok) {
      setMessages(prev => prev.filter(m => m.id !== id));
      showNotification('Message deleted', 'info');
    }
  };

  // Determine which data to render on the public site
  const activePortfolio = isPreviewMode ? draftPortfolio : publishedPortfolio;

  return (
    <PortfolioContext.Provider
      value={{
        portfolio: activePortfolio,
        publishedPortfolio,
        isLoading,
        isAdminOpen,
        adminView,
        setAdminView,
        isAuthenticated,
        adminEmail,
        selectedProject,
        isResumeOpen,
        isPreviewMode,
        messages,
        analytics,
        notification,
        showNotification,
        updatePortfolioData,
        savePortfolio,
        resetPortfolioToDefault,
        loginAdmin,
        logoutAdmin,
        updateCredentials,
        openCaseStudy,
        closeCaseStudy,
        openResume,
        closeResume,
        toggleAdminPortal,
        togglePreviewMode,
        refreshMessages,
        updateMessageStatus,
        deleteMessage
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
};
