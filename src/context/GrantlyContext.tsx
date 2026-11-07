'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  Scholarship,
  StudentProfile,
  DocumentItem,
  ApplicationRecord,
  ApplicationStatus,
  SmartMatchResult,
} from '@/types';
import { GrantlyStorage } from '@/lib/storage';
import { calculateSmartMatch } from '@/lib/matching';
import { DEMO_SCHOLARSHIPS } from '@/data/scholarships';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_DOCUMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_SAVED_SCHOLARSHIPS,
} from '@/data/demo-profile';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface GrantlyContextType {
  scholarships: Scholarship[];
  profile: StudentProfile;
  savedIds: string[];
  applications: ApplicationRecord[];
  documents: DocumentItem[];
  toasts: ToastMessage[];
  isLoaded: boolean;
  
  // Actions
  toggleSaveScholarship: (id: string) => void;
  updateApplicationStatus: (scholarshipId: string, status: ApplicationStatus, notes?: string) => void;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  toggleDocumentReady: (id: string) => void;
  resetDemoData: () => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Computed helpers
  getMatchResult: (scholarship: Scholarship) => SmartMatchResult;
  stats: {
    totalScholarships: number;
    eligibleCount: number;
    savedCount: number;
    applicationsCount: number;
    approvedCount: number;
    documentsReadyCount: number;
    documentsTotalCount: number;
    profileCompletionPercent: number;
    upcomingDeadlines: Array<{ scholarship: Scholarship; daysRemaining: number }>;
  };
}

const GrantlyContext = createContext<GrantlyContextType | null>(null);

export function GrantlyProvider({ children }: { children: React.ReactNode }) {
  // Initialize with canonical seed data to guarantee zero layout shift (CLS) between SSR and hydration
  const [scholarships, setScholarships] = useState<Scholarship[]>(DEMO_SCHOLARSHIPS);
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [savedIds, setSavedIds] = useState<string[]>(INITIAL_SAVED_SCHOLARSHIPS);
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Sync state from LocalStorage on mount
  const syncFromStorage = useCallback(() => {
    setScholarships(GrantlyStorage.getScholarships());
    setProfile(GrantlyStorage.getProfile());
    setSavedIds(GrantlyStorage.getSavedIds());
    setApplications(GrantlyStorage.getApplications());
    setDocuments(GrantlyStorage.getDocuments());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    syncFromStorage();

    const handleStorageChange = () => {
      syncFromStorage();
    };

    window.addEventListener('grantly_storage_change', handleStorageChange);
    return () => {
      window.removeEventListener('grantly_storage_change', handleStorageChange);
    };
  }, [syncFromStorage]);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleSaveScholarship = useCallback(
    (id: string) => {
      const isSaved = GrantlyStorage.toggleSaved(id);
      setSavedIds(GrantlyStorage.getSavedIds());
      const s = scholarships.find((item) => item.id === id);
      showToast({
        type: isSaved ? 'success' : 'info',
        title: isSaved ? 'Saved to Bookmarks' : 'Removed from Bookmarks',
        description: s ? s.name : 'Scholarship updated in your local tracker.',
      });
    },
    [scholarships, showToast]
  );

  const updateApplicationStatus = useCallback(
    (scholarshipId: string, status: ApplicationStatus, notes?: string) => {
      GrantlyStorage.updateApplicationStatus(scholarshipId, status, notes);
      setApplications(GrantlyStorage.getApplications());
      const s = scholarships.find((item) => item.id === scholarshipId);
      showToast({
        type: status === 'Approved' ? 'success' : 'info',
        title: `Status: ${status}`,
        description: `${s ? s.name : 'Application'} tracker updated.`,
      });
    },
    [scholarships, showToast]
  );

  const updateProfile = useCallback(
    (updated: Partial<StudentProfile>) => {
      const res = GrantlyStorage.updateProfile(updated);
      setProfile(res);
      showToast({
        type: 'success',
        title: 'Profile Saved',
        description: 'Smart Match recalculations have been updated.',
      });
    },
    [showToast]
  );

  const toggleDocumentReady = useCallback(
    (id: string) => {
      const res = GrantlyStorage.toggleDocumentStatus(id);
      setDocuments(res);
      const targetDoc = res.find((d) => d.id === id);
      showToast({
        type: 'info',
        title: targetDoc?.status === 'ready' ? 'Document Marked Ready' : 'Document Marked Pending',
        description: targetDoc?.title,
      });
    },
    [showToast]
  );

  const resetDemoData = useCallback(() => {
    GrantlyStorage.resetAllDemoData();
    syncFromStorage();
    showToast({
      type: 'info',
      title: 'Demo Data Reset',
      description: 'Restored all original sample scholarships, applications, and documents.',
    });
  }, [syncFromStorage, showToast]);

  const getMatchResult = useCallback(
    (scholarship: Scholarship): SmartMatchResult => {
      return calculateSmartMatch(scholarship, profile);
    },
    [profile]
  );

  // Compute stats dynamically
  const stats = useMemo(() => {
    const totalScholarships = scholarships.length;
    let eligibleCount = 0;
    const now = new Date().getTime();

    scholarships.forEach((s) => {
      const res = calculateSmartMatch(s, profile);
      if (res.isEligible) {
        eligibleCount++;
      }
    });

    const approvedCount = applications.filter((a) => a.status === 'Approved').length;
    const docsReady = documents.filter((d) => d.status === 'ready').length;

    // Profile completion score
    let profileFilled = 0;
    const fields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.institution,
      profile.course,
      profile.stream,
      profile.academicScore,
      profile.familyIncome,
      profile.state,
      profile.gender,
      profile.category,
    ];
    fields.forEach((f) => {
      if (f !== undefined && f !== null && f !== '') profileFilled++;
    });
    const profileCompletionPercent = Math.round((profileFilled / fields.length) * 100);

    // Upcoming deadlines within 60 days
    const upcomingDeadlines = scholarships
      .map((s) => {
        const diffDays = Math.ceil((new Date(s.deadline).getTime() - now) / (1000 * 60 * 60 * 24));
        return { scholarship: s, daysRemaining: diffDays };
      })
      .filter((item) => item.daysRemaining >= 0 && item.daysRemaining <= 60)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);

    return {
      totalScholarships,
      eligibleCount,
      savedCount: savedIds.length,
      applicationsCount: applications.length,
      approvedCount,
      documentsReadyCount: docsReady,
      documentsTotalCount: documents.length,
      profileCompletionPercent,
      upcomingDeadlines,
    };
  }, [scholarships, profile, savedIds, applications, documents]);

  // Memoize context value to eliminate cascading consumer re-renders
  const contextValue = useMemo(
    () => ({
      scholarships,
      profile,
      savedIds,
      applications,
      documents,
      toasts,
      isLoaded,
      toggleSaveScholarship,
      updateApplicationStatus,
      updateProfile,
      toggleDocumentReady,
      resetDemoData,
      showToast,
      removeToast,
      getMatchResult,
      stats,
    }),
    [
      scholarships,
      profile,
      savedIds,
      applications,
      documents,
      toasts,
      isLoaded,
      toggleSaveScholarship,
      updateApplicationStatus,
      updateProfile,
      toggleDocumentReady,
      resetDemoData,
      showToast,
      removeToast,
      getMatchResult,
      stats,
    ]
  );

  return (
    <GrantlyContext.Provider value={contextValue}>
      {children}
    </GrantlyContext.Provider>
  );
}

export function useGrantly() {
  const context = useContext(GrantlyContext);
  if (!context) {
    throw new Error('useGrantly must be used within a GrantlyProvider');
  }
  return context;
}
