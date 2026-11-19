import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Layers, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  BookOpen,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { Subject, QuestionType, DifficultyLevel } from '../../types';

interface PracticeSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubject: Subject;
  initialTopicId?: string;
  onLaunchPractice: (config: {
    topicIds: string[];
    difficulty: DifficultyLevel;
    types: QuestionType[];
    questionCount: number;
  }) => void;
}

export const PracticeSetupModal: React.FC<PracticeSetupModalProps> = ({
  isOpen,
  onClose,
  currentSubject,
  initialTopicId,
  onLaunchPractice
}) => {
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>(
    initialTopicId ? [initialTopicId] : currentSubject.topics.map(t => t.id)
  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(currentSubject.preferredDifficulty || 'medium');
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(['mcq', 'short_answer', 'numerical', 'long_answer']);
  const [questionCount, setQuestionCount] = useState<number>(5);

  if (!isOpen) return null;

  const toggleTopic = (id: string) => {
    if (selectedTopicIds.includes(id)) {
      if (selectedTopicIds.length > 1) {
        setSelectedTopicIds(selectedTopicIds.filter(t => t !== id));
      }
    } else {
      setSelectedTopicIds([...selectedTopicIds, id]);
    }
  };

  const selectAllTopics = () => {
    setSelectedTopicIds(currentSubject.topics.map(t => t.id));
  };

  const toggleType = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter(t => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleStart = () => {
    onLaunchPractice({
      topicIds: selectedTopicIds,
      difficulty,
      types: selectedTypes,
      questionCount
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Custom Practice Session</h2>
              <p className="text-xs text-slate-500">{currentSubject.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Topic Coverage */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">Topic Coverage</label>
              <button
                type="button"
                onClick={selectAllTopics}
                className="text-[11px] text-brand-600 font-semibold hover:underline"
              >
                Select All Topics
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50">
              {currentSubject.topics.map(topic => {
                const isChecked = selectedTopicIds.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors ${
                      isChecked ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-brand-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span className="truncate">{topic.name}</span>
                    <span className="ml-auto text-[10px] text-slate-400 shrink-0">
                      {topic.estimatedWeightagePercentage}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Difficulty Pacing</label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map(diff => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                    difficulty === diff 
                      ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-xs ring-1 ring-brand-500' 
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question Types */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Question Formats</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { type: 'mcq' as QuestionType, label: 'Multiple Choice (MCQ)' },
                { type: 'numerical' as QuestionType, label: 'Numerical Calculations' },
                { type: 'short_answer' as QuestionType, label: 'Short Conceptual Answers' },
                { type: 'long_answer' as QuestionType, label: 'Long Derivations & Explanations' },
              ].map(item => {
                const isSelected = selectedTypes.includes(item.type);
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => toggleType(item.type)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${
                      isSelected 
                        ? 'border-brand-600 bg-brand-50 text-brand-800 font-semibold' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <span className="text-[11px] truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Questions Count</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    questionCount === count 
                      ? 'border-brand-600 bg-brand-600 text-white shadow-xs' 
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {count} Qs
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStart}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Start Practice Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
