'use client';

import React from 'react';
import { useGrantly } from '@/context/GrantlyContext';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useGrantly();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#16A779] flex-shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#DC5260] flex-shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-[#E5A32A] flex-shrink-0" />,
          info: <Info className="w-5 h-5 text-[#3486D9] flex-shrink-0" />,
        };

        const borderStyles = {
          success: 'border-[#16A779]/30 bg-white shadow-lg',
          error: 'border-[#DC5260]/30 bg-white shadow-lg',
          warning: 'border-[#E5A32A]/30 bg-white shadow-lg',
          info: 'border-[#3486D9]/30 bg-white shadow-lg',
        };

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borderStyles[toast.type]} transition-all animate-in slide-in-from-bottom-2 duration-200`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#17213A]">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-[#667085] mt-0.5 line-clamp-2">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#667085] hover:text-[#17213A] p-1 rounded-md transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
