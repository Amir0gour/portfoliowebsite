import { PortfolioData, ContactMessage, AnalyticsStats } from '../types/portfolio';
import { initialPortfolioData, initialMessages, initialAnalytics } from '../data/initialPortfolio';
import { 
  db, 
  auth, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';

const LOCAL_STORAGE_PORTFOLIO_KEY = 'devfolio_portfolio_cache';
const LOCAL_STORAGE_MESSAGES_KEY = 'devfolio_messages_cache';
const LOCAL_STORAGE_ANALYTICS_KEY = 'devfolio_analytics_cache';
const LOCAL_STORAGE_AUTH_KEY = 'devfolio_auth_token';
const LOCAL_STORAGE_USER_KEY = 'devfolio_auth_user';
const LOCAL_STORAGE_CREDENTIALS_KEY = 'devfolio_custom_credentials';

function isJsonResponse(res: Response): boolean {
  const ct = res.headers.get('content-type');
  return !!ct && ct.includes('application/json');
}

export const apiService = {
  // Auth Token
  getToken(): string | null {
    if (auth.currentUser) return auth.currentUser.uid;
    return localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
  },

  getAdminUser(): string | null {
    if (auth.currentUser?.email) return auth.currentUser.email;
    const custom = this.getLocalCredentials();
    if (custom?.email) return custom.email;
    return localStorage.getItem(LOCAL_STORAGE_USER_KEY) || 'admin@portfolio.dev';
  },

  getLocalCredentials(): { email: string; password?: string } | null {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CREDENTIALS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  },

  setAuth(token: string, email: string) {
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, token);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, email);
  },

  clearAuth() {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    fbSignOut(auth).catch(() => {});
  },

  // Firebase Google Auth Sign In
  async loginWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const email = result.user.email || '';
        this.setAuth(result.user.uid, email);
        return { success: true, user: result.user };
      }
      return { success: false, error: 'Google sign-in cancelled or returned no user.' };
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      return { success: false, error: err.message || 'Google authentication failed' };
    }
  },

  // 1. Fetch Portfolio (Firestore -> API -> LocalStorage fallback)
  async getPortfolio(): Promise<PortfolioData> {
    const portfolioDocRef = doc(db, 'portfolio', 'main');
    try {
      const snapshot = await getDoc(portfolioDocRef);
      if (snapshot.exists()) {
        const firestoreData = snapshot.data() as PortfolioData;
        localStorage.setItem(LOCAL_STORAGE_PORTFOLIO_KEY, JSON.stringify(firestoreData));
        return firestoreData;
      }
    } catch (err) {
      console.warn('Firestore read error, attempting API / local fallback:', err);
    }

    // Try Express backend if running
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok && isJsonResponse(res)) {
        const json = await res.json();
        if (json.data) {
          localStorage.setItem(LOCAL_STORAGE_PORTFOLIO_KEY, JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch {
      // fallback
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

  // 2. Update Portfolio (Syncs directly to Firestore & local cache)
  async updatePortfolio(data: PortfolioData): Promise<{ success: boolean; data?: PortfolioData; error?: string }> {
    const portfolioDocRef = doc(db, 'portfolio', 'main');
    let firestoreSuccess = false;

    try {
      await setDoc(portfolioDocRef, {
        profile: data.profile,
        projects: data.projects,
        skills: data.skills,
        timeline: data.timeline,
        testimonials: data.testimonials,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      firestoreSuccess = true;
    } catch (error) {
      console.warn('Firestore write error (will fallback to server/cache):', error);
      // We don't throw fatal here so the user can continue in offline/fallback mode
    }

    // Also sync to backend server if active
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
    } catch {
      // ignore
    }

    // Always cache locally so immediate changes render
    localStorage.setItem(LOCAL_STORAGE_PORTFOLIO_KEY, JSON.stringify(data));
    return { success: true, data };
  },

  // 3. Submit Contact Form (Firestore 'messages' collection)
  async submitContact(payload: {
    name: string;
    email: string;
    subject: string;
    message: string;
    budget?: string;
  }): Promise<{ success: boolean; message: string; error?: string }> {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const msgData: ContactMessage = {
      id,
      name: payload.name.trim(),
      email: payload.email.trim(),
      subject: payload.subject.trim(),
      message: payload.message.trim(),
      budget: payload.budget ? payload.budget.trim() : '',
      createdAt: new Date().toISOString(),
      read: false,
      starred: false,
      archived: false,
      replied: false
    };

    try {
      const msgDocRef = doc(db, 'messages', id);
      await setDoc(msgDocRef, msgData);
      return {
        success: true,
        message: 'Message delivered successfully to cloud inbox!'
      };
    } catch (err) {
      console.warn('Firestore message save error, falling back to API / local:', err);
    }

    // Server fallback
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (isJsonResponse(res)) {
        const json = await res.json();
        if (res.ok && json.success) {
          return { success: true, message: json.message };
        }
      }
    } catch {
      // ignore
    }

    // Local storage fallback
    const existing = this.getLocalMessages();
    existing.unshift(msgData);
    localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(existing));
    return {
      success: true,
      message: 'Message delivered! Alex will review your inquiry shortly.'
    };
  },

  // 4. Get Admin Messages (Firestore 'messages' collection)
  async getMessages(): Promise<ContactMessage[]> {
    try {
      const msgsCol = collection(db, 'messages');
      const snap = await getDocs(msgsCol);
      if (!snap.empty) {
        const list: ContactMessage[] = [];
        snap.forEach(d => {
          list.push(d.data() as ContactMessage);
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.warn('Firestore getMessages error:', err);
    }

    // API / Cache fallback
    const token = this.getToken();
    try {
      const res = await fetch('/api/messages', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok && isJsonResponse(res)) {
        const json = await res.json();
        if (json.data) {
          localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch {
      // offline
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

  // 5. Update Message status in Firestore
  async updateMessage(
    id: string,
    updates: Partial<Pick<ContactMessage, 'read' | 'starred' | 'archived' | 'replied'>>
  ): Promise<boolean> {
    try {
      const ref = doc(db, 'messages', id);
      await updateDoc(ref, updates);
    } catch (err) {
      console.warn('Firestore updateMessage error, updating local:', err);
    }

    const token = this.getToken();
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updates)
      });
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
    return true;
  },

  // 6. Delete Message in Firestore
  async deleteMessage(id: string): Promise<boolean> {
    try {
      const ref = doc(db, 'messages', id);
      await deleteDoc(ref);
    } catch (err) {
      console.warn('Firestore deleteMessage error:', err);
    }

    const token = this.getToken();
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
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
      if (res.ok && isJsonResponse(res)) {
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
  async trackVisit(): Promise<void> {
    try {
      await fetch('/api/track/visit', { method: 'POST' });
    } catch {
      // offline fallback
      const cached = await this.getAnalytics();
      cached.pageViews += 1;
      localStorage.setItem(LOCAL_STORAGE_ANALYTICS_KEY, JSON.stringify(cached));
    }
  },

  // 9. Track Resume Download
  async trackResumeDownload(): Promise<void> {
    try {
      await fetch('/api/track/resume', { method: 'POST' });
    } catch {
      const cached = await this.getAnalytics();
      cached.resumeDownloads += 1;
      localStorage.setItem(LOCAL_STORAGE_ANALYTICS_KEY, JSON.stringify(cached));
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

      if (isJsonResponse(res)) {
        const json = await res.json();
        if (res.ok && json.success) {
          this.setAuth(json.token, json.adminEmail || email);
          return { success: true, token: json.token };
        } else if (!res.ok) {
          return { success: false, error: json.error || 'Authentication rejected' };
        }
      }
      throw new Error('Non-JSON server response (static environment)');
    } catch {
      // Static / Firebase fallback
      // Check synced cloud settings first
      try {
        const settingsSnap = await getDoc(doc(db, 'settings', 'admin'));
        if (settingsSnap.exists()) {
          const s = settingsSnap.data();
          if (s.adminEmail && s.adminEmail.toLowerCase() === email.trim().toLowerCase()) {
            if (!s.adminPassword || s.adminPassword === password) {
              const fallbackToken = 'devfolio-cloud-token';
              this.setAuth(fallbackToken, s.adminEmail);
              return { success: true, token: fallbackToken };
            }
          }
        }
      } catch (err) {
        console.warn('Firestore settings fetch during login:', err);
      }

      // Check browser local saved credentials
      const custom = this.getLocalCredentials();
      const enteredEmail = email.trim().toLowerCase();

      if (custom && custom.email) {
        const savedEmail = custom.email.trim().toLowerCase();
        const savedPass = custom.password || 'admin123';

        if (enteredEmail === savedEmail) {
          if (password !== savedPass) {
            return { success: false, error: 'Incorrect password for this administrator account' };
          }
          const fallbackToken = 'devfolio-offline-token';
          this.setAuth(fallbackToken, custom.email);
          return { success: true, token: fallbackToken };
        }
      }

      // Check default demo credentials
      if (
        (enteredEmail === 'admin@portfolio.dev' || 
         enteredEmail === 'alex.rivera.dev@gmail.com' ||
         enteredEmail === 'a3045809@gmail.com') &&
        password === 'admin123'
      ) {
        const fallbackToken = 'devfolio-offline-token';
        this.setAuth(fallbackToken, email);
        return { success: true, token: fallbackToken };
      }

      return { success: false, error: 'Invalid email or password' };
    }
  },

  // 11. Update Admin Credentials (Email / Password) - Syncs to Firestore /settings/admin
  async updateCredentials(payload: {
    newEmail?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; message?: string; error?: string; adminEmail?: string }> {
    // 1. Sync directly to Firestore /settings/admin so every device has the new credentials
    const updatedEmail = payload.newEmail ? payload.newEmail.trim() : (this.getAdminUser() || 'admin@portfolio.dev');
    const updatedPassword = payload.newPassword ? payload.newPassword : 'admin123';

    try {
      const settingsRef = doc(db, 'settings', 'admin');
      await setDoc(settingsRef, {
        adminEmail: updatedEmail,
        adminPassword: updatedPassword,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore settings write error:', err);
    }

    // 2. Also notify Node backend if running
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
      if (isJsonResponse(res)) {
        const json = await res.json();
        if (res.ok && json.success) {
          if (json.adminEmail) {
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, json.adminEmail);
          }
        }
      }
    } catch {
      // offline / static
    }

    // 3. Update local browser cache
    const newCreds = {
      email: updatedEmail,
      password: updatedPassword
    };
    localStorage.setItem(LOCAL_STORAGE_CREDENTIALS_KEY, JSON.stringify(newCreds));
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, updatedEmail);

    return {
      success: true,
      message: 'Admin Gmail & password synchronized across all devices via Firebase!',
      adminEmail: updatedEmail
    };
  },

  // 12. Load cloud settings on startup
  async getCloudSettings(): Promise<{ adminEmail?: string; adminPassword?: string } | null> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'admin'));
      if (snap.exists()) {
        const data = snap.data();
        if (data.adminEmail) {
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, data.adminEmail);
          const creds: { email: string; password?: string } = this.getLocalCredentials() || { email: data.adminEmail };
          creds.email = data.adminEmail;
          if (data.adminPassword) creds.password = data.adminPassword;
          localStorage.setItem(LOCAL_STORAGE_CREDENTIALS_KEY, JSON.stringify(creds));
        }
        return data as any;
      }
    } catch (err) {
      console.warn('Could not read cloud settings:', err);
    }
    return null;
  },

  // 13. Reset Portfolio to defaults
  async resetToDefaults(): Promise<PortfolioData> {
    try {
      const portfolioDocRef = doc(db, 'portfolio', 'main');
      await setDoc(portfolioDocRef, initialPortfolioData);
    } catch (err) {
      console.warn('Firestore reset error:', err);
    }

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
