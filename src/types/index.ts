export type QuestionType = 'mcq' | 'short_answer' | 'long_answer' | 'numerical';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate';

export interface RubricCriterion {
  id: string;
  criterion: string;
  maxPoints: number;
  description: string;
}

export interface RubricEvaluation {
  criteriaScores: {
    criterion: string;
    awarded: number;
    max: number;
    feedback: string;
  }[];
  overallFeedback: string;
  keyStrengths: string[];
  missingPoints: string[];
  isEstimate: boolean;
  confidenceScore: number; // 0 - 100
  suggestedAction: string;
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  topicName: string;
  subtopic?: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  bloomLevel?: BloomLevel;
  marks: number;
  text: string;
  options?: string[]; // for MCQ
  correctAnswer?: string; // for MCQ and Numerical
  tolerance?: number; // for Numerical range (+/-)
  unit?: string; // for Numerical unit e.g. "m/s", "Joules"
  referenceAnswer?: string; // for Short/Long answers
  explanation: string;
  hints?: string[];
  rubric?: RubricCriterion[];
  pastPaperSource?: string;
  formulaReference?: string;
}

export interface SyllabusTopic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  estimatedWeightagePercentage: number;
  subtopics: string[];
  difficultyTrend: DifficultyLevel;
  masteryLevel: number; // 0 to 100
  totalPracticed: number;
  totalCorrect: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  board: string;
  grade: string;
  targetExamDate: string;
  dailyStudyMinutes: number;
  preferredDifficulty: DifficultyLevel;
  topics: SyllabusTopic[];
}

export interface PastPaper {
  id: string;
  subjectId: string;
  title: string;
  year: number;
  examBoard: string;
  totalMarks: number;
  durationMinutes: number;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  extractedQuestionsCount: number;
  status: 'processed' | 'processing' | 'failed';
}

export interface AnswerSubmission {
  questionId: string;
  studentAnswer: string;
  isAttempted: boolean;
  isCorrect?: boolean;
  marksObtained?: number;
  maxMarks: number;
  timeSpentSeconds: number;
  isFlagged?: boolean;
  isBookmarked?: boolean;
  rubricEvaluation?: RubricEvaluation;
}

export interface PracticeSession {
  id: string;
  subjectId: string;
  subjectName: string;
  mode: 'practice' | 'mock_exam';
  title: string;
  startTime: string;
  endTime?: string;
  durationLimitMinutes?: number;
  timeRemainingSeconds?: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  questions: Question[];
  submissions: Record<string, AnswerSubmission>;
  currentQuestionIndex: number;
  score?: number;
  totalMarks?: number;
  percentage?: number;
  topicPerformance?: Record<string, { total: number; correct: number; percentage: number }>;
}

export interface StudyPlanSession {
  id: string;
  date: string;
  title: string;
  topicIds: string[];
  topicNames: string[];
  durationMinutes: number;
  type: 'concept_review' | 'topic_practice' | 'mock_exam' | 'weakness_boost';
  isCompleted: boolean;
  notes?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  grade: string;
  board: string;
  targetExamDate: string;
  dailyStudyMinutes: number;
  preferredDifficulty: DifficultyLevel;
  currentSubjectId: string;
  streakDays: number;
  totalStudyMinutes: number;
  joinedDate: string;
  bookmarkedQuestionIds: string[];
}

export interface AnalyticsSummary {
  readinessScore: number; // 0 - 100
  questionsPracticedCount: number;
  accuracyPercentage: number;
  averageTimePerQuestionSeconds: number;
  strongTopics: { topicName: string; mastery: number }[];
  weakTopics: { topicName: string; mastery: number; recommendedQuestions: number }[];
  recentScores: { date: string; score: number; title: string; mode: string }[];
  topicMasteryList: { topicName: string; mastery: number; count: number }[];
}

export type ActiveScreen = 
  | 'landing'
  | 'dashboard'
  | 'syllabus'
  | 'studyplan'
  | 'practice_config'
  | 'practice_active'
  | 'mock_exam_start'
  | 'mock_exam_active'
  | 'results'
  | 'analytics'
  | 'settings';
