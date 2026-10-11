import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types/portfolio';
import { ExternalLink, Github, ArrowRight, Layers, Sparkles, Terminal } from 'lucide-react';

export const ProjectsGallery: React.FC = () => {
  const { portfolio, openCaseStudy } = usePortfolio();
  const { projects } = portfolio;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Full Stack', 'AI & Agents', 'Cloud & Systems', 'Open Source'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="py-20 border-b border-neutral-200 dark:border-neutral-800/60 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-2">
              Selected Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Production Case Studies & Systems
            </h2>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
            Click any project to inspect deep architectural blueprints, performance tradeoffs, and measurable throughput metrics.
          </p>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-900/80 rounded-xl border border-neutral-300 dark:border-neutral-800 w-fit mb-10 overflow-x-auto max-w-full">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-neutral-950 shadow-sm dark:bg-neutral-100 dark:text-neutral-950'
                  : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Bento Grid of Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => {
            const isWide = idx === 0 && filteredProjects.length > 2;

            return (
              <div
                key={project.id}
                className={`${
                  isWide ? 'md:col-span-2' : 'col-span-1'
                } rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/40 overflow-hidden flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs group`}
              >
                {/* Visual Cover / Architecture Blueprint Banner */}
                <div
                  onClick={() => openCaseStudy(project)}
                  className={`h-48 sm:h-56 ${
                    isWide ? 'md:h-64' : ''
                  } relative bg-neutral-100 dark:bg-neutral-950 p-6 flex flex-col justify-between border-b border-neutral-200 dark:border-neutral-800/80 cursor-pointer overflow-hidden`}
                >
                  {/* Subtle Background Geometric Grid / Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.coverGradient || 'from-blue-600/20 via-indigo-600/10 to-transparent'} opacity-80 group-hover:opacity-100 transition-opacity`} />
                  
                  {/* Grid Lines Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

                  {/* Top Row: Category & Status */}
                  <div className="relative z-10 flex items-center justify-between text-xs font-mono text-neutral-600 dark:text-neutral-400">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                        Featured System
                      </span>
                    )}
                  </div>

                  {/* Mid Blueprint Visual Abstract */}
                  <div className="relative z-10 my-auto">
                    <div className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1 mt-1">
                      {project.subtitle}
                    </p>
                  </div>

                  {/* Bottom Blueprint Hint */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="font-mono text-[11px] text-neutral-500">
                      {project.caseStudy.metrics[0]?.label}: {project.caseStudy.metrics[0]?.value}
                    </span>
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform font-medium">
                      <span>Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Project Description */}
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-5">
                      {project.description}
                    </p>

                    {/* Tech Stack Tags (Zero-Pill Discipline: Clean Unboxed Text with Separators) */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-mono">
                      {project.tags.map((tag, tIdx) => (
                        <React.Fragment key={tag}>
                          <span className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors">{tag}</span>
                          {tIdx < project.tags.length - 1 && (
                            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-600">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions: Live Preview, GitHub Repo, and Case Study Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800/60">
                    <div className="flex items-center gap-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                        >
                          <span>Live Preview</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1.5 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => openCaseStudy(project)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                    >
                      Inspect Blueprint
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
