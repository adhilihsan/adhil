import React, { useState } from 'react';
import { 
  Bookmark, 
  Flag, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Info,
  Check,
  RotateCcw
} from 'lucide-react';
import { Question, AnswerSubmission } from '../../types';
import { getDifficultyColor } from '../../utils/helpers';

interface QuestionCardProps {
  question: Question;
  submission?: AnswerSubmission;
  questionNumber: number;
  totalQuestions: number;
  onAnswerChange: (answer: string) => void;
  onSubmitAnswer: () => void;
  onToggleBookmark: () => void;
  onToggleFlag?: () => void;
  onRetryQuestion?: () => void;
  isMockExamMode?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  submission,
  questionNumber,
  totalQuestions,
  onAnswerChange,
  onSubmitAnswer,
  onToggleBookmark,
  onToggleFlag,
  onRetryQuestion,
  isMockExamMode = false
}) => {
  const [showHints, setShowHints] = useState(false);
  const [showReferenceAnswer, setShowReferenceAnswer] = useState(false);

  const currentAnswer = submission?.studentAnswer || '';
  const isEvaluated = Boolean(submission?.isAttempted && submission?.rubricEvaluation);
  const rubricEval = submission?.rubricEvaluation;
  const isBookmarked = Boolean(submission?.isBookmarked);
  const isFlagged = Boolean(submission?.isFlagged);

  const diffClass = getDifficultyColor(question.difficulty);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Top Meta Bar */}
      <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-extrabold text-sm text-slate-900">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-slate-300">&bull;</span>
          <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
            {question.topicName}
          </span>
          {question.subtopic && (
            <span className="text-xs text-slate-500 hidden sm:inline">
              ({question.subtopic})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${diffClass}`}>
            {question.difficulty}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
            {question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}
          </span>

          {/* Bookmark Button */}
          <button
            onClick={onToggleBookmark}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked 
                ? 'bg-amber-50 border-amber-300 text-amber-600' 
                : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Bookmark this question'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>

          {/* Flag for Review (especially in mock exam mode) */}
          {onToggleFlag && (
            <button
              onClick={onToggleFlag}
              className={`p-1.5 rounded-lg border transition-colors ${
                isFlagged 
                  ? 'bg-purple-50 border-purple-300 text-purple-600' 
                  : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title={isFlagged ? 'Flagged for review' : 'Flag for review'}
            >
              <Flag className={`w-4 h-4 ${isFlagged ? 'fill-purple-500 text-purple-500' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Main Question Body */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Past paper source badge */}
        {question.pastPaperSource && (
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            <span>Past Exam Pattern:</span>
            <span className="text-slate-700">{question.pastPaperSource}</span>
          </div>
        )}

        {/* Question Text */}
        <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed whitespace-pre-line">
          {question.text}
        </div>

        {/* Hints or Formula Reference (Available in practice mode) */}
        {!isMockExamMode && (question.hints || question.formulaReference) && (
          <div>
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHints ? 'Hide Hints & Formula' : 'Need a hint or formula reference?'}</span>
              {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showHints && (
              <div className="mt-2 p-3.5 rounded-xl bg-brand-50/60 border border-brand-200 text-xs text-brand-900 space-y-1.5">
                {question.formulaReference && (
                  <p>
                    <strong>Formula:</strong> <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-brand-200">{question.formulaReference}</code>
                  </p>
                )}
                {question.hints?.map((hint, idx) => (
                  <p key={idx} className="flex items-start gap-1.5">
                    <span className="text-brand-600 font-bold">&bull;</span>
                    <span>{hint}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Input Interface by Question Type */}

        {/* 1. Multiple Choice Questions */}
        {question.type === 'mcq' && (
          <div className="space-y-2.5 pt-2">
            {question.options?.map((option, idx) => {
              const isSelected = currentAnswer === option;
              let optionStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700';

              if (isEvaluated && !isMockExamMode) {
                if (option === question.correctAnswer) {
                  optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                } else if (isSelected && option !== question.correctAnswer) {
                  optionStyle = 'border-rose-400 bg-rose-50 text-rose-800 ring-1 ring-rose-400';
                }
              } else if (isSelected) {
                optionStyle = 'border-brand-600 bg-brand-50 text-brand-900 font-semibold ring-1 ring-brand-500';
              }

              return (
                <button
                  key={idx}
                  disabled={isEvaluated && !isMockExamMode}
                  onClick={() => onAnswerChange(option)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${optionStyle}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                    isSelected ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-500 border-slate-300'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 mt-0.5">{option}</span>
                  {isEvaluated && !isMockExamMode && option === question.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isEvaluated && !isMockExamMode && isSelected && option !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. Numerical Problem Input */}
        {question.type === 'numerical' && (
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700">Your Numerical Answer</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                disabled={isEvaluated && !isMockExamMode}
                value={currentAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Enter computed value (e.g. 25, 4.8)"
                className="w-full sm:w-64 p-3 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              {question.unit && (
                <span className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {question.unit}
                </span>
              )}
            </div>
            {question.tolerance !== undefined && (
              <p className="text-[11px] text-slate-400">
                Acceptable calculation tolerance: &plusmn;{question.tolerance} {question.unit || ''}
              </p>
            )}
          </div>
        )}

        {/* 3. Short & Long Written Answers */}
        {(question.type === 'short_answer' || question.type === 'long_answer') && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                {question.type === 'short_answer' ? 'Short Explanation' : 'Detailed Derivation & Explanation'}
              </label>
              <span className="text-[11px] text-slate-400">
                {currentAnswer.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              rows={question.type === 'short_answer' ? 4 : 8}
              disabled={isEvaluated && !isMockExamMode}
              value={currentAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder={
                question.type === 'short_answer'
                  ? 'Write your concise, structured response using key terms...'
                  : 'Provide your step-by-step reasoning, formulas, derivation steps, and conclusions...'
              }
              className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed"
            />
          </div>
        )}

        {/* Evaluation Feedback Panel (in practice mode) */}
        {isEvaluated && !isMockExamMode && rubricEval && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200">
            
            {/* Header: Score Awarded */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                  submission.marksObtained && submission.marksObtained >= question.marks * 0.7
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {submission.marksObtained ?? 0}
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Awarded: {submission.marksObtained} / {question.marks} Marks
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {submission.isCorrect ? 'Fully Correct' : 'Partially or Incorrect'}
                  </p>
                </div>
              </div>

              {rubricEval.isEstimate && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>AI Rubric Estimate &bull; Not official marking</span>
                </div>
              )}
            </div>

            {/* Overall Feedback */}
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {rubricEval.overallFeedback}
            </p>

            {/* Rubric Criteria Breakdown */}
            {rubricEval.criteriaScores.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Marking Scheme Criteria
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {rubricEval.criteriaScores.map((crit, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs flex items-start justify-between gap-3">
                      <div>
                        <span className="font-semibold text-slate-800">{crit.criterion}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{crit.feedback}</p>
                      </div>
                      <span className="font-bold text-xs shrink-0 text-slate-700">
                        {crit.awarded} / {crit.max} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Missing Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {rubricEval.keyStrengths.length > 0 && (
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Key Strengths
                  </span>
                  {rubricEval.keyStrengths.map((str, i) => (
                    <p key={i} className="text-[11px] text-emerald-700">&bull; {str}</p>
                  ))}
                </div>
              )}

              {rubricEval.missingPoints.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-1">
                  <span className="font-bold text-rose-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Points to Improve
                  </span>
                  {rubricEval.missingPoints.map((mis, i) => (
                    <p key={i} className="text-[11px] text-rose-700">&bull; {mis}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Toggle Reference Answer */}
            <div className="pt-2">
              <button
                onClick={() => setShowReferenceAnswer(!showReferenceAnswer)}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>{showReferenceAnswer ? 'Hide Reference Model Answer' : 'View Reference Model Solution'}</span>
                {showReferenceAnswer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showReferenceAnswer && (
                <div className="mt-2 p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-mono">
                  {question.referenceAnswer || question.explanation}
                </div>
              )}
            </div>

            {/* Retry Button */}
            {onRetryQuestion && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={onRetryQuestion}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry This Question</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Action Footer (Submit Answer in Practice Mode) */}
      {!isMockExamMode && !isEvaluated && (
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Submit to receive instant rubric scoring and feedback
          </span>
          <button
            onClick={onSubmitAnswer}
            disabled={!currentAnswer.trim()}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Submit & Evaluate Answer</span>
          </button>
        </div>
      )}

    </div>
  );
};
