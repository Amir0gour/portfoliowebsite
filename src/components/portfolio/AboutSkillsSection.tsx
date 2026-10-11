import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Cpu, Server, Layout, Terminal, Code2, Check, Sparkles } from 'lucide-react';

export const AboutSkillsSection: React.FC = () => {
  const { portfolio } = usePortfolio();
  const { skills } = portfolio;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Backend & Cloud', 'Systems & Architecture', 'DevOps & Tools'];

  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  return (
    <section id="skills" className="py-20 border-b border-neutral-200 dark:border-neutral-800/60 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-2">
              Technical Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Skills & Engineering Depth
            </h2>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
            Architectural mastery honed across high-traffic platforms, distributed pipelines, and responsive frontend systems.
          </p>
        </div>

        {/* Category Segmented Filter Tabs (Interactive Functional Buttons) */}
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

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => (
            <div
              key={skill.id}
              className="p-5 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/30 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                {/* Header: Skill Name & Category (Clean unboxed metadata) */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {skill.name}
                  </h3>
                  <span className="text-xs font-mono tabular-nums font-semibold text-blue-600 dark:text-blue-400">
                    {skill.proficiency}%
                  </span>
                </div>

                {/* Subtitle / Metadata */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
                  <span>{skill.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{skill.experienceYears} yrs experience</span>
                </div>

                {/* Visual Proficiency Bar */}
                <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>

              {/* Highlight Note */}
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-200 dark:border-neutral-800/50 pt-3">
                {skill.highlight}
              </p>
            </div>
          ))}
        </div>

        {/* Philosophy & Architecture Highlights */}
        <div id="about" className="mt-16 p-8 rounded-2xl border border-neutral-200 bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/20">
          <div className="max-w-3xl">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Engineering Philosophy & Mindset
            </h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              I believe the most reliable software is born from clear abstractions, low mental overhead, and rigorous automated validation. Whether profiling a memory leak in a high-frequency websocket loop or refining a micro-interaction curve in React, I treat systems architecture and end-user aesthetics as equal partners in software quality.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-xs">
              <div>
                <span className="font-bold text-neutral-900 dark:text-neutral-200 block mb-1">
                  Predictable Performance
                </span>
                <span className="text-neutral-600 dark:text-neutral-400">
                  Target sub-100ms response windows and zero main-thread layout thrashing.
                </span>
              </div>
              <div>
                <span className="font-bold text-neutral-900 dark:text-neutral-200 block mb-1">
                  Type Safety & Contracts
                </span>
                <span className="text-neutral-600 dark:text-neutral-400">
                  End-to-end typed schemas from database rows to client components.
                </span>
              </div>
              <div>
                <span className="font-bold text-neutral-900 dark:text-neutral-200 block mb-1">
                  Accessibility by Default
                </span>
                <span className="text-neutral-600 dark:text-neutral-400">
                  WCAG AA compliance, semantic markup, and keyboard-first navigation.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
