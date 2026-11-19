import React from 'react';
import { AlertCircle, CheckCircle2, Flag, FileQuestion, ArrowRight, X } from 'lucide-react';
import { PracticeSession } from '../../types';

interface ExamSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  session: PracticeSession;
}

export const ExamSubmitModal: React.FC<ExamSubmitModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  session
}) => {
  if (!isOpen) return null;

  const total = session.questions.length;
  let answered = 0;
  let flagged = 0;

  session.questions.forEach(q => {
    const sub = session.submissions[q.id];
    if (sub && sub.studentAnswer && sub.studentAnswer.trim().length > 0) {
      answered++;
    }
    if (sub && sub.isFlagged) {
      flagged++;
    }
  });

  const unanswered = total - answered;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">Submit Examination</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to finish and submit your exam? Once submitted, your answers will be locked and evaluated by the rubric agent.
          </p>

          {/* Counts overview */}
          <div className="grid grid-cols-3 gap-2.5 py-1">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="block text-xl font-extrabold text-emerald-800">{answered}</span>
              <span className="text-[10px] font-semibold text-emerald-700 uppercase">Answered</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-center">
              <span className="block text-xl font-extrabold text-slate-700">{unanswered}</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Unanswered</span>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center">
              <span className="block text-xl font-extrabold text-purple-800">{flagged}</span>
              <span className="text-[10px] font-semibold text-purple-700 uppercase">Flagged</span>
            </div>
          </div>

          {unanswered > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                You have <strong>{unanswered} unanswered {unanswered === 1 ? 'question' : 'questions'}</strong>. You can return to the paper to complete them.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Return to Exam
          </button>

          <button
            onClick={onConfirmSubmit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Confirm & Submit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
