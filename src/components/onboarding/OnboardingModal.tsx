import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  Target, 
  BookOpen, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Layers
} from 'lucide-react';
import { StudentProfile, Subject, DifficultyLevel } from '../../types';
import { AIAgentService } from '../../services/aiAgentService';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: StudentProfile, subject: Subject) => void;
  onCancel: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('Adhil Ihsan');
  const [email, setEmail] = useState('adhil.ihsan@student.edu');
  const [grade, setGrade] = useState('Class 12 / Senior');
  const [board, setBoard] = useState('CBSE / National Board');
  const [subjectName, setSubjectName] = useState('Chemistry (Class 12)');
  const [subjectCode, setSubjectCode] = useState('CHEM-12');
  const [targetExamDate, setTargetExamDate] = useState(
    new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [preferredDifficulty, setPreferredDifficulty] = useState<DifficultyLevel>('medium');
  const [starterTopicText, setStarterTopicText] = useState(
    'Solid State & Solutions\nElectrochemistry & Chemical Kinetics\nCoordination Compounds\nOrganic Chemistry: Haloalkanes & Alcohols'
  );

  if (!isOpen) return null;

  const handleFinish = () => {
    const subjectId = `sub_${Date.now()}`;
    const topics = AIAgentService.extractTopicsFromText(starterTopicText, subjectName).map(t => ({
      ...t,
      subjectId
    }));

    const newSubject: Subject = {
      id: subjectId,
      name: subjectName,
      code: subjectCode,
      board,
      grade,
      targetExamDate,
      dailyStudyMinutes: dailyMinutes,
      preferredDifficulty,
      topics
    };

    const newProfile: StudentProfile = {
      id: `student_${Date.now()}`,
      name,
      email,
      grade,
      board,
      targetExamDate,
      dailyStudyMinutes: dailyMinutes,
      preferredDifficulty,
      currentSubjectId: subjectId,
      streakDays: 1,
      totalStudyMinutes: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      bookmarkedQuestionIds: []
    };

    onComplete(newProfile, newSubject);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Progress Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
              {step}
            </span>
            <span className="text-xs font-bold text-slate-700">
              {step === 1 && 'Step 1: Student & Board Details'}
              {step === 2 && 'Step 2: Subject & Target Exam Date'}
              {step === 3 && 'Step 3: Study Preferences & Syllabus Topics'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                className={`w-6 h-1.5 rounded-full transition-colors ${
                  s === step ? 'bg-brand-600' : s < step ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Welcome! Let’s set up your exam goal</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  The agent personalizes question patterns and study milestones to your grade and curriculum board.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500"
                    placeholder="Student Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500"
                    placeholder="student@example.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grade or Academic Level</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Class 10 / Secondary">Class 10 / Secondary (Board Exams)</option>
                  <option value="Class 11 / Junior">Class 11 / Higher Secondary Year 1</option>
                  <option value="Class 12 / Senior">Class 12 / High School Senior (Pre-University)</option>
                  <option value="Undergraduate / College">Undergraduate / College Degree</option>
                  <option value="Competitive Entrance Exam">Competitive Entrance (JEE / NEET / SAT / GRE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Board / Accreditation</label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-brand-500"
                >
                  <option value="CBSE / National Board">Central Board of Secondary Education (CBSE)</option>
                  <option value="ICSE / ISC">ICSE / ISC Council</option>
                  <option value="State Board">State Secondary & Higher Board</option>
                  <option value="Cambridge / GCSE / A-Levels">Cambridge / GCSE / Edexcel / A-Levels</option>
                  <option value="College Board / AP / SAT">College Board (AP / SAT)</option>
                  <option value="International Baccalaureate (IB)">International Baccalaureate (IB Diploma)</option>
                  <option value="University Exam">University / Autonomous College</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Which subject are you preparing for?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  You can add more subjects anytime from the dashboard.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name</label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. Chemistry, Mathematics, Biology"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. 043"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Exam Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={targetExamDate}
                    onChange={(e) => setTargetExamDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  The study plan scheduler will calculate daily pacing up to this date.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Study Pacing & Initial Syllabus Topics</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set daily commitment and enter your main chapters. The agent will parse them into topics.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Daily Study Time
                  </label>
                  <select
                    value={dailyMinutes}
                    onChange={(e) => setDailyMinutes(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-brand-500"
                  >
                    <option value={30}>30 minutes / day</option>
                    <option value={45}>45 minutes / day</option>
                    <option value={60}>60 minutes / day (Recommended)</option>
                    <option value={90}>90 minutes / day (Intensive)</option>
                    <option value={120}>120 minutes / day (Crunch Mode)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Starting Difficulty
                  </label>
                  <select
                    value={preferredDifficulty}
                    onChange={(e) => setPreferredDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="easy">Easy (Build Confidence)</option>
                    <option value="medium">Medium (Standard Exam Level)</option>
                    <option value="hard">Hard (Top Marks Challenge)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Syllabus Chapters / Topics (1 per line)
                  </label>
                  <span className="text-[11px] text-brand-600 font-medium">
                    You can also upload PDFs later
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={starterTopicText}
                  onChange={(e) => setStarterTopicText(e.target.value)}
                  placeholder="Enter chapter names, one per line..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 font-mono"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Workspace & Start Practice</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
