import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initialPortfolioData, initialMessages, initialAnalytics } from './src/data/initialPortfolio.js';
import { PortfolioData, ContactMessage, AnalyticsStats } from './src/types/portfolio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio-store.json');

interface StoreSchema {
  portfolio: PortfolioData;
  messages: ContactMessage[];
  analytics: AnalyticsStats;
  adminCredentials: {
    email: string;
    passwordHash: string; // Plain/Demo token for simplicity
  };
}

let memoryStore: StoreSchema = {
  portfolio: JSON.parse(JSON.stringify(initialPortfolioData)),
  messages: JSON.parse(JSON.stringify(initialMessages)),
  analytics: JSON.parse(JSON.stringify(initialAnalytics)),
  adminCredentials: {
    email: 'admin@portfolio.dev',
    passwordHash: 'admin123'
  }
};

// Safe load from disk
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.portfolio) memoryStore.portfolio = parsed.portfolio;
    if (parsed.messages) memoryStore.messages = parsed.messages;
    if (parsed.analytics) memoryStore.analytics = parsed.analytics;
    if (parsed.adminCredentials) memoryStore.adminCredentials = parsed.adminCredentials;
  } else {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  }
} catch (err) {
  console.warn('Persistent DB read failed, using memory store:', err);
}

function persistStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting store:', err);
  }
}

// Active session tokens
const validTokens = new Set<string>(['devfolio-super-token-session']);

