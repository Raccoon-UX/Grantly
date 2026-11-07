import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GrantlyStorage, safeGet, safeSet, STORAGE_KEYS } from '@/lib/storage';
import { z } from 'zod';

// Mock localStorage for Node test runner
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

describe('Grantly Storage & Zod Resilient Deserialization', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Setup global window mock
    (global as any).window = {
      localStorage: localStorageMock,
      dispatchEvent: vi.fn(),
    };
  });

  describe('safeGet resilient parsing', () => {
    it('returns defaultValue when key does not exist', () => {
      const val = safeGet('non_existent_key', { fallback: true });
      expect(val).toEqual({ fallback: true });
    });

    it('returns parsed object when valid JSON exists', () => {
      window.localStorage.setItem('test_key', JSON.stringify({ name: 'Valid' }));
      const val = safeGet('test_key', { name: 'Default' });
      expect(val).toEqual({ name: 'Valid' });
    });

    it('recovers from corrupted JSON and returns default fallback without throwing', () => {
      window.localStorage.setItem('corrupted_key', '{ invalid json syntax !!!');
      const val = safeGet('corrupted_key', { safe: true });
      expect(val).toEqual({ safe: true });
    });

    it('enforces Zod schema validation and returns default fallback on schema mismatch', () => {
      const SimpleSchema = z.object({
        count: z.number(),
        title: z.string(),
      });

      // Data has string count instead of number, violating schema
      window.localStorage.setItem(
        'schema_mismatch_key',
        JSON.stringify({ count: 'not-a-number', title: 'Test' })
      );

      const val = safeGet(
        'schema_mismatch_key',
        { count: 0, title: 'Fallback' },
        SimpleSchema
      );
      expect(val).toEqual({ count: 0, title: 'Fallback' });
    });
  });

  describe('GrantlyStorage business operations', () => {
    it('loads default demo profile if storage is empty', () => {
      const profile = GrantlyStorage.getProfile();
      expect(profile).toBeDefined();
      expect(profile.fullName).toBe('Aarav Sharma');
      expect(profile.stream).toBe('Engineering & Technology');
    });

    it('updates and persists partial profile updates', () => {
      GrantlyStorage.updateProfile({ fullName: 'Updated Student Name' });
      const updated = GrantlyStorage.getProfile();
      expect(updated.fullName).toBe('Updated Student Name');
      // Preserves existing fields
      expect(updated.stream).toBe('Engineering & Technology');
    });

    it('toggles bookmarks (saved IDs) accurately', () => {
      const idToToggle = 'grant-test-bookmark';
      const initialSaved = GrantlyStorage.isSaved(idToToggle);

      const nowSaved = GrantlyStorage.toggleSaved(idToToggle);
      expect(nowSaved).toBe(!initialSaved);
      expect(GrantlyStorage.isSaved(idToToggle)).toBe(true);

      const untoggled = GrantlyStorage.toggleSaved(idToToggle);
      expect(untoggled).toBe(false);
      expect(GrantlyStorage.isSaved(idToToggle)).toBe(false);
    });

    it('updates application tracker status and calculates progress percent', () => {
      const app = GrantlyStorage.updateApplicationStatus(
        'grant-01',
        'Ready to Apply',
        'Documents verified by office'
      );
      expect(app.scholarshipId).toBe('grant-01');
      expect(app.status).toBe('Ready to Apply');
      expect(app.progressPercent).toBe(65);
      expect(app.notes).toBe('Documents verified by office');

      // Update to Applied
      const approvedApp = GrantlyStorage.updateApplicationStatus('grant-01', 'Approved');
      expect(approvedApp.status).toBe('Approved');
      expect(approvedApp.progressPercent).toBe(100);
    });

    it('toggles document readiness checklist state', () => {
      const docs = GrantlyStorage.getDocuments();
      expect(docs.length).toBeGreaterThan(0);
      const targetDoc = docs[0];
      const initialStatus = targetDoc.status;

      const updatedDocs = GrantlyStorage.toggleDocumentStatus(targetDoc.id);
      const updatedDoc = updatedDocs.find((d) => d.id === targetDoc.id);
      expect(updatedDoc?.status).not.toBe(initialStatus);
    });

    it('resets all data back to demo defaults', () => {
      GrantlyStorage.updateProfile({ fullName: 'Temporary Mutation' });
      GrantlyStorage.resetAllDemoData();
      const profile = GrantlyStorage.getProfile();
      expect(profile.fullName).toBe('Aarav Sharma');
    });
  });
});
