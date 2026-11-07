'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useGrantly } from '@/context/GrantlyContext';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import {
  Settings,
  Bell,
  Palette,
  Shield,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export default function SettingsPage() {
  const { resetDemoData, showToast, profile, applications, savedIds, documents } = useGrantly();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [smartMatchAlerts, setSmartMatchAlerts] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const resetModalRef = useFocusTrap<HTMLDivElement>({
    isOpen: showResetConfirm,
    onClose: () => setShowResetConfirm(false),
  });

  const handleExportData = () => {
    const backup = {
      profile,
      applications,
      savedIds,
      documents,
      exportedAt: new Date().toISOString(),
      platform: 'GRANTLY Outpost Edition',
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grantly-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast({
      type: 'success',
      title: 'Portfolio Exported',
      description: 'Downloaded complete student profile and application logs JSON.',
    });
  };

  const handleReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#EDEBFF] text-[#5145CD] flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
              Settings & Account
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Configure platform notifications, data preferences, and system controls.
          </p>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-3xl border border-[#E7E9F0] p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E7E9F0] pb-3">
            <Bell className="w-4 h-4 text-[#5145CD]" />
            <h2 className="text-sm font-bold text-[#17213A]">Notification & Radar Settings</h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <p className="font-bold text-[#17213A]">Deadline Radar Alerts</p>
                <p className="text-xs text-[#667085]">
                  Receive countdown banners for scholarships closing within 15 days.
                </p>
              </div>
              <input
                type="checkbox"
                checked={deadlineReminders}
                onChange={(e) => setDeadlineReminders(e.target.checked)}
                className="mt-1 rounded text-[#5145CD] focus:ring-[#5145CD] w-4 h-4"
              />
            </label>

            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <p className="font-bold text-[#17213A]">Smart Match Discovery Notifications</p>
                <p className="text-xs text-[#667085]">
                  Highlight new fellowship programs with 80%+ compatibility.
                </p>
              </div>
              <input
                type="checkbox"
                checked={smartMatchAlerts}
                onChange={(e) => setSmartMatchAlerts(e.target.checked)}
                className="mt-1 rounded text-[#5145CD] focus:ring-[#5145CD] w-4 h-4"
              />
            </label>

            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <p className="font-bold text-[#17213A]">Institutional Summary Digests</p>
                <p className="text-xs text-[#667085]">
                  Weekly summaries of state and central scholarship circulars.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="mt-1 rounded text-[#5145CD] focus:ring-[#5145CD] w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Data Portability & Backup */}
        <div className="bg-white rounded-3xl border border-[#E7E9F0] p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E7E9F0] pb-3">
            <Shield className="w-4 h-4 text-[#5145CD]" />
            <h2 className="text-sm font-bold text-[#17213A]">Data Portability & Local Storage</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-[#17213A]">Download Complete Student Portfolio</p>
              <p className="text-[#667085]">
                Export your verified academic scorecards, tracked application statuses, and notes as standard JSON.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E7E9F0] bg-[#F7F8FC] hover:bg-[#EDEBFF] text-[#5145CD] font-bold transition-colors flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Demo Baseline Reset */}
        <div className="bg-white rounded-3xl border border-red-100 p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E7E9F0] pb-3 text-[#DC5260]">
            <AlertTriangle className="w-4 h-4" />
            <h2 className="text-sm font-bold text-[#17213A]">Hackathon Demonstration Controls</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-[#17213A]">Reset All Local Demo Records</p>
              <p className="text-[#667085]">
                Revert the platform to initial sample state with 14 distinct scholarships, Aarav Sharma profile, and active demo applications.
              </p>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#DC5260] border border-red-200 font-bold transition-colors flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showResetConfirm && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-modal-title"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div
              ref={resetModalRef}
              tabIndex={-1}
              className="bg-white rounded-3xl border border-[#E7E9F0] p-6 max-w-sm w-full shadow-elevated space-y-4 outline-none"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 text-[#DC5260] flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 id="reset-modal-title" className="text-base font-bold text-[#17213A]">
                  Reset Demo Data?
                </h3>
                <p className="text-xs text-[#667085]">
                  This will restore all default scholarships, sample applications, document checklist items, and profile defaults.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#E7E9F0] text-xs font-semibold text-[#667085]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#DC5260] text-white text-xs font-bold shadow-sm"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
