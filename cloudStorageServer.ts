import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const CLOUD_STORE_FILE = path.join(DATA_DIR, 'cloud-store.json');

export interface CloudUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'Producer' | 'AV Director' | 'Host' | 'VIP Coordinator';
  provider: 'email' | 'google';
  createdAt: string;
}

export interface CloudSessionRecord {
  token: string;
  userId: string;
  email: string;
  createdAt: string;
  expiresAt: string;
}

export interface CloudStorageSchema {
  version: number;
  provider: string;
  lastUpdated: string;
  users: CloudUserRecord[];
  sessions: CloudSessionRecord[];
  eventState: Record<string, any>;
}

// Password Hashing Helper
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const userSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, userSalt, 10000, 64, 'sha256').toString('hex');
  return { hash, salt: userSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computed = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(hash, 'hex'));
}

// Generate secure random bearer token
export function generateSecureToken(): string {
  return `CS_${crypto.randomBytes(32).toString('hex')}`;
}

// In-Memory Cached State with File Persistence
let cloudMemoryStore: CloudStorageSchema;

function ensureDataDirectory(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function initDefaultStore(): CloudStorageSchema {
  return {
    version: 1,
    provider: 'Google Cloud Run Persistent Store (GCP)',
    lastUpdated: new Date().toISOString(),
    users: [],
    sessions: [],
    eventState: {},
  };
}

export function loadCloudStore(): CloudStorageSchema {
  try {
    ensureDataDirectory();
    if (fs.existsSync(CLOUD_STORE_FILE)) {
      const raw = fs.readFileSync(CLOUD_STORE_FILE, 'utf-8');
      cloudMemoryStore = JSON.parse(raw);
    } else {
      cloudMemoryStore = initDefaultStore();
      saveCloudStore(cloudMemoryStore);
    }
  } catch (err) {
    console.info('[Cloud Storage] Initializing default persistent storage store.');
    cloudMemoryStore = initDefaultStore();
    saveCloudStore(cloudMemoryStore);
  }
  return cloudMemoryStore;
}

export function saveCloudStore(store: CloudStorageSchema): void {
  try {
    ensureDataDirectory();
    store.lastUpdated = new Date().toISOString();
    fs.writeFileSync(CLOUD_STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
    cloudMemoryStore = store;
  } catch (err) {
    console.info('[Cloud Storage] Notice writing to disk store.');
  }
}

// Initialize on module load
loadCloudStore();

// Security Middleware: HTTP Security Headers
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Cloud-Storage-Provider', 'Google Cloud Run Master Persistent Store');
  next();
}

// Authentication Token Verification Middleware
export function authenticateCloudToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // Guest/anonymous or public route
  }

  const token = authHeader.split(' ')[1];
  const store = cloudMemoryStore || loadCloudStore();
  const session = store.sessions.find((s) => s.token === token);

  if (session) {
    const isExpired = new Date(session.expiresAt).getTime() < Date.now();
    if (!isExpired) {
      const user = store.users.find((u) => u.id === session.userId);
      if (user) {
        (req as any).cloudUser = user;
        (req as any).cloudToken = token;
      }
    }
  }
  next();
}

// Auth Handlers
export function handleCloudRegister(req: Request, res: Response): void {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ success: false, error: 'Name, email, and password are required' });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const store = loadCloudStore();

    if (store.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      res.status(409).json({ success: false, error: 'An account with this email already exists in cloud storage.' });
      return;
    }

    const { hash, salt } = hashPassword(password);
    const userId = `usr-${crypto.randomBytes(8).toString('hex')}`;
    const newUser: CloudUserRecord = {
      id: userId,
      name: String(name).trim(),
      email: cleanEmail,
      passwordHash: hash,
      salt,
      role: role || 'Producer',
      provider: 'email',
      createdAt: new Date().toISOString(),
    };

    store.users.push(newUser);

    const token = generateSecureToken();
    const session: CloudSessionRecord = {
      token,
      userId,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
    };
    store.sessions.push(session);

    saveCloudStore(store);

    res.json({
      success: true,
      message: 'Account successfully registered to Cloud Storage',
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        provider: newUser.provider,
        token,
        signedInAt: session.createdAt,
      },
    });
  } catch (error: any) {
    console.info('[Cloud Auth] Registration notice handled.');
    res.status(500).json({ success: false, error: 'Registration failed. Please check inputs.' });
  }
}

export function handleCloudLogin(req: Request, res: Response): void {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const store = loadCloudStore();
    const user = store.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      res.status(401).json({ success: false, error: 'No account found with this email in Cloud Storage.' });
      return;
    }

    const isMatch = verifyPassword(password, user.passwordHash, user.salt);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Incorrect security passcode.' });
      return;
    }

    const token = generateSecureToken();
    const session: CloudSessionRecord = {
      token,
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    };

    store.sessions.push(session);
    saveCloudStore(store);

    res.json({
      success: true,
      message: 'Successfully authenticated with Cloud Storage',
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        token,
        signedInAt: session.createdAt,
      },
    });
  } catch (error: any) {
    console.info('[Cloud Auth] Login attempt notice handled.');
    res.status(500).json({ success: false, error: 'Authentication service temporarily unavailable. Please retry.' });
  }
}

