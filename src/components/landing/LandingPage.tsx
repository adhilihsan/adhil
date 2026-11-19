import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Upload, 
  FileCheck, 
  BarChart, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onStartDemo: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartDemo, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800">
      
      {/* Top Banner Navigation */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-slate-900">PrepAgent</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                Exam AI
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Autonomous Question Paper Practice Agent</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onStartDemo}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
          >
            <span>Launch Practice Agent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-medium mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Transform any syllabus & past exam papers into personal practice papers</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Practice the exact exam questions you need to conquer your syllabus.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload your syllabus or past question papers. The agent extracts recurring question patterns, generates targeted practice papers, scores your answers with rubric-level feedback, and shows what to study next.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onStartDemo}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Start Practice (Pre-loaded Class 12 Physics)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-sm transition-all"
          >
            Create Your Custom Student Profile
          </button>
        </div>

        {/* Feature highlight badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Rubric-based grading</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Supports MCQ, Numericals & Written answers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Timed Mock Exam simulator</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Autosaves progress continuously</span>
          </div>
        </div>
      </section>

      {/* Visual Workflow: The 4 Steps */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">How It Works</h2>
          <p className="text-2xl font-bold text-slate-900 mt-1">Autonomous preparation from syllabus to exam day</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center mb-4 font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Add Syllabus & Papers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload PDF or paste topics. The agent automatically extracts chapter units, weightage, and recurring question styles.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-accent-600 flex items-center justify-center mb-4 font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Generate Practice Papers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Choose single topics or balanced exam papers. Supports MCQs, short explanations, multi-step derivations, and numericals.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Rubric-Based Feedback</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated scoring evaluates criteria, highlights missing points, and provides reference model solutions.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-bold text-sm">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Adaptive Study Plan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Daily study roadmap adjusts based on your weakest topics and target exam countdown.
            </p>
          </div>

        </div>
      </section>

      {/* Interactive Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-4 border border-brand-500/30">
              <Clock className="w-3.5 h-3.5" />
              <span>Realistic Timed Mock Exams</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Build exam stamina with live countdowns and autosave.
            </h2>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Simulate actual board & standardized test constraints. Mark questions for review, jump across the question palette, and submit with full confidence knowing progress is never lost.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={onStartDemo}
                className="px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <span>Try Timed Mock Exam Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
