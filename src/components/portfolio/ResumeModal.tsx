import React, { useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { X, Printer, Download, Copy, Check, FileText } from 'lucide-react';

export const ResumeModal: React.FC = () => {
  const { isResumeOpen, closeResume, portfolio, showNotification } = usePortfolio();
  const { profile, skills, timeline } = portfolio;
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeResume();
    };
    if (isResumeOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isResumeOpen, closeResume]);

  if (!isResumeOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textContent = `
${profile.name}
${profile.title} | ${profile.location}
Email: ${profile.email} | GitHub: ${profile.socialLinks.github} | LinkedIn: ${profile.socialLinks.linkedin}

EXECUTIVE SUMMARY
${profile.bio}

CORE SKILLS
${skills.map(s => `${s.name} (${s.experienceYears} yrs)`).join(' · ')}

PROFESSIONAL EXPERIENCE
${timeline
  .filter(t => t.type === 'work')
  .map(
    t => `${t.title} — ${t.organization} (${t.period})
${t.description}
Impact:
${t.highlights.map(h => `- ${h}`).join('\n')}`
  )
  .join('\n\n')}

EDUCATION & HONORS
${timeline
  .filter(t => t.type !== 'work')
  .map(t => `${t.title} — ${t.organization} (${t.period})\n${t.description}`)
  .join('\n\n')}
    `.trim();

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    showNotification('Plain text resume copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify({ profile, skills, timeline }, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.replace(/\s+/g, '_')}_Resume.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Resume specification JSON exported', 'success');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={closeResume}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] bg-white text-neutral-900 border border-neutral-200 rounded-2xl shadow-2xl overflow-y-auto flex flex-col my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls Bar (Do not print) */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-neutral-100 border-b border-neutral-200 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Executive Resume Document</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-medium hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Text</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-medium hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer hidden sm:flex"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={closeResume}
              aria-label="Close Resume"
              className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Resume Body */}
        <div className="p-8 sm:p-12 space-y-8 bg-white text-neutral-900 font-sans print:p-0">
          
          {/* Header */}
          <div className="border-b border-neutral-200 pb-6">
            <h1 id="resume-modal-title" className="text-3xl font-extrabold tracking-tight text-neutral-950">
              {profile.name}
            </h1>
            <div className="text-base font-bold text-blue-700 mt-1">
              {profile.title}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 mt-2 font-mono">
              <span>{profile.location}</span>
              <span>·</span>
              <span>{profile.email}</span>
              <span>·</span>
              <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="text-neutral-900 hover:underline">
                GitHub
              </a>
              <span>·</span>
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-neutral-900 hover:underline">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-950 mb-2 border-b border-neutral-100 pb-1">
              Executive Summary
            </h2>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Core Technical Capabilities */}
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-950 mb-3 border-b border-neutral-100 pb-1">
              Core Technical Competencies
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {skills.map(s => (
                <div key={s.id} className="p-2 rounded border border-neutral-100 bg-neutral-50/50">
                  <div className="font-bold text-neutral-900">{s.name}</div>
                  <div className="text-[11px] text-neutral-500 font-mono">{s.experienceYears} yrs · {s.proficiency}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Experience */}
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-950 mb-4 border-b border-neutral-100 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {timeline.filter(t => t.type === 'work').map(t => (
                <div key={t.id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <div className="font-bold text-sm text-neutral-950">
                      {t.title} <span className="font-normal text-neutral-600">· {t.organization}</span>
                    </div>
                    <div className="text-xs font-mono text-neutral-500">
                      {t.period} · {t.location}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-700 mb-2">
                    {t.description}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600 pl-1">
                    {t.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Achievements */}
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-950 mb-4 border-b border-neutral-100 pb-1">
              Education & Honors
            </h2>
            <div className="space-y-4">
              {timeline.filter(t => t.type !== 'work').map(t => (
                <div key={t.id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <div className="font-bold text-sm text-neutral-950">
                      {t.title} <span className="font-normal text-neutral-600">· {t.organization}</span>
                    </div>
                    <div className="text-xs font-mono text-neutral-500">
                      {t.period}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-700">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
