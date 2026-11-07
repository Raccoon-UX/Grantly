import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import {
  Sparkles,
  Compass,
  ClipboardList,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Calendar,
  Building2,
  Lock,
} from 'lucide-react';
import { DEMO_SCHOLARSHIPS } from '@/data/scholarships';
import { formatCurrencyINR } from '@/lib/utils';

export default function LandingPage() {
  const featured = DEMO_SCHOLARSHIPS.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col text-[#17213A] selection:bg-[#EDEBFF] selection:text-[#5145CD]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E7E9F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo size="lg" />

          <div className="flex items-center gap-3">
            <Link
              href="/discover"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#17213A] hover:text-[#5145CD] hover:bg-[#F7F8FC] transition-colors"
            >
              Browse Scholarships
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5145CD] hover:bg-[#4338B8] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#5145CD]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          {/* Subtle background glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#EDEBFF] via-[#7868F6]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
            aria-hidden="true"
          />

          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDEBFF] text-[#5145CD] border border-[#7868F6]/30 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#7868F6]" />
              <span>THE OUTPOST HACKATHON — FRONTEND ARENA EDITION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#17213A] leading-[1.12]">
              Every Opportunity <br />
              <span className="bg-gradient-to-r from-[#5145CD] via-[#7868F6] to-[#3526A8] bg-clip-text text-transparent">
                Within Reach.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-[#667085] max-w-2xl mx-auto leading-relaxed">
              GRANTLY is the unified scholarship discovery and management platform for ambitious students.
              Deterministic matching, proactive deadline radaring, and automated document checklist tracking.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#5145CD] hover:bg-[#4338B8] text-white font-bold text-sm shadow-elevated transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/discover"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-gray-50 border border-[#E7E9F0] text-[#17213A] font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#5145CD]" />
                <span>Explore 14+ Scholarships</span>
              </Link>
            </div>

            {/* Credibility Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#667085]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#16A779]" />
                100% Deterministic Matching
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A779]" />
                Zero PII Collected
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#5145CD]" />
                National & Corporate Portals
              </span>
            </div>
          </div>
        </section>

        {/* Dynamic Metric Counter Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white border border-[#E7E9F0] shadow-card text-center">
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#5145CD] tabular-nums">
                ₹1.4+ Cr
              </div>
              <p className="text-xs font-semibold text-[#667085] mt-1">Aggregated Grant Pool</p>
            </div>
            <div className="p-3 border-l border-[#E7E9F0]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tabular-nums">
                14+
              </div>
              <p className="text-xs font-semibold text-[#667085] mt-1">Curated Fellowships</p>
            </div>
            <div className="p-3 border-l border-[#E7E9F0]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#16A779] tabular-nums">
                100%
              </div>
              <p className="text-xs font-semibold text-[#667085] mt-1">Rule-Based Scoring</p>
            </div>
            <div className="p-3 border-l border-[#E7E9F0]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#7868F6] tabular-nums">
                7
              </div>
              <p className="text-xs font-semibold text-[#667085] mt-1">Lifecycle Tracking Stages</p>
            </div>
          </div>
        </section>

        {/* Feature Pillars */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17213A]">
              Engineered for Real Student Success
            </h2>
            <p className="text-xs sm:text-sm text-[#667085]">
              Every module is designed to eliminate uncertainty and streamline funding workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E7E9F0] shadow-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EDEBFF] text-[#5145CD] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#17213A]">Transparent Smart Match</h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                Deterministic matching engine that evaluates education level, academic stream, minimum CGPA, family income limits, and state domiciles with clear explanations.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E7E9F0] shadow-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#E5A32A] flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#17213A]">Proactive Deadline Radar</h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                Automated countdown badges and alerts identify opportunities expiring soon so you never miss a submission window.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E7E9F0] shadow-card space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A779] flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#17213A]">Document Center</h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                Keep bonafide certificates, income proofs, transcripts, and category credentials organized locally before you submit on official portals.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Scholarships Preview */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#17213A]">Featured Opportunities</h2>
              <p className="text-xs sm:text-sm text-[#667085]">
                High-impact national programs with active application deadlines.
              </p>
            </div>
            <Link
              href="/discover"
              className="text-xs sm:text-sm font-semibold text-[#5145CD] hover:underline flex items-center gap-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl border border-[#E7E9F0] p-6 shadow-card flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDEBFF] text-[#5145CD]">
                    {s.category}
                  </span>
                  <h3 className="text-base font-bold text-[#17213A] line-clamp-1">{s.name}</h3>
                  <p className="text-xs text-[#667085] flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#8F9BB3]" />
                    <span>{s.provider}</span>
                  </p>
                  <p className="text-xs text-[#667085] line-clamp-2">{s.description}</p>
                </div>

                <div className="pt-4 border-t border-[#E7E9F0] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#667085]">Grant</span>
                    <p className="text-base font-extrabold text-[#17213A] tabular-nums">
                      {formatCurrencyINR(s.awardAmount)}
                    </p>
                  </div>
                  <Link
                    href={`/scholarships/${s.id}`}
                    className="px-3 py-1.5 rounded-xl bg-[#5145CD] text-white text-xs font-semibold hover:bg-[#4338B8]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E7E9F0] py-12 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-[#667085]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <Logo size="sm" />
          <p>© 2026 GRANTLY. Built for Frontend Arena — The Outpost. WCAG 2.2 AA Target Compliant.</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-[#5145CD]">
              Dashboard
            </Link>
            <Link href="/discover" className="hover:text-[#5145CD]">
              Scholarships
            </Link>
            <Link href="/smart-match" className="hover:text-[#5145CD]">
              Smart Match
            </Link>
            <Link href="/settings" className="hover:text-[#5145CD]">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
