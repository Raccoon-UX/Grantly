'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ToastContainer } from '@/components/shared/ToastContainer';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Compass, Sparkles, ClipboardList, User } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Bottom navigation items for mobile
  const mobileNavItems = [
    { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Explore', href: '/discover', icon: Compass },
    { label: 'Smart Match', href: '/smart-match', icon: Sparkles },
    { label: 'Tracker', href: '/applications', icon: ClipboardList },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F8FC]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E7E9F0] py-2 px-3 z-30 flex items-center justify-around"
        aria-label="Mobile Navigation"
      >
        {mobileNavItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-bold transition-all ${
                isActive ? 'text-[#5145CD]' : 'text-[#667085] hover:text-[#17213A]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#5145CD]' : 'text-[#667085]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Toast Notification Mount */}
      <ToastContainer />
    </div>
  );
}
