import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Skill } from '../../types/portfolio';
import { Plus, Trash2, Edit2, Check, X, Cpu } from 'lucide-react';

export const AdminSkillsManager: React.FC = () => {
  const { portfolio, updatePortfolioData, savePortfolio, showNotification } = usePortfolio();
  const [skillsList, setSkillsList] = useState<Skill[]>(JSON.parse(JSON.stringify(portfolio.skills)));
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleStartAdd = () => {
    const newSkill: Skill = {
      id: `sk-${Date.now()}`,
      name: 'GraphQL & Federation',
      category: 'Backend & Cloud',
      proficiency: 90,
      experienceYears: 4,
      highlight: 'Schema stitching, Apollo gateway, caching directives'
    };
    setEditingSkill(newSkill);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    const filtered = skillsList.filter(s => s.id !== id);
    setSkillsList(filtered);
    updatePortfolioData(prev => ({ ...prev, skills: filtered }));
    savePortfolio({ ...portfolio, skills: filtered });
    showNotification('Skill deleted', 'info');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    let updated: Skill[];
    if (isCreating) {
      updated = [...skillsList, editingSkill];
    } else {
      updated = skillsList.map(s => (s.id === editingSkill.id ? editingSkill : s));
    }

    setSkillsList(updated);
    updatePortfolioData(prev => ({ ...prev, skills: updated }));
    savePortfolio({ ...portfolio, skills: updated });

    setEditingSkill(null);
    setIsCreating(false);
    showNotification('Skill saved', 'success');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-100">
            Skills & Technical Proficiency Manager
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Adjust competencies, category groupings, proficiency bars, and years of experience
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Skill</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillsList.map(skill => (
          <div
            key={skill.id}
            className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-bold text-neutral-100">{skill.name}</span>
                <span className="text-xs font-mono text-blue-400 font-bold">{skill.proficiency}%</span>
              </div>
              <div className="text-xs text-neutral-500 mb-2 font-mono">
                {skill.category} · {skill.experienceYears} yrs
              </div>
              <p className="text-xs text-neutral-400 mb-3 line-clamp-2">
                {skill.highlight}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800/60">
              <button
                onClick={() => {
                  setEditingSkill(JSON.parse(JSON.stringify(skill)));
                  setIsCreating(false);
                }}
                className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-200 text-xs hover:bg-neutral-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
                className="p-1 rounded text-red-400 hover:bg-red-950/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h3 className="text-base font-bold text-neutral-100">
                {isCreating ? 'Add Technical Skill' : `Edit: ${editingSkill.name}`}
              </h3>
              <button onClick={() => setEditingSkill(null)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                  <select
                    value={editingSkill.category}
                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend & Cloud">Backend & Cloud</option>
                    <option value="Systems & Architecture">Systems & Architecture</option>
                    <option value="DevOps & Tools">DevOps & Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Years of Exp</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={editingSkill.experienceYears}
                    onChange={(e) => setEditingSkill({ ...editingSkill, experienceYears: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-neutral-300 mb-1">
                  <span>Proficiency Level</span>
                  <span className="font-mono text-blue-400">{editingSkill.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={editingSkill.proficiency}
                  onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Key Topics & Libraries</label>
                <input
                  type="text"
                  value={editingSkill.highlight}
                  onChange={(e) => setEditingSkill({ ...editingSkill, highlight: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
