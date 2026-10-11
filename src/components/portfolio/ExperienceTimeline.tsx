import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Briefcase, GraduationCap, Award, Calendar, MapPin, ChevronRight } from 'lucide-react';

export const ExperienceTimeline: React.FC = () => {
  const { portfolio } = usePortfolio();
  const { timeline } = portfolio;
  const [filter, setFilter] = useState<'all' | 'work' | 'education' | 'achievement'>('all');

  const filteredItems = filter === 'all'
    ? timeline
    : timeline.filter(item => item.type === filter);

  return (
    <section id="experience" className="py-20 border-b border-neutral-800/60 dark:border-neutral-800/60 light:border-neutral-200">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-2">
              Career Trajectory
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight">
              Experience & Milestones
            </h2>
          </div>
          
          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900/80 dark:bg-neutral-900/80 light:bg-neutral-100 rounded-xl border border-neutral-800 dark:border-neutral-800 light:border-neutral-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-neutral-100 dark:bg-neutral-100 light:bg-neutral-900 text-neutral-950 dark:text-neutral-950 light:text-neutral-50 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 dark:text-neutral-400 dark:hover:text-neutral-200 light:text-neutral-600'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilter('work')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filter === 'work'
                  ? 'bg-neutral-100 dark:bg-neutral-100 light:bg-neutral-900 text-neutral-950 dark:text-neutral-950 light:text-neutral-50 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 dark:text-neutral-400 dark:hover:text-neutral-200 light:text-neutral-600'
              }`}
            >
              Work
            </button>
            <button
              onClick={() => setFilter('education')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filter === 'education'
                  ? 'bg-neutral-100 dark:bg-neutral-100 light:bg-neutral-900 text-neutral-950 dark:text-neutral-950 light:text-neutral-50 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 dark:text-neutral-400 dark:hover:text-neutral-200 light:text-neutral-600'
              }`}
            >
              Education
            </button>
            <button
              onClick={() => setFilter('achievement')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filter === 'achievement'
                  ? 'bg-neutral-100 dark:bg-neutral-100 light:bg-neutral-900 text-neutral-950 dark:text-neutral-950 light:text-neutral-50 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 dark:text-neutral-400 dark:hover:text-neutral-200 light:text-neutral-600'
              }`}
            >
              Key Honors
            </button>
          </div>
        </div>

        {/* Timeline Stream */}
        <div className="relative border-l border-neutral-800 dark:border-neutral-800 light:border-neutral-300 ml-4 md:ml-6 space-y-10 pl-6 md:pl-10">
          {filteredItems.map(item => (
            <div key={item.id} className="relative group">
              
              {/* Timeline Indicator Node */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-neutral-950 dark:bg-neutral-950 light:bg-white border-2 border-blue-500 shadow-sm flex items-center justify-center" />

              {/* Timeline Card */}
              <div className="p-6 rounded-2xl border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 bg-neutral-900/30 dark:bg-neutral-900/30 light:bg-neutral-50/80 hover:border-neutral-700 dark:hover:border-neutral-700 transition-all">
                
                {/* Meta Row: Period, Location, Type */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mb-2">
                  <span className="text-blue-400 font-semibold flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 inline" /> {item.period}
                  </span>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 inline" /> {item.location}
                  </span>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span className="capitalize text-neutral-400">{item.type}</span>
                </div>

                {/* Title & Organization */}
                <h3 className="text-xl font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 mb-1">
                  {item.title}
                </h3>
                <div className="text-sm font-semibold text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-4">
                  {item.organization}
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Impact Highlights */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="border-t border-neutral-800/60 dark:border-neutral-800/60 light:border-neutral-200 pt-3 mt-3">
                    <div className="text-xs font-bold text-neutral-300 dark:text-neutral-300 light:text-neutral-800 mb-2">
                      Key Contributions & Impact:
                    </div>
                    <ul className="space-y-1.5">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 flex items-start gap-2 leading-relaxed">
                          <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
