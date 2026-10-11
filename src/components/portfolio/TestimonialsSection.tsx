import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Quote, ChevronLeft, ChevronRight, LayoutGrid, SlidersHorizontal } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { portfolio } = usePortfolio();
  const { testimonials } = portfolio;
  const [layoutMode, setLayoutMode] = useState<'grid' | 'carousel'>('grid');
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 border-b border-neutral-200 dark:border-neutral-800/60 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-2">
              Engineering References
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Peer & Leadership Endorsements
            </h2>
          </div>

          {/* Grid vs Carousel Layout Toggle */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900/80 rounded-xl border border-neutral-300 dark:border-neutral-800">
            <button
              onClick={() => setLayoutMode('grid')}
              aria-label="Grid View"
              className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                layoutMode === 'grid'
                  ? 'bg-white text-neutral-950 shadow-sm dark:bg-neutral-100 dark:text-neutral-950'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('carousel')}
              aria-label="Carousel View"
              className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                layoutMode === 'carousel'
                  ? 'bg-white text-neutral-950 shadow-sm dark:bg-neutral-100 dark:text-neutral-950'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Presentation */}
        {layoutMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/30 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <Quote className="w-6 h-6 text-blue-500/30 mb-4" />
                  <p className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed italic mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center font-bold text-xs">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {t.name}
                    </h3>
                    <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                      {t.role} · {t.company}
                    </div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                      {t.relationship}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="p-8 sm:p-10 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/40 relative shadow-sm">
              <Quote className="w-8 h-8 text-blue-500/30 mb-6" />
              
              <p className="text-lg sm:text-xl text-neutral-900 dark:text-neutral-100 leading-relaxed italic mb-8">
                &ldquo;{testimonials[currentIndex].quote}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center font-bold text-sm">
                    {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      {testimonials[currentIndex].role} · {testimonials[currentIndex].company}
                    </div>
                    <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                      {testimonials[currentIndex].relationship}
                    </div>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    aria-label="Previous Testimonial"
                    className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-neutral-500 px-1">
                    {currentIndex + 1} / {testimonials.length}
                  </span>
                  <button
                    onClick={nextSlide}
                    aria-label="Next Testimonial"
                    className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
