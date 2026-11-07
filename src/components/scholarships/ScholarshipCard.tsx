'use client';

import React from 'react';
import Link from 'next/link';
import { Scholarship } from '@/types';
import { useGrantly } from '@/context/GrantlyContext';
import { formatCurrencyINR, formatDate, getDaysRemaining } from '@/lib/utils';
import {
  Bookmark,
  Calendar,
  Sparkles,
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  viewMode?: 'grid' | 'list';
}

function ScholarshipCardComponent({
  scholarship,
  viewMode = 'grid',
}: ScholarshipCardProps) {
  const { savedIds, toggleSaveScholarship, getMatchResult, applications } = useGrantly();

  const isSaved = savedIds.includes(scholarship.id);
  const matchResult = getMatchResult(scholarship);
  const daysLeft = getDaysRemaining(scholarship.deadline);
  const existingApp = applications.find((a) => a.scholarshipId === scholarship.id);

  const getMatchBadgeStyle = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (score >= 60) return 'bg-[#EDEBFF] text-[#5145CD] border-[#7868F6]/30';
    if (score >= 40) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getDeadlineBadge = (days: number) => {
    if (days < 0) return { label: 'Deadline Expired', color: 'bg-gray-100 text-gray-600' };
    if (days === 0) return { label: 'Closes Today', color: 'bg-red-50 text-red-700 font-bold border border-red-200' };
    if (days <= 10) return { label: `${days} days left`, color: 'bg-red-50 text-red-700 font-bold border border-red-200' };
    if (days <= 30) return { label: `${days} days left`, color: 'bg-amber-50 text-amber-800 font-medium border border-amber-200' };
    return { label: formatDate(scholarship.deadline), color: 'bg-[#F7F8FC] text-gray-700 border border-[#E7E9F0]' };
  };

  const deadlineBadge = getDeadlineBadge(daysLeft);

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-2xl border border-[#E7E9F0] hover:border-[#7868F6]/40 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex-1 min-w-0 space-y-2">
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
            {existingApp && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#5145CD]/10 text-[#5145CD]">
                Status: {existingApp.status}
              </span>
            )}
          </div>

          <div>
            <Link
              href={`/scholarships/${scholarship.id}`}
              className="text-base font-bold text-[#17213A] group-hover:text-[#5145CD] transition-colors line-clamp-1"
            >
              {scholarship.name}
            </Link>
            <p className="text-xs text-[#667085] flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-[#8F9BB3]" />
              <span>{scholarship.provider}</span>
            </p>
          </div>

          <p className="text-xs text-[#667085] line-clamp-2">{scholarship.description}</p>
        </div>

        {/* Right Info & Actions */}
        <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-[#E7E9F0] gap-3">
          <div className="text-left md:text-right">
            <div className="text-lg font-bold text-[#17213A] tabular-nums">
              {formatCurrencyINR(scholarship.awardAmount)}
            </div>
            <span className="text-[11px] text-[#667085]">{scholarship.awardType}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveScholarship(scholarship.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-[#5145CD] text-white border-[#5145CD]'
                  : 'bg-white text-[#667085] hover:text-[#5145CD] border-[#E7E9F0]'
              }`}
              aria-label={isSaved ? 'Remove from saved' : 'Save scholarship'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <Link
              href={`/scholarships/${scholarship.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5145CD] hover:bg-[#4338B8] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid Card View (Default)
  return (
    <div className="group bg-white rounded-2xl border border-[#E7E9F0] hover:border-[#7868F6]/40 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between relative">
      {/* Top Bar: Category, Smart Match, and Bookmark */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EDEBFF] text-[#5145CD]">
              {scholarship.category}
            </span>

            {/* Smart Match score pill */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${getMatchBadgeStyle(
                matchResult.matchScore
              )}`}
              title={matchResult.explanation}
            >
              <Sparkles className="w-3 h-3" />
              <span>{matchResult.matchScore}% Match</span>
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleSaveScholarship(scholarship.id)}
            className={`p-2 rounded-xl border transition-all ${
              isSaved
                ? 'bg-[#5145CD] text-white border-[#5145CD] shadow-sm'
                : 'bg-white text-[#667085] hover:text-[#5145CD] border-[#E7E9F0]'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save scholarship'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title and Provider */}
        <Link
          href={`/scholarships/${scholarship.id}`}
          className="block text-base font-bold text-[#17213A] group-hover:text-[#5145CD] transition-colors line-clamp-2 leading-snug"
        >
          {scholarship.name}
        </Link>

        <p className="text-xs text-[#667085] flex items-center gap-1.5 mt-1">
          <Building2 className="w-3.5 h-3.5 text-[#8F9BB3] flex-shrink-0" />
          <span className="truncate">{scholarship.provider}</span>
        </p>

        {/* Short Summary */}
        <p className="text-xs text-[#667085] mt-2.5 line-clamp-2 leading-relaxed">
          {scholarship.description}
        </p>

        {/* Stream and Level Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F7F8FC] text-[#17213A] border border-[#E7E9F0]">
            <GraduationCap className="w-3 h-3 text-[#667085]" />
            {scholarship.educationLevels[0]}
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F7F8FC] text-[#667085] border border-[#E7E9F0]">
            {scholarship.eligibleStreams[0]}
          </span>
        </div>
      </div>

      {/* Card Footer: Financial Benefit, Deadline, Action */}
      <div className="mt-5 pt-4 border-t border-[#E7E9F0]/80">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#667085]">
              Award Grant
            </span>
            <div className="text-lg font-extrabold text-[#17213A] tabular-nums leading-none mt-0.5">
              {formatCurrencyINR(scholarship.awardAmount)}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#667085] block">
              Deadline
            </span>
            <span
              className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${deadlineBadge.color}`}
            >
              {deadlineBadge.label}
            </span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex items-center gap-2">
          {existingApp ? (
            <div className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>In Tracker ({existingApp.status})</span>
            </div>
          ) : (
            <Link
              href={`/scholarships/${scholarship.id}`}
              className="flex-1 py-2 px-3 rounded-xl bg-[#5145CD] hover:bg-[#4338B8] text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1 shadow-sm"
            >
              <span>Explore Opportunity</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export const ScholarshipCard = React.memo(ScholarshipCardComponent);
