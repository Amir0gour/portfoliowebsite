import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Shield, Key, Mail, Lock, Eye, EyeOff, Check, AlertCircle, Save, Info } from 'lucide-react';

export const AdminSecuritySettings: React.FC = () => {
  const { adminEmail, updateCredentials, portfolio, updatePortfolioData, savePortfolio, showNotification } = usePortfolio();

  const [newEmail, setNewEmail] = useState(adminEmail || 'admin@portfolio.dev');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [syncPublicEmail, setSyncPublicEmail] = useState(true);

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword && newPassword !== confirmPassword) {
      setStatus({ success: false, message: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setStatus({ success: false, message: 'New password must be at least 6 characters long.' });
      return;
    }

    setIsLoading(true);

    const payload: {
      newEmail?: string;
      currentPassword?: string;
      newPassword?: string;
    } = {
      newEmail: newEmail.trim()
    };

    if (currentPassword) payload.currentPassword = currentPassword;
    if (newPassword) payload.newPassword = newPassword;

    const res = await updateCredentials(payload);
    setIsLoading(false);

    if (res.success) {
      // If user selected sync public email, update profile too
      if (syncPublicEmail && newEmail.trim() && newEmail.trim() !== portfolio.profile.email) {
        updatePortfolioData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            email: newEmail.trim(),
            socialLinks: {
              ...prev.profile.socialLinks,
              email: `mailto:${newEmail.trim()}`
            }
          }
        }));
        savePortfolio();
      }

      setStatus({
        success: true,
        message: 'Admin Gmail and security credentials have been updated successfully!'
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setStatus({
        success: false,
        message: res.error || 'Failed to update credentials. Please check your current password.'
      });
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800">
        <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <span>Admin Account & Security Settings</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Change your administrative Gmail / email address and update your portal login password
        </p>
      </div>

      {/* Secret Access Notice */}
      <div className="p-4 rounded-xl border border-blue-900/40 bg-blue-950/20 text-xs text-blue-300 space-y-1.5">
        <div className="font-semibold text-blue-200 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-400" />
          <span>Stealth Admin Access Configuration</span>
        </div>
        <p className="text-blue-300/80 leading-relaxed text-[11px]">
          The Admin Portal is hidden from public site visitors. You can reopen this CMS anytime via:
        </p>
        <ul className="list-disc list-inside text-[11px] text-blue-200 font-mono space-y-0.5 pl-1">
          <li>Direct URL: <span className="underline">/admin</span> or <span className="underline">#admin</span></li>
          <li>Keyboard shortcut: <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-white">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-white">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-white">A</kbd></li>
          <li>Clicking the copyright <span className="font-bold text-white">©</span> mark in the site footer</li>
        </ul>
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
            status.success
              ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-200'
              : 'bg-red-950/50 border border-red-800 text-red-200'
          }`}
        >
          {status.success ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-6">
        
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
            Admin Gmail / Login Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="your.email@gmail.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Used as the login username for the Admin CMS Portal.
          </span>
        </div>

        {/* Sync with Public Contact Email checkbox */}
        <div className="flex items-center gap-2.5 pt-1">
          <input
            type="checkbox"
            id="sync-email"
            checked={syncPublicEmail}
            onChange={(e) => setSyncPublicEmail(e.target.checked)}
            className="rounded border-neutral-800 text-blue-600 focus:ring-0 cursor-pointer"
          />
          <label htmlFor="sync-email" className="text-xs text-neutral-300 cursor-pointer">
            Also update public profile contact email to this address ({newEmail})
          </label>
        </div>

        <div className="border-t border-neutral-800/80 pt-5 space-y-4">
          <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            Password Change (Optional)
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
              Current Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type={showCurrentPass ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password to authorize changes"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300"
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[10px] text-neutral-500 mt-0.5 block font-mono">
              (Default initial demo password is &apos;admin123&apos;)
            </span>
          </div>

          {/* New Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-neutral-800">
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Updating Credentials...' : 'Save Security Credentials'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
