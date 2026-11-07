import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'blue';
}

function StatCardComponent({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  colorScheme = 'indigo',
}: StatCardProps) {
  const styles = {
    indigo: {
      bg: 'bg-white',
      border: 'border-[#E7E9F0]',
      iconBg: 'bg-[#EDEBFF] text-[#5145CD]',
    },
    emerald: {
      bg: 'bg-white',
      border: 'border-[#E7E9F0]',
      iconBg: 'bg-emerald-50 text-[#16A779]',
    },
    amber: {
      bg: 'bg-white',
      border: 'border-[#E7E9F0]',
      iconBg: 'bg-amber-50 text-[#E5A32A]',
    },
    blue: {
      bg: 'bg-white',
      border: 'border-[#E7E9F0]',
      iconBg: 'bg-blue-50 text-[#3486D9]',
    },
  };

  const scheme = styles[colorScheme];

  return (
    <div
      className={`p-5 rounded-2xl border ${scheme.border} ${scheme.bg} shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#667085] uppercase tracking-wider">{title}</p>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#17213A] mt-1 tabular-nums">
            {value}
          </div>
        </div>
        <div className={`w-10 h-10 rounded-xl ${scheme.iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="mt-3 pt-3 border-t border-[#E7E9F0]/60 flex items-center justify-between text-xs">
          {subtitle && <span className="text-[#667085] truncate">{subtitle}</span>}
          {badge && (
            <span className="font-semibold text-[#5145CD] bg-[#EDEBFF] px-2 py-0.5 rounded-full text-[10px]">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export const StatCard = React.memo(StatCardComponent);
