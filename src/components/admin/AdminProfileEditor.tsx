import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Profile } from '../../types/portfolio';
import { Save, Check, RefreshCw, User, Globe, Mail, Briefcase, MapPin } from 'lucide-react';

export const AdminProfileEditor: React.FC = () => {
  const { portfolio, updatePortfolioData, savePortfolio, showNotification } = usePortfolio();
  const [profileState, setProfileState] = useState<Profile>(JSON.parse(JSON.stringify(portfolio.profile)));
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof Profile, value: any) => {
    setProfileState(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field: keyof Profile['socialLinks'], value: string) => {
    setProfileState(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [field]: value
      }
    }));
  };

  const handleMetricChange = (index: number, key: 'label' | 'value' | 'detail', value: string) => {
    setProfileState(prev => {
      const nextMetrics = [...prev.metrics];
      nextMetrics[index] = { ...nextMetrics[index], [key]: value };
      return { ...prev, metrics: nextMetrics };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Update local context draft
    updatePortfolioData(prev => ({
      ...prev,
      profile: profileState
    }));

    const ok = await savePortfolio({
      ...portfolio,
      profile: profileState
    });

    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      
      {/* Action Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-neutral-100">
            Edit Developer Profile
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Update your public personal bio, headline, availability status, and social channels
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Profile'}</span>
        </button>
      </div>

      {/* Basic Info Grid */}
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 space-y-5">
        <h3 className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-2">
          Basic Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={profileState.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Professional Role & Title
            </label>
            <input
              type="text"
              required
              value={profileState.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
            Hero Headline (Punchy display text)
          </label>
          <input
            type="text"
            required
            value={profileState.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
            Bio / Lead Copy
          </label>
          <textarea
            rows={4}
            required
            value={profileState.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500 resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={profileState.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Public Contact Email
            </label>
            <input
              type="email"
              required
              value={profileState.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Avatar Image URL (Optional)
            </label>
            <input
              type="text"
              value={profileState.avatarUrl}
              placeholder="Leave empty for styled initials"
              onChange={(e) => handleChange('avatarUrl', e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-800/60">
          <div>
            <label className="text-xs font-bold text-neutral-200 block">
              Available for New Contracts & Roles
            </label>
            <span className="text-[11px] text-neutral-500">
              Renders the green availability indicator in the hero section
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleChange('availableForWork', !profileState.availableForWork)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              profileState.availableForWork
                ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/60'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
            }`}
          >
            {profileState.availableForWork ? 'Active (Available)' : 'Inactive (Not Looking)'}
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
            Status Kicker / Custom Availability Message
          </label>
          <input
            type="text"
            value={profileState.statusMessage}
            onChange={(e) => handleChange('statusMessage', e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 space-y-4">
        <h3 className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-2">
          Social & External Links
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              value={profileState.socialLinks.github}
              onChange={(e) => handleSocialChange('github', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={profileState.socialLinks.linkedin}
              onChange={(e) => handleSocialChange('linkedin', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Twitter / X URL
            </label>
            <input
              type="url"
              value={profileState.socialLinks.twitter}
              onChange={(e) => handleSocialChange('twitter', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Resume URL / Anchor
            </label>
            <input
              type="text"
              value={profileState.resumeUrl}
              onChange={(e) => handleChange('resumeUrl', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Metrics Row (KPI Strip) */}
      <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 space-y-4">
        <h3 className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-2">
          Headline KPI Metrics (4-Column Strip)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profileState.metrics.map((m, idx) => (
            <div key={idx} className="p-3.5 rounded-lg border border-neutral-800/80 bg-neutral-950/60 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>Metric #{idx + 1}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Value (e.g. 8+ Years)"
                  value={m.value}
                  onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs font-mono font-bold"
                />
                <input
                  type="text"
                  placeholder="Label (e.g. Experience)"
                  value={m.label}
                  onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs"
                />
              </div>
              <input
                type="text"
                placeholder="Detail explanation"
                value={m.detail}
                onChange={(e) => handleMetricChange(idx, 'detail', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Publishing...' : 'Save Profile Changes'}</span>
        </button>
      </div>

    </form>
  );
};
