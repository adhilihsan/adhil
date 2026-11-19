import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  Bookmark, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  Layers,
  ChevronLeft
} from 'lucide-react';
import { PracticeSession } from '../../types';
import { QuestionCard } from '../practice/QuestionCard';
import { ExamSubmitModal } from './ExamSubmitModal';
import { formatTime } from '../../utils/helpers';

interface MockExamViewProps {
  session: PracticeSession;
  onUpdateAnswer: (questionId: string, answer: string) => void;
  onToggleFlag: (questionId: string) => void;
  onToggleBookmark: (questionId: string) => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onSelectQuestion: (index: number) => void;
  onSubmitExam: () => void;
  onExitExam: () => void;
}

export const MockExamView: React.FC<MockExamViewProps> = ({
  session,
  onUpdateAnswer,
  onToggleFlag,
  onToggleBookmark,
  onNextQuestion,
  onPrevQuestion,
  onSelectQuestion,
  onSubmitExam,
  onExitExam
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(session.timeRemainingSeconds ?? ((session.durationLimitMinutes ?? 60) * 60));
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const currentIndex = session.currentQuestionIndex;
  const currentQuestion = session.questions[currentIndex];
  const submission = session.submissions[currentQuestion?.id];

  // Timer countdown hook
  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onSubmitExam]);

  // Is timer in warning zone (< 5 minutes)
  const isTimeCritical = timeLeft < 300;

  if (!currentQuestion) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Fixed Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:px-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSubmitModalOpen(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Exit / Submit"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-slate-900">{session.title}</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                Mock Exam
              </span>
            </div>
            <p className="text-xs text-slate-500">Autosaving enabled &bull; Answers locked on submit</p>
          </div>
        </div>

        {/* Live Timer Pill */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-bold shadow-xs transition-colors ${
            isTimeCritical 
              ? 'bg-rose-50 border-rose-300 text-rose-700 animate-timer-warning' 
              : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-600' : 'text-slate-300'}`} />
            <span>{formatTime(timeLeft)} Remaining</span>
          </div>

          <button
            onClick={() => setSubmitModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Submit Paper
          </button>
        </div>

      </div>

      {/* Main Split Layout: Question Card on Left, Question Palette on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left 3 Columns: Active Question */}
        <div className="lg:col-span-3 space-y-4">
          <QuestionCard
            question={currentQuestion}
            submission={submission}
            questionNumber={currentIndex + 1}
            totalQuestions={session.questions.length}
            onAnswerChange={(ans) => onUpdateAnswer(currentQuestion.id, ans)}
            onSubmitAnswer={() => {}}
            onToggleBookmark={() => onToggleBookmark(currentQuestion.id)}
            onToggleFlag={() => onToggleFlag(currentQuestion.id)}
            isMockExamMode={true}
          />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onPrevQuestion}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-xs font-semibold text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => onToggleFlag(currentQuestion.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                submission?.isFlagged 
                  ? 'bg-purple-50 border-purple-300 text-purple-700' 
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${submission?.isFlagged ? 'fill-purple-600 text-purple-600' : ''}`} />
              <span>{submission?.isFlagged ? 'Flagged for Review' : 'Flag for Review'}</span>
            </button>

            {currentIndex < session.questions.length - 1 ? (
              <button
                onClick={onNextQuestion}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Save & Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setSubmitModalOpen(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Review & Submit</span>
              </button>
            )}
          </div>
        </div>

        {/* Right 1 Column: Question Palette */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Question Palette</h3>
            <span className="text-xs font-bold text-slate-800">
              {Object.values(session.submissions).filter(s => s.studentAnswer?.trim()).length} / {session.questions.length} Done
            </span>
          </div>

          {/* Palette Grid */}
          <div className="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto p-1">
            {session.questions.map((q, idx) => {
              const sub = session.submissions[q.id];
              const isCurrent = idx === currentIndex;
              const hasAnswer = sub && sub.studentAnswer && sub.studentAnswer.trim().length > 0;
              const isFlagged = sub && sub.isFlagged;

              let style = 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200';

              if (isCurrent) {
                style = 'bg-brand-600 text-white font-bold ring-2 ring-brand-300 border-brand-600';
              } else if (isFlagged) {
                style = 'bg-purple-100 text-purple-900 font-semibold border-purple-300';
              } else if (hasAnswer) {
                style = 'bg-emerald-100 text-emerald-900 font-semibold border-emerald-300';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => onSelectQuestion(idx)}
                  className={`relative w-full aspect-square rounded-xl border text-xs flex items-center justify-center transition-all ${style}`}
                >
                  {idx + 1}
                  {isFlagged && !isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-600 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Palette Legend */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-100 border border-purple-300" />
              <span>Flagged for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
              <span>Unattempted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-brand-600 border border-brand-600" />
              <span>Current Question</span>
            </div>
          </div>

          <button
            onClick={() => setSubmitModalOpen(true)}
            className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Submit Paper
          </button>
        </div>

      </div>

      {/* Confirmation Modal */}
      <ExamSubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onConfirmSubmit={() => {
          setSubmitModalOpen(false);
          onSubmitExam();
        }}
        session={session}
      />

    </div>
  );
};
