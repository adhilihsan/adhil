import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Bookmark, 
  Flag, 
  CheckCircle2, 
  Sparkles, 
  Award,
  ChevronLeft
} from 'lucide-react';
import { PracticeSession } from '../../types';
import { QuestionCard } from './QuestionCard';

interface PracticeSessionViewProps {
  session: PracticeSession;
  onUpdateAnswer: (questionId: string, answer: string) => void;
  onSubmitAnswer: (questionId: string) => void;
  onToggleBookmark: (questionId: string) => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onSelectQuestion: (index: number) => void;
  onCompleteSession: () => void;
  onExitSession: () => void;
}

export const PracticeSessionView: React.FC<PracticeSessionViewProps> = ({
  session,
  onUpdateAnswer,
  onSubmitAnswer,
  onToggleBookmark,
  onNextQuestion,
  onPrevQuestion,
  onSelectQuestion,
  onCompleteSession,
  onExitSession
}) => {
  const currentIndex = session.currentQuestionIndex;
  const currentQuestion = session.questions[currentIndex];
  const submission = session.submissions[currentQuestion?.id];

  if (!currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center">
        <p>No questions found in this session.</p>
        <button onClick={onExitSession} className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg">
          Exit
        </button>
      </div>
    );
  }

  const answeredCount = Object.values(session.submissions).filter(s => s.isAttempted).length;
  const progressPercent = Math.round(((currentIndex + 1) / session.questions.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Session Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:px-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onExitSession}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Exit to Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-sm sm:text-base text-slate-900">{session.title}</h2>
            <p className="text-xs text-slate-500">
              {answeredCount} of {session.questions.length} questions attempted &bull; Autosaved
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={onCompleteSession}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Finish & View Scorecard</span>
          </button>
        </div>
      </div>

      {/* Question Palette / Indicator Strip */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 overflow-x-auto">
        {session.questions.map((q, idx) => {
          const sub = session.submissions[q.id];
          const isCurrent = idx === currentIndex;
          const isDone = sub && sub.isAttempted;
          const isCorrect = sub && sub.isCorrect;

          let btnClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
          if (isCurrent) {
            btnClass = 'bg-brand-600 text-white font-bold ring-2 ring-brand-300';
          } else if (isDone) {
            btnClass = isCorrect 
              ? 'bg-emerald-100 text-emerald-800 font-semibold' 
              : 'bg-amber-100 text-amber-800 font-semibold';
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(idx)}
              className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all shrink-0 ${btnClass}`}
              title={`Question ${idx + 1}: ${q.topicName}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <QuestionCard
        question={currentQuestion}
        submission={submission}
        questionNumber={currentIndex + 1}
        totalQuestions={session.questions.length}
        onAnswerChange={(ans) => onUpdateAnswer(currentQuestion.id, ans)}
        onSubmitAnswer={() => onSubmitAnswer(currentQuestion.id)}
        onToggleBookmark={() => onToggleBookmark(currentQuestion.id)}
        onRetryQuestion={() => onUpdateAnswer(currentQuestion.id, '')}
        isMockExamMode={false}
      />

      {/* Bottom Paging Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onPrevQuestion}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-xs font-semibold text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Question</span>
        </button>

        {currentIndex < session.questions.length - 1 ? (
          <button
            onClick={onNextQuestion}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onCompleteSession}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Practice & View Results</span>
          </button>
        )}
      </div>

    </div>
  );
};
