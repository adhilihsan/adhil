import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  Bookmark, 
  ArrowRight, 
  RotateCcw, 
  Target, 
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { PracticeSession, Question, AnswerSubmission } from '../../types';
import { triggerCelebration, getDifficultyColor, getMasteryColor } from '../../utils/helpers';

interface ExamResultsViewProps {
  session: PracticeSession;
  onRetrySession: () => void;
  onPracticeWeakTopics: (topicId: string) => void;
  onBackToDashboard: () => void;
}

export const ExamResultsView: React.FC<ExamResultsViewProps> = ({
  session,
  onRetrySession,
  onPracticeWeakTopics,
  onBackToDashboard
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'bookmarked'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const percentage = session.percentage ?? Math.round(((session.score || 0) / Math.max(1, session.totalMarks || 1)) * 100);

  // Trigger celebration confetti if percentage is good
  useEffect(() => {
    if (percentage >= 65) {
      triggerCelebration();
    }
  }, [percentage]);

  const questions = session.questions;
  const submissions = session.submissions;

  // Breakdown by topic
  const topicStats: Record<string, { total: number; correct: number; marks: number; maxMarks: number }> = {};
  questions.forEach(q => {
    const sub = submissions[q.id];
    if (!topicStats[q.topicName]) {
      topicStats[q.topicName] = { total: 0, correct: 0, marks: 0, maxMarks: 0 };
    }
    topicStats[q.topicName].total += 1;
    topicStats[q.topicName].maxMarks += q.marks;
    if (sub && sub.isAttempted) {
      topicStats[q.topicName].marks += (sub.marksObtained || 0);
      if (sub.isCorrect || (sub.marksObtained && sub.marksObtained >= q.marks * 0.7)) {
        topicStats[q.topicName].correct += 1;
      }
    }
  });

  // Find lowest scoring topic
  let weakestTopicName = '';
  let minTopicRatio = 1.0;
  Object.entries(topicStats).forEach(([name, stat]) => {
    const ratio = stat.marks / Math.max(1, stat.maxMarks);
    if (ratio < minTopicRatio) {
      minTopicRatio = ratio;
      weakestTopicName = name;
    }
  });

  const filteredQuestions = questions.filter(q => {
    const sub = submissions[q.id];
    if (filter === 'incorrect') {
      return !sub || !sub.isCorrect || ((sub.marksObtained || 0) < q.marks * 0.7);
    }
    if (filter === 'bookmarked') {
      return sub && sub.isBookmarked;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Scorecard */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-inner shrink-0 ${
              percentage >= 75 
                ? 'bg-emerald-50 text-emerald-700 ring-2 ring-emerald-300' 
                : percentage >= 50
                  ? 'bg-amber-50 text-amber-700 ring-2 ring-amber-300'
                  : 'bg-rose-50 text-rose-700 ring-2 ring-rose-300'
            }`}>
              {percentage}%
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  {session.mode === 'mock_exam' ? 'Mock Exam Scorecard' : 'Practice Scorecard'}
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs text-slate-500">{new Date(session.startTime).toLocaleDateString()}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{session.title}</h1>
              <p className="text-xs text-slate-500 mt-1">
                Total Score: <strong className="text-slate-800">{session.score}</strong> / {session.totalMarks} Marks
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <button
              onClick={onRetrySession}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Session</span>
            </button>
            <button
              onClick={onBackToDashboard}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Disclaimer Strip */}
        <div className="py-3 px-4 mt-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-brand-600 shrink-0" />
          <span>
            <strong>Marking Notice:</strong> Objective items are graded against official keys. Written answer scores are automated estimates based on standard marking rubrics.
          </span>
        </div>

        {/* Topic-by-Topic Performance Breakdown */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Topic Performance Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(topicStats).map(([topicName, stat], idx) => {
              const topicPct = Math.round((stat.marks / Math.max(1, stat.maxMarks)) * 100);
              const mastery = getMasteryColor(topicPct);

              return (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-xs text-slate-800 truncate" title={topicName}>{topicName}</span>
                    <span className={`text-xs font-bold shrink-0 ${mastery.text}`}>{topicPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${mastery.bar}`} style={{ width: `${topicPct}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{stat.correct} / {stat.total} Solved</span>
                    <span>{stat.marks} / {stat.maxMarks} Marks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent Follow-up Recommendation Banner */}
        {weakestTopicName && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Next Recommended Study Step</span>
              </span>
              <p className="text-xs text-amber-800">
                You scored lowest in <strong>{weakestTopicName}</strong>. Practice 5 targeted questions to plug this conceptual gap.
              </p>
            </div>
            <button
              onClick={() => onPracticeWeakTopics(questions.find(q => q.topicName === weakestTopicName)?.topicId || '')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <span>Practice {weakestTopicName.split(' ')[0]}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* Question-by-Question Detailed Review */}
      <div className="space-y-4">
        
        {/* Review Filter Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Question-by-Question Review</h2>
            <p className="text-xs text-slate-500">Examine model solutions, rubrics, and feedback</p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'incorrect' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Needs Improvement ({questions.filter(q => {
                const sub = submissions[q.id];
                return !sub || !sub.isCorrect || ((sub.marksObtained || 0) < q.marks * 0.7);
              }).length})
            </button>
            <button
              onClick={() => setFilter('bookmarked')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'bookmarked' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Bookmarked ({questions.filter(q => submissions[q.id]?.isBookmarked).length})
            </button>
          </div>
        </div>

        {/* Questions Review List */}
        <div className="space-y-3">
          {filteredQuestions.map((q, idx) => {
            const sub = submissions[q.id];
            const isCorrect = sub && (sub.isCorrect || (sub.marksObtained && sub.marksObtained >= q.marks * 0.7));
            const isExpanded = expandedQuestionId === q.id;
            const diffClass = getDifficultyColor(q.difficulty);

            return (
              <div 
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Collapsed Header */}
                <div 
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60"
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-700" />
                      )}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">Q{questions.indexOf(q) + 1}</span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-xs text-brand-700 font-medium">{q.topicName}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase ${diffClass}`}>
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium mt-1 line-clamp-1">{q.text}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">
                        {sub?.marksObtained ?? 0} / {q.marks} pts
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 space-y-4 text-xs">
                    
                    {/* Full question text */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Question Statement
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed">{q.text}</p>
                    </div>

                    {/* Student answer vs Reference */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">
                          Your Submitted Answer:
                        </span>
                        <p className={`font-mono leading-relaxed whitespace-pre-line ${
                          sub?.studentAnswer ? 'text-slate-800' : 'text-slate-400 italic'
                        }`}>
                          {sub?.studentAnswer || 'No answer submitted.'}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-emerald-200 bg-emerald-50/20">
                        <span className="text-[11px] font-bold text-emerald-800 block mb-1">
                          Reference Model Solution:
                        </span>
                        <p className="font-mono text-slate-800 leading-relaxed whitespace-pre-line">
                          {q.correctAnswer ? `Correct Choice / Value: ${q.correctAnswer} ${q.unit || ''}` : q.referenceAnswer}
                        </p>
                      </div>
                    </div>

                    {/* Rubric evaluation notes */}
                    {sub?.rubricEvaluation && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          AI Rubric Feedback & Breakdown
                        </span>
                        <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                          <p className="text-slate-700 leading-relaxed">{sub.rubricEvaluation.overallFeedback}</p>
                          {sub.rubricEvaluation.criteriaScores.map((c, i) => (
                            <div key={i} className="flex justify-between text-[11px] text-slate-600 border-t border-slate-100 pt-1.5">
                              <span><strong>{c.criterion}:</strong> {c.feedback}</span>
                              <span className="font-bold shrink-0 ml-2">{c.awarded} / {c.max} pts</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-200 text-brand-950">
                        <span className="text-[11px] font-bold block mb-0.5">Detailed Explanation:</span>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
