import { describe, it, expect } from 'vitest';
import {
  cn,
  formatCurrencyINR,
  formatDate,
  getDaysRemaining,
  sanitizeExternalUrl,
} from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn (Tailwind Merge)', () => {
    it('merges class names correctly', () => {
      expect(cn('px-2 py-1', 'bg-blue-500')).toBe('px-2 py-1 bg-blue-500');
    });

    it('resolves conflicting Tailwind utility classes', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('handles conditional falsy values', () => {
      expect(cn('base-class', false && 'hidden', null, undefined, 'active')).toBe(
        'base-class active'
      );
    });
  });

  describe('formatCurrencyINR', () => {
    it('returns "Free / Nil" when amount is 0', () => {
      expect(formatCurrencyINR(0)).toBe('Free / Nil');
    });

    it('formats positive values with INR currency and commas', () => {
      const formatted = formatCurrencyINR(120000);
      expect(formatted).toContain('1,20,000');
      expect(formatted).toMatch(/₹|INR/);
    });

    it('formats small and large amounts properly', () => {
      expect(formatCurrencyINR(5000)).toContain('5,000');
      expect(formatCurrencyINR(1000000)).toContain('10,00,000');
    });
  });

  describe('formatDate', () => {
    it('formats valid ISO date strings in Indian English locale', () => {
      const formatted = formatDate('2026-12-15');
      expect(formatted).toContain('2026');
      expect(formatted).toContain('Dec');
      expect(formatted).toContain('15');
    });

    it('gracefully returns raw string if date is invalid', () => {
      expect(formatDate('invalid-date-string')).toBe('invalid-date-string');
    });
  });

  describe('getDaysRemaining', () => {
    it('calculates positive days for future dates', () => {
      const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
      const days = getDaysRemaining(future);
      expect(days).toBeGreaterThanOrEqual(9);
      expect(days).toBeLessThanOrEqual(11);
    });

    it('calculates negative or zero days for past dates', () => {
      const past = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
      const days = getDaysRemaining(past);
      expect(days).toBeLessThanOrEqual(0);
    });
  });

  describe('sanitizeExternalUrl', () => {
    it('allows valid HTTPS URLs', () => {
      expect(sanitizeExternalUrl('https://scholarships.gov.in')).toBe(
        'https://scholarships.gov.in'
      );
    });

    it('allows valid HTTP URLs', () => {
      expect(sanitizeExternalUrl('http://example.org/grant')).toBe(
        'http://example.org/grant'
      );
    });

    it('rejects javascript: pseudo-protocol vectors', () => {
      expect(sanitizeExternalUrl('javascript:alert(document.cookie)')).toBeNull();
      expect(sanitizeExternalUrl('javascript://%0aalert(1)')).toBeNull();
    });

    it('rejects data: URLs and file: protocols', () => {
      expect(sanitizeExternalUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
      expect(sanitizeExternalUrl('file:///etc/passwd')).toBeNull();
    });

    it('returns null for null, undefined, or empty strings', () => {
      expect(sanitizeExternalUrl(null)).toBeNull();
      expect(sanitizeExternalUrl(undefined)).toBeNull();
      expect(sanitizeExternalUrl('')).toBeNull();
      expect(sanitizeExternalUrl('   ')).toBeNull();
    });

    it('returns null for malformed URLs', () => {
      expect(sanitizeExternalUrl('not a valid url')).toBeNull();
      expect(sanitizeExternalUrl('htp:/bad')).toBeNull();
    });
  });
});
