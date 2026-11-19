import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Flame, 
  BarChart3, 
  Settings, 
  FileText, 
  Clock, 
  Menu, 
  X, 
  LogOut, 
  Sparkles,
  ChevronDown,
  Target
} from 'lucide-react';
import { ActiveScreen, StudentProfile, Subject } from '../../types';

interface NavbarProps {
  currentScreen: ActiveScreen;
  setCurrentScreen: (screen: ActiveScreen) => void;
  profile: StudentProfile;
  subjects: Subject[];
  currentSubject: Subject;
  onSelectSubject: (subjectId: string) => void;
  onLogout: () => void;
  readinessScore: number;
  onOpenPracticeConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  setCurrentScreen,
  profile,
  subjects,
  currentSubject,
  onSelectSubject,
  onLogout,
  readinessScore,
  onOpenPracticeConfig
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as ActiveScreen, label: 'Dashboard', icon: Target },
    { id: 'syllabus' as ActiveScreen, label: 'Syllabus & Papers', icon: FileText },
    { id: 'studyplan' as ActiveScreen, label: 'Study Plan', icon: Calendar },
    { id: 'analytics' as ActiveScreen, label: 'Progress & Analytics', icon: BarChart3 },
    { id: 'settings' as ActiveScreen, label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Subject Selector */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                    PrepAgent
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                    AI Practice
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">Exam Practice & Scoring Agent</p>
              </div>
            </button>

            {/* Current Subject Switcher Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setSubjectDropdownOpen(!subjectDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                <span className="max-w-[150px] truncate">{currentSubject.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {subjectDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setSubjectDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Active Subject
                  </div>
                  {subjects.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        onSelectSubject(sub.id);
                        setSubjectDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        sub.id === currentSubject.id ? 'bg-brand-50/60 font-semibold text-brand-700' : 'text-slate-700'
                      }`}
                    >
                      <span className="truncate">{sub.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        {sub.code}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-slate-100 text-brand-700 font-bold shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Top Actions: Streak, Readiness & Practice Button */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold" title="Consecutive days studied">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{profile.streakDays}d streak</span>
            </div>

            {/* Readiness Gauge Pill */}
            <button 
              onClick={() => setCurrentScreen('analytics')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold hover:bg-brand-100 transition-colors"
              title="Calculated exam readiness"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>{readinessScore}% Ready</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenPracticeConfig}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
            >
              <span>Start Practice</span>
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenPracticeConfig}
              className="px-2.5 py-1 rounded-md bg-brand-600 text-white text-xs font-medium"
            >
              Practice
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
          <div className="pb-2 border-b border-slate-100">
            <label className="text-[11px] font-semibold text-slate-400 uppercase">Subject</label>
            <select
              value={currentSubject.id}
              onChange={(e) => onSelectSubject(e.target.value)}
              className="mt-1 w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 py-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{profile.streakDays} Day Streak</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-brand-50 text-brand-800 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>{readinessScore}% Exam Ready</span>
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentScreen(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">{profile.name}</span>
            <button
              onClick={onLogout}
              className="text-xs text-rose-600 font-medium flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
