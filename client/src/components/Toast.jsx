import { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-down">
      <div className="flex items-center gap-2.5 bg-slate-900 text-white text-sm rounded-lg pl-3.5 pr-4 py-3 shadow-lg shadow-slate-900/20">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 shrink-0">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        {message}
      </div>
    </div>
  );
}
