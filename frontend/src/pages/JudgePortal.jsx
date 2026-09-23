import React, { useState } from 'react';
import { useJudging } from '../hooks/useJudging';
import { CheckCircle2, Clock, ExternalLink, Send } from 'lucide-react';

const RUBRIC = [
  { name: 'Technical Execution', weight: 0.30 },
  { name: 'Innovation & Originality', weight: 0.25 },
  { name: 'Practical Impact', weight: 0.25 },
  { name: 'Polish & Presentation', weight: 0.20 }
];

export default function JudgePortal() {
  const { assignments, loading, error, submitScore } = useJudging();
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [scores, setScores] = useState({
    'Technical Execution': 7.0,
    'Innovation & Originality': 7.0,
    'Practical Impact': 7.0,
    'Polish & Presentation': 7.0
  });
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const activeAssignment = assignments.find((a) => a.submission?._id === selectedSubId) || assignments[0];

  const handleScoreChange = (criterion, val) => {
    setScores((prev) => ({ ...prev, [criterion]: parseFloat(val) }));
  };

  const handleSubmit = async () => {
    if (!activeAssignment?.submission?._id) return;
    setSubmitting(true);
    try {
      const criteriaScores = RUBRIC.map((r) => ({
        criteriaName: r.name,
        weight: r.weight,
        rawScore: scores[r.name] || 7.0
      }));

      await submitScore(activeAssignment.submission._id, criteriaScores, notes);
      alert('Ballot successfully submitted!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit ballot');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-secondary text-sm">Loading assigned evaluation queue...</div>;
  }

  if (assignments.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-xl font-bold text-primary mb-2">No Projects Assigned Yet</h2>
        <p className="text-xs text-secondary">
          The organizer has not yet executed the automated judge assignment engine. Please check back shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Queue Column */}
        <div className="space-y-4">
          <h2 className="text-sm uppercase font-semibold text-secondary tracking-wider">Evaluation Queue</h2>
          <div className="space-y-2">
            {assignments.map((item) => {
              const sub = item.submission;
              if (!sub) return null;
              const isSelected = (activeAssignment?.submission?._id === sub._id);
              const isScored = item.status === 'scored';

              return (
                <div
                  key={item.assignmentId}
                  onClick={() => setSelectedSubId(sub._id)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-surface-raised border-accent shadow-card'
                      : 'bg-surface border-subtle hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-accent px-2 py-0.5 rounded bg-accent/10">
                      {item.track}
                    </span>
                    {isScored ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-status-success font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Scored
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-status-warning font-medium">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-primary truncate">{sub.title}</h4>
                  <p className="text-xs text-secondary truncate">{sub.tagline}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Evaluation Ballot */}
        {activeAssignment?.submission && (
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl bg-surface border border-subtle">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-primary">{activeAssignment.submission.title}</h2>
                  <p className="text-xs text-secondary mt-1">{activeAssignment.submission.tagline}</p>
                </div>
                {activeAssignment.submission.repoUrl && (
                  <a
                    href={activeAssignment.submission.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    View Code <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="p-4 rounded-lg bg-canvas border border-subtle text-xs text-secondary mb-6 max-h-40 overflow-y-auto">
                {activeAssignment.submission.descriptionMarkdown}
              </div>

              {/* Rubric Sliders */}
              <div className="space-y-5">
                <h3 className="text-xs uppercase font-semibold text-secondary tracking-wider">Weighted Rubric Scoring</h3>
                {RUBRIC.map((criterion) => {
                  const val = scores[criterion.name] || 7.0;
                  return (
                    <div key={criterion.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-primary">{criterion.name} ({criterion.weight * 100}%)</span>
                        <span className="font-mono text-accent font-bold">{val.toFixed(1)} / 10.0</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={val}
                        onChange={(e) => handleScoreChange(criterion.name, e.target.value)}
                        className="w-full accent-accent cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Private Notes */}
              <div className="mt-6">
                <label className="block text-xs font-medium text-secondary mb-1">Confidential Judge Feedback / Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide constructive feedback (isolated and confidential)..."
                  className="w-full p-2.5 rounded-lg bg-canvas border border-subtle text-primary text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-card transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> {submitting ? 'Recording...' : 'Submit Evaluation Ballot'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
