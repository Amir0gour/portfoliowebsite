import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { apiService } from '../../services/api';
import { Send, Mail, Check, Copy, AlertCircle, MessageSquare } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { portfolio, showNotification } = usePortfolio();
  const { profile } = portfolio;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    budget: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const scopePresets = [
    '< $10,000',
    '$10,000 — $25,000',
    '$25,000 — $50,000',
    '$50,000+',
    'Hourly Advisory',
    'MVP Build',
    'Architecture Audit'
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    showNotification('Email address copied to clipboard', 'info');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmittedStatus({
        success: false,
        message: 'Please complete all required fields.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmittedStatus(null);

    const res = await apiService.submitContact(formData);
    setIsSubmitting(false);

    if (res.success) {
      setSubmittedStatus({
        success: true,
        message: res.message || 'Inquiry successfully transmitted! Alex will respond within 24 hours.'
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        budget: ''
      });
    } else {
      setSubmittedStatus({
        success: false,
        message: res.error || 'Failed to transmit message. Please try again or email directly.'
      });
    }
  };

  return (
    <section id="contact" className="py-20 border-b border-neutral-200 dark:border-neutral-800/60 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context & Direct Channels */}
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-2">
              Get In Touch
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight mb-4">
              Initiate a Technical Conversation
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
              Whether you need senior architectural leadership on a distributed pipeline, performance consulting for a mission-critical web app, or an advisory partner, send a message below.
            </p>

            {/* Direct Email Card */}
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 mb-6 shadow-xs">
              <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                Direct Contact Mailbox
              </div>
              <div className="flex items-center justify-between gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="font-mono text-sm text-neutral-900 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold"
                >
                  {profile.email}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Availability details */}
            <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Response Time: Typically under 24 hours on business days</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Timezone: Pacific Standard Time (PST / UTC-8)</span>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 backdrop-blur-sm shadow-xs">
              
              {submittedStatus && (
                <div
                  className={`p-4 rounded-xl mb-6 text-xs flex items-start gap-3 ${
                    submittedStatus.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200'
                      : 'bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800/80 text-red-800 dark:text-red-200'
                  }`}
                >
                  {submittedStatus.success ? (
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <span>{submittedStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject & Budget Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Topic / Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Technical Advisory, Architecture, or Consultation"
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:border-blue-500 transition-colors placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="project-scope-input" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Target Project Scope / Budget
                      </label>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal">
                        Write custom or pick preset
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        id="project-scope-input"
                        type="text"
                        list="scope-budget-presets"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="e.g. $25k — $50k, Full MVP build, or Advisory contract"
                        className="w-full px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:border-blue-500 transition-colors placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                      />
                      <datalist id="scope-budget-presets">
                        {scopePresets.map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    </div>

                    {/* Quick suggestion chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-500">Quick options:</span>
                      {scopePresets.map((opt) => {
                        const isSelected = formData.budget === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData({ ...formData, budget: isSelected ? '' : opt })}
                            className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer border ${
                              isSelected
                                ? 'bg-blue-600/15 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
                                : 'bg-neutral-100 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-700'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Project Details & Scope <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your system requirements, technical goals, and target timeline..."
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:border-blue-500 transition-colors resize-y"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Transmitting inquiry...</span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
