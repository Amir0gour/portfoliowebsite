import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { apiService } from '../../services/api';
import { Shield, Key, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, loginWithGoogle, adminEmail } = usePortfolio();
  const savedCreds = apiService.getLocalCredentials();
  const defaultEmail = adminEmail || savedCreds?.email || apiService.getAdminUser() || 'admin@portfolio.dev';
  const defaultPassword = savedCreds?.password || 'admin123';

  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
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

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Google sign-in was unsuccessful.');
    }
  };

  const handleUseDemoCreds = () => {
    const creds = apiService.getLocalCredentials();
    setEmail(creds?.email || adminEmail || 'admin@portfolio.dev');
    setPassword(creds?.password || 'admin123');
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto my-auto p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-2xl backdrop-blur-md">
      
      {/* Icon & Title */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-3">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Admin CMS Portal
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          Authenticate to manage projects, content, skills, and client inquiries
        </p>
      </div>

      {/* Demo Credentials Quick Pill Banner */}
      <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/20 text-xs text-blue-700 dark:text-blue-300 mb-6 flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5 mb-0.5">
            <Key className="w-3.5 h-3.5" />
            <span>Authorized Admin Login</span>
          </div>
          <div className="font-mono text-[11px] text-blue-800 dark:text-blue-400/90">
            Email: <span className="text-blue-950 dark:text-white font-semibold">{defaultEmail}</span>
            <br />
            Initial Demo Pass: <span className="text-blue-950 dark:text-white font-semibold">admin123</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleUseDemoCreds}
          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline shrink-0 mt-1 cursor-pointer"
        >
          Fill Demo
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl border border-red-300 dark:border-red-800/60 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300 mb-6 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Admin Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@portfolio.dev"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:border-blue-500 transition-colors"
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
              <span>Sign In with Password</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Google Sign In Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase">
          <span className="bg-white dark:bg-neutral-900 px-3 text-neutral-500 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800/80 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium text-xs transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 shadow-sm"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Sign In with Google</span>
      </button>

    </div>
  );
};
