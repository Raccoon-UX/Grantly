'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGrantly } from '@/context/GrantlyContext';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Calendar,
  X,
  ExternalLink,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  const router = useRouter();
  const { stats, profile } = useGrantly();
  const [quickSearch, setQuickSearch] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Close notifications on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNotifOpen) {
        setIsNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNotifOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      router.push(`/discover?search=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E7E9F0] px-4 sm:px-6 flex items-center justify-between">
      {/* Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[#17213A] hover:bg-[#F7F8FC] border border-[#E7E9F0]"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Quick Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md hidden sm:block">
          <label htmlFor="global-search" className="sr-only">
            Search scholarships, providers, streams
          </label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
          <input
            id="global-search"
            type="text"
            placeholder="Search scholarships by keyword or provider (e.g. STEM, AICTE)..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl text-[#17213A] placeholder-[#667085] focus:bg-white focus:border-[#5145CD] focus:ring-1 focus:ring-[#5145CD] transition-all"
          />
        </form>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Smart Match Quick Indicator Pill */}
        <Link
          href="/smart-match"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDEBFF] text-[#5145CD] hover:bg-[#EDEBFF]/80 text-xs font-semibold border border-[#7868F6]/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#7868F6]" />
          <span>{stats.eligibleCount} Matched Opportunities</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-[#667085] hover:text-[#17213A] hover:bg-[#F7F8FC] border border-[#E7E9F0] transition-colors"
            aria-label="View upcoming deadlines and reminders"
          >
            <Bell className="w-4 h-4" />
            {stats.upcomingDeadlines.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC5260] ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Deadline notifications"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-elevated border border-[#E7E9F0] p-4 z-50 animate-in fade-in-50 zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E9F0]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#5145CD]" />
                  <span className="text-sm font-bold text-[#17213A]">Deadline Radar</span>
                </div>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="text-[#667085] hover:text-[#17213A]"
                  aria-label="Close notifications"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                {stats.upcomingDeadlines.length === 0 ? (
                  <p className="text-xs text-[#667085] py-4 text-center">
                    No urgent deadlines in the next 60 days.
                  </p>
                ) : (
                  stats.upcomingDeadlines.slice(0, 5).map(({ scholarship, daysRemaining }) => (
                    <Link
                      key={scholarship.id}
                      href={`/scholarships/${scholarship.id}`}
                      onClick={() => setIsNotifOpen(false)}
                      className="block p-2.5 rounded-xl hover:bg-[#F7F8FC] border border-transparent hover:border-[#E7E9F0] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-[#17213A] line-clamp-1">
                          {scholarship.name}
                        </p>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                            daysRemaining <= 15
                              ? 'bg-[#DC5260]/10 text-[#DC5260]'
                              : 'bg-[#E5A32A]/10 text-[#E5A32A]'
                          }`}
                        >
                          {daysRemaining === 0 ? 'Today' : `${daysRemaining}d left`}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#667085] mt-1">{scholarship.provider}</p>
                    </Link>
                  ))
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-[#E7E9F0] text-center">
                <Link
                  href="/discover"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs font-semibold text-[#5145CD] hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore all opportunities</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Name */}
        <Link
          href="/profile"
          className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full hover:bg-[#F7F8FC] border border-transparent hover:border-[#E7E9F0] transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-[#5145CD] text-white flex items-center justify-center font-bold text-xs">
            {profile.fullName.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-[#17213A] leading-tight">{profile.fullName}</p>
            <p className="text-[10px] text-[#667085] leading-tight">Student Member</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
