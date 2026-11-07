'use client';

import {
  Scholarship,
  StudentProfile,
  DocumentItem,
  ApplicationRecord,
  ApplicationStatus,
} from '@/types';
import { DEMO_SCHOLARSHIPS } from '@/data/scholarships';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_DOCUMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_SAVED_SCHOLARSHIPS,
} from '@/data/demo-profile';

const STORAGE_KEYS = {
  SCHOLARSHIPS: 'grantly_scholarships_v1',
  PROFILE: 'grantly_profile_v1',
  DOCUMENTS: 'grantly_documents_v1',
  APPLICATIONS: 'grantly_applications_v1',
  SAVED: 'grantly_saved_v1',
  THEME: 'grantly_theme_v1',
  NOTIFICATION_PREFS: 'grantly_notifs_v1',
};

function safeGet<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[GrantlyStorage] Error parsing key ${key}:`, err);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('grantly_storage_change', { detail: { key } }));
  } catch (err) {
    console.error(`[GrantlyStorage] Error saving key ${key}:`, err);
  }
}

export const GrantlyStorage = {
  // Scholarships
  getScholarships(): Scholarship[] {
    const stored = safeGet<Scholarship[]>(STORAGE_KEYS.SCHOLARSHIPS, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.SCHOLARSHIPS, DEMO_SCHOLARSHIPS);
      return DEMO_SCHOLARSHIPS;
    }
    return stored;
  },

  getScholarshipById(id: string): Scholarship | undefined {
    const list = this.getScholarships();
    return list.find((s) => s.id === id);
  },

  // Student Profile
  getProfile(): StudentProfile {
    return safeGet<StudentProfile>(STORAGE_KEYS.PROFILE, INITIAL_STUDENT_PROFILE);
  },

  updateProfile(profile: Partial<StudentProfile>): StudentProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    safeSet(STORAGE_KEYS.PROFILE, updated);
    return updated;
  },

  // Saved / Bookmarked Scholarships
  getSavedIds(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.SAVED, INITIAL_SAVED_SCHOLARSHIPS);
  },

  isSaved(id: string): boolean {
    const saved = this.getSavedIds();
    return saved.includes(id);
  },

  toggleSaved(id: string): boolean {
    const current = this.getSavedIds();
    let updated: string[];
    let nowSaved: boolean;
    if (current.includes(id)) {
      updated = current.filter((item) => item !== id);
      nowSaved = false;
    } else {
      updated = [...current, id];
      nowSaved = true;
    }
    safeSet(STORAGE_KEYS.SAVED, updated);
    return nowSaved;
  },

  // Applications
  getApplications(): ApplicationRecord[] {
    return safeGet<ApplicationRecord[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },

  getApplicationByScholarshipId(scholarshipId: string): ApplicationRecord | undefined {
    const apps = this.getApplications();
    return apps.find((a) => a.scholarshipId === scholarshipId);
  },

  updateApplicationStatus(
    scholarshipId: string,
    status: ApplicationStatus,
    notes?: string
  ): ApplicationRecord {
    const apps = this.getApplications();
    const existingIndex = apps.findIndex((a) => a.scholarshipId === scholarshipId);

    const progressMap: Record<ApplicationStatus, number> = {
      Saved: 10,
      Preparing: 30,
      'Ready to Apply': 65,
      Applied: 85,
      'Under Review': 90,
      Approved: 100,
      Rejected: 100,
    };

    const now = new Date().toISOString().split('T')[0];

    if (existingIndex >= 0) {
      const existing = apps[existingIndex];
      const updated: ApplicationRecord = {
        ...existing,
        status,
        progressPercent: progressMap[status],
        lastUpdated: now,
        notes: notes !== undefined ? notes : existing.notes,
        appliedDate: status === 'Applied' && !existing.appliedDate ? now : existing.appliedDate,
      };
      apps[existingIndex] = updated;
      safeSet(STORAGE_KEYS.APPLICATIONS, apps);
      return updated;
    } else {
      const newApp: ApplicationRecord = {
        id: `app-${Date.now()}`,
        scholarshipId,
        status,
        progressPercent: progressMap[status],
        appliedDate: status === 'Applied' ? now : undefined,
        lastUpdated: now,
        notes: notes || 'Application initiated by student.',
        documentsAttached: ['Aadhaar Card'],
        reminderSet: true,
      };
      apps.unshift(newApp);
      safeSet(STORAGE_KEYS.APPLICATIONS, apps);
      return newApp;
    }
  },

  // Documents Checklist
  getDocuments(): DocumentItem[] {
    return safeGet<DocumentItem[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  },

  toggleDocumentStatus(id: string): DocumentItem[] {
    const docs = this.getDocuments();
    const updated: DocumentItem[] = docs.map((d) => {
      if (d.id === id) {
        const nextStatus: 'ready' | 'pending' = d.status === 'ready' ? 'pending' : 'ready';
        return {
          ...d,
          status: nextStatus,
          lastUpdated: nextStatus === 'ready' ? new Date().toISOString().split('T')[0] : d.lastUpdated,
          fileName: nextStatus === 'ready' && !d.fileName ? `${d.title.replace(/\s+/g, '_')}.pdf` : d.fileName,
          fileSize: nextStatus === 'ready' && !d.fileSize ? '640 KB' : d.fileSize,
        };
      }
      return d;
    });
    safeSet(STORAGE_KEYS.DOCUMENTS, updated);
    return updated;
  },

  // Reset all to demo defaults
  resetAllDemoData(): void {
    if (typeof window === 'undefined') return;
    safeSet(STORAGE_KEYS.SCHOLARSHIPS, DEMO_SCHOLARSHIPS);
    safeSet(STORAGE_KEYS.PROFILE, INITIAL_STUDENT_PROFILE);
    safeSet(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    safeSet(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    safeSet(STORAGE_KEYS.SAVED, INITIAL_SAVED_SCHOLARSHIPS);
  },
};
