import React, { useState } from 'react';
import { 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  ShieldCheck, 
  Layers,
  ArrowLeft
} from 'lucide-react';
import { Subject, DifficultyLevel } from '../../types';

interface MockExamStartProps {
  currentSubject: Subject;
  onBack: () => void;
  onLaunchMockExam: (config: {
    durationMinutes: number;
    questionCount: number;
    difficulty: DifficultyLevel;
  }) => void;
}

export const MockExamStart: React.FC<MockExamStartProps> = ({
  currentSubject,
  onBack,
  onLaunchMockExam
}) => {
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [questionCount, setQuestionCount] = useState(15);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');

  const totalEstimatedMarks = questionCount * 3;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-brand-900 text-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-300 mb-2">
            <Clock className="w-4 h-4" />
            <span>Official Exam Simulation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Full-Length Timed Mock Examination
          </h1>
          <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Test your exam readiness under authentic timed conditions. Balanced topic coverage, strict countdown timer, and automated rubric scoring upon completion.
          </p>
        </div>

        {/* Configuration Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Duration */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Exam Duration</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
              >
                <option value={30}>30 Minutes (Sprint)</option>
                <option value={60}>60 Minutes (Standard)</option>
                <option value={90}>90 Minutes (Section Test)</option>
                <option value={180}>180 Minutes (Full Board Exam)</option>
              </select>
            </div>

            {/* Questions count */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Question Count</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800"
              >
                <option value={10}>10 Questions (~30 Marks)</option>
                <option value={15}>15 Questions (~45 Marks)</option>
                <option value={20}>20 Questions (~60 Marks)</option>
                <option value={33}>33 Questions (70 Marks Full Paper)</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 capitalize"
              >
                <option value="easy">Easy (Foundational)</option>
                <option value="medium">Medium (Board Exam Standard)</option>
                <option value="hard">Hard (Top Marks Rigor)</option>
              </select>
            </div>

          </div>

          {/* Exam Rules & Instructions */}
          <div className="p-5 rounded-2xl bg-brand-50/50 border border-brand-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Exam Rules & Navigation Instructions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-950/80">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Autosave Protected:</strong> Your responses are continuously saved in local storage. Refreshing will not lose your progress.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Question Palette:</strong> Freely jump between questions, flag doubts for review, and inspect unanswered items.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Rubric Evaluation:</strong> Numerical & written answers will be graded by the AI marking agent upon final submission.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Timer Warning:</strong> A visual reminder alerts you when 5 minutes remain. The exam auto-submits at 00:00.
                </span>
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Paper: <strong className="text-slate-800">{currentSubject.name}</strong> &bull; Coverage: All {currentSubject.topics.length} Syllabus Chapters
            </div>

            <button
              onClick={() => onLaunchMockExam({ durationMinutes, questionCount, difficulty })}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>I am Ready &mdash; Start Mock Exam</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
