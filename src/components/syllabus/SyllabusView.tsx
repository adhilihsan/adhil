import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Sparkles, 
  FileText, 
  Download, 
  AlertCircle, 
  HelpCircle,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';
import { Subject, SyllabusTopic, PastPaper } from '../../types';
import { DocumentUploader } from './DocumentUploader';
import { getDifficultyColor, getMasteryColor } from '../../utils/helpers';
import { AIAgentService } from '../../services/aiAgentService';

interface SyllabusViewProps {
  currentSubject: Subject;
  pastPapers: PastPaper[];
  onUpdateTopics: (topics: SyllabusTopic[]) => void;
  onAddPastPaper: (paper: PastPaper) => void;
  onDeletePastPaper: (id: string) => void;
  onStartPracticeWithTopic: (topicId: string) => void;
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({
  currentSubject,
  pastPapers,
  onUpdateTopics,
  onAddPastPaper,
  onDeletePastPaper,
  onStartPracticeWithTopic
}) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'past_papers'>('syllabus');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [pendingTopics, setPendingTopics] = useState<SyllabusTopic[]>([]);
  const [pendingSource, setPendingSource] = useState<string>('');
  
  // Topic inline edit state
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [editedWeight, setEditedWeight] = useState(15);
  const [editedSubtopics, setEditedSubtopics] = useState('');

  // Handle topics extracted from uploader
  const handleTopicsExtracted = (extracted: SyllabusTopic[], fileName?: string) => {
    setPendingTopics(extracted.map(t => ({ ...t, subjectId: currentSubject.id })));
    setPendingSource(fileName || 'Uploaded Document');
    setReviewModalOpen(true);
  };

  const handleSaveReviewedTopics = () => {
    // Append or replace
    const existingNames = new Set(currentSubject.topics.map(t => t.name.toLowerCase()));
    const newUnique = pendingTopics.filter(t => !existingNames.has(t.name.toLowerCase()));
    
    // Normalize weights
    const allTopics = [...currentSubject.topics, ...newUnique];
    onUpdateTopics(allTopics);
    setReviewModalOpen(false);
  };

  const handlePastPaperUploaded = (title: string, year: number, totalMarks: number, fileName: string) => {
    const newPaper: PastPaper = {
      id: `pp_${Date.now()}`,
      subjectId: currentSubject.id,
      title,
      year,
      examBoard: currentSubject.board,
      totalMarks,
      durationMinutes: 180,
      fileName,
      fileSize: '1.8 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      extractedQuestionsCount: Math.floor(totalMarks / 2.5),
      status: 'processed'
    };
    onAddPastPaper(newPaper);
  };

  const handleDeleteTopic = (topicId: string) => {
    const updated = currentSubject.topics.filter(t => t.id !== topicId);
    onUpdateTopics(updated);
  };

  const startEditTopic = (topic: SyllabusTopic) => {
    setEditingTopicId(topic.id);
    setEditedName(topic.name);
    setEditedWeight(topic.estimatedWeightagePercentage);
    setEditedSubtopics(topic.subtopics.join(', '));
  };

  const saveEditTopic = () => {
    if (!editingTopicId) return;
    const updated = currentSubject.topics.map(t => {
      if (t.id === editingTopicId) {
        return {
          ...t,
          name: editedName,
          estimatedWeightagePercentage: editedWeight,
          subtopics: editedSubtopics.split(',').map(s => s.trim()).filter(Boolean)
        };
      }
      return t;
    });
    onUpdateTopics(updated);
    setEditingTopicId(null);
  };

