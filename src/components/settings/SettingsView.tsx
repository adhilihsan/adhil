import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Trash2, 
  FileText, 
  Save, 
  RefreshCw, 
  Lock, 
  Database,
  Calendar,
  Clock,
  Sparkles,
  AlertTriangle,
  Check
} from 'lucide-react';
import { StudentProfile, Subject, PastPaper, DifficultyLevel } from '../../types';

interface SettingsViewProps {
  profile: StudentProfile;
  currentSubject: Subject;
  pastPapers: PastPaper[];
  onUpdateProfile: (updated: StudentProfile) => void;
  onUpdateSubject: (updated: Subject) => void;
  onDeletePastPaper: (paperId: string) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  currentSubject,
  pastPapers,
  onUpdateProfile,
  onUpdateSubject,
  onDeletePastPaper,
  onResetData
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [grade, setGrade] = useState(profile.grade);
  const [board, setBoard] = useState(profile.board);
  const [targetExamDate, setTargetExamDate] = useState(currentSubject.targetExamDate || profile.targetExamDate);
  const [dailyMinutes, setDailyMinutes] = useState(profile.dailyStudyMinutes);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(profile.preferredDifficulty);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: StudentProfile = {
      ...profile,
      name,
      email,
      grade,
      board,
      targetExamDate,
      dailyStudyMinutes: dailyMinutes,
      preferredDifficulty: difficulty,
    };
    onUpdateProfile(updatedProfile);

    const updatedSubject: Subject = {
      ...currentSubject,
      board,
      grade,
      targetExamDate,
      dailyStudyMinutes: dailyMinutes,
      preferredDifficulty: difficulty,
    };
    onUpdateSubject(updatedSubject);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings & Study Preferences</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your student profile, exam deadlines, uploaded documents, and privacy preferences.
        </p>
      </div>

      {/* Profile & Study Preferences Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Student Profile & Goal Settings</h2>
              <p className="text-xs text-slate-500">Personalize your study pacing and question recommendations</p>
            </div>
          </div>

          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Successfully</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Grade / Level</label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Board</label>
            <input
              type="text"
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Exam Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                value={targetExamDate}
                onChange={(e) => setTargetExamDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Study Target</label>
            <select
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-brand-500"
            >
              <option value={30}>30 minutes / day</option>
              <option value={45}>45 minutes / day</option>
              <option value={60}>60 minutes / day</option>
              <option value={75}>75 minutes / day</option>
              <option value={90}>90 minutes / day</option>
              <option value={120}>120 minutes / day</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Uploaded Materials Management */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-accent-700 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Uploaded Study Materials & Past Papers</h2>
              <p className="text-xs text-slate-500">Manage or delete documents stored in your local workspace</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">{pastPapers.length} Documents</span>
        </div>

        {pastPapers.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {pastPapers.map(paper => (
              <div key={paper.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-xs text-slate-800">{paper.title}</h4>
                    <span className="text-[10px] text-slate-400">
                      {paper.fileName} &bull; {paper.fileSize} &bull; {paper.extractedQuestionsCount} questions
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeletePastPaper(paper.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-3">No uploaded files currently stored.</p>
        )}
      </div>

      {/* Privacy & Reset Controls */}
      <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-700">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <h2 className="text-sm font-bold">Data & Privacy Controls</h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          All study materials, syllabus extractions, and practice answers are stored privately in your browser's local storage. You can reset your session history or restore default sample data at any time.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm('Reset all progress and reload pre-populated Class 12 Physics sample data?')) {
                onResetData();
              }
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset & Reload Sample Data</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete all student data and clear local storage? This cannot be undone.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Local Storage Data</span>
          </button>
        </div>
      </div>

    </div>
  );
};
