import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'compact' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withLink?: boolean;
}

export function Logo({
  variant = 'full',
  size = 'md',
  className = '',
  withLink = true,
}: LogoProps) {
  const sizeMap = {
    sm: { symbol: 24, font: 'text-lg', subtitle: 'text-[9px]' },
    md: { symbol: 32, font: 'text-xl', subtitle: 'text-[11px]' },
    lg: { symbol: 42, font: 'text-2xl', subtitle: 'text-xs' },
    xl: { symbol: 54, font: 'text-3xl', subtitle: 'text-sm' },
  };

  const { symbol: symbolSize, font: fontSize, subtitle: subSize } = sizeMap[size];

  const symbolSvg = (
    <svg
      width={symbolSize}
      height={symbolSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="grantlySparkGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7868F6" />
          <stop offset="0.5" stopColor="#5145CD" />
          <stop offset="1" stopColor="#3526A8" />
        </linearGradient>
        <linearGradient id="grantlyFacetGrad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="sparkCenterGlow" cx="24" cy="24" r="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#EDEBFF" stopOpacity="0.6" />
          <stop offset="1" stopColor="#5145CD" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Rounded dynamic shield container */}
      <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#grantlySparkGrad)" />
      
      {/* Smart Spark 4-pointed diamond star */}
      <path
        d="M24 10 C24 18 20 22 12 24 C20 26 24 30 24 38 C24 30 28 26 36 24 C28 22 24 18 24 10 Z"
        fill="#FFFFFF"
      />

      {/* Modern Opportunity Sparkle accent */}
      <circle cx="34" cy="14" r="2.5" fill="#EDEBFF" />
      <circle cx="14" cy="34" r="1.5" fill="#EDEBFF" opacity="0.8" />

      {/* Center Intelligence Core */}
      <circle cx="24" cy="24" r="3.5" fill="url(#sparkCenterGlow)" />
    </svg>
  );

  const textBlock = (
    <div className="flex flex-col leading-none">
      <div className="flex items-center gap-1.5">
        <span
          className={`font-bold tracking-tight ${fontSize} ${
            variant === 'white' ? 'text-white' : 'text-[#17213A]'
          }`}
          style={{ letterSpacing: '-0.03em' }}
        >
          GRANTLY
        </span>
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EDEBFF] text-[#5145CD] border border-[#7868F6]/20">
          PRO
        </span>
      </div>
      {variant !== 'compact' && (
        <span
          className={`font-medium tracking-wide ${subSize} mt-0.5 ${
            variant === 'white' ? 'text-white/80' : 'text-[#667085]'
          }`}
        >
          Every Opportunity Within Reach.
        </span>
      )}
    </div>
  );

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {symbolSvg}
      {variant !== 'compact' && textBlock}
    </div>
  );

  if (withLink) {
    return (
      <Link
        href="/dashboard"
        className="inline-flex items-center rounded-lg transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5145CD]"
      >
        {content}
      </Link>
    );
  }

  return content;
}