  const handleAddNewManualTopic = () => {
    const newTopic: SyllabusTopic = {
      id: `top_manual_${Date.now()}`,
      subjectId: currentSubject.id,
      name: 'New Chapter / Topic',
      description: 'Enter key concepts and principles for this chapter.',
      estimatedWeightagePercentage: 10,
      subtopics: ['Core Definitions', 'Standard Derivations', 'Formula Practice'],
      difficultyTrend: 'medium',
      masteryLevel: 0,
      totalPracticed: 0,
      totalCorrect: 0
    };
    onUpdateTopics([...currentSubject.topics, newTopic]);
    startEditTopic(newTopic);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Syllabus & Materials</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200">
              {currentSubject.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review your curriculum topics, upload past board papers, and generate exam-style questions.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'syllabus' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Syllabus Topics ({currentSubject.topics.length})
          </button>
          <button
            onClick={() => setActiveTab('past_papers')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'past_papers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Past Papers ({pastPapers.length})
          </button>
        </div>
      </div>

      {activeTab === 'syllabus' ? (
        <div className="space-y-6">
          {/* Document Uploader Card */}
          <DocumentUploader
            mode="syllabus"
            subjectName={currentSubject.name}
            onTopicsExtracted={handleTopicsExtracted}
          />

          {/* Topics List Header & Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Current Syllabus Topics</h2>
              <p className="text-xs text-slate-500">
                Topics are prioritized in adaptive practice based on weightage and your mastery level.
              </p>
            </div>
            <button
              onClick={handleAddNewManualTopic}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Topic Manually</span>
            </button>
          </div>

          {/* Topic Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSubject.topics.map(topic => {
              const isEditing = editingTopicId === topic.id;
              const mastery = getMasteryColor(topic.masteryLevel);
              const diffClass = getDifficultyColor(topic.difficultyTrend);

              if (isEditing) {
                return (
                  <div key={topic.id} className="bg-white rounded-2xl p-5 border-2 border-brand-500 shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-700">Editing Topic</span>
                      <button onClick={() => setEditingTopicId(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Topic Name</label>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Estimated Exam Weightage (%)</label>
                      <input
                        type="number"
                        value={editedWeight}
                        onChange={(e) => setEditedWeight(Number(e.target.value))}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Subtopics (comma-separated)</label>
                      <textarea
                        rows={2}
                        value={editedSubtopics}
                        onChange={(e) => setEditedSubtopics(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-300"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingTopicId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEditTopic}
                        className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={topic.id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-slate-900 text-sm">{topic.name}</h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${diffClass}`}>
                          {topic.difficultyTrend}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {topic.estimatedWeightagePercentage}% Weight
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{topic.description}</p>

                    {/* Subtopics pill list */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {topic.subtopics.map((sub, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
                          {sub}
                        </span>
                      ))}
                    </div>

                    {/* Mastery Level Bar */}
                    <div className="pt-2 border-t border-slate-100 mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 text-[11px]">Topic Mastery</span>
                        <span className={`font-bold ${mastery.text}`}>{topic.masteryLevel}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${mastery.bar}`} style={{ width: `${topic.masteryLevel}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditTopic(topic)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Edit topic details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTopic(topic.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete topic"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onStartPracticeWithTopic(topic.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold transition-colors"
                    >
                      <span>Practice Topic</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Past Papers Tab */
        <div className="space-y-6">
          <DocumentUploader
            mode="past_paper"
            subjectName={currentSubject.name}
            onTopicsExtracted={() => {}}
            onPastPaperUploaded={handlePastPaperUploaded}
          />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Extracted Past Question Papers</h3>
                <p className="text-xs text-slate-500">The agent extracts questions, marks schemes, and difficulty distributions</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {pastPapers.map(paper => (
                <div key={paper.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-accent-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{paper.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {paper.fileName} &bull; {paper.fileSize} &bull; Uploaded {paper.uploadDate}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          Year {paper.year}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {paper.totalMarks} Marks ({paper.durationMinutes} min)
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          {paper.extractedQuestionsCount} Questions Indexed
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => onStartPracticeWithTopic(currentSubject.topics[0]?.id)}
                      className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Practice Exam Pattern</span>
                    </button>
                    <button
                      onClick={() => onDeletePastPaper(paper.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete paper"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review & Edit Extracted Topics Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Review Extracted Topics</h3>
                  <p className="text-[11px] text-slate-500">Source: {pendingSource}</p>
                </div>
              </div>
              <button onClick={() => setReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <p className="text-xs text-slate-600">
                The agent identified <strong className="text-slate-900">{pendingTopics.length} topics</strong> from your document. You can rename, edit weightages, or remove any topics before adding them to your syllabus.
              </p>

              <div className="space-y-3">
                {pendingTopics.map((pt, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={pt.name}
                        onChange={(e) => {
                          const updated = [...pendingTopics];
                          updated[idx].name = e.target.value;
                          setPendingTopics(updated);
                        }}
                        className="font-bold text-slate-900 w-full p-1.5 rounded-md border border-slate-200"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          value={pt.estimatedWeightagePercentage}
                          onChange={(e) => {
                            const updated = [...pendingTopics];
                            updated[idx].estimatedWeightagePercentage = Number(e.target.value);
                            setPendingTopics(updated);
                          }}
                          className="w-16 p-1.5 rounded-md border border-slate-200 text-center"
                        />
                        <span className="text-[11px] text-slate-500">%</span>
                        <button
                          onClick={() => {
                            setPendingTopics(pendingTopics.filter((_, i) => i !== idx));
                          }}
                          className="p-1.5 rounded text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={pt.subtopics.join(', ')}
                      onChange={(e) => {
                        const updated = [...pendingTopics];
                        updated[idx].subtopics = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setPendingTopics(updated);
                      }}
                      placeholder="Subtopics (comma-separated)"
                      className="w-full p-1.5 rounded-md border border-slate-200 text-slate-600 text-[11px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReviewedTopics}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept & Add Topics to Syllabus</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
