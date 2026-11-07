'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import { useGrantly } from '@/context/GrantlyContext';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  ClipboardList,
  Bookmark,
  FileCheck2,
  User,
  Settings,
  GraduationCap,
  RotateCcw,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { stats, profile, resetDemoData } = useGrantly();

  const navigationGroups = [
    {
      label: 'DISCOVER & MATCH',
      items: [
        {
          name: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          name: 'Browse Scholarships',
          href: '/discover',
          icon: Compass,
          badge: stats.totalScholarships > 0 ? stats.totalScholarships.toString() : null,
        },
        {
          name: 'Smart Match AI',
          href: '/smart-match',
          icon: Sparkles,
          badge: stats.eligibleCount > 0 ? `${stats.eligibleCount} Eligible` : 'Active',
          badgeColor: 'bg-[#EDEBFF] text-[#5145CD] border-[#7868F6]/30',
        },
      ],
    },
    {
      label: 'MANAGE APPLICATIONS',
      items: [
        {
          name: 'Application Tracker',
          href: '/applications',
          icon: ClipboardList,
          badge: stats.applicationsCount > 0 ? stats.applicationsCount.toString() : null,
        },
        {
          name: 'Saved Opportunities',
          href: '/saved',
          icon: Bookmark,
          badge: stats.savedCount > 0 ? stats.savedCount.toString() : null,
        },
        {
          name: 'Document Center',
          href: '/documents',
          icon: FileCheck2,
          badge: `${stats.documentsReadyCount}/${stats.documentsTotalCount}`,
        },
      ],
    },
    {
      label: 'ACCOUNT & SYSTEM',
      items: [
        {
          name: 'Student Profile',
          href: '/profile',
          icon: User,
          badge: `${stats.profileCompletionPercent}%`,
        },
        {
          name: 'Settings & Security',
          href: '/settings',
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  return (
    <aside
      className="flex flex-col h-full bg-[#FFFFFF] border-r border-[#E7E9F0] w-72 flex-shrink-0 select-none"
      aria-label="Main Navigation"
    >
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-[#E7E9F0]/80">
        <Logo size="md" />
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-3 text-[11px] font-bold tracking-wider text-[#667085] uppercase">
              {group.label}
            </p>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#5145CD] text-white shadow-sm'
                        : 'text-[#17213A] hover:bg-[#F7F8FC] hover:text-[#5145CD]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-[18px] h-[18px] transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-[#667085] group-hover:text-[#5145CD]'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-white/20 text-white border-white/20'
                            : item.badgeColor || 'bg-[#F7F8FC] text-[#667085] border-[#E7E9F0]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick Demo Reset & User Card */}
      <div className="p-4 border-t border-[#E7E9F0] bg-[#F7F8FC]/60 space-y-3">
        {/* Reset Demo State button */}
        <button
          onClick={resetDemoData}
          type="button"
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold text-[#667085] hover:text-[#5145CD] hover:bg-white border border-[#E7E9F0] transition-colors"
          title="Reset demonstration data to initial default states"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>

        {/* Profile preview snippet */}
        <Link
          href="/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-3 p-2 rounded-xl bg-white border border-[#E7E9F0] hover:border-[#7868F6]/40 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[#EDEBFF] text-[#5145CD] font-bold flex items-center justify-center text-sm border border-[#7868F6]/20 flex-shrink-0">
            {profile.fullName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#17213A] truncate">{profile.fullName}</p>
            <p className="text-[11px] text-[#667085] truncate">{profile.institution}</p>
          </div>
          <GraduationCap className="w-4 h-4 text-[#7868F6] flex-shrink-0" />
        </Link>
      </div>
    </aside>
  );
}
