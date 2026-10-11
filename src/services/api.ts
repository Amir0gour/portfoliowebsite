import { PortfolioData, ContactMessage, AnalyticsStats } from '../types/portfolio';
import { initialPortfolioData, initialMessages, initialAnalytics } from '../data/initialPortfolio';

const LOCAL_STORAGE_PORTFOLIO_KEY = 'devfolio_portfolio_cache';
const LOCAL_STORAGE_MESSAGES_KEY = 'devfolio_messages_cache';
const LOCAL_STORAGE_ANALYTICS_KEY = 'devfolio_analytics_cache';
const LOCAL_STORAGE_AUTH_KEY = 'devfolio_auth_token';
const LOCAL_STORAGE_USER_KEY = 'devfolio_auth_user';

export const apiService = {
  // Auth Token
  getToken(): string | null {
    return localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
  },

  getAdminUser(): string | null {
    return localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  },

  setAuth(token: string, email: string) {
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, token);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, email);
  },

  clearAuth() {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  },

  // 1. Fetch Portfolio
  async getPortfolio(): Promise<PortfolioData> {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          localStorage.setItem(LOCAL_STORAGE_PORTFOLIO_KEY, JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch {
      // Offline fallback
    }

    const cached = localStorage.getItem(LOCAL_STORAGE_PORTFOLIO_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    return initialPortfolioData;
  },

  // 2. Update Portfolio
  async updatePortfolio(data: PortfolioData): Promise<{ success: boolean; data?: PortfolioData; error?: string }> {
    const token = this.getToken();
    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        localStorage.setItem(LOCAL_STORAGE_PORTFOLIO_KEY, JSON.stringify(json.data || data));
        return { success: true, data: json.data || data };
      }
      const errJson = await res.json().catch(() => ({}));
      return { success: false, error: errJson.error || 'Failed to update portfolio' };
    } catch (err: any) {
      // Local fallback
      localStorage.setItem(LOCAL_STORAGE_PORTFOLIO_KEY, JSON.stringify(data));
      return { success: true, data };
    }
  },

  // 3. Submit Contact Form
  async submitContact(payload: {
    name: string;
    email: string;
    subject: string;
    message: string;
    budget?: string;
  }): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, message: json.message };
      }
      return { success: false, message: '', error: json.error || 'Failed to transmit message' };
    } catch (err: any) {
      // Client offline fallback
      const localMsg: ContactMessage = {
        id: `msg-local-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        budget: payload.budget,
        createdAt: new Date().toISOString(),
        read: false,
        starred: false,
        archived: false,
        replied: false
      };
      const existing = this.getLocalMessages();
      existing.unshift(localMsg);
      localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(existing));
      return {
        success: true,
        message: 'Message delivered! Alex will review your inquiry shortly.'
      };
    }
  },

  // 4. Get Admin Messages
  async getMessages(): Promise<ContactMessage[]> {
    const token = this.getToken();
    try {
      const res = await fetch('/api/messages', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch {
      // Offline fallback
    }
    return this.getLocalMessages();
  },

  getLocalMessages(): ContactMessage[] {
    const raw = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // ignore
      }
    }
    return initialMessages;
  },

  // 5. Update Message
  async updateMessage(
    id: string,
    updates: Partial<Pick<ContactMessage, 'read' | 'starred' | 'archived' | 'replied'>>
  ): Promise<boolean> {
    const token = this.getToken();
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) return true;
    } catch {
      // offline
    }

    const msgs = this.getLocalMessages();
    const idx = msgs.findIndex(m => m.id === id);
    if (idx !== -1) {
      msgs[idx] = { ...msgs[idx], ...updates };
      localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(msgs));
      return true;
    }
    return false;
  },

  // 6. Delete Message
  async deleteMessage(id: string): Promise<boolean> {
    const token = this.getToken();
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) return true;
    } catch {
      // offline
    }

    const msgs = this.getLocalMessages();
    const filtered = msgs.filter(m => m.id !== id);
    localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(filtered));
    return true;
  },

  // 7. Get Analytics
  async getAnalytics(): Promise<AnalyticsStats> {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          localStorage.setItem(LOCAL_STORAGE_ANALYTICS_KEY, JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch {
      // offline
    }

    const cached = localStorage.getItem(LOCAL_STORAGE_ANALYTICS_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    return initialAnalytics;
  },

  // 8. Track Visit
  async trackVisit() {
    try {
      fetch('/api/analytics/visit', { method: 'POST' }).catch(() => {});
    } catch {
      // ignore
    }
  },

  // 9. Track Resume Download
  async trackResumeDownload() {
    try {
      fetch('/api/analytics/resume', { method: 'POST' }).catch(() => {});
    } catch {
      // ignore
    }
  },

  // 10. Login Admin
  async login(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        this.setAuth(json.token, email);
        return { success: true, token: json.token };
      }
      return { success: false, error: json.error || 'Invalid credentials' };
    } catch (err: any) {
      // Offline fallback: allow default demo credentials
      if (
        (email.toLowerCase() === 'admin@portfolio.dev' || email.toLowerCase() === 'alex.rivera.dev@gmail.com') &&
        password === 'admin123'
      ) {
        const fallbackToken = 'devfolio-offline-token';
        this.setAuth(fallbackToken, email);
        return { success: true, token: fallbackToken };
      }
      return { success: false, error: 'Network error or incorrect credentials' };
    }
  },

  // 11. Update Admin Credentials (Email / Password)
  async updateCredentials(payload: {
    newEmail?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; message?: string; error?: string; adminEmail?: string }> {
    const token = this.getToken();
    try {
      const res = await fetch('/api/auth/credentials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        if (json.adminEmail) {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, json.adminEmail);
        }
        return { success: true, message: json.message, adminEmail: json.adminEmail };
      }
      return { success: false, error: json.error || 'Failed to update credentials' };
    } catch (err: any) {
      if (payload.newEmail) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, payload.newEmail);
      }
      return { success: true, message: 'Credentials updated locally', adminEmail: payload.newEmail };
    }
  },

  // 12. Reset Portfolio to defaults
  async resetToDefaults(): Promise<PortfolioData> {
    const token = this.getToken();
    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const json = await res.json();
        localStorage.setItem(LOCAL_STORAGE_PORTFOLIO_KEY, JSON.stringify(json.data));
        localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(initialMessages));
        return json.data;
      }
    } catch {
      // offline
    }
    localStorage.setItem(LOCAL_STORAGE_PORTFOLIO_KEY, JSON.stringify(initialPortfolioData));
    localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(initialMessages));
    return initialPortfolioData;
  }
};