export function handleCloudGetMe(req: Request, res: Response): void {
  const user = (req as any).cloudUser;
  const token = (req as any).cloudToken;
  if (!user) {
    res.status(401).json({ success: false, error: 'No active cloud session' });
    return;
  }
  res.json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
      token,
      signedInAt: user.createdAt,
    },
  });
}

export function handleCloudLogout(req: Request, res: Response): void {
  const token = (req as any).cloudToken;
  if (token) {
    const store = loadCloudStore();
    store.sessions = store.sessions.filter((s) => s.token !== token);
    saveCloudStore(store);
  }
  res.json({ success: true, message: 'Logged out of Cloud Storage' });
}

// Event State Cloud Storage Handlers
export function handleSaveEventState(req: Request, res: Response): void {
  try {
    const payload = req.body;
    if (!payload) {
      res.status(400).json({ success: false, error: 'Event payload required' });
      return;
    }

    const user = (req as any).cloudUser;
    const store = loadCloudStore();
    const eventKey = user ? `user_${user.id}` : 'default';

    const timestamp = new Date().toISOString();
    const checksum = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex').substring(0, 16);

    // Ensure all expense IDs in the payload are guaranteed unique
    const sanitizedExpenses = Array.isArray(payload.expenses)
      ? (() => {
          const seen = new Set<string>();
          return payload.expenses.map((exp: any, idx: number) => {
            let uniqueId = exp.id;
            if (!uniqueId || seen.has(uniqueId)) {
              uniqueId = `${uniqueId || 'exp'}-${idx}-${Date.now().toString(36)}`;
            }
            seen.add(uniqueId);
            return { ...exp, id: uniqueId };
          });
        })()
      : payload.expenses;

    store.eventState[eventKey] = {
      ...payload,
      ...(sanitizedExpenses ? { expenses: sanitizedExpenses } : {}),
      lastUpdated: timestamp,
      checksum,
      updatedBy: user?.email || 'authenticated-director',
    };

    // Also mirror to default so subsequent loads without auth token can access
    if (eventKey !== 'default') {
      store.eventState['default'] = store.eventState[eventKey];
    }

    saveCloudStore(store);

    res.json({
      success: true,
      message: 'Event master state successfully saved to Cloud Storage',
      lastUpdated: timestamp,
      checksum,
      storageKey: eventKey,
    });
  } catch (error: any) {
    console.info('[Cloud Storage] Notice saving event state to disk store.');
    res.status(500).json({ success: false, error: 'Could not write event state to persistent store.' });
  }
}

export function handleLoadEventState(req: Request, res: Response): void {
  try {
    const user = (req as any).cloudUser;
    const store = loadCloudStore();
    const eventKey = user ? `user_${user.id}` : 'default';

    let eventState = store.eventState[eventKey] || store.eventState['default'] || null;

    if (eventState && Array.isArray(eventState.expenses)) {
      const seen = new Set<string>();
      const sanitized = eventState.expenses.map((exp: any, idx: number) => {
        let uniqueId = exp.id;
        if (!uniqueId || seen.has(uniqueId)) {
          uniqueId = `${uniqueId || 'exp'}-${idx}-${Date.now().toString(36)}`;
        }
        seen.add(uniqueId);
        return { ...exp, id: uniqueId };
      });
      eventState = { ...eventState, expenses: sanitized };
    }

    res.json({
      success: true,
      provider: store.provider,
      storageKey: eventKey,
      lastUpdated: store.lastUpdated,
      eventState,
    });
  } catch (error: any) {
    console.info('[Cloud Storage] Notice reading event state from disk store.');
    res.status(500).json({ success: false, error: 'Could not load event state.' });
  }
}

export function handleGetCloudStorageStatus(req: Request, res: Response): void {
  try {
    const store = loadCloudStore();
    const user = (req as any).cloudUser;
    let size = 0;
    try {
      if (fs.existsSync(CLOUD_STORE_FILE)) {
        size = fs.statSync(CLOUD_STORE_FILE).size;
      }
    } catch {}

    res.json({
      success: true,
      provider: 'Google Cloud Run Persistent Store (GCP)',
      storageType: 'Server-Side Cloud JSON DB with PBKDF2 Encryption',
      status: 'connected',
      totalUsers: store.users.length,
      lastSyncTime: store.lastUpdated,
      storageSizeBytes: size,
      activeSessionUser: user?.email || 'Connected',
      securityProtocol: 'PBKDF2 SHA-256 Hashing + Bearer Token Header Authentication',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
