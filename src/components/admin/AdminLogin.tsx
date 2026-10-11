import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Shield, Key, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, adminEmail } = usePortfolio();
  const [email, setEmail] = useState(adminEmail || 'admin@portfolio.dev');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await loginAdmin(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleUseDemoCreds = () => {
    setEmail(adminEmail || 'admin@portfolio.dev');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto my-auto p-8 rounded-2xl border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-white shadow-2xl backdrop-blur-md">
      
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-3">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight">
          Admin CMS Portal
        </h2>
        <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1">
          Authenticate to manage projects, content, skills, and client inquiries
        </p>
      </div>

      {/* Demo Credentials Quick Pill Banner */}
      <div className="p-3.5 rounded-xl border border-blue-900/40 bg-blue-950/20 text-xs text-blue-300 mb-6 flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-blue-200 flex items-center gap-1.5 mb-0.5">
            <Key className="w-3.5 h-3.5" />
            <span>Authorized Admin Login</span>
          </div>
          <div className="font-mono text-[11px] text-blue-400/90">
            Email: <span className="text-white">{adminEmail || 'admin@portfolio.dev'}</span>
            <br />
            Initial Demo Pass: <span className="text-white">admin123</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleUseDemoCreds}
          className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 underline shrink-0 mt-1 cursor-pointer"
        >
          Fill Demo
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl border border-red-800/60 bg-red-950/30 text-xs text-red-300 mb-6 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1.5">
            Admin Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@portfolio.dev"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-50 border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 text-neutral-100 dark:text-neutral-100 light:text-neutral-900 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-950 dark:bg-neutral-950 light:bg-neutral-50 border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 text-neutral-100 dark:text-neutral-100 light:text-neutral-900 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 mt-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span>Verifying session...</span>
          ) : (
            <>
              <span>Sign In to Admin CMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

    </div>
  );
};
