import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  BookOpen, 
  Edit2, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { Subject, StudyPlanSession, StudentProfile } from '../../types';
import { getDaysRemaining, formatMinutesToHours } from '../../utils/helpers';
import { AIAgentService } from '../../services/aiAgentService';

interface StudyPlanViewProps {
  currentSubject: Subject;
  profile: StudentProfile;
  studyPlan: StudyPlanSession[];
  onUpdateStudyPlan: (plan: StudyPlanSession[]) => void;
  onToggleComplete: (sessionId: string) => void;
  onStartSessionPractice: (topicIds: string[]) => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  currentSubject,
  profile,
  studyPlan,
  onUpdateStudyPlan,
  onToggleComplete,
  onStartSessionPractice
}) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [reschedulingSessionId, setReschedulingSessionId] = useState<string | null>(null);
  const [newDateValue, setNewDateValue] = useState<string>('');

  const daysLeft = getDaysRemaining(currentSubject.targetExamDate || profile.targetExamDate);
  const completedCount = studyPlan.filter(s => s.isCompleted).length;
  const progressPercent = studyPlan.length > 0 ? Math.round((completedCount / studyPlan.length) * 100) : 0;

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const freshPlan = AIAgentService.generateStudyPlan(
        currentSubject,
        currentSubject.targetExamDate || profile.targetExamDate,
        profile.dailyStudyMinutes
      );
      onUpdateStudyPlan(freshPlan);
      setIsRegenerating(false);
    }, 600);
  };

  const handleReschedule = (sessionId: string) => {
    if (!newDateValue) {
      setReschedulingSessionId(null);
      return;
    }
    const updated = studyPlan.map(s => {
      if (s.id === sessionId) {
        return { ...s, date: newDateValue };
      }
      return s;
    });
    // Sort by date
    updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    onUpdateStudyPlan(updated);
    setReschedulingSessionId(null);
    setNewDateValue('');
  };

  const filteredSessions = studyPlan.filter(s => {
    if (filter === 'pending') return !s.isCompleted;
    if (filter === 'completed') return s.isCompleted;
    return true;
  });

  const getTypeBadge = (type: StudyPlanSession['type']) => {
    switch (type) {
      case 'mock_exam':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Timed Mock</span>;
      case 'weakness_boost':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Weakness Booster</span>;
      case 'concept_review':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Concept Revision</span>;
      case 'topic_practice':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Topic Drill</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Adaptive Study Schedule</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200">
              {daysLeft} Days to Exam
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Calculated from your available daily study time ({profile.dailyStudyMinutes} mins/day) and prioritized by syllabus weightage and topic mastery.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Pacing Schedule...' : 'Re-plan with Agent'}</span>
          </button>
        </div>
      </div>

      {/* Progress & Pacing Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Plan Completion</span>
          <div className="flex items-center justify-between mt-1 mb-2">
            <span className="text-xl font-bold text-slate-900">{completedCount} of {studyPlan.length} Sessions</span>
            <span className="text-xs font-bold text-brand-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-brand-600 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Daily Study Target</span>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="text-xl font-bold text-slate-900">{profile.dailyStudyMinutes} mins / day</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Estimated total prep: ~{Math.round((daysLeft * profile.dailyStudyMinutes) / 60)} hours</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Exam Countdown</span>
          <div className="flex items-center gap-2 mt-1">
            <CalendarIcon className="w-5 h-5 text-brand-500" />
            <span className="text-xl font-bold text-slate-900">{daysLeft} Days Remaining</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Exam Date: {currentSubject.targetExamDate || profile.targetExamDate}</p>
        </div>
      </div>

      {/* Sessions Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Sessions ({studyPlan.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Pending ({studyPlan.filter(s => !s.isCompleted).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Sessions Timeline List */}
      <div className="space-y-3">
        {filteredSessions.map((session, index) => {
          const isRescheduling = reschedulingSessionId === session.id;

          return (
            <div
              key={session.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                session.isCompleted 
                  ? 'border-slate-200 bg-slate-50/60 opacity-75' 
                  : 'border-slate-200 hover:border-brand-300 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <button
                  onClick={() => onToggleComplete(session.id)}
                  className="mt-1 shrink-0 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {session.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-brand-500" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-bold text-sm ${session.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {session.title}
                    </span>
                    {getTypeBadge(session.type)}
                  </div>

                  <p className="text-xs text-slate-500">{session.notes}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      {session.date}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {session.durationMinutes} mins allocated
                    </span>
                    <span>&bull;</span>
                    <span>Topics: {session.topicNames.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons & Reschedule */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                {isRescheduling ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={newDateValue || session.date}
                      onChange={(e) => setNewDateValue(e.target.value)}
                      className="text-xs p-1.5 rounded-lg border border-slate-300"
                    />
                    <button
                      onClick={() => handleReschedule(session.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setReschedulingSessionId(null)}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setReschedulingSessionId(session.id);
                        setNewDateValue(session.date);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Reschedule session"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onStartSessionPractice(session.topicIds)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold transition-colors"
                    >
                      <span>Start Practice</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
