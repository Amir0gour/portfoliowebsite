import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { TimelineItem } from '../../types/portfolio';
import { Plus, Trash2, Edit2, X, Briefcase, GraduationCap, Award } from 'lucide-react';

export const AdminTimelineManager: React.FC = () => {
  const { portfolio, updatePortfolioData, savePortfolio, showNotification } = usePortfolio();
  const [timelineList, setTimelineList] = useState<TimelineItem[]>(JSON.parse(JSON.stringify(portfolio.timeline)));
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleStartAdd = () => {
    const newItem: TimelineItem = {
      id: `time-${Date.now()}`,
      type: 'work',
      title: 'Principal Systems Architect',
      organization: 'New Ventures Corp',
      period: '2026 — Present',
      location: 'San Francisco, CA',
      description: 'Guiding enterprise migration to event-driven serverless architectures.',
      highlights: ['Reduced server cost by 38% while improving throughput']
    };
    setEditingItem(newItem);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    const filtered = timelineList.filter(t => t.id !== id);
    setTimelineList(filtered);
    updatePortfolioData(prev => ({ ...prev, timeline: filtered }));
    savePortfolio({ ...portfolio, timeline: filtered });
    showNotification('Timeline milestone deleted', 'info');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: TimelineItem[];
    if (isCreating) {
      updated = [editingItem, ...timelineList];
    } else {
      updated = timelineList.map(t => (t.id === editingItem.id ? editingItem : t));
    }

    setTimelineList(updated);
    updatePortfolioData(prev => ({ ...prev, timeline: updated }));
    savePortfolio({ ...portfolio, timeline: updated });

    setEditingItem(null);
    setIsCreating(false);
    showNotification('Timeline milestone saved', 'success');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-100">
            Work History & Milestones Manager
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage roles, educational degrees, and conference achievements on your timeline
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Milestone</span>
        </button>
      </div>

      <div className="space-y-4">
        {timelineList.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-1">
                <span className="capitalize text-blue-400 font-semibold">{item.type}</span>
                <span>·</span>
                <span>{item.period}</span>
                <span>·</span>
                <span>{item.location}</span>
              </div>
              <h3 className="text-base font-bold text-neutral-100">
                {item.title} <span className="font-normal text-neutral-400">at {item.organization}</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setEditingItem(JSON.parse(JSON.stringify(item)));
                  setIsCreating(false);
                }}
                className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-200 text-xs font-semibold hover:bg-neutral-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg border border-neutral-800 text-red-400 hover:bg-red-950/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="text-base font-bold text-neutral-100">
                {isCreating ? 'Add Timeline Milestone' : `Edit: ${editingItem.title}`}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Type</label>
                  <select
                    value={editingItem.type}
                    onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  >
                    <option value="work">Work Role</option>
                    <option value="education">Education</option>
                    <option value="achievement">Achievement / Honor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Period (e.g. 2023 — Present)</label>
                  <input
                    type="text"
                    required
                    value={editingItem.period}
                    onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Title / Role</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Organization / Company</label>
                  <input
                    type="text"
                    required
                    value={editingItem.organization}
                    onChange={(e) => setEditingItem({ ...editingItem, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Highlights (One bullet per line)</label>
                <textarea
                  rows={3}
                  value={editingItem.highlights.join('\n')}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      highlights: e.target.value.split('\n').filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs font-mono"
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
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
