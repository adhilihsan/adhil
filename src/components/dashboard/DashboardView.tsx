import React from 'react';
import { 
  Play, 
  Clock, 
  Calendar, 
  Flame, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Award,
  BookOpen,
  FileQuestion,
  RefreshCw,
  Target
} from 'lucide-react';
import { 
  StudentProfile, 
  Subject, 
  AnalyticsSummary, 
  StudyPlanSession, 
  PracticeSession 
} from '../../types';
import { getDaysRemaining, formatMinutesToHours, getMasteryColor } from '../../utils/helpers';

interface DashboardViewProps {
  profile: StudentProfile;
  currentSubject: Subject;
  analytics: AnalyticsSummary;
  studyPlan: StudyPlanSession[];
  recentSessions: PracticeSession[];
  onStartPractice: (topicId?: string) => void;
  onStartMockExam: () => void;
  onNavigateToScreen: (screen: any) => void;
  onToggleSessionComplete: (sessionId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  currentSubject,
  analytics,
  studyPlan,
  recentSessions,
  onStartPractice,
  onStartMockExam,
  onNavigateToScreen,
  onToggleSessionComplete
}) => {
  const daysLeft = getDaysRemaining(currentSubject.targetExamDate || profile.targetExamDate);
  const nextSession = studyPlan.find(s => !s.isCompleted);
  const weakestTopic = [...(currentSubject.topics || [])].sort((a, b) => a.masteryLevel - b.masteryLevel)[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Card: Primary Call to Action & Countdown */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-accent-700 text-white p-6 sm:p-8 shadow-lg shadow-brand-700/20">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-white/95">
              <Sparkles className="w-3.5 h-3.5 text-brand-200" />
              <span>Target: {currentSubject.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready for today's practice session, {profile.name.split(' ')[0]}?
            </h1>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              {nextSession 
                ? `Recommended next step: "${nextSession.title}" based on your past mock exam analysis.` 
                : 'All scheduled sessions for today are complete! Keep your momentum going with adaptive practice.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => onStartPractice()}
              className="px-6 py-3.5 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-brand-700" />
              <span>Continue Adaptive Practice</span>
            </button>
            <button
              onClick={onStartMockExam}
              className="px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Start Timed Mock Exam</span>
            </button>
          </div>
        </div>

        {/* Exam Countdown & Progress Bar Strip */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-white/60 block text-[11px]">Exam Countdown</span>
            <span className="font-bold text-base sm:text-lg">{daysLeft} days remaining</span>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Exam Readiness</span>
            <span className="font-bold text-base sm:text-lg text-emerald-300">{analytics.readinessScore}% Ready</span>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Questions Practiced</span>
            <span className="font-bold text-base sm:text-lg">{analytics.questionsPracticedCount} solved</span>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Study Streak</span>
            <span className="font-bold text-base sm:text-lg text-amber-300 flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300 inline" />
              {profile.streakDays} days active
            </span>
          </div>
        </div>
      </div>

      {/* 3 Key Panels: Weak Topic Focus, Upcoming Study Plan, Readiness Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel 1: Weak Topic Alert & Instant Booster */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Priority Weak Topic</h3>
                  <p className="text-[11px] text-slate-500">Autonomous performance recommendation</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Action Required
              </span>
            </div>

            {weakestTopic ? (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-800 mb-1">
                    <span>{weakestTopic.name}</span>
                    <span className="text-rose-600 font-bold">{weakestTopic.masteryLevel}% Mastery</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${weakestTopic.masteryLevel}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Carries approx. <strong className="text-slate-800">{weakestTopic.estimatedWeightagePercentage}%</strong> of exam weightage. Practicing 5 questions here will boost your overall readiness by ~4%.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <span className="font-semibold text-slate-700 block">Subtopics to focus on:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {weakestTopic.subtopics.slice(0, 3).map((st, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">All topics are currently balanced!</p>
            )}
          </div>

          <button
            onClick={() => onStartPractice(weakestTopic?.id)}
            className="mt-5 w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <span>Practice {weakestTopic?.name.split(' ')[0]} Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Panel 2: Today & Upcoming Study Plan Sessions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Study Plan Roadmap</h3>
                  <p className="text-[11px] text-slate-500">{profile.dailyStudyMinutes} mins daily goal</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToScreen('studyplan')}
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {studyPlan.slice(0, 3).map(session => (
                <div 
                  key={session.id}
                  className={`p-3 rounded-xl border text-xs transition-colors flex items-start justify-between gap-3 ${
                    session.isCompleted ? 'bg-slate-50/70 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-brand-300'
                  }`}
                >
                  <button 
                    onClick={() => onToggleSessionComplete(session.id)}
                    className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {session.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 hover:border-emerald-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold truncate ${session.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {session.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>{session.date}</span>
                      <span>&bull;</span>
                      <span>{session.durationMinutes} mins</span>
                      <span className="capitalize px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px]">
                        {session.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToScreen('studyplan')}
            className="mt-5 w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Interactive Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Panel 3: Syllabus Mastery Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Topic Mastery</h3>
                  <p className="text-[11px] text-slate-500">{currentSubject.topics.length} chapters identified</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToScreen('syllabus')}
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {currentSubject.topics.slice(0, 4).map(topic => {
                const colors = getMasteryColor(topic.masteryLevel);
                return (
                  <div key={topic.id} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-700 truncate max-w-[190px]">{topic.name}</span>
                      <span className={`font-bold ${colors.text}`}>{topic.masteryLevel}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${topic.masteryLevel}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateToScreen('syllabus')}
            className="mt-5 w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Upload Past Papers & Syllabus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Recent Practice & Mock Exam Submissions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Practice Sessions</h3>
            <p className="text-xs text-slate-500">Track and review past answers, rubrics, and mistakes</p>
          </div>
          <button
            onClick={() => onNavigateToScreen('analytics')}
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
          >
            Full Analytics & Scores
          </button>
        </div>

        {recentSessions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentSessions.slice(0, 4).map(session => (
              <div key={session.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                    session.mode === 'mock_exam' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-brand-700'
                  }`}>
                    {session.mode === 'mock_exam' ? 'MOCK' : 'PRAC'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-xs sm:text-sm">{session.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      {new Date(session.startTime).toLocaleDateString()} &bull; {session.questions.length} questions &bull; Mode: {session.mode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {session.percentage !== undefined ? `${session.percentage}%` : `${session.score || 0} pts`}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-semibold">Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileQuestion className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No practice sessions completed yet today.</p>
            <button
              onClick={() => onStartPractice()}
              className="mt-3 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
            >
              Start Your First Practice Session
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
