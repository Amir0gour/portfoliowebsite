import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/portfolio/HeroSection';
import { AboutSkillsSection } from './components/portfolio/AboutSkillsSection';
import { ExperienceTimeline } from './components/portfolio/ExperienceTimeline';
import { ProjectsGallery } from './components/portfolio/ProjectsGallery';
import { TestimonialsSection } from './components/portfolio/TestimonialsSection';
import { ContactSection } from './components/portfolio/ContactSection';
import { ProjectModal } from './components/portfolio/ProjectModal';
import { ResumeModal } from './components/portfolio/ResumeModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { useRealtimeVisitors } from './hooks/useRealtimeVisitors';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const PortfolioApp: React.FC = () => {
  const { isLoading, notification } = usePortfolio();
  
  // Lightweight real-time visitor and page-view tracking hook
  useRealtimeVisitors(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-400">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-xs font-mono tracking-wider uppercase">Hydrating Portfolio Engine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-50 text-neutral-100 dark:text-neutral-100 light:text-neutral-900 transition-colors">
      
      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 ${
              notification.type === 'success'
                ? 'bg-emerald-950 border-emerald-700 text-emerald-200'
                : notification.type === 'error'
                ? 'bg-red-950 border-red-700 text-red-200'
                : 'bg-neutral-900 border-neutral-700 text-neutral-200'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <Navbar />
      
      <main>
        <HeroSection />
        <AboutSkillsSection />
        <ExperienceTimeline />
        <ProjectsGallery />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <Footer />

      {/* Interactive Modals */}
      <ProjectModal />
      <ResumeModal />
      <AdminPortal />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <PortfolioApp />
      </PortfolioProvider>
    </ThemeProvider>
  );
}
