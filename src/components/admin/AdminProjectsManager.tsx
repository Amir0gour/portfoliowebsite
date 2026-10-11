import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project, CaseStudy } from '../../types/portfolio';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, ExternalLink, Github, Check, X, Layers, Sparkles } from 'lucide-react';

const emptyCaseStudy: CaseStudy = {
  summary: '',
  clientOrContext: '',
  role: 'Staff Full-Stack Engineer',
  timeline: '3 Months · 2026',
  architecture: ['Distributed event broker with streaming consumer queues', 'Optimistic UI hydration pipeline in React 19'],
  challenges: ['Ensuring latency stays under 50ms during peak load spikes'],
  metrics: [{ label: 'p95 Latency', value: '< 45ms' }],
  keyLearnings: 'Decoupling compute workers from stateful caching was essential.'
};

export const AdminProjectsManager: React.FC = () => {
  const { portfolio, updatePortfolioData, savePortfolio, showNotification } = usePortfolio();
  const [projectsList, setProjectsList] = useState<Project[]>(JSON.parse(JSON.stringify(portfolio.projects)));
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Move project up/down
  const moveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projectsList.length) return;

    const copy = [...projectsList];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    setProjectsList(copy);
    updatePortfolioData(prev => ({ ...prev, projects: copy }));
    savePortfolio({ ...portfolio, projects: copy });
    showNotification('Project reordered', 'info');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const filtered = projectsList.filter(p => p.id !== id);
    setProjectsList(filtered);
    updatePortfolioData(prev => ({ ...prev, projects: filtered }));
    savePortfolio({ ...portfolio, projects: filtered });
    showNotification('Project removed', 'info');
  };

  const handleStartCreate = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: 'New Production Engineering Project',
      slug: `project-${Date.now()}`,
      subtitle: 'High-performance cloud microservices and responsive dashboard',
      description: 'Engineered an end-to-end full stack platform with sub-second queries, real-time WebSockets, and clean typography.',
      category: 'Full Stack',
      tags: ['TypeScript', 'React 19', 'Node.js', 'Tailwind CSS'],
      featured: false,
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/repo',
      coverGradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
      sortOrder: projectsList.length + 1,
      caseStudy: { ...emptyCaseStudy }
    };
    setEditingProject(newProj);
    setIsCreatingNew(true);
    setTagInput('');
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    let updated: Project[];
    if (isCreatingNew) {
      updated = [...projectsList, editingProject];
    } else {
      updated = projectsList.map(p => (p.id === editingProject.id ? editingProject : p));
    }

    setProjectsList(updated);
    updatePortfolioData(prev => ({ ...prev, projects: updated }));
    savePortfolio({ ...portfolio, projects: updated });

    setEditingProject(null);
    setIsCreatingNew(false);
    showNotification('Project successfully saved and published!', 'success');
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || !editingProject) return;
    if (!editingProject.tags.includes(tagInput.trim())) {
      setEditingProject({
        ...editingProject,
        tags: [...editingProject.tags, tagInput.trim()]
      });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      tags: editingProject.tags.filter(t => t !== tag)
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-100">
            Projects & Case Studies Manager
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Create, reorder, tag, and publish architectural case studies
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projectsList.map((project, index) => (
          <div
            key={project.id}
            className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-mono mb-1">
                <span className="text-blue-400 font-semibold">{project.category}</span>
                <span className="text-neutral-600">·</span>
                <span className="text-neutral-500">#{index + 1}</span>
                {project.featured && (
                  <>
                    <span className="text-neutral-600">·</span>
                    <span className="text-amber-400 font-medium">Featured</span>
                  </>
                )}
              </div>

              <h3 className="text-base font-bold text-neutral-100 mb-1">
                {project.title}
              </h3>
              <p className="text-xs text-neutral-400 line-clamp-1 mb-2">
                {project.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 font-mono">
                {project.tags.map((t, idx) => (
                  <span key={t}>
                    {t}{idx < project.tags.length - 1 && ' ·'}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Reorder Buttons */}
              <button
                disabled={index === 0}
                onClick={() => moveProject(index, 'up')}
                className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-neutral-100 disabled:opacity-30 cursor-pointer"
                title="Move up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={index === projectsList.length - 1}
                onClick={() => moveProject(index, 'down')}
                className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-neutral-100 disabled:opacity-30 cursor-pointer"
                title="Move down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              {/* Edit */}
              <button
                onClick={() => {
                  setEditingProject(JSON.parse(JSON.stringify(project)));
                  setIsCreatingNew(false);
                }}
                className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-200 text-xs font-semibold hover:bg-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(project.id)}
                className="p-1.5 rounded-lg border border-neutral-800 text-red-400 hover:bg-red-950/40 hover:border-red-800 transition-colors cursor-pointer"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl max-h-[90vh] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-y-auto flex flex-col p-6 sm:p-8 space-y-6 my-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-neutral-100">
                {isCreatingNew ? 'Add New Project' : `Edit: ${editingProject.title}`}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-6">
              
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="AI & Agents">AI & Agents</option>
                    <option value="Cloud & Systems">Cloud & Systems</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>
              </div>

              {/* Subtitle & Featured Checkbox */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Subtitle (Short one-line elevator pitch)
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.subtitle}
                  onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Card Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Tags Editor */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Tech Stack Tags
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {editingProject.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 flex items-center gap-1.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add tag (e.g. Next.js, Redis, WebAssembly)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-200 text-xs font-semibold hover:bg-neutral-700"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {/* External URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Live Preview URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.liveUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.githubUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-800">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={editingProject.featured}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="rounded border-neutral-800 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featured-toggle" className="text-xs font-semibold text-neutral-300 cursor-pointer">
                  Feature this project prominently on the homepage Bento grid
                </label>
              </div>

              {/* Case Study Section */}
              <div className="pt-4 border-t border-neutral-800 space-y-4">
                <div className="text-xs uppercase tracking-wider text-blue-400 font-bold">
                  Case Study Deep-Dive Specifications
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Case Study Summary
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.caseStudy.summary}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        caseStudy: { ...editingProject.caseStudy, summary: e.target.value }
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Client / Domain Context
                    </label>
                    <input
                      type="text"
                      value={editingProject.caseStudy.clientOrContext}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          caseStudy: { ...editingProject.caseStudy, clientOrContext: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Timeline & Delivery
                    </label>
                    <input
                      type="text"
                      value={editingProject.caseStudy.timeline}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          caseStudy: { ...editingProject.caseStudy, timeline: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Key Architectural Highlights (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.caseStudy.architecture.join('\n')}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        caseStudy: {
                          ...editingProject.caseStudy,
                          architecture: e.target.value.split('\n').filter(Boolean)
                        }
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Core Challenges Tackled (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.caseStudy.challenges.join('\n')}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        caseStudy: {
                          ...editingProject.caseStudy,
                          challenges: e.target.value.split('\n').filter(Boolean)
                        }
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-lg border border-neutral-800 text-neutral-400 text-xs hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md"
                >
                  {isCreatingNew ? 'Add Project' : 'Save Project Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
