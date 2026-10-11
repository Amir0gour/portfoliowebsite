import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Testimonial } from '../../types/portfolio';
import { Plus, Trash2, Edit2, X, Quote } from 'lucide-react';

export const AdminTestimonialsManager: React.FC = () => {
  const { portfolio, updatePortfolioData, savePortfolio, showNotification } = usePortfolio();
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(JSON.parse(JSON.stringify(portfolio.testimonials)));
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleStartAdd = () => {
    const newItem: Testimonial = {
      id: `test-${Date.now()}`,
      name: 'Michael Scott',
      role: 'CTO',
      company: 'Dunder Data Labs',
      avatar: '',
      quote: 'Alex single-handedly untangled our database bottlenecks and delivered our product 3 weeks ahead of schedule.',
      relationship: 'Client on Infrastructure Optimization',
      featured: true
    };
    setEditingItem(newItem);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    const filtered = testimonialsList.filter(t => t.id !== id);
    setTestimonialsList(filtered);
    updatePortfolioData(prev => ({ ...prev, testimonials: filtered }));
    savePortfolio({ ...portfolio, testimonials: filtered });
    showNotification('Testimonial removed', 'info');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: Testimonial[];
    if (isCreating) {
      updated = [...testimonialsList, editingItem];
    } else {
      updated = testimonialsList.map(t => (t.id === editingItem.id ? editingItem : t));
    }

    setTestimonialsList(updated);
    updatePortfolioData(prev => ({ ...prev, testimonials: updated }));
    savePortfolio({ ...portfolio, testimonials: updated });

    setEditingItem(null);
    setIsCreating(false);
    showNotification('Testimonial saved', 'success');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-100">
            Client & Peer Testimonials
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage attributable endorsements, titles, and company relationships
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Endorsement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonialsList.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 flex flex-col justify-between"
          >
            <div>
              <p className="text-xs text-neutral-300 italic mb-4 leading-relaxed line-clamp-3">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="text-xs font-bold text-neutral-100">{item.name}</div>
              <div className="text-[11px] text-neutral-400">{item.role} · {item.company}</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">{item.relationship}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800/60 mt-4">
              <button
                onClick={() => {
                  setEditingItem(JSON.parse(JSON.stringify(item)));
                  setIsCreating(false);
                }}
                className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-200 text-xs hover:bg-neutral-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1 rounded text-red-400 hover:bg-red-950/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="text-base font-bold text-neutral-100">
                {isCreating ? 'Add Recommendation' : `Edit: ${editingItem.name}`}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Role / Title</label>
                  <input
                    type="text"
                    required
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    value={editingItem.company}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Relationship Context</label>
                  <input
                    type="text"
                    value={editingItem.relationship}
                    onChange={(e) => setEditingItem({ ...editingItem, relationship: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Attributable Endorsement Quote</label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.quote}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                >
                  Save Endorsement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
