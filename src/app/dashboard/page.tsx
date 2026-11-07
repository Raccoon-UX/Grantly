'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useGrantly } from '@/context/GrantlyContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { ScholarshipCard } from '@/components/scholarships/ScholarshipCard';
import {
  Sparkles,
  ClipboardList,
  Bookmark,
  FileCheck2,
  Search,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  TrendingUp,
  FileText,
  UserCheck,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { scholarships, profile, applications, stats, getMatchResult } = useGrantly();
  const [searchTerm, setSearchTerm] = useState('');

  // Handle quick search form
  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/discover?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/discover');
    }
  };

  // Top recommended scholarships sorted by smart match score
  const recommendedScholarships = [...scholarships]
    .map((s) => ({ scholarship: s, match: getMatchResult(s) }))
    .sort((a, b) => b.match.matchScore - a.match.matchScore)
    .slice(0, 3);

  // Applications in progress
  const activeApplications = applications.filter(
    (a) => a.status !== 'Approved' && a.status !== 'Rejected'
  );

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Personalized Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3526A8] via-[#5145CD] to-[#7868F6] p-6 sm:p-8 text-white shadow-elevated">
          {/* Subtle decorative geometric overlay */}
          <div
            className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute right-24 -top-12 w-48 h-48 rounded-full bg-[#EDEBFF]/20 blur-xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-[#EDEBFF]" />
                <span>Smart Opportunity Hub</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {profile.fullName.split(' ')[0]}! 👋
              </h1>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                You are currently pursuing <span className="font-semibold text-white">{profile.course}</span> at{' '}
                <span className="font-semibold text-white">{profile.institution}</span>. We found{' '}
                <span className="font-bold underline decoration-[#EDEBFF] decoration-2">
                  {stats.eligibleCount} high-probability scholarships
                </span>{' '}
                tailored to your academic profile and merit achievements.
              </p>
            </div>

            {/* Profile completion widget */}
            <div className="flex-shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 min-w-[260px]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-white/90">Profile Completeness</span>
                <span className="font-extrabold text-white">{stats.profileCompletionPercent}%</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#16A779] h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.profileCompletionPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-white/80 mt-2 flex items-center justify-between">
                <span>Verification Status: Active</span>
                <Link
                  href="/profile"
                  className="font-bold text-white hover:underline flex items-center gap-0.5"
                >
                  <span>Edit Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </p>
            </div>
          </div>

          {/* Quick Search inside banner */}
          <form onSubmit={handleQuickSearch} className="relative mt-6 max-w-3xl">
            <label htmlFor="banner-search" className="sr-only">
              Search scholarships by keywords, provider name, or academic field
            </label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667085]" />
            <input
              id="banner-search"
              type="text"
              placeholder="Search by keywords, provider name, or academic field (e.g. AICTE, STEM, B.Tech, Merit)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white text-[#17213A] placeholder-[#667085] text-sm focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[#5145CD] hover:bg-[#4338B8] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Search
            </button>
          </form>
        </section>

        {/* Dynamic Metric Cards */}
        <section aria-label="Key Scholarship Statistics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Eligible Matches"
              value={stats.eligibleCount}
              subtitle="Satisfies all key criteria"
              badge="Deterministic AI"
              icon={Sparkles}
              colorScheme="indigo"
            />
            <StatCard
              title="Applications Tracked"
              value={stats.applicationsCount}
              subtitle={`${stats.approvedCount} granted / approved`}
              badge="Active"
              icon={ClipboardList}
              colorScheme="emerald"
            />
            <StatCard
              title="Saved Opportunities"
              value={stats.savedCount}
              subtitle="Quick reference bookmarks"
              badge="Local Stored"
              icon={Bookmark}
              colorScheme="blue"
            />
            <StatCard
              title="Document Readiness"
              value={`${stats.documentsReadyCount}/${stats.documentsTotalCount}`}
              subtitle="Verified & uploaded"
              badge="Readiness Check"
              icon={FileCheck2}
              colorScheme="amber"
            />
          </div>
        </section>

        {/* Main Grid: Recommended Scholarships (2 cols) & Action Radar / Deadlines (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Recommended Scholarships */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#17213A] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#5145CD]" />
                  <span>Top Smart Match Recommendations</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
                  Algorithmic matches verified against your {profile.stream} qualification and merit grade.
                </p>
              </div>

              <Link
                href="/smart-match"
                className="text-xs sm:text-sm font-semibold text-[#5145CD] hover:text-[#4338B8] flex items-center gap-1 group"
              >
                <span>View All Matches</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Scholarships List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
              {recommendedScholarships.map(({ scholarship }) => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} viewMode="grid" />
              ))}
            </div>

            {/* Quick Action Discovery Bar */}
            <div className="p-5 rounded-2xl bg-white border border-[#E7E9F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-[#17213A]">Looking for niche programs?</h3>
                <p className="text-xs text-[#667085]">
                  Filter by 7 distinct academic disciplines, state domiciles, or special talent awards.
                </p>
              </div>
              <Link
                href="/discover"
                className="px-4 py-2.5 rounded-xl bg-[#EDEBFF] hover:bg-[#EDEBFF]/80 text-[#5145CD] text-xs font-bold transition-all text-center flex-shrink-0"
              >
                Browse All {stats.totalScholarships} Scholarships
              </Link>
            </div>
          </div>

          {/* Right Column: Deadlines, Applications in Flight & Checklist */}
          <div className="space-y-6">
            {/* Urgent Deadlines Widget */}
            <div className="bg-white rounded-2xl border border-[#E7E9F0] p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E9F0] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#DC5260] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17213A]">Upcoming Deadlines</h3>
                    <p className="text-[11px] text-[#667085]">Next 60 days</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  {stats.upcomingDeadlines.length} Active
                </span>
              </div>

              <div className="space-y-3">
                {stats.upcomingDeadlines.slice(0, 4).map(({ scholarship, daysRemaining }) => (
                  <Link
                    key={scholarship.id}
                    href={`/scholarships/${scholarship.id}`}
                    className="block p-3 rounded-xl border border-[#E7E9F0] hover:border-[#7868F6]/40 hover:bg-[#F7F8FC] transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-[#17213A] line-clamp-1">
                        {scholarship.name}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                          daysRemaining <= 10
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {daysRemaining === 0 ? 'Today' : `${daysRemaining}d left`}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#667085] mt-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#8F9BB3]" />
                      <span className="truncate">{scholarship.provider}</span>
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Active Applications Tracker Summary */}
            <div className="bg-white rounded-2xl border border-[#E7E9F0] p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E9F0] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EDEBFF] text-[#5145CD] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17213A]">Application Radar</h3>
                    <p className="text-[11px] text-[#667085]">Recent submissions & drafts</p>
                  </div>
                </div>
                <Link
                  href="/applications"
                  className="text-xs font-semibold text-[#5145CD] hover:underline"
                >
                  Manage
                </Link>
              </div>

              <div className="space-y-3">
                {activeApplications.slice(0, 3).map((app) => {
                  const s = scholarships.find((item) => item.id === app.scholarshipId);
                  return (
                    <div
                      key={app.id}
                      className="p-3 rounded-xl border border-[#E7E9F0] space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-[#17213A] line-clamp-1">
                          {s?.name || 'Scholarship Application'}
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5145CD]/10 text-[#5145CD]">
                          {app.status}
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full bg-[#F7F8FC] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#5145CD] h-full rounded-full"
                          style={{ width: `${app.progressPercent}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#667085] truncate">{app.notes}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="bg-[#EDEBFF]/50 border border-[#7868F6]/20 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#3526A8]">
                Student Shortcuts
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/documents"
                  className="p-2.5 rounded-xl bg-white border border-[#E7E9F0] hover:border-[#5145CD] text-left transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#5145CD] mb-1" />
                  <p className="text-xs font-bold text-[#17213A]">Checklist</p>
                  <p className="text-[10px] text-[#667085]">Doc status</p>
                </Link>
                <Link
                  href="/profile"
                  className="p-2.5 rounded-xl bg-white border border-[#E7E9F0] hover:border-[#5145CD] text-left transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-[#16A779] mb-1" />
                  <p className="text-xs font-bold text-[#17213A]">Update CGPA</p>
                  <p className="text-[10px] text-[#667085]">Smart re-calc</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
