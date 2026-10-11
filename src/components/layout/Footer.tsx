import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowUp, Shield, Github, Linkedin, Twitter, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { portfolio, toggleAdminPortal, isAuthenticated } = usePortfolio();
  const { profile } = portfolio;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-neutral-800/60 dark:border-neutral-800/60 light:border-neutral-200 bg-neutral-950 dark:bg-neutral-950 light:bg-white text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left: Quiet Copyright & Unboxed Title */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="font-semibold text-neutral-200 dark:text-neutral-200 light:text-neutral-900">
            {profile.name}
          </span>
          <span aria-hidden="true" className="hidden sm:inline text-neutral-600">·</span>
          <span>
            <button
              onClick={() => toggleAdminPortal(true)}
              className="hover:text-neutral-200 cursor-default select-none focus:outline-none"
              title="Admin Portal Access (Ctrl+Shift+A)"
              aria-label="System Access"
            >
              ©
            </button>{' '}
            {new Date().getFullYear()} All rights reserved
          </span>
          <span aria-hidden="true" className="hidden sm:inline text-neutral-600">·</span>
          <span>Handcrafted with React 19 & TypeScript</span>
        </div>

        {/* Right: Actions & Socials */}
        <div className="flex items-center gap-5">
          {/* Social Icons */}
          <div className="flex items-center gap-4 text-neutral-400">
            {profile.socialLinks.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-white dark:hover:text-white light:hover:text-black">
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {profile.socialLinks.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white dark:hover:text-white light:hover:text-black">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
            {profile.socialLinks.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-white dark:hover:text-white light:hover:text-black">
                <Twitter className="w-3.5 h-3.5" />
              </a>
            )}
            {profile.socialLinks.email && (
              <a href={profile.socialLinks.email} aria-label="Email" className="hover:text-white dark:hover:text-white light:hover:text-black">
                <Mail className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Only shown if Admin is logged in */}
          {isAuthenticated && (
            <>
              <span aria-hidden="true" className="text-neutral-700">|</span>
              <button
                onClick={() => toggleAdminPortal(true)}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer"
                title="Active Admin Session"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin CMS</span>
              </button>
            </>
          )}

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="p-1.5 rounded-lg border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 text-neutral-400 hover:text-white dark:hover:text-white light:hover:text-black cursor-pointer transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
