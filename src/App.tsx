import React, { useState, useEffect } from 'react';
import { 
  ActiveScreen, 
  StudentProfile, 
  Subject, 
  Question, 
  PastPaper, 
  StudyPlanSession, 
  PracticeSession, 
  AnalyticsSummary, 
  DifficultyLevel, 
  QuestionType,
  SyllabusTopic
} from './types';
import { StorageService } from './services/storageService';
import { AIAgentService } from './services/aiAgentService';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { SyllabusView } from './components/syllabus/SyllabusView';
import { StudyPlanView } from './components/studyplan/StudyPlanView';
import { PracticeSetupModal } from './components/practice/PracticeSetupModal';
import { PracticeSessionView } from './components/practice/PracticeSessionView';
import { MockExamStart } from './components/mockexam/MockExamStart';
import { MockExamView } from './components/mockexam/MockExamView';
import { ExamResultsView } from './components/results/ExamResultsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';

export function App() {
  // Navigation & Modal State
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [practiceConfigOpen, setPracticeConfigOpen] = useState(false);
  const [practiceConfigInitialTopic, setPracticeConfigInitialTopic] = useState<string | undefined>(undefined);

  // Core Data State
  const [profile, setProfile] = useState<StudentProfile>(StorageService.getProfile());
  const [subjects, setSubjects] = useState<Subject[]>(StorageService.getSubjects());
  const [currentSubjectId, setCurrentSubjectId] = useState<string>(profile.currentSubjectId || subjects[0]?.id || 'sub_physics_12');
  const [pastPapers, setPastPapers] = useState<PastPaper[]>(StorageService.getPastPapers());
  const [studyPlan, setStudyPlan] = useState<StudyPlanSession[]>(StorageService.getStudyPlan());
  const [activeSession, setActiveSession] = useState<PracticeSession | null>(StorageService.getActiveSession());
  const [completedSessions, setCompletedSessions] = useState<PracticeSession[]>(StorageService.getCompletedSessions());
  const [lastCompletedSession, setLastCompletedSession] = useState<PracticeSession | null>(null);

  // Derived current subject
  const currentSubject = subjects.find(s => s.id === currentSubjectId) || subjects[0];
  const analytics = StorageService.getAnalytics();

  // If user is already authenticated or resumes, go to dashboard
  useEffect(() => {
    if (StorageService.isAuthenticated()) {
      if (activeSession && activeSession.status === 'in_progress') {
        setCurrentScreen(activeSession.mode === 'mock_exam' ? 'mock_exam_active' : 'practice_active');
      } else if (currentScreen === 'landing') {
        setCurrentScreen('dashboard');
      }
    }
  }, []);

  // Autosave active session
  useEffect(() => {
    StorageService.saveActiveSession(activeSession);
  }, [activeSession]);

  // Handle switching active subject
  const handleSelectSubject = (subjectId: string) => {
    setCurrentSubjectId(subjectId);
    const updatedProf = { ...profile, currentSubjectId: subjectId };
    setProfile(updatedProf);
    StorageService.saveProfile(updatedProf);
  };

  // --- Session Launchers ---

  // 1. Adaptive Practice Launcher (prioritizes weakest topic or full syllabus)
  const handleStartPractice = (specificTopicId?: string) => {
    const topicsToUse = specificTopicId 
      ? currentSubject.topics.filter(t => t.id === specificTopicId)
      : currentSubject.topics;

    const targetTopic = topicsToUse.length > 0 ? topicsToUse : currentSubject.topics;
    const questions = AIAgentService.generateQuestions({
      subject: currentSubject,
      topics: targetTopic,
      count: 5,
      preferredDifficulty: currentSubject.preferredDifficulty || 'medium',
      types: ['mcq', 'short_answer', 'numerical', 'long_answer']
    });

    const newSession: PracticeSession = {
      id: `session_prac_${Date.now()}`,
      subjectId: currentSubject.id,
      subjectName: currentSubject.name,
      mode: 'practice',
      title: specificTopicId 
        ? `Topic Practice: ${targetTopic[0]?.name}` 
        : `Adaptive Practice Drill: ${currentSubject.name}`,
      startTime: new Date().toISOString(),
      status: 'in_progress',
      questions,
      submissions: {},
      currentQuestionIndex: 0
    };

    setActiveSession(newSession);
    setCurrentScreen('practice_active');
  };

  // 2. Custom Practice Session Launcher
  const handleLaunchCustomPractice = (config: {
    topicIds: string[];
    difficulty: DifficultyLevel;
    types: QuestionType[];
    questionCount: number;
  }) => {
    const selectedTopics = currentSubject.topics.filter(t => config.topicIds.includes(t.id));
    const targetTopics = selectedTopics.length > 0 ? selectedTopics : currentSubject.topics;

    const questions = AIAgentService.generateQuestions({
      subject: currentSubject,
      topics: targetTopics,
      count: config.questionCount,
      preferredDifficulty: config.difficulty,
      types: config.types
    });

    const newSession: PracticeSession = {
      id: `session_custom_${Date.now()}`,
      subjectId: currentSubject.id,
      subjectName: currentSubject.name,
      mode: 'practice',
      title: selectedTopics.length === 1 
        ? `Practice: ${selectedTopics[0].name}` 
        : `Custom Practice (${config.questionCount} Qs)`,
      startTime: new Date().toISOString(),
      status: 'in_progress',
      questions,
      submissions: {},
      currentQuestionIndex: 0
    };

    setActiveSession(newSession);
    setCurrentScreen('practice_active');
  };

  // 3. Timed Mock Exam Launcher
  const handleLaunchMockExam = (config: {
    durationMinutes: number;
    questionCount: number;
    difficulty: DifficultyLevel;
  }) => {
    const questions = AIAgentService.generateQuestions({
      subject: currentSubject,
      topics: currentSubject.topics,
      count: config.questionCount,
      preferredDifficulty: config.difficulty,
      types: ['mcq', 'short_answer', 'numerical', 'long_answer']
    });

    const newSession: PracticeSession = {
      id: `session_mock_${Date.now()}`,
      subjectId: currentSubject.id,
      subjectName: currentSubject.name,
      mode: 'mock_exam',
      title: `${currentSubject.name} Timed Mock Exam`,
      startTime: new Date().toISOString(),
      durationLimitMinutes: config.durationMinutes,
      timeRemainingSeconds: config.durationMinutes * 60,
      status: 'in_progress',
      questions,
      submissions: {},
      currentQuestionIndex: 0
    };

    setActiveSession(newSession);
    setCurrentScreen('mock_exam_active');
  };

  // --- Question Answering Handlers ---

  const handleUpdateAnswer = (questionId: string, answer: string) => {
    if (!activeSession) return;
    const currentSub = activeSession.submissions[questionId] || {
      questionId,
      studentAnswer: '',
      isAttempted: false,
      maxMarks: activeSession.questions.find(q => q.id === questionId)?.marks || 1,
      timeSpentSeconds: 0
    };

    setActiveSession({
      ...activeSession,
      submissions: {
        ...activeSession.submissions,
        [questionId]: {
          ...currentSub,
          studentAnswer: answer,
          isAttempted: answer.trim().length > 0
        }
      }
    });
  };

  const handleSubmitAnswerInPractice = (questionId: string) => {
    if (!activeSession) return;
    const q = activeSession.questions.find(item => item.id === questionId);
    if (!q) return;

    const sub = activeSession.submissions[questionId];
    const evaluation = AIAgentService.evaluateAnswer(q, sub?.studentAnswer || '');

    setActiveSession({
      ...activeSession,
      submissions: {
        ...activeSession.submissions,
        [questionId]: {
          questionId,
          studentAnswer: sub?.studentAnswer || '',
          isAttempted: true,
          isCorrect: evaluation.isCorrect,
          marksObtained: evaluation.marksObtained,
          maxMarks: q.marks,
          timeSpentSeconds: sub?.timeSpentSeconds || 30,
          rubricEvaluation: evaluation
        }
      }
    });
  };

  const handleToggleBookmark = (questionId: string) => {
    if (!activeSession) return;
    const sub = activeSession.submissions[questionId] || {
      questionId,
      studentAnswer: '',
      isAttempted: false,
      maxMarks: 1,
      timeSpentSeconds: 0
    };

    setActiveSession({
      ...activeSession,
      submissions: {
        ...activeSession.submissions,
        [questionId]: {
          ...sub,
          isBookmarked: !sub.isBookmarked
        }
      }
    });
  };

  const handleToggleFlag = (questionId: string) => {
    if (!activeSession) return;
    const sub = activeSession.submissions[questionId] || {
      questionId,
      studentAnswer: '',
      isAttempted: false,
      maxMarks: 1,
      timeSpentSeconds: 0
    };

    setActiveSession({
      ...activeSession,
      submissions: {
        ...activeSession.submissions,
        [questionId]: {
          ...sub,
          isFlagged: !sub.isFlagged
        }
      }
    });
  };

  // --- Final Session Completion & Scoring ---
  const handleCompleteSession = () => {
    if (!activeSession) return;

    // Evaluate any un-evaluated questions
    const finalSubmissions = { ...activeSession.submissions };
    let totalScore = 0;
    let totalMaxMarks = 0;

    activeSession.questions.forEach(q => {
      totalMaxMarks += q.marks;
      let sub = finalSubmissions[q.id];

      if (!sub || !sub.rubricEvaluation) {
        const evalResult = AIAgentService.evaluateAnswer(q, sub?.studentAnswer || '');
        sub = {
          questionId: q.id,
          studentAnswer: sub?.studentAnswer || '',
          isAttempted: Boolean(sub?.studentAnswer && sub.studentAnswer.trim().length > 0),
          isCorrect: evalResult.isCorrect,
          marksObtained: evalResult.marksObtained,
          maxMarks: q.marks,
          timeSpentSeconds: 45,
          rubricEvaluation: evalResult
        };
        finalSubmissions[q.id] = sub;
      }

      totalScore += (sub.marksObtained || 0);
    });

    const percentage = Math.round((totalScore / Math.max(1, totalMaxMarks)) * 100);

    const completed: PracticeSession = {
      ...activeSession,
      status: 'completed',
      endTime: new Date().toISOString(),
      score: totalScore,
      totalMarks: totalMaxMarks,
      percentage,
      submissions: finalSubmissions
    };

    StorageService.saveCompletedSession(completed);
    setCompletedSessions(StorageService.getCompletedSessions());
    setSubjects(StorageService.getSubjects()); // Topic masteries were updated
    setLastCompletedSession(completed);
    setActiveSession(null);
    setCurrentScreen('results');
  };

  // --- Auth & Onboarding Handlers ---
  const handleLoginSuccess = (userProfile: StudentProfile) => {
    StorageService.setAuthenticated(true);
    StorageService.saveProfile(userProfile);
    setProfile(userProfile);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    StorageService.setAuthenticated(false);
    setCurrentScreen('landing');
  };

  const handleOnboardingComplete = (newProfile: StudentProfile, newSubject: Subject) => {
    StorageService.setAuthenticated(true);
    StorageService.saveProfile(newProfile);
    const existing = StorageService.getSubjects();
    const updated = [newSubject, ...existing];
    StorageService.saveSubjects(updated);

    // Generate study plan
    const initialPlan = AIAgentService.generateStudyPlan(
      newSubject,
      newSubject.targetExamDate,
      newSubject.dailyStudyMinutes
    );
    StorageService.saveStudyPlan(initialPlan);

    setProfile(newProfile);
    setSubjects(updated);
    setCurrentSubjectId(newSubject.id);
    setStudyPlan(initialPlan);
    setOnboardingOpen(false);
    setCurrentScreen('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Navbar (displayed on all screens except landing) */}
      {currentScreen !== 'landing' && (
        <Navbar
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          profile={profile}
          subjects={subjects}
          currentSubject={currentSubject}
          onSelectSubject={handleSelectSubject}
          onLogout={handleLogout}
          readinessScore={analytics.readinessScore}
          onOpenPracticeConfig={() => {
            setPracticeConfigInitialTopic(undefined);
            setPracticeConfigOpen(true);
          }}
        />
      )}

      {/* Main Dynamic Screen Views */}
      <main className="flex-1">
        {/* 1. Landing Screen */}
        {currentScreen === 'landing' && (
          <LandingPage
            onStartDemo={() => {
              StorageService.setAuthenticated(true);
              setCurrentScreen('dashboard');
            }}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* 2. Dashboard Screen */}
        {currentScreen === 'dashboard' && (
          <DashboardView
            profile={profile}
            currentSubject={currentSubject}
            analytics={analytics}
            studyPlan={studyPlan}
            recentSessions={completedSessions}
            onStartPractice={(topicId) => handleStartPractice(topicId)}
            onStartMockExam={() => setCurrentScreen('mock_exam_start')}
            onNavigateToScreen={(screen) => setCurrentScreen(screen)}
            onToggleSessionComplete={(sessionId) => {
              StorageService.toggleStudySession(sessionId);
              setStudyPlan(StorageService.getStudyPlan());
            }}
          />
        )}

        {/* 3. Syllabus & Past Papers Screen */}
        {currentScreen === 'syllabus' && (
          <SyllabusView
            currentSubject={currentSubject}
            pastPapers={pastPapers}
            onUpdateTopics={(updatedTopics) => {
              StorageService.updateSubjectTopics(currentSubject.id, updatedTopics);
              setSubjects(StorageService.getSubjects());
            }}
            onAddPastPaper={(paper) => {
              StorageService.addPastPaper(paper);
              setPastPapers(StorageService.getPastPapers());
            }}
            onDeletePastPaper={(id) => {
              StorageService.deletePastPaper(id);
              setPastPapers(StorageService.getPastPapers());
            }}
            onStartPracticeWithTopic={(topicId) => {
              setPracticeConfigInitialTopic(topicId);
              setPracticeConfigOpen(true);
            }}
          />
        )}

        {/* 4. Study Plan Screen */}
        {currentScreen === 'studyplan' && (
          <StudyPlanView
            currentSubject={currentSubject}
            profile={profile}
            studyPlan={studyPlan}
            onUpdateStudyPlan={(updatedPlan) => {
              StorageService.saveStudyPlan(updatedPlan);
              setStudyPlan(updatedPlan);
            }}
            onToggleComplete={(sessionId) => {
              StorageService.toggleStudySession(sessionId);
              setStudyPlan(StorageService.getStudyPlan());
            }}
            onStartSessionPractice={(topicIds) => {
              handleLaunchCustomPractice({
                topicIds,
                difficulty: currentSubject.preferredDifficulty || 'medium',
                types: ['mcq', 'short_answer', 'numerical', 'long_answer'],
                questionCount: 5
              });
            }}
          />
        )}

        {/* 5. Interactive Practice Active Screen */}
        {currentScreen === 'practice_active' && activeSession && (
          <PracticeSessionView
            session={activeSession}
            onUpdateAnswer={handleUpdateAnswer}
            onSubmitAnswer={handleSubmitAnswerInPractice}
            onToggleBookmark={handleToggleBookmark}
            onNextQuestion={() => {
              if (activeSession.currentQuestionIndex < activeSession.questions.length - 1) {
                setActiveSession({
                  ...activeSession,
                  currentQuestionIndex: activeSession.currentQuestionIndex + 1
                });
              }
            }}
            onPrevQuestion={() => {
              if (activeSession.currentQuestionIndex > 0) {
                setActiveSession({
                  ...activeSession,
                  currentQuestionIndex: activeSession.currentQuestionIndex - 1
                });
              }
            }}
            onSelectQuestion={(idx) => {
              setActiveSession({
                ...activeSession,
                currentQuestionIndex: idx
              });
            }}
            onCompleteSession={handleCompleteSession}
            onExitSession={() => setCurrentScreen('dashboard')}
          />
        )}

        {/* 6. Mock Exam Start Screen */}
        {currentScreen === 'mock_exam_start' && (
          <MockExamStart
            currentSubject={currentSubject}
            onBack={() => setCurrentScreen('dashboard')}
            onLaunchMockExam={handleLaunchMockExam}
          />
        )}

        {/* 7. Timed Mock Exam Active Screen */}
        {currentScreen === 'mock_exam_active' && activeSession && (
          <MockExamView
            session={activeSession}
            onUpdateAnswer={handleUpdateAnswer}
            onToggleFlag={handleToggleFlag}
            onToggleBookmark={handleToggleBookmark}
            onNextQuestion={() => {
              if (activeSession.currentQuestionIndex < activeSession.questions.length - 1) {
                setActiveSession({
                  ...activeSession,
                  currentQuestionIndex: activeSession.currentQuestionIndex + 1
                });
              }
            }}
            onPrevQuestion={() => {
              if (activeSession.currentQuestionIndex > 0) {
                setActiveSession({
                  ...activeSession,
                  currentQuestionIndex: activeSession.currentQuestionIndex - 1
                });
              }
            }}
            onSelectQuestion={(idx) => {
              setActiveSession({
                ...activeSession,
                currentQuestionIndex: idx
              });
            }}
            onSubmitExam={handleCompleteSession}
            onExitExam={() => setCurrentScreen('dashboard')}
          />
        )}

        {/* 8. Exam Results & Rubric Review Screen */}
        {currentScreen === 'results' && lastCompletedSession && (
          <ExamResultsView
            session={lastCompletedSession}
            onRetrySession={() => {
              handleLaunchCustomPractice({
                topicIds: lastCompletedSession.questions.map(q => q.topicId),
                difficulty: 'medium',
                types: ['mcq', 'short_answer', 'numerical', 'long_answer'],
                questionCount: lastCompletedSession.questions.length
              });
            }}
            onPracticeWeakTopics={(topicId) => handleStartPractice(topicId)}
            onBackToDashboard={() => setCurrentScreen('dashboard')}
          />
        )}

        {/* 9. Analytics & Progress Screen */}
        {currentScreen === 'analytics' && (
          <AnalyticsView
            analytics={analytics}
            currentSubject={currentSubject}
            profile={profile}
            onPracticeTopic={(topicId) => handleStartPractice(topicId)}
          />
        )}

        {/* 10. Settings & Uploaded Materials Screen */}
        {currentScreen === 'settings' && (
          <SettingsView
            profile={profile}
            currentSubject={currentSubject}
            pastPapers={pastPapers}
            onUpdateProfile={(updated) => {
              StorageService.saveProfile(updated);
              setProfile(updated);
            }}
            onUpdateSubject={(updated) => {
              const allSubs = StorageService.getSubjects().map(s => s.id === updated.id ? updated : s);
              StorageService.saveSubjects(allSubs);
              setSubjects(allSubs);
            }}
            onDeletePastPaper={(id) => {
              StorageService.deletePastPaper(id);
              setPastPapers(StorageService.getPastPapers());
            }}
            onResetData={() => {
              StorageService.resetAllData();
              setProfile(StorageService.getProfile());
              setSubjects(StorageService.getSubjects());
              setPastPapers(StorageService.getPastPapers());
              setStudyPlan(StorageService.getStudyPlan());
              setCompletedSessions([]);
              setActiveSession(null);
              setCurrentScreen('dashboard');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onStartOnboarding={() => setOnboardingOpen(true)}
      />

      <OnboardingModal
        isOpen={onboardingOpen}
        onComplete={handleOnboardingComplete}
        onCancel={() => setOnboardingOpen(false)}
      />

      <PracticeSetupModal
        isOpen={practiceConfigOpen}
        onClose={() => setPracticeConfigOpen(false)}
        currentSubject={currentSubject}
        initialTopicId={practiceConfigInitialTopic}
        onLaunchPractice={handleLaunchCustomPractice}
      />

    </div>
  );
}

export default App;
