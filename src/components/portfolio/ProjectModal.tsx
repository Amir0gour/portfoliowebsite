import React, { useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { X, ExternalLink, Github, CheckCircle2, AlertCircle, ArrowUpRight, Cpu, Layers } from 'lucide-react';

export const ProjectModal: React.FC = () => {
  const { selectedProject, closeCaseStudy } = usePortfolio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCaseStudy();
      }
    };
    if (selectedProject) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject, closeCaseStudy]);

  if (!selectedProject) return null;

  const { caseStudy } = selectedProject;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={closeCaseStudy}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-neutral-950 dark:bg-neutral-950 light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 rounded-2xl shadow-2xl overflow-y-auto flex flex-col my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-6 bg-neutral-950/95 dark:bg-neutral-950/95 light:bg-white/95 backdrop-blur-sm border-b border-neutral-800 dark:border-neutral-800 light:border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
              <span className="text-blue-400 font-semibold uppercase">{selectedProject.category}</span>
              <span aria-hidden="true">·</span>
              <span>{caseStudy.clientOrContext}</span>
              <span aria-hidden="true">·</span>
              <span>{caseStudy.timeline}</span>
            </div>
            <h2 id="case-study-title" className="text-2xl sm:text-3xl font-extrabold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight">
              {selectedProject.title}
            </h2>
          </div>

          <button
            onClick={closeCaseStudy}
            aria-label="Close Case Study"
            className="p-2 text-neutral-400 hover:text-neutral-100 dark:hover:text-neutral-100 light:hover:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-800 light:hover:bg-neutral-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Executive Summary */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Executive Summary
            </h3>
            <p className="text-base text-neutral-200 dark:text-neutral-200 light:text-neutral-800 leading-relaxed">
              {caseStudy.summary}
            </p>
          </div>

          {/* Key Metrics / Throughput Impact Strip */}
          {caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <div className="p-5 rounded-xl border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 bg-neutral-900/40 dark:bg-neutral-900/40 light:bg-neutral-50">
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">
                Measurable System Impact
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {caseStudy.metrics.map((m, idx) => (
                  <div key={idx}>
                    <div className="text-2xl font-black font-mono text-blue-400 tracking-tight tabular-nums">
                      {m.value}
                    </div>
                    <div className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Architectural Decisions */}
          <div>
            <h3 className="text-base font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Architectural Blueprint & Engineering Choices</span>
            </h3>
            <div className="space-y-2.5">
              {caseStudy.architecture.map((arch, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-neutral-800/80 dark:border-neutral-800/80 light:border-neutral-200 bg-neutral-900/20 dark:bg-neutral-900/20 light:bg-neutral-50/50 flex items-start gap-3 text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{arch}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Challenges Tackled */}
          <div>
            <h3 className="text-base font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Core Challenges & Invariants Tackled</span>
            </h3>
            <div className="space-y-2.5">
              {caseStudy.challenges.map((ch, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-neutral-800/80 dark:border-neutral-800/80 light:border-neutral-200 bg-neutral-900/20 dark:bg-neutral-900/20 light:bg-neutral-50/50 flex items-start gap-3 text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                  <span>{ch}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Learnings & Takeaways */}
          {caseStudy.keyLearnings && (
            <div className="p-5 rounded-xl border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 bg-neutral-900/30 dark:bg-neutral-900/30 light:bg-neutral-50 text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
              <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-1">
                Architectural Retrospective
              </div>
              <p className="leading-relaxed">
                {caseStudy.keyLearnings}
              </p>
            </div>
          )}

          {/* Tech Stack Unboxed Tags */}
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Technologies & Frameworks
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-neutral-400">
              {selectedProject.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  <span>{tag}</span>
                  {idx < selectedProject.tags.length - 1 && (
                    <span aria-hidden="true" className="text-neutral-600">/</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between p-6 bg-neutral-950 dark:bg-neutral-950 light:bg-white border-t border-neutral-800 dark:border-neutral-800 light:border-neutral-200">
          <div className="flex items-center gap-4">
            {selectedProject.liveUrl && (
              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <span>Open Live Deployment</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {selectedProject.githubUrl && (
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 text-neutral-200 dark:text-neutral-200 light:text-neutral-800 font-medium text-xs hover:bg-neutral-850 dark:hover:bg-neutral-850 light:hover:bg-neutral-100 transition-colors flex items-center gap-2"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
            )}
          </div>

          <button
            onClick={closeCaseStudy}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
