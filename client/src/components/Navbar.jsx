import { useEffect, useRef, useState } from "react";

export default function Navbar({ name, onLogout }) {
  const initial = name ? name.charAt(0).toUpperCase() : "A";
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#0b1220] border-b border-slate-800/60">
      <div className="max-w-5xl mx-auto px-5 h-[58px] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-[27px] w-[27px] rounded-[8px] bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-display font-bold text-xs shadow-md shadow-indigo-900/40">
            F
          </div>
          <span className="font-display font-semibold text-white text-[14.5px] tracking-tight">
            Formify
          </span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 pl-[5px] pr-3 py-[5px] rounded-[10px] bg-white/[0.08] border border-white/[0.06] hover:bg-white/[0.12] transition-colors"
          >
            <span className="relative">
              <span className="h-[27px] w-[27px] rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500 text-white text-[10.5px] font-semibold flex items-center justify-center">
                {initial}
              </span>
              <span className="absolute -bottom-px -right-px h-2 w-2 rounded-full bg-emerald-400 border-2 border-[#0b1220]" />
            </span>
            <span className="text-slate-100 text-[13px] font-medium">{name}</span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {open && (
            <div className="absolute top-[44px] right-0 bg-white rounded-xl shadow-[0_12px_32px_rgba(15,23,42,0.16),0_2px_6px_rgba(15,23,42,0.08)] border border-slate-100 w-[200px] overflow-hidden z-10 animate-scale-in">
              <div className="p-3.5 flex items-center gap-2.5 border-b border-slate-100">
                <div className="h-[34px] w-[34px] rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {initial}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 truncate">{name}</p>
                  <p className="text-[11px] text-slate-400 mt-px">Administrator</p>
                </div>
              </div>
              <div className="p-1.5">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[12.5px] font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
