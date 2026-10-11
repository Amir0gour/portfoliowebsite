import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Shield, Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { portfolio, toggleAdminPortal, isAuthenticated, isPreviewMode } = usePortfolio();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Banner if in Preview Mode */}
      {isPreviewMode && (
        <div className="bg-amber-500 text-neutral-950 px-4 py-1.5 text-xs font-semibold text-center flex items-center justify-center gap-3">
          <span>Live Preview Mode Active (Unpublished draft changes visible)</span>
          <button
            onClick={() => toggleAdminPortal(true)}
            className="underline hover:text-black font-bold whitespace-nowrap"
          >
            Open CMS & Publish
          </button>
        </div>
      )}

      {/* Top Bar Contract (Strict 3-Zone) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800/80 transition-colors">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single element wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap shrink-0 hover:text-blue-500 transition-colors"
          >
            {portfolio.profile.name}
          </a>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reviews
            </button>
          </nav>

          {/* Zone 3: 1 primary action area */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white rounded-lg border border-neutral-300/80 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all cursor-pointer shadow-2xs"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700 animate-in spin-in-180 duration-200" />
              )}
            </button>

            {/* Admin CMS Button - Hidden for regular visitors, only visible if admin is logged in */}
            {isAuthenticated && (
              <button
                onClick={() => toggleAdminPortal(true)}
                aria-label="Admin CMS Portal"
                title="Admin CMS (Active Session)"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">CMS</span>
              </button>
            )}

            {/* Primary Action CTA */}
            <button
              onClick={() => scrollToSection('contact')}
              className="hidden sm:flex px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm items-center gap-1.5"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md px-6 py-4 flex flex-col gap-3 text-sm">
            <button
              onClick={() => scrollToSection('about')}
              className="text-left py-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className="text-left py-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              Skills
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="text-left py-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="text-left py-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="text-left py-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              Reviews
            </button>

            {/* Mobile Theme Switcher Row */}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Appearance</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => scrollToSection('contact')}
              className="mt-2 w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-center transition-colors"
            >
              Get in Touch
            </button>
          </div>
        )}
      </header>
    </>
  );
};
