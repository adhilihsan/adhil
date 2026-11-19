import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Target, 
  Flame,
  Award
} from 'lucide-react';
import { AnalyticsSummary, Subject, StudentProfile } from '../../types';
import { getMasteryColor, formatTime } from '../../utils/helpers';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary;
  currentSubject: Subject;
  profile: StudentProfile;
  onPracticeTopic: (topicId: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
  currentSubject,
  profile,
  onPracticeTopic
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Progress & Exam Analytics</h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200">
            {currentSubject.name}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Autonomous performance metrics calculated from your mock exams and practice answers.
        </p>
      </div>

      {/* 4 Big Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Readiness Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Exam Readiness</span>
            <Target className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-700">{analytics.readinessScore}%</span>
            <span className="text-xs text-emerald-600 font-bold">+6% this week</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Weighted across all {currentSubject.topics.length} chapters</p>
        </div>

        {/* Metric 2: Accuracy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Overall Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{analytics.accuracyPercentage}%</span>
            <span className="text-xs text-slate-500">of submitted Qs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">{analytics.questionsPracticedCount} questions evaluated</p>
        </div>

        {/* Metric 3: Time Spent */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Avg Time per Q</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatTime(analytics.averageTimePerQuestionSeconds)}
            </span>
            <span className="text-xs text-emerald-600 font-bold">Pacing on track</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Standard exam target: ~2m 15s</p>
        </div>

        {/* Metric 4: Streak */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{profile.streakDays} Days</span>
            <span className="text-xs text-amber-700 font-bold">Unbroken</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">{profile.dailyStudyMinutes} mins/day commitment</p>
        </div>

      </div>

      {/* Visual Chart: Score Trends Over Time */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Score Trends Over Recent Sessions</h2>
            <p className="text-xs text-slate-500">Historical performance in practice and timed mock exams</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            Upward Trajectory
          </span>
        </div>

        {/* CSS/SVG Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-200 pb-2">
          {analytics.recentScores.map((item, idx) => {
            const heightPercent = Math.max(15, item.score);
            const isMock = item.mode === 'mock_exam';

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[11px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.score}%
                </span>
                <div 
                  className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 ${
                    isMock 
                      ? 'bg-gradient-to-t from-purple-700 to-accent-500 shadow-xs' 
                      : 'bg-gradient-to-t from-brand-700 to-brand-500 shadow-xs'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[10px] font-medium text-slate-500 truncate max-w-[50px]">
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-brand-500" />
            <span>Practice Drills</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-accent-600" />
            <span>Timed Mock Exams</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Strengths vs Weaknesses & Full Topic Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Priority Weak Topics & Strengths */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Priority Areas (Focus Next)</h3>
            </div>
            <p className="text-xs text-slate-500">Topics with the lowest mastery score relative to exam weightage</p>
          </div>

          <div className="space-y-3">
            {analytics.weakTopics.map((item, idx) => {
              const matchingTopic = currentSubject.topics.find(t => t.name === item.topicName);
              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{item.topicName}</span>
                    <span className="text-[11px] text-rose-700 font-medium">
                      Mastery: {item.mastery}% &bull; Recommended: {item.recommendedQuestions} practice Qs
                    </span>
                  </div>
                  <button
                    onClick={() => onPracticeTopic(matchingTopic?.id || '')}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 transition-colors"
                  >
                    Drill Topic
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Strongest Topics (Exam Ready)</h3>
            </div>
            <div className="space-y-2">
              {analytics.strongTopics.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.topicName}</span>
                  <span className="font-bold text-emerald-700">{item.mastery}% Mastered</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Full Topic Mastery Radar/Bars */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Comprehensive Syllabus Mastery</h3>
            <p className="text-xs text-slate-500">Detailed breakdown across all indexed curriculum chapters</p>
          </div>

          <div className="space-y-3.5">
            {currentSubject.topics.map(topic => {
              const mastery = getMasteryColor(topic.masteryLevel);

              return (
                <div key={topic.id} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 truncate max-w-[240px]">{topic.name}</span>
                    <span className={`font-bold ${mastery.text}`}>{topic.masteryLevel}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${mastery.bar}`} style={{ width: `${topic.masteryLevel}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{topic.totalPracticed} practice questions attempted</span>
                    <span>{topic.estimatedWeightagePercentage}% exam weight</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
