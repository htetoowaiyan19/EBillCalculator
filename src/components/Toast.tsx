import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'warning';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4 animate-in slide-in-from-bottom-6 fade-in duration-300 pointer-events-none">
      <div
        className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-full backdrop-blur-2xl shadow-2xl border text-sm font-extrabold font-burmese ${
          type === 'warning'
            ? 'bg-amber-950/85 text-amber-200 border-amber-500/40 shadow-amber-950/40'
            : 'bg-slate-950/85 text-white border-white/20 shadow-black/50'
        }`}
      >
        {type === 'warning' ? (
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        )}
        <span className="leading-snug">{message}</span>
      </div>
    </div>
  );
};