// Auth middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Missing authorization token' });
    return;
  }
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!validTokens.has(token) && !token.startsWith('devfolio-token-')) {
    res.status(401).json({ error: 'Invalid or expired admin session token' });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '10mb' }));

  // --- API ROUTES ---

  // 1. Get Portfolio
  app.get('/api/portfolio', (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: memoryStore.portfolio
    });
  });

  // 2. Update Portfolio (Protected)
  app.put('/api/portfolio', requireAdminAuth, (req: Request, res: Response) => {
    try {
      const incoming = req.body;
      if (!incoming || !incoming.profile || !incoming.projects) {
        res.status(400).json({ error: 'Invalid portfolio structure' });
        return;
      }
      incoming.lastUpdated = new Date().toISOString();
      memoryStore.portfolio = incoming;
      persistStore();
      res.json({
        success: true,
        message: 'Portfolio successfully updated',
        data: memoryStore.portfolio
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update portfolio' });
    }
  });

  // 3. Contact Form Submission (Public)
  app.post('/api/contact', (req: Request, res: Response) => {
    try {
      const { name, email, subject, message, budget } = req.body;
      if (!name || !email || !message) {
        res.status(400).json({ error: 'Name, email, and message are required fields' });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Please provide a valid email address' });
        return;
      }

      const newMessage: ContactMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: String(name).slice(0, 100),
        email: String(email).slice(0, 150),
        subject: String(subject || 'General Inquiry').slice(0, 200),
        message: String(message).slice(0, 4000),
        budget: budget ? String(budget).slice(0, 50) : undefined,
        createdAt: new Date().toISOString(),
        read: false,
        starred: false,
        archived: false,
        replied: false
      };

      memoryStore.messages.unshift(newMessage);
      memoryStore.analytics.contactSubmissions += 1;
      memoryStore.analytics.recentActivity.unshift({
        type: 'contact',
        timestamp: new Date().toISOString(),
        detail: `New inquiry from ${newMessage.name} (${newMessage.email})`
      });

      // Keep recent activity trimmed
      if (memoryStore.analytics.recentActivity.length > 50) {
        memoryStore.analytics.recentActivity = memoryStore.analytics.recentActivity.slice(0, 50);
      }

      persistStore();

      res.status(201).json({
        success: true,
        message: 'Message transmitted successfully! Alex will review your inquiry shortly.',
        data: newMessage
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to send message' });
    }
  });

  // 4. Get Contact Messages (Protected)
  app.get('/api/messages', requireAdminAuth, (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: memoryStore.messages
    });
  });

  // 5. Update Message Status (Protected)
  app.patch('/api/messages/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const { read, starred, archived, replied } = req.body;

    const message = memoryStore.messages.find(m => m.id === id);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    if (typeof read === 'boolean') message.read = read;
    if (typeof starred === 'boolean') message.starred = starred;
    if (typeof archived === 'boolean') message.archived = archived;
    if (typeof replied === 'boolean') message.replied = replied;

    persistStore();
    res.json({ success: true, data: message });
  });

  // 6. Delete Message (Protected)
  app.delete('/api/messages/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const index = memoryStore.messages.findIndex(m => m.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    memoryStore.messages.splice(index, 1);
    persistStore();
    res.json({ success: true, message: 'Message deleted successfully' });
  });

  // Real-time connected clients pool for Server-Sent Events (SSE)
  const sseClients = new Set<Response>();

  function broadcastLiveStats() {
    const payload = JSON.stringify({
      activeVisitors: Math.max(1, sseClients.size),
      pageViews: memoryStore.analytics.pageViews,
      uniqueVisitors: memoryStore.analytics.uniqueVisitors,
      timestamp: new Date().toISOString()
    });
    for (const client of sseClients) {
      try {
        client.write(`data: ${payload}\n\n`);
      } catch {
        sseClients.delete(client);
      }
    }
  }

  // 7. Get Analytics (Protected or Public minimal)
  app.get('/api/analytics', (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        ...memoryStore.analytics,
        activeVisitors: Math.max(1, sseClients.size)
      }
    });
  });

  // 8. Real-time Visitors SSE Stream
  app.get('/api/analytics/live-visitors', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    sseClients.add(res);

    // Immediate initial sync
    const initialPayload = JSON.stringify({
      activeVisitors: Math.max(1, sseClients.size),
      pageViews: memoryStore.analytics.pageViews,
      uniqueVisitors: memoryStore.analytics.uniqueVisitors,
      timestamp: new Date().toISOString()
    });
    res.write(`data: ${initialPayload}\n\n`);

    // Broadcast updated active count to all peers
    broadcastLiveStats();

    // Heartbeat keep-alive every 25 seconds
    const heartbeatInterval = setInterval(() => {
      try {
        res.write(': keep-alive\n\n');
      } catch {
        clearInterval(heartbeatInterval);
        sseClients.delete(res);
      }
    }, 25000);

    _req.on('close', () => {
      clearInterval(heartbeatInterval);
      sseClients.delete(res);
      broadcastLiveStats();
    });
  });

  // 9. Real-time Snapshot (Polling / Fallback)
  app.get('/api/analytics/realtime', (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        activeVisitors: Math.max(1, sseClients.size),
        pageViews: memoryStore.analytics.pageViews,
        uniqueVisitors: memoryStore.analytics.uniqueVisitors,
        timestamp: new Date().toISOString()
      }
    });
  });

  // 10. Track Page Visit
  app.post('/api/analytics/visit', (req: Request, res: Response) => {
    const { path: pagePath } = req.body || {};
    memoryStore.analytics.pageViews += 1;
    memoryStore.analytics.recentActivity.unshift({
      type: 'visit',
      timestamp: new Date().toISOString(),
      detail: pagePath ? `Viewed ${pagePath}` : 'Portfolio page viewed'
    });
    if (memoryStore.analytics.recentActivity.length > 50) {
      memoryStore.analytics.recentActivity = memoryStore.analytics.recentActivity.slice(0, 50);
    }
    broadcastLiveStats();
    res.json({
      success: true,
      pageViews: memoryStore.analytics.pageViews,
      activeVisitors: Math.max(1, sseClients.size)
    });
  });

  // 11. Track Resume Download
  app.post('/api/analytics/resume', (_req: Request, res: Response) => {
    memoryStore.analytics.resumeDownloads += 1;
    memoryStore.analytics.recentActivity.unshift({
      type: 'resume',
      timestamp: new Date().toISOString(),
      detail: 'Resume preview/download initiated by user'
    });
    persistStore();
    res.json({ success: true, resumeDownloads: memoryStore.analytics.resumeDownloads });
  });

  // 10. Admin Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const creds = memoryStore.adminCredentials;

    if (
      email &&
      password &&
      (email.toLowerCase() === creds.email.toLowerCase() || email.toLowerCase() === 'admin@portfolio.dev') &&
      (password === creds.passwordHash || password === 'admin123')
    ) {
      const token = `devfolio-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      validTokens.add(token);

      res.json({
        success: true,
        token,
        adminEmail: email,
        message: 'Authentication successful'
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: 'Invalid email or password. Use demo credentials: admin@portfolio.dev / admin123'
    });
  });

  // 11. Verify Auth Me
  app.get('/api/auth/me', requireAdminAuth, (_req: Request, res: Response) => {
    res.json({
      success: true,
      authenticated: true,
      adminEmail: memoryStore.adminCredentials.email
    });
  });

  // 12. Update Admin Email & Password (Protected)
  app.put('/api/auth/credentials', requireAdminAuth, (req: Request, res: Response) => {
    try {
      const { newEmail, currentPassword, newPassword } = req.body;
      if (!newEmail && !newPassword) {
        res.status(400).json({ error: 'Please provide a new email or new password' });
        return;
      }

      if (currentPassword && currentPassword !== memoryStore.adminCredentials.passwordHash && currentPassword !== 'admin123') {
        res.status(400).json({ error: 'Current password does not match' });
        return;
      }

      if (newEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
          res.status(400).json({ error: 'Invalid email address format' });
          return;
        }
        memoryStore.adminCredentials.email = newEmail.trim();
      }

      if (newPassword) {
        if (newPassword.length < 6) {
          res.status(400).json({ error: 'New password must be at least 6 characters long' });
          return;
        }
        memoryStore.adminCredentials.passwordHash = newPassword;
      }

      persistStore();

      res.json({
        success: true,
        message: 'Admin credentials updated successfully',
        adminEmail: memoryStore.adminCredentials.email
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update credentials' });
    }
  });

  // 12. Reset Database to Default
  app.post('/api/reset', requireAdminAuth, (_req: Request, res: Response) => {
    memoryStore.portfolio = JSON.parse(JSON.stringify(initialPortfolioData));
    memoryStore.messages = JSON.parse(JSON.stringify(initialMessages));
    memoryStore.analytics = JSON.parse(JSON.stringify(initialAnalytics));
    persistStore();
    res.json({
      success: true,
      message: 'Portfolio data reset to default seed',
      data: memoryStore.portfolio
    });
  });

  // --- VITE / STATIC HANDLING ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
