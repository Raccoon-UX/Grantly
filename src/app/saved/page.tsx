'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useGrantly } from '@/context/GrantlyContext';
import { ScholarshipCard } from '@/components/scholarships/ScholarshipCard';
import { Bookmark, Compass, ArrowRight } from 'lucide-react';

export default function SavedScholarshipsPage() {
  const { scholarships, savedIds } = useGrantly();

  const savedScholarships = scholarships.filter((s) => savedIds.includes(s.id));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#EDEBFF] text-[#5145CD] flex items-center justify-center">
                <Bookmark className="w-5 h-5 fill-current" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                Saved Scholarships
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDEBFF] text-[#5145CD] border border-[#7868F6]/20">
                {savedScholarships.length} Bookmarked
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Your personal shortlist of scholarship opportunities for quick reference and tracking.
            </p>
          </div>

          <Link
            href="/discover"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5145CD] hover:bg-[#4338B8] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Discover More</span>
          </Link>
        </div>

        {/* Saved List or Empty State */}
        {savedScholarships.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-[#E7E9F0] shadow-card space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#EDEBFF] text-[#5145CD] flex items-center justify-center mx-auto">
              <Bookmark className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#17213A]">No Saved Scholarships</h3>
              <p className="text-xs text-[#667085]">
                You haven&apos;t bookmarked any opportunities yet. Click the bookmark icon on any scholarship card to save it here.
              </p>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5145CD] text-white text-xs font-semibold hover:bg-[#4338B8] transition-all shadow-sm"
            >
              <span>Explore Scholarships</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedScholarships.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} viewMode="grid" />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
