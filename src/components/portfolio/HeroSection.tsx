import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  ArrowDown, 
  FileText, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  CheckCircle2, 
  Layers, 
  Terminal, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { portfolio, openResume } = usePortfolio();
  const { profile } = portfolio;

  const scrollToContact = () => {
    const elem = document.getElementById('contact');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    const elem = document.getElementById('projects');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-neutral-800/60 dark:border-neutral-800/60 light:border-neutral-200">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Split Screen 2-Column Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Kicker & Availability Status (Clean Unboxed Text with Separators) */}
            <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mb-5">
              <span className="text-blue-400 font-semibold uppercase tracking-wider">{profile.title}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>{profile.location}</span>
              {profile.availableForWork && (
                <>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 inline" /> Available for Hire
                  </span>
                </>
              )}
            </div>

            {/* Display Headline with balanced wrapping */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-100 dark:text-neutral-100 light:text-neutral-900 leading-[1.12] mb-6 max-w-2xl text-balance">
              {profile.headline}
            </h1>

            {/* Lead Copy */}
            <p className="text-base sm:text-lg text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed max-w-xl mb-8">
              {profile.bio}
            </p>

            {/* Action Row & CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button
                onClick={openResume}
                className="px-5 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-100 light:bg-neutral-900 text-neutral-900 dark:text-neutral-900 light:text-neutral-100 font-semibold text-sm hover:bg-white dark:hover:bg-white light:hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>View & Download Resume</span>
              </button>

              <button
                onClick={scrollToProjects}
                className="px-5 py-2.5 rounded-lg border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 text-neutral-200 dark:text-neutral-200 light:text-neutral-800 font-medium text-sm hover:bg-neutral-800/40 dark:hover:bg-neutral-800/40 light:hover:bg-neutral-100 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Featured Works</span>
                <ArrowDown className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {/* Social Links (Clean Affordances) */}
            <div className="flex items-center gap-5 text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
              <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">Connect:</span>
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub Profile"
                  className="hover:text-neutral-100 dark:hover:text-neutral-100 light:hover:text-neutral-900 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn Profile"
                  className="hover:text-neutral-100 dark:hover:text-neutral-100 light:hover:text-neutral-900 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter / X Profile"
                  className="hover:text-neutral-100 dark:hover:text-neutral-100 light:hover:text-neutral-900 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.email && (
                <a
                  href={profile.socialLinks.email}
                  aria-label="Direct Email"
                  className="hover:text-neutral-100 dark:hover:text-neutral-100 light:hover:text-neutral-900 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Architectural Visual Anchor & Developer Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-2xl border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-neutral-50 p-6 backdrop-blur-sm shadow-xl relative overflow-hidden group">
              
              {/* Subtle architectural ambient highlight */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Card Header: Avatar & Core Identifiers */}
              <div className="flex items-center gap-4 mb-6 relative z-10">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-neutral-700 dark:border-neutral-700 light:border-neutral-300 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xl font-bold shadow-md tracking-wider">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                    {profile.name}
                  </h3>
                  <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
                    {profile.title.split('&')[0]}
                  </p>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    {profile.email}
                  </p>
                </div>
              </div>

              {/* Interactive Code/Architecture Console Window */}
              <div className="rounded-xl bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800/80 dark:border-neutral-800/80 light:border-neutral-200 p-4 font-mono text-xs text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-5 relative z-10">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 dark:border-neutral-800 light:border-neutral-200 text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    <span>system.spec.ts</span>
                  </span>
                  <span className="text-[11px] text-neutral-500">Node v22 / TS 5.7</span>
                </div>
                <div className="space-y-1.5 leading-relaxed">
                  <div className="text-neutral-500">// Core Engineering Invariants</div>
                  <div>
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-blue-300">stack</span> = {'{'}
                  </div>
                  <div className="pl-4">
                    runtime: <span className="text-emerald-400">&apos;React 19 + TypeScript&apos;</span>,
                  </div>
                  <div className="pl-4">
                    systems: <span className="text-emerald-400">&apos;Distributed Microservices&apos;</span>,
                  </div>
                  <div className="pl-4">
                    latency: <span className="text-amber-400">&apos;p95 &lt; 50ms&apos;</span>,
                  </div>
                  <div className="pl-4">
                    reliability: <span className="text-cyan-400">0.9999</span>
                  </div>
                  <div>{'};'}</div>
                </div>
              </div>

              {/* Status footer inside card */}
              <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800/60 dark:border-neutral-800/60 light:border-neutral-200">
                <span>{profile.statusMessage}</span>
                <button
                  onClick={scrollToContact}
                  className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Inquire</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Full-Width 4-Column KPI Strip (Positioned directly below the split, fulfilling design constitution) */}
        <div className="mt-16 pt-10 border-t border-neutral-800/80 dark:border-neutral-800/80 light:border-neutral-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {profile.metrics.map((metric, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-extrabold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 font-mono tracking-tight tabular-nums">
                  {metric.value}
                </span>
                <span className="text-sm font-semibold text-neutral-300 dark:text-neutral-300 light:text-neutral-800 mt-1">
                  {metric.label}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-500 light:text-neutral-600 mt-0.5">
                  {metric.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
