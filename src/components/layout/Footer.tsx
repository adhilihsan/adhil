import React from 'react';
import { ShieldCheck, Sparkles, BookOpen, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
              P
            </div>
            <span className="font-semibold text-slate-800">Autonomous Student Question Paper Practice Agent</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-[11px] text-center md:text-right">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Marking Scheme Notice:</strong> Automated answer evaluations and suggested scores are estimates designed to assist study and revision. They do not represent official board evaluation.
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} PrepAgent. Built for focused, stress-free exam preparation.
          </div>
          <div className="flex items-center gap-4">
            <span>Encouraging & Adaptive Learning</span>
            <span>&bull;</span>
            <span>Data stored locally in your browser</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
