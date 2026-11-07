'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useGrantly } from '@/context/GrantlyContext';
import { ScholarshipCard } from '@/components/scholarships/ScholarshipCard';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  FilterX,
  GraduationCap,
  Briefcase,
  IndianRupee,
  MapPin,
  Calendar,
} from 'lucide-react';
import { EducationLevel, AcademicStream, ScholarshipCategory } from '@/types';
import { getDaysRemaining } from '@/lib/utils';
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';

function DiscoverContent() {
  const searchParams = useSearchParams();
  const { scholarships, stats, getMatchResult } = useGrantly();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [maxIncomeFilter, setMaxIncomeFilter] = useState<number>(1000000);
  const [minAmountFilter, setMinAmountFilter] = useState<number>(0);
  const [deadlineFilter, setDeadlineFilter] = useState<string>('all'); // 'all', '15days', '30days', '60days'
  const [sortBy, setSortBy] = useState<
    'relevance' | 'amount-high' | 'amount-low' | 'deadline-soon' | 'match-score'
  >('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const mobileFilterTrapRef = useFocusTrap<HTMLDivElement>({
    isOpen: mobileFilterOpen,
    onClose: () => setMobileFilterOpen(false),
  });

  // Sync initial query from URL search param
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Unique options for filters
  const educationLevels: EducationLevel[] = [
    'Undergraduate',
    'Postgraduate',
    'Diploma / Polytechnic',
    'High School (11th-12th)',
    'PhD / Doctoral',
  ];

  const academicStreams: AcademicStream[] = [
    'Engineering & Technology',
    'Medicine & Healthcare',
    'Basic Sciences',
    'Commerce & Management',
    'Humanities & Social Sciences',
    'Law',
    'Design & Arts',
  ];

  const categories: ScholarshipCategory[] = [
    'Merit-Based',
    'Need-Based',
    'STEM & Tech',
    'Women in Tech',
    'Minority / Reserved',
    'Special Talent',
    'Higher Education',
  ];

  const locations = ['All India', 'Karnataka', 'Maharashtra'];

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLevel('all');
    setSelectedStream('all');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setMaxIncomeFilter(1000000);
    setMinAmountFilter(0);
    setDeadlineFilter('all');
    setSortBy('relevance');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedLevel !== 'all' ||
    selectedStream !== 'all' ||
    selectedCategory !== 'all' ||
    selectedLocation !== 'all' ||
    minAmountFilter > 0 ||
    maxIncomeFilter < 1000000 ||
    deadlineFilter !== 'all' ||
    sortBy !== 'relevance';

  // Pre-index match scores map to avoid recomputing match algorithm O(N log N) times during sorting
  const matchScoresMap = useMemo(() => {
    const map = new Map<string, number>();
    scholarships.forEach((s) => {
      map.set(s.id, getMatchResult(s).matchScore);
    });
    return map;
  }, [scholarships, getMatchResult]);

  // Filtered & Sorted Scholarships
  const filteredScholarships = useMemo(() => {
    return scholarships
      .filter((s) => {
        // Search query: title, provider, description, tags
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = s.name.toLowerCase().includes(q);
          const matchProvider = s.provider.toLowerCase().includes(q);
          const matchDesc = s.description.toLowerCase().includes(q);
          const matchTags = s.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchProvider && !matchDesc && !matchTags) return false;
        }

        // Education level
        if (selectedLevel !== 'all' && !s.educationLevels.includes(selectedLevel as EducationLevel)) {
          return false;
        }

        // Academic stream
        if (selectedStream !== 'all' && !s.eligibleStreams.includes(selectedStream as AcademicStream)) {
          return false;
        }

        // Category
        if (selectedCategory !== 'all' && s.category !== selectedCategory) {
          return false;
        }

        // Location / State
        if (selectedLocation !== 'all') {
          const matchesLocation =
            s.eligibleStates.includes('All India') || s.eligibleStates.includes(selectedLocation);
          if (!matchesLocation) return false;
        }

        // Min award amount
        if (s.awardAmount < minAmountFilter) {
          return false;
        }

        // Max family income cap
        if (s.maxFamilyIncome > 0 && s.maxFamilyIncome > maxIncomeFilter) {
          return false;
        }

        // Deadline filter
        if (deadlineFilter !== 'all') {
          const days = getDaysRemaining(s.deadline);
          if (days < 0) return false;
          if (deadlineFilter === '15days' && days > 15) return false;
          if (deadlineFilter === '30days' && days > 30) return false;
          if (deadlineFilter === '60days' && days > 60) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'amount-high') return b.awardAmount - a.awardAmount;
        if (sortBy === 'amount-low') return a.awardAmount - b.awardAmount;
        if (sortBy === 'deadline-soon') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        if (sortBy === 'match-score') {
          const scoreA = matchScoresMap.get(a.id) ?? 0;
          const scoreB = matchScoresMap.get(b.id) ?? 0;
          return scoreB - scoreA;
        }
        // Default: relevance (featured first, then match score)
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        const relScoreA = matchScoresMap.get(a.id) ?? 0;
        const relScoreB = matchScoresMap.get(b.id) ?? 0;
        return relScoreB - relScoreA;
      });
  }, [
    scholarships,
    searchQuery,
    selectedLevel,
    selectedStream,
    selectedCategory,
    selectedLocation,
    minAmountFilter,
    maxIncomeFilter,
    deadlineFilter,
    sortBy,
    matchScoresMap,
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                Scholarship Discovery
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDEBFF] text-[#5145CD] border border-[#7868F6]/20">
                {filteredScholarships.length} Available
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Explore national grants, institutional endowments, and merit-cum-means awards across India.
            </p>
          </div>

          {/* View Mode Toggle and Mobile Filters Button */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E7E9F0] text-xs font-semibold text-[#17213A]"
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#5145CD]" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#5145CD]" />
              )}
            </button>

            <div className="bg-white border border-[#E7E9F0] rounded-xl p-1 flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#5145CD] text-white'
                    : 'text-[#667085] hover:text-[#17213A]'
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#5145CD] text-white'
                    : 'text-[#667085] hover:text-[#17213A]'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar & Sorting Toolbar */}
        <div className="bg-white rounded-2xl border border-[#E7E9F0] p-4 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <label htmlFor="discover-search" className="sr-only">
                Search scholarships by title, provider, or stream
              </label>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085]" />
              <input
                id="discover-search"
                type="text"
                placeholder="Search by scholarship title, provider (e.g. AICTE, Google, Infosys), or stream..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl text-[#17213A] placeholder-[#667085] focus:bg-white focus:border-[#5145CD] focus:ring-1 focus:ring-[#5145CD] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search input"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#667085] hover:text-[#17213A]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <ArrowUpDown className="w-4 h-4 text-[#667085]" />
              <label htmlFor="sort-select" className="sr-only">
                Sort Scholarships
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | 'relevance'
                      | 'amount-high'
                      | 'amount-low'
                      | 'deadline-soon'
                      | 'match-score'
                  )
                }
                className="bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#17213A] focus:border-[#5145CD] focus:bg-white transition-all cursor-pointer"
              >
                <option value="relevance">Sort: Recommended & Featured</option>
                <option value="match-score">Sort: Highest Match %</option>
                <option value="amount-high">Sort: Grant Amount (High to Low)</option>
                <option value="amount-low">Sort: Grant Amount (Low to High)</option>
                <option value="deadline-soon">Sort: Deadline (Closing Soon)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Filters Sidebar + Results List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Filters Sidebar */}
          <div
            className={`lg:block ${
              mobileFilterOpen
                ? 'fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center'
                : 'hidden'
            }`}
          >
            <div
              ref={mobileFilterOpen ? mobileFilterTrapRef : undefined}
              role={mobileFilterOpen ? 'dialog' : undefined}
              aria-modal={mobileFilterOpen ? 'true' : undefined}
              aria-label="Filter Criteria"
              tabIndex={mobileFilterOpen ? -1 : undefined}
              className={`bg-white rounded-2xl border border-[#E7E9F0] p-5 shadow-card space-y-6 outline-none ${
                mobileFilterOpen ? 'max-w-md w-full max-h-[90vh] overflow-y-auto' : ''
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E9F0]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#5145CD]" />
                  <span className="text-sm font-bold text-[#17213A]">Filter Criteria</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-semibold text-[#5145CD] hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
                {mobileFilterOpen && (
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="lg:hidden text-xs font-bold text-[#667085] p-1"
                  >
                    Done
                  </button>
                )}
              </div>

              {/* Education Level */}
              <div className="space-y-2">
                <label htmlFor="filter-edu-level" className="text-xs font-bold text-[#17213A] uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>Education Level</span>
                </label>
                <select
                  id="filter-edu-level"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A]"
                >
                  <option value="all">All Levels</option>
                  {educationLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Stream */}
              <div className="space-y-2">
                <label htmlFor="filter-stream" className="text-xs font-bold text-[#17213A] uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>Academic Stream</span>
                </label>
                <select
                  id="filter-stream"
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value)}
                  className="w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A]"
                >
                  <option value="all">All Streams</option>
                  {academicStreams.map((stm) => (
                    <option key={stm} value={stm}>
                      {stm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="filter-category" className="text-xs font-bold text-[#17213A] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>Category</span>
                </label>
                <select
                  id="filter-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="filter-location" className="text-xs font-bold text-[#17213A] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>State / Location</span>
                </label>
                <select
                  id="filter-location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A]"
                >
                  <option value="all">Pan-India & All States</option>
                  <option value="Karnataka">Karnataka Specific</option>
                  <option value="Maharashtra">Maharashtra Specific</option>
                </select>
              </div>

              {/* Deadline Range */}
              <fieldset className="space-y-2 border-0 p-0 m-0">
                <legend className="text-xs font-bold text-[#17213A] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>Deadline Window</span>
                </legend>
                <div className="space-y-1 text-xs">
                  {[
                    { label: 'Any Deadline', value: 'all' },
                    { label: 'Closing in 15 days', value: '15days' },
                    { label: 'Closing in 30 days', value: '30days' },
                    { label: 'Closing in 60 days', value: '60days' },
                  ].map((d) => (
                    <label key={d.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="deadlineRange"
                        value={d.value}
                        checked={deadlineFilter === d.value}
                        onChange={(e) => setDeadlineFilter(e.target.value)}
                        className="text-[#5145CD] focus:ring-[#5145CD]"
                      />
                      <span className="text-[#17213A]">{d.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Min Award Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#17213A]">
                  <label htmlFor="filter-min-grant" className="uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                    <IndianRupee className="w-3.5 h-3.5 text-[#5145CD]" />
                    <span>Min. Grant</span>
                  </label>
                  <span className="tabular-nums text-[#5145CD]">
                    ₹{minAmountFilter.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  id="filter-min-grant"
                  type="range"
                  min="0"
                  max="200000"
                  step="10000"
                  value={minAmountFilter}
                  onChange={(e) => setMinAmountFilter(Number(e.target.value))}
                  className="w-full accent-[#5145CD]"
                />
              </div>

              {/* Annual Family Income Limit Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#17213A]">
                  <label htmlFor="filter-max-income" className="uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                    <IndianRupee className="w-3.5 h-3.5 text-[#5145CD]" />
                    <span>Family Income Limit</span>
                  </label>
                  <span className="tabular-nums text-[#5145CD]">
                    {maxIncomeFilter >= 1000000 ? 'No Limit (All)' : `≤ ₹${maxIncomeFilter.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <input
                  id="filter-max-income"
                  type="range"
                  min="200000"
                  max="1000000"
                  step="50000"
                  value={maxIncomeFilter}
                  onChange={(e) => setMaxIncomeFilter(Number(e.target.value))}
                  className="w-full accent-[#5145CD]"
                  aria-label="Annual family income limit filter"
                />
              </div>
            </div>
          </div>

          {/* Results Grid / List */}
          <div className="lg:col-span-3 space-y-4">
            {filteredScholarships.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#E7E9F0] shadow-card space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EDEBFF] text-[#5145CD] flex items-center justify-center mx-auto">
                  <FilterX className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-lg font-bold text-[#17213A]">No Scholarships Found</h3>
                  <p className="text-xs sm:text-sm text-[#667085]">
                    No opportunities match your current filter criteria. Try adjusting your discipline,
                    widening the grant range, or resetting filters.
                  </p>
                </div>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-[#5145CD] hover:bg-[#4338B8] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-5'
                    : 'space-y-4'
                }
              >
                {filteredScholarships.map((s) => (
                  <ScholarshipCard key={s.id} scholarship={s} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#667085]">Loading scholarship directory...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
