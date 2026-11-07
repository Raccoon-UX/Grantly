'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useGrantly } from '@/context/GrantlyContext';
import { formatCurrencyINR, formatDate, getDaysRemaining } from '@/lib/utils';
import { ApplicationStatus } from '@/types';
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Building2,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
  Share2,
  IndianRupee,
  Clock,
  Send,
  HelpCircle,
  Check,
} from 'lucide-react';

export default function ScholarshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    scholarships,
    savedIds,
    toggleSaveScholarship,
    getMatchResult,
    applications,
    updateApplicationStatus,
    documents,
    showToast,
  } = useGrantly();

  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('Applied');
  const [appNotes, setAppNotes] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Close modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showStatusModal) {
        setShowStatusModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showStatusModal]);

  const scholarship = scholarships.find((s) => s.id === id);

  if (!scholarship) {
    return (
      <AppShell>
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E7E9F0] shadow-card space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-red-50 text-[#DC5260] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#17213A]">Opportunity Not Found</h2>
          <p className="text-xs text-[#667085]">
            The requested scholarship could not be located in our verified directory or sample registry.
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5145CD] text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Discovery</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  const isSaved = savedIds.includes(scholarship.id);
  const matchResult = getMatchResult(scholarship);
  const existingApp = applications.find((a) => a.scholarshipId === scholarship.id);
  const daysLeft = getDaysRemaining(scholarship.deadline);

  const handleUpdateStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateApplicationStatus(scholarship.id, selectedStatus, appNotes || undefined);
    setShowStatusModal(false);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'info',
        title: 'Link Copied',
        description: 'Opportunity URL copied to clipboard.',
      });
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Back navigation & Share */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#667085] hover:text-[#5145CD] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Opportunities</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white border border-[#E7E9F0] text-[#667085] hover:text-[#17213A] transition-colors"
              aria-label="Share opportunity"
              title="Copy link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveScholarship(scholarship.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                isSaved
                  ? 'bg-[#5145CD] text-white border-[#5145CD]'
                  : 'bg-white text-[#17213A] hover:border-[#5145CD] border-[#E7E9F0]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-white rounded-3xl border border-[#E7E9F0] p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EDEBFF] text-[#5145CD] border border-[#7868F6]/20">
                  {scholarship.category}
                </span>

                {scholarship.verifiedStatus === 'Verified Official' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#16A779] border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Official Government / Org Grant
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-[#E5A32A] border border-amber-200">
                    Demo Partner Program
                  </span>
                )}

                {existingApp && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#5145CD] text-white">
                    Tracker Status: {existingApp.status}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] leading-tight">
                {scholarship.name}
              </h1>

              <p className="text-sm text-[#667085] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#5145CD]" />
                <span className="font-semibold text-[#17213A]">{scholarship.provider}</span>
                <span>•</span>
                <span>Eligible States: {scholarship.eligibleStates.join(', ')}</span>
              </p>
            </div>

            {/* Financial Overview Card */}
            <div className="p-5 rounded-2xl bg-[#F7F8FC] border border-[#E7E9F0] flex-shrink-0 min-w-[240px] text-left md:text-right space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                Financial Award
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#5145CD] tabular-nums">
                {formatCurrencyINR(scholarship.awardAmount)}
              </div>
              <p className="text-xs font-semibold text-[#17213A]">{scholarship.awardType}</p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E7E9F0]">
            <div className="p-3 rounded-xl bg-[#F7F8FC] border border-[#E7E9F0]/80">
              <span className="text-[10px] text-[#667085] uppercase tracking-wider font-bold block">
                Deadline
              </span>
              <span className="text-xs font-bold text-[#17213A] mt-0.5 block">
                {formatDate(scholarship.deadline)}
              </span>
              <span
                className={`text-[10px] font-semibold ${
                  daysLeft <= 10 ? 'text-[#DC5260]' : 'text-[#667085]'
                }`}
              >
                {daysLeft < 0 ? 'Closed' : `${daysLeft} days remaining`}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F8FC] border border-[#E7E9F0]/80">
              <span className="text-[10px] text-[#667085] uppercase tracking-wider font-bold block">
                Min. Academic Score
              </span>
              <span className="text-xs font-bold text-[#17213A] mt-0.5 block">
                {scholarship.minAcademicScore}% or equivalent
              </span>
              <span className="text-[10px] text-[#667085]">Merit threshold</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F8FC] border border-[#E7E9F0]/80">
              <span className="text-[10px] text-[#667085] uppercase tracking-wider font-bold block">
                Income Ceiling
              </span>
              <span className="text-xs font-bold text-[#17213A] mt-0.5 block">
                {scholarship.maxFamilyIncome === 0
                  ? 'No Income Limit'
                  : `₹${scholarship.maxFamilyIncome.toLocaleString('en-IN')}/yr`}
              </span>
              <span className="text-[10px] text-[#667085]">Annual family income</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F8FC] border border-[#E7E9F0]/80">
              <span className="text-[10px] text-[#667085] uppercase tracking-wider font-bold block">
                Gender Mandate
              </span>
              <span className="text-xs font-bold text-[#17213A] mt-0.5 block">
                {scholarship.genderCriteria}
              </span>
              <span className="text-[10px] text-[#667085]">Inclusion mandate</span>
            </div>
          </div>
        </div>

        {/* Two Columns: Left (Details, Process, Benefits) + Right (Smart Match & Tracker CTA) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview & Purpose */}
            <div className="bg-white rounded-2xl border border-[#E7E9F0] p-6 shadow-card space-y-3">
              <h2 className="text-base font-bold text-[#17213A]">About the Scholarship</h2>
              <p className="text-sm text-[#17213A] leading-relaxed">{scholarship.description}</p>
              <div className="pt-2">
                <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block mb-2">
                  Program Highlights & Benefits
                </span>
                <p className="text-xs sm:text-sm font-medium text-[#5145CD] bg-[#EDEBFF] p-3 rounded-xl border border-[#7868F6]/20">
                  {scholarship.benefitsSummary}
                </p>
              </div>
            </div>

            {/* Eligibility Requirements Breakdown */}
            <div className="bg-white rounded-2xl border border-[#E7E9F0] p-6 shadow-card space-y-4">
              <h2 className="text-base font-bold text-[#17213A]">Eligibility Requirements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-[#F7F8FC] border border-[#E7E9F0]">
                  <span className="text-[#667085] font-semibold block mb-1">Eligible Education Levels</span>
                  <div className="flex flex-wrap gap-1">
                    {scholarship.educationLevels.map((lvl) => (
                      <span key={lvl} className="px-2 py-0.5 rounded bg-white text-[#17213A] font-bold border border-[#E7E9F0]">
                        {lvl}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F7F8FC] border border-[#E7E9F0]">
                  <span className="text-[#667085] font-semibold block mb-1">Accepted Disciplines / Streams</span>
                  <div className="flex flex-wrap gap-1">
                    {scholarship.eligibleStreams.map((st) => (
                      <span key={st} className="px-2 py-0.5 rounded bg-white text-[#17213A] font-bold border border-[#E7E9F0]">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Application Process Steps */}
            <div className="bg-white rounded-2xl border border-[#E7E9F0] p-6 shadow-card space-y-4">
              <h2 className="text-base font-bold text-[#17213A]">Official Application Process</h2>
              <ol className="space-y-3">
                {scholarship.applicationProcess.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded-full bg-[#5145CD] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-[#17213A] font-medium leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Required Documents List */}
            <div className="bg-white rounded-2xl border border-[#E7E9F0] p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#17213A] flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-[#5145CD]" />
                  <span>Mandatory Documents Checklist</span>
                </h2>
                <Link href="/documents" className="text-xs font-semibold text-[#5145CD] hover:underline">
                  Manage in Document Center
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {scholarship.requiredDocuments.map((docName) => {
                  const docMatch = documents.find(
                    (d) => d.title.toLowerCase().includes(docName.toLowerCase()) || docName.toLowerCase().includes(d.title.toLowerCase())
                  );
                  const isReady = docMatch?.status === 'ready';

                  return (
                    <div
                      key={docName}
                      className="p-3 rounded-xl border border-[#E7E9F0] bg-[#F7F8FC] flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-[#17213A]">{docName}</span>
                      <span
                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          isReady
                            ? 'bg-emerald-50 text-[#16A779] border border-emerald-200'
                            : 'bg-amber-50 text-[#E5A32A] border border-amber-200'
                        }`}
                      >
                        {isReady ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {isReady ? 'Ready' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Provider Contact & Official Verification Note */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-[#E7E9F0] text-xs text-[#667085] space-y-1">
              <p className="font-bold text-[#17213A]">Official Provider Verification & Inquiry</p>
              <p>Contact Details: {scholarship.contactInfo}</p>
              <p className="text-[11px] text-gray-400">
                Data recorded in accordance with official public notifications. GRANTLY manages discovery
                and student tracking locally; direct portal filing is completed with the provider.
              </p>
            </div>
          </div>

          {/* Right Column: Smart Match Assessment & Tracker Actions */}
          <div className="space-y-6">
            {/* Deterministic Smart Match Card */}
            <div className="bg-white rounded-2xl border border-[#E7E9F0] p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E9F0] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EDEBFF] text-[#5145CD] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17213A]">Smart Match Engine</h3>
                    <p className="text-[10px] text-[#667085]">Deterministic Eligibility Scan</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-[#5145CD] tabular-nums">
                    {matchResult.matchScore}%
                  </div>
                  <span className="text-[10px] text-[#667085]">Match Index</span>
                </div>
              </div>

              {/* Match Explanation */}
              <p className="text-xs text-[#17213A] bg-[#F7F8FC] p-3 rounded-xl border border-[#E7E9F0]">
                {matchResult.explanation}
              </p>

              {/* Matched Criteria */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#16A779] uppercase tracking-wider block">
                  Satisfied Criteria ({matchResult.matchedCriteria.length})
                </span>
                <div className="space-y-1.5">
                  {matchResult.matchedCriteria.map((c) => (
                    <div
                      key={c.label}
                      className="flex items-start gap-2 text-xs p-2 rounded-lg bg-emerald-50/50 border border-emerald-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#16A779] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#17213A]">{c.label}</p>
                        <p className="text-[10px] text-[#667085]">{c.studentValue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unmatched Criteria */}
              {matchResult.unmatchedCriteria.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#DC5260] uppercase tracking-wider block">
                    Unmatched Criteria ({matchResult.unmatchedCriteria.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchResult.unmatchedCriteria.map((c) => (
                      <div
                        key={c.label}
                        className="flex items-start gap-2 text-xs p-2 rounded-lg bg-red-50/50 border border-red-100"
                      >
                        <XCircle className="w-4 h-4 text-[#DC5260] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#17213A]">{c.label}</p>
                          <p className="text-[10px] text-[#DC5260]">
                            Requires: {c.requiredValue} | You: {c.studentValue}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-[#667085] border-t border-[#E7E9F0] pt-2">
                Note: Smart Match is deterministic based on your student profile. Final award selection
                is decided independently by {scholarship.provider}.
              </p>
            </div>

            {/* Tracker Actions Box */}
            <div className="bg-white rounded-2xl border border-[#E7E9F0] p-6 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-[#17213A]">Take Action</h3>

              {/* Official External Link */}
              {scholarship.officialUrl ? (
                <a
                  href={scholarship.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#5145CD] hover:bg-[#4338B8] text-white text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 text-center">
                  Official direct web link not published. Application submitted via offline / CSR portal.
                </div>
              )}

              {/* Update Local Tracker Button */}
              <button
                onClick={() => {
                  setSelectedStatus(existingApp?.status || 'Preparing');
                  setAppNotes(existingApp?.notes || '');
                  setShowStatusModal(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#EDEBFF] hover:bg-[#EDEBFF]/80 text-[#5145CD] text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2 border border-[#7868F6]/20"
              >
                <Clock className="w-4 h-4" />
                <span>
                  {existingApp ? `Update Status (${existingApp.status})` : 'Add to Application Tracker'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal for Application Tracker Status Update */}
        {showStatusModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-modal-title"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl border border-[#E7E9F0] p-6 max-w-md w-full shadow-elevated space-y-5 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[#E7E9F0] pb-3">
                <h3 id="status-modal-title" className="text-base font-bold text-[#17213A]">
                  Update Application Tracker
                </h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-[#667085] hover:text-[#17213A] text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17213A]">Target Scholarship</label>
                  <p className="text-xs text-[#667085] bg-[#F7F8FC] p-2.5 rounded-xl border border-[#E7E9F0]">
                    {scholarship.name}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17213A]">Select New Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                    className="w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#17213A]"
                  >
                    <option value="Saved">Saved</option>
                    <option value="Preparing">Preparing (Drafting Documents)</option>
                    <option value="Ready to Apply">Ready to Apply (Verified)</option>
                    <option value="Applied">Applied (Submitted to Provider)</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved / Sanctioned</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#17213A]">Personal Notes & Reference ID</label>
                  <textarea
                    rows={3}
                    placeholder="E.g. Application ID: NSP2026/88921. Sent transcript to college office for e-attestation."
                    value={appNotes}
                    onChange={(e) => setAppNotes(e.target.value)}
                    className="w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl p-3 text-xs text-[#17213A] placeholder-[#667085] focus:bg-white focus:border-[#5145CD]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-[#E7E9F0] text-xs font-semibold text-[#667085] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#5145CD] hover:bg-[#4338B8] text-white text-xs font-bold shadow-sm"
                  >
                    Save Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
