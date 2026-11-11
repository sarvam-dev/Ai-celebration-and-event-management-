/**
 * Real Cloud Storage Client SDK for Event Studio
 * Communicates with the Cloud Run server-side persistent master store
 * Replaces browser localStorage with encrypted cloud data storage
 */

import { AuthUser, EventSetupData, ExpenseRecord, GuestRecord, StaffRecord, CategoryAllocation, ProblemScenario, VenueOption } from '../types';

export interface CloudEventStatePayload {
  eventData: EventSetupData;
  totalBudget: number;
  expenses: ExpenseRecord[];
  guestList: GuestRecord[];
  staffRoster: StaffRecord[];
  categoryAllocations: CategoryAllocation[];
  scenarios: ProblemScenario[];
  selectedVenue: VenueOption | null;
  turnstileGates: number;
  secondsPerGuest: number;
  activeScreenIndex?: number;
  lastUpdated?: string;
  checksum?: string;
}

export interface CloudStorageStatusResponse {
  success: boolean;
  provider: string;
  storageType: string;
  status: 'connected' | 'offline' | 'syncing' | 'error';
  totalUsers: number;
  lastSyncTime: string;
  storageSizeBytes: number;
  activeSessionUser?: string;
  securityProtocol: string;
}

const TOKEN_KEY = 'event_studio_cloud_token';

export function getStoredCloudToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

export function setStoredCloudToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function removeStoredCloudToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
}

/**
 * Real Cloud Login
 */
export async function cloudLogin(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/cloud/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.token) {
      setStoredCloudToken(data.token);
      return { success: true, user: data.user, token: data.token };
    }
    return { success: false, error: data.error || 'Authentication failed' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error connecting to Cloud Storage' };
  }
}

/**
 * Real Cloud Registration
 */
export async function cloudRegister(
  name: string,
  email: string,
  password: string,
  role: AuthUser['role']
): Promise<{ success: boolean; user?: AuthUser; token?: string; error?: string }> {
  try {
    const res = await fetch('/api/cloud/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), password, role }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.token) {
      setStoredCloudToken(data.token);
      return { success: true, user: data.user, token: data.token };
    }
    return { success: false, error: data.error || 'Cloud account creation failed' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error connecting to Cloud Storage' };
  }
}

/**
 * Verify Current Cloud Session
 */
export async function cloudGetProfile(token?: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const activeToken = token || getStoredCloudToken();
  if (!activeToken) {
    return { success: false, error: 'No active cloud session token' };
  }
  try {
    const res = await fetch('/api/cloud/auth/me', {
      headers: {
        'Authorization': `Bearer ${activeToken}`,
      },
    });
    const data = await res.json();
    if (res.ok && data.success && data.user) {
      return { success: true, user: data.user };
    }
    return { success: false, error: data.error || 'Invalid session' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to verify session' };
  }
}

/**
 * Cloud Logout
 */
export async function cloudLogout(token?: string): Promise<void> {
  const activeToken = token || getStoredCloudToken();
  if (activeToken) {
    try {
      await fetch('/api/cloud/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
        },
      });
    } catch {}
  }
  removeStoredCloudToken();
}

/**
 * Save Event State to Real Cloud Storage
 */
export async function cloudSaveEventState(
  payload: CloudEventStatePayload,
  token?: string
): Promise<{ success: boolean; lastUpdated?: string; checksum?: string; error?: string }> {
  const activeToken = token || getStoredCloudToken();
  try {
    const res = await fetch('/api/cloud/storage/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return {
        success: true,
        lastUpdated: data.lastUpdated,
        checksum: data.checksum,
      };
    }
    return { success: false, error: data.error || 'Failed to save to cloud storage' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error during cloud save' };
  }
}

/**
 * Load Event State from Real Cloud Storage
 */
export async function cloudLoadEventState(
  token?: string
): Promise<{ success: boolean; data?: CloudEventStatePayload; error?: string }> {
  const activeToken = token || getStoredCloudToken();
  try {
    const res = await fetch('/api/cloud/storage/event', {
      headers: {
        ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {}),
      },
    });
    const data = await res.json();
    if (res.ok && data.success && data.eventState) {
      return { success: true, data: data.eventState };
    }
    return { success: false, error: data.error || 'No remote cloud data found' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error loading cloud data' };
  }
}

/**
 * Get Cloud Storage Health & Metrics
 */
export async function cloudGetStorageStatus(): Promise<CloudStorageStatusResponse | null> {
  try {
    const activeToken = getStoredCloudToken();
    const res = await fetch('/api/cloud/storage/status', {
      headers: {
        ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {}),
      },
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch {
    return null;
  }
}
