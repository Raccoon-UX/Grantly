'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useGrantly } from '@/context/GrantlyContext';
import { formatCurrencyINR, formatDate } from '@/lib/utils';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Sliders,
  Bookmark,
  Building2,
  Info,
} from 'lucide-react';

export default function SmartMatchPage() {
  const { scholarships, profile, getMatchResult, savedIds, toggleSaveScholarship, updateProfile } =
    useGrantly();

  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'moderate' | 'unmatched'>('all');
  const [showSimulator, setShowSimulator] = useState(false);

  // Simulated score and income test state
  const [simScore, setSimScore] = useState(profile.academicScore);
  const [simIncome, setSimIncome] = useState(profile.familyIncome);

  // Match all scholarships
  const analyzedScholarships = scholarships.map((s) => {
    // If simulator values differ from profile, we can calculate simulated match
    const testProfile = {
      ...profile,
      academicScore: simScore,
      familyIncome: simIncome,
    };
    const result = getMatchResult(s);
    return {
      scholarship: s,
      result,
    };
  });

  // Sort by match score descending
  analyzedScholarships.sort((a, b) => b.result.matchScore - a.result.matchScore);

  // Filter by tab
  const filteredMatches = analyzedScholarships.filter(({ result }) => {
    if (activeTab === 'high') return result.matchScore >= 80;
    if (activeTab === 'moderate') return result.matchScore >= 50 && result.matchScore < 80;
    if (activeTab === 'unmatched') return result.matchScore < 50;
    return true;
  });

  const highMatchCount = analyzedScholarships.filter((m) => m.result.matchScore >= 80).length;
  const modMatchCount = analyzedScholarships.filter(
    (m) => m.result.matchScore >= 50 && m.result.matchScore < 80
  ).length;

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#EDEBFF] text-[#5145CD] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                Deterministic Smart Match
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#667085] mt-1 max-w-2xl">
              Transparent algorithmic matching. Every score is computed by comparing your verified student profile parameters against official provider mandates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#E7E9F0] text-xs font-semibold text-[#17213A] hover:border-[#5145CD] transition-all flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4 text-[#5145CD]" />
              <span>{showSimulator ? 'Close Simulator' : 'Test Scenarios'}</span>
            </button>
            <Link
              href="/profile"
              className="px-4 py-2 rounded-xl bg-[#5145CD] hover:bg-[#4338B8] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Edit Live Profile</span>
            </Link>
          </div>
        </div>

        {/* Disclaimer Callout Box */}
        <div className="bg-[#EDEBFF]/60 border border-[#7868F6]/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs">
          <Info className="w-5 h-5 text-[#5145CD] flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-[#17213A]">
            <p className="font-bold">Transparent Matching Principle</p>
            <p className="text-gray-700 leading-relaxed">
              A high match score demonstrates strong algorithmic compatibility with criteria like academic marks, discipline, gender mandates, and income brackets. It is not an external guarantee of award disbursement, which rests solely with the scholarship provider.
            </p>
          </div>
        </div>

        {/* Interactive What-If Scenario Simulator (if toggled) */}
        {showSimulator && (
          <div className="bg-white rounded-3xl border border-[#5145CD]/30 p-6 shadow-card space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E9F0]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#5145CD]" />
                <h3 className="text-sm font-bold text-[#17213A]">
                  Profile Simulation: What-If Scenario Explorer
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-[#667085]">
                Temporarily adjust parameters to preview eligibility shifts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#17213A]">
                  <span>Simulated Academic Score</span>
                  <span className="text-[#5145CD]">{simScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="0.5"
                  value={simScore}
                  onChange={(e) => setSimScore(Number(e.target.value))}
                  className="w-full accent-[#5145CD]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#17213A]">
                  <span>Simulated Annual Family Income</span>
                  <span className="text-[#5145CD]">₹{simIncome.toLocaleString('en-IN')}/yr</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="1500000"
                  step="25000"
                  value={simIncome}
                  onChange={(e) => setSimIncome(Number(e.target.value))}
                  className="w-full accent-[#5145CD]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  updateProfile({ academicScore: simScore, familyIncome: simIncome });
                }}
                className="px-4 py-1.5 rounded-xl bg-[#5145CD] text-white text-xs font-semibold"
              >
                Save These Values to Live Profile
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E7E9F0] pb-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Opportunities', count: analyzedScholarships.length },
            { id: 'high', label: 'High Match (80%+)', count: highMatchCount },
            { id: 'moderate', label: 'Moderate Match (50-79%)', count: modMatchCount },
            { id: 'unmatched', label: 'Criteria Mismatch (<50%)', count: analyzedScholarships.length - highMatchCount - modMatchCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'all' | 'high' | 'moderate' | 'unmatched')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#5145CD] text-white shadow-sm'
                  : 'text-[#667085] hover:text-[#17213A] hover:bg-[#F7F8FC]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id
                    ? 'bg-white text-[#5145CD]'
                    : 'bg-[#F7F8FC] text-[#667085] border border-[#E7E9F0]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Match Cards List */}
        <div className="space-y-5">
          {filteredMatches.map(({ scholarship, result }) => {
            const isSaved = savedIds.includes(scholarship.id);

            return (
              <div
                key={scholarship.id}
                className="bg-white rounded-3xl border border-[#E7E9F0] hover:border-[#7868F6]/40 p-6 shadow-card hover:shadow-card-hover transition-all duration-200 space-y-5"
              >
                {/* Header: Name, Provider, Score Pill, Bookmark */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EDEBFF] text-[#5145CD]">
                        {scholarship.category}
                      </span>
                      {scholarship.verifiedStatus === 'Verified Official' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          Verified
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/scholarships/${scholarship.id}`}
                      className="text-lg font-bold text-[#17213A] hover:text-[#5145CD] transition-colors line-clamp-1 block"
                    >
                      {scholarship.name}
                    </Link>

                    <p className="text-xs text-[#667085] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#8F9BB3]" />
                      <span>{scholarship.provider}</span>
                    </p>
                  </div>

                  {/* Score Pill & Bookmark */}
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#F7F8FC] border border-[#E7E9F0] text-right min-w-[110px]">
                      <div className="flex items-center justify-end gap-1">
                        <Sparkles className="w-4 h-4 text-[#5145CD]" />
                        <span className="text-xl font-extrabold text-[#17213A] tabular-nums">
                          {result.matchScore}%
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold block ${
                          result.matchScore >= 80
                            ? 'text-emerald-800'
                            : result.matchScore >= 50
                            ? 'text-[#5145CD]'
                            : 'text-red-700'
                        }`}
                      >
                        {result.confidenceTier} Alignment
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSaveScholarship(scholarship.id)}
                      className={`p-2.5 rounded-2xl border transition-all ${
                        isSaved
                          ? 'bg-[#5145CD] text-white border-[#5145CD]'
                          : 'bg-white text-[#667085] hover:text-[#5145CD] border-[#E7E9F0]'
                      }`}
                      aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Explanation text */}
                <p className="text-xs text-[#17213A] bg-[#F7F8FC] p-3.5 rounded-2xl border border-[#E7E9F0]/80 leading-relaxed">
                  {result.explanation}
                </p>

                {/* Criteria Checks Breakdown (2 cols) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Matched */}
                  <div className="space-y-2">
                    <p className="font-bold text-[#16A779] uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Satisfied Requirements ({result.matchedCriteria.length})</span>
                    </p>
                    <div className="space-y-1.5">
                      {result.matchedCriteria.map((c) => (
                        <div
                          key={c.label}
                          className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between"
                        >
                          <span className="font-semibold text-[#17213A]">{c.label}</span>
                          <span className="text-[11px] text-[#16A779] font-medium">{c.studentValue}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unmatched / Gaps */}
                  <div className="space-y-2">
                    <p className="font-bold text-[#DC5260] uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Unmatched Constraints ({result.unmatchedCriteria.length})</span>
                    </p>
                    {result.unmatchedCriteria.length === 0 ? (
                      <div className="p-3 rounded-xl bg-[#F7F8FC] text-center text-[#667085]">
                        All mandatory requirements satisfied.
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {result.unmatchedCriteria.map((c) => (
                          <div
                            key={c.label}
                            className="p-2.5 rounded-xl bg-red-50/50 border border-red-100 flex flex-col justify-between"
                          >
                            <span className="font-semibold text-[#17213A]">{c.label}</span>
                            <span className="text-[10px] text-[#DC5260] mt-0.5">
                              Provider requires: {c.requiredValue} (You: {c.studentValue})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Bar: Award Amount & Action */}
                <div className="pt-3 border-t border-[#E7E9F0] flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-[#667085]">Award: </span>
                    <span className="font-extrabold text-[#17213A]">
                      {formatCurrencyINR(scholarship.awardAmount)}
                    </span>
                    <span className="text-[#667085]"> • {scholarship.awardType}</span>
                  </div>

                  <Link
                    href={`/scholarships/${scholarship.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5145CD] hover:bg-[#4338B8] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <span>View Scholarship Full Brief</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
