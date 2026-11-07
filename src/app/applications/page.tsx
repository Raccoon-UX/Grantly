'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useGrantly } from '@/context/GrantlyContext';
import { formatCurrencyINR, formatDate, getDaysRemaining } from '@/lib/utils';
import { ApplicationStatus } from '@/types';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Building2,
  ExternalLink,
  Edit3,
  Search,
  Filter,
  Check,
  Plus,
} from 'lucide-react';

export default function ApplicationsPage() {
  const { scholarships, applications, updateApplicationStatus, showToast } = useGrantly();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const statusOptions: ApplicationStatus[] = [
    'Saved',
    'Preparing',
    'Ready to Apply',
    'Applied',
    'Under Review',
    'Approved',
    'Rejected',
  ];

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-[#16A779] border-emerald-200';
      case 'Under Review':
      case 'Applied':
        return 'bg-blue-50 text-[#3486D9] border-blue-200';
      case 'Ready to Apply':
        return 'bg-[#EDEBFF] text-[#5145CD] border-[#7868F6]/30';
      case 'Preparing':
        return 'bg-amber-50 text-[#E5A32A] border-amber-200';
      case 'Rejected':
        return 'bg-red-50 text-[#DC5260] border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'in-flight') {
      return ['Preparing', 'Ready to Apply', 'Applied', 'Under Review'].includes(app.status);
    }
    if (filterStatus === 'approved') return app.status === 'Approved';
    if (filterStatus === 'saved') return app.status === 'Saved';
    return app.status === filterStatus;
  });

  const handleSaveNotes = (scholarshipId: string, currentStatus: ApplicationStatus) => {
    updateApplicationStatus(scholarshipId, currentStatus, tempNotes);
    setEditingNotesId(null);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#EDEBFF] text-[#5145CD] flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                Application Tracker
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#667085] mt-1 max-w-2xl">
              Manage your active scholarship filings, submission checkpoints, application notes, and document clearances in one centralized cockpit.
            </p>
          </div>

          <Link
            href="/discover"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5145CD] hover:bg-[#4338B8] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Discover & Track More</span>
          </Link>
        </div>

        {/* Local tracking notice */}
        <div className="bg-[#F7F8FC] border border-[#E7E9F0] rounded-2xl p-4 text-xs text-[#667085] flex items-center justify-between">
          <span>
            ℹ️ <strong className="text-[#17213A]">Local Tracking Workflow:</strong> Status updates
            and notes are safely stored in your browser session and LocalStorage to organize your
            admissions and funding journey.
          </span>
          <span className="font-bold text-[#5145CD] tabular-nums hidden sm:inline">
            {applications.length} Total Registered
          </span>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E7E9F0] pb-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Applications', count: applications.length },
            {
              id: 'in-flight',
              label: 'In Progress',
              count: applications.filter((a) =>
                ['Preparing', 'Ready to Apply', 'Applied', 'Under Review'].includes(a.status)
              ).length,
            },
            {
              id: 'approved',
              label: 'Sanctioned / Approved',
              count: applications.filter((a) => a.status === 'Approved').length,
            },
            {
              id: 'saved',
              label: 'Draft / Saved',
              count: applications.filter((a) => a.status === 'Saved').length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-[#5145CD] text-white shadow-sm'
                  : 'text-[#667085] hover:text-[#17213A] hover:bg-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  filterStatus === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#667085]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Application List */}
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E7E9F0] shadow-card space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#EDEBFF] text-[#5145CD] flex items-center justify-center mx-auto">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#17213A]">No Applications in this View</h3>
            <p className="text-xs text-[#667085]">
              You don&apos;t have any applications matching the selected filter. Find an opportunity in the discovery directory to start tracking.
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5145CD] text-white text-xs font-semibold"
            >
              <span>Explore Scholarships</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const scholarship = scholarships.find((s) => s.id === app.scholarshipId);
              if (!scholarship) return null;

              const daysLeft = getDaysRemaining(scholarship.deadline);
              const isEditingThisNote = editingNotesId === app.id;

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-[#E7E9F0] hover:border-[#7868F6]/40 p-5 shadow-card hover:shadow-card-hover transition-all space-y-4"
                >
                  {/* Top Bar: Title, Provider, Status Selector, Award */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EDEBFF] text-[#5145CD]">
                          {scholarship.category}
                        </span>
                        <span className="text-[11px] text-[#667085] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Deadline: {formatDate(scholarship.deadline)}</span>
                          <span
                            className={`font-semibold ${
                              daysLeft <= 10 ? 'text-[#DC5260]' : 'text-[#667085]'
                            }`}
                          >
                            ({daysLeft < 0 ? 'Closed' : `${daysLeft}d left`})
                          </span>
                        </span>
                      </div>

                      <Link
                        href={`/scholarships/${scholarship.id}`}
                        className="text-lg font-bold text-[#17213A] hover:text-[#5145CD] transition-colors block"
                      >
                        {scholarship.name}
                      </Link>

                      <p className="text-xs text-[#667085] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#8F9BB3]" />
                        <span>{scholarship.provider}</span>
                      </p>
                    </div>

                    {/* Status Dropdown and Award Amount */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0">
                      <div className="text-left sm:text-right">
                        <div className="text-lg font-extrabold text-[#17213A] tabular-nums">
                          {formatCurrencyINR(scholarship.awardAmount)}
                        </div>
                        <span className="text-[10px] text-[#667085]">{scholarship.awardType}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor={`status-${app.id}`} className="sr-only">
                          Change Status
                        </label>
                        <select
                          id={`status-${app.id}`}
                          value={app.status}
                          onChange={(e) =>
                            updateApplicationStatus(
                              scholarship.id,
                              e.target.value as ApplicationStatus
                            )
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer transition-all ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Progress Meter Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#17213A]">
                        Stage: <span className="text-[#5145CD]">{app.status}</span>
                      </span>
                      <span className="font-extrabold text-[#667085] tabular-nums">
                        {app.progressPercent}% Completed
                      </span>
                    </div>
                    <div className="w-full bg-[#F7F8FC] h-2 rounded-full overflow-hidden border border-[#E7E9F0]">
                      <div
                        className="h-full bg-gradient-to-r from-[#5145CD] to-[#7868F6] rounded-full transition-all duration-300"
                        style={{ width: `${app.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Notes & Checkpoints Box */}
                  <div className="bg-[#F7F8FC] rounded-xl p-3 border border-[#E7E9F0] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#17213A] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#5145CD]" />
                        <span>Filing Notes & Reference ID</span>
                      </span>
                      {!isEditingThisNote && (
                        <button
                          onClick={() => {
                            setEditingNotesId(app.id);
                            setTempNotes(app.notes);
                          }}
                          className="text-[11px] font-semibold text-[#5145CD] hover:underline flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Notes</span>
                        </button>
                      )}
                    </div>

                    {isEditingThisNote ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          className="w-full p-2 rounded-lg border border-[#5145CD] text-xs bg-white focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-2.5 py-1 rounded-lg border text-[11px] text-[#667085] hover:bg-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(scholarship.id, app.status)}
                            className="px-3 py-1 rounded-lg bg-[#5145CD] text-white text-[11px] font-bold"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[#667085] leading-relaxed">
                        {app.notes || 'No custom notes recorded for this scholarship.'}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#E7E9F0]/60 text-[11px] text-[#667085]">
                      <span>Last Updated: {app.lastUpdated}</span>
                      {scholarship.officialUrl && (
                        <a
                          href={scholarship.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#5145CD] font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <span>Open Provider Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
