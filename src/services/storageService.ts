import { 
  StudentProfile, 
  Subject, 
  Question, 
  PastPaper, 
  StudyPlanSession, 
  PracticeSession, 
  AnalyticsSummary,
  SyllabusTopic
} from '../types';
import { 
  SAMPLE_PROFILE, 
  INITIAL_SUBJECTS, 
  SAMPLE_QUESTIONS, 
  SAMPLE_PAST_PAPERS, 
  INITIAL_STUDY_PLAN 
} from './mockData';

const STORAGE_KEYS = {
  PROFILE: 'prepagent_profile_v1',
  SUBJECTS: 'prepagent_subjects_v1',
  QUESTIONS: 'prepagent_questions_v1',
  PAST_PAPERS: 'prepagent_past_papers_v1',
  STUDY_PLAN: 'prepagent_study_plan_v1',
  ACTIVE_SESSION: 'prepagent_active_session_v1',
  COMPLETED_SESSIONS: 'prepagent_completed_sessions_v1',
  IS_AUTHENTICATED: 'prepagent_is_authenticated_v1'
};

export class StorageService {
  // --- Profile ---
  static getProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : SAMPLE_PROFILE;
    } catch {
      return SAMPLE_PROFILE;
    }
  }

  static saveProfile(profile: StudentProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  static isAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
  }

  static setAuthenticated(val: boolean): void {
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, val ? 'true' : 'false');
  }

  // --- Subjects ---
  static getSubjects(): Subject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (data) return JSON.parse(data);
      this.saveSubjects(INITIAL_SUBJECTS);
      return INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  }

  static saveSubjects(subjects: Subject[]): void {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }

  static getCurrentSubject(): Subject {
    const subjects = this.getSubjects();
    const profile = this.getProfile();
    const found = subjects.find(s => s.id === profile.currentSubjectId);
    return found || subjects[0] || INITIAL_SUBJECTS[0];
  }

  static updateSubjectTopics(subjectId: string, topics: SyllabusTopic[]): void {
    const subjects = this.getSubjects();
    const updated = subjects.map(s => {
      if (s.id === subjectId) {
        return { ...s, topics };
      }
      return s;
    });
    this.saveSubjects(updated);
  }

  // --- Questions ---
  static getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (data) return JSON.parse(data);
      this.saveQuestions(SAMPLE_QUESTIONS);
      return SAMPLE_QUESTIONS;
    } catch {
      return SAMPLE_QUESTIONS;
    }
  }

  static saveQuestions(questions: Question[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }

  static addQuestions(newQuestions: Question[]): void {
    const existing = this.getQuestions();
    const combined = [...newQuestions, ...existing];
    // Deduplicate by id
    const unique = Array.from(new Map(combined.map(q => [q.id, q])).values());
    this.saveQuestions(unique);
  }

  // --- Past Papers ---
  static getPastPapers(): PastPaper[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAST_PAPERS);
      if (data) return JSON.parse(data);
      this.savePastPapers(SAMPLE_PAST_PAPERS);
      return SAMPLE_PAST_PAPERS;
    } catch {
      return SAMPLE_PAST_PAPERS;
    }
  }

  static savePastPapers(papers: PastPaper[]): void {
    localStorage.setItem(STORAGE_KEYS.PAST_PAPERS, JSON.stringify(papers));
  }

  static addPastPaper(paper: PastPaper): void {
    const papers = this.getPastPapers();
    this.savePastPapers([paper, ...papers]);
  }

  static deletePastPaper(id: string): void {
    const papers = this.getPastPapers().filter(p => p.id !== id);
    this.savePastPapers(papers);
  }

  // --- Study Plan ---
  static getStudyPlan(): StudyPlanSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_PLAN);
      if (data) return JSON.parse(data);
      this.saveStudyPlan(INITIAL_STUDY_PLAN);
      return INITIAL_STUDY_PLAN;
    } catch {
      return INITIAL_STUDY_PLAN;
    }
  }

  static saveStudyPlan(plan: StudyPlanSession[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDY_PLAN, JSON.stringify(plan));
  }

  static toggleStudySession(sessionId: string): void {
    const plan = this.getStudyPlan();
    const updated = plan.map(s => {
      if (s.id === sessionId) {
        return { ...s, isCompleted: !s.isCompleted };
      }
      return s;
    });
    this.saveStudyPlan(updated);
  }

  // --- Active / In-Progress Practice Session ---
  static getActiveSession(): PracticeSession | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveActiveSession(session: PracticeSession | null): void {
    if (!session) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    }
  }

  // --- Completed Sessions History ---
  static getCompletedSessions(): PracticeSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveCompletedSession(session: PracticeSession): void {
    const list = this.getCompletedSessions();
    const updated = [session, ...list.filter(s => s.id !== session.id)];
    localStorage.setItem(STORAGE_KEYS.COMPLETED_SESSIONS, JSON.stringify(updated));

    // Also update topic masteries
    this.updateTopicMasteriesFromSession(session);
  }

  /**
   * Recalculates topic mastery from submitted session.
   */
  private static updateTopicMasteriesFromSession(session: PracticeSession): void {
    const subjects = this.getSubjects();
    const subject = subjects.find(s => s.id === session.subjectId);
    if (!subject) return;

    const topicStats: Record<string, { total: number; correct: number }> = {};

    session.questions.forEach(q => {
      const sub = session.submissions[q.id];
      if (!topicStats[q.topicId]) {
        topicStats[q.topicId] = { total: 0, correct: 0 };
      }
      if (sub && sub.isAttempted) {
        topicStats[q.topicId].total += 1;
        if (sub.isCorrect || (sub.marksObtained && sub.marksObtained >= q.marks * 0.7)) {
          topicStats[q.topicId].correct += 1;
        }
      }
    });

    const updatedTopics = subject.topics.map(t => {
      const stat = topicStats[t.id];
      if (!stat || stat.total === 0) return t;

      const newTotal = t.totalPracticed + stat.total;
      const newCorrect = t.totalCorrect + stat.correct;
      const mastery = Math.round((newCorrect / Math.max(1, newTotal)) * 100);

      return {
        ...t,
        totalPracticed: newTotal,
        totalCorrect: newCorrect,
        masteryLevel: Math.max(15, Math.min(100, mastery))
      };
    });

    this.updateSubjectTopics(subject.id, updatedTopics);
  }

  // --- Analytics Calculation ---
  static getAnalytics(): AnalyticsSummary {
    const currentSubject = this.getCurrentSubject();
    const completedSessions = this.getCompletedSessions();
    const topics = currentSubject.topics || [];

    // Overall readiness score is weighted average of topic masteries by weightage
    let weightedMasterySum = 0;
    let totalWeight = 0;
    let totalQuestions = 0;
    let totalCorrect = 0;

    topics.forEach(t => {
      weightedMasterySum += (t.masteryLevel * t.estimatedWeightagePercentage);
      totalWeight += t.estimatedWeightagePercentage;
      totalQuestions += t.totalPracticed;
      totalCorrect += t.totalCorrect;
    });

    const readinessScore = totalWeight > 0 ? Math.round(weightedMasterySum / totalWeight) : 65;
    const accuracyPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 70;

    // Strong & weak topics
    const sorted = [...topics].sort((a, b) => b.masteryLevel - a.masteryLevel);
    const strongTopics = sorted.slice(0, 3).map(t => ({ topicName: t.name, mastery: t.masteryLevel }));
    const weakTopics = [...topics]
      .sort((a, b) => a.masteryLevel - b.masteryLevel)
      .slice(0, 3)
      .map(t => ({
        topicName: t.name,
        mastery: t.masteryLevel,
        recommendedQuestions: Math.max(5, Math.round((80 - t.masteryLevel) / 5))
      }));

    const recentScores = completedSessions.slice(0, 8).map(s => ({
      date: new Date(s.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: s.percentage || Math.round(((s.score || 0) / Math.max(1, s.totalMarks || 1)) * 100),
      title: s.title,
      mode: s.mode
    }));

    // If no completed sessions yet, generate realistic initial scores
    const fallbackRecent = [
      { date: 'Nov 2', score: 62, title: 'Electrostatics Practice', mode: 'practice' },
      { date: 'Nov 5', score: 70, title: 'Current Electricity Drill', mode: 'practice' },
      { date: 'Nov 8', score: 68, title: 'Weekly Section Mock 1', mode: 'mock_exam' },
      { date: 'Nov 10', score: 76, title: 'Optics & Modern Physics', mode: 'practice' },
    ];

    return {
      readinessScore,
      questionsPracticedCount: totalQuestions || 48,
      accuracyPercentage,
      averageTimePerQuestionSeconds: 110,
      strongTopics,
      weakTopics,
      recentScores: recentScores.length > 0 ? recentScores : fallbackRecent,
      topicMasteryList: topics.map(t => ({
        topicName: t.name,
        mastery: t.masteryLevel,
        count: t.totalPracticed
      }))
    };
  }

  // --- Reset to default ---
  static resetAllData(): void {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
    this.saveProfile(SAMPLE_PROFILE);
    this.saveSubjects(INITIAL_SUBJECTS);
    this.saveQuestions(SAMPLE_QUESTIONS);
    this.savePastPapers(SAMPLE_PAST_PAPERS);
    this.saveStudyPlan(INITIAL_STUDY_PLAN);
  }
}
