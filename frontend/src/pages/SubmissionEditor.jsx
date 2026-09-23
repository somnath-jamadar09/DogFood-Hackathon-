import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatMarkdownPreview } from '../utils/markdownSanitizer';
import { Save, Lock, Upload, CheckCircle } from 'lucide-react';

export default function SubmissionEditor() {
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    track: 'AI/ML',
    repoUrl: '',
    demoUrl: '',
    descriptionMarkdown: '### Project Overview\n\nExplain your architecture, problem statement, and key features here.'
  });
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await api.get('/teams/my-team');
        if (res.data.team) {
          setFormData((prev) => ({
            ...prev,
            track: res.data.team.track || 'AI/ML'
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, []);

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await api.post('/submissions', formData);
      setStatus(res.data.submission.status);
      setMessage('Draft saved successfully.');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleFinalize = async () => {
    if (!window.confirm('Are you sure you want to finalize this submission for evaluation?')) return;
    setSaving(true);
    try {
      await api.post('/submissions/finalize');
      setStatus('submitted');
      setMessage('Submission successfully locked and queued for judging!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Finalization failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-secondary text-sm">Loading submission workspace...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Project Submission Editor</h1>
          <p className="text-xs text-secondary">Markdown dual-pane editor with live rendered preview</p>
        </div>
        <div className="flex items-center gap-3">
          {message && <span className="text-xs text-status-success font-medium">{message}</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-subtle hover:bg-surface-raised text-primary text-xs font-semibold transition-all"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
          <button
            onClick={handleFinalize}
            disabled={saving || status === 'submitted'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-card transition-all"
          >
            <Lock className="w-3.5 h-3.5" /> Finalize Submission
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form Column */}
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-surface border border-subtle space-y-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">Project Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Neural Raptor"
                className="w-full px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">Short Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Autonomous air-gapped machine learning evaluator"
                className="w-full px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Code Repository URL</label>
                <input
                  type="url"
                  value={formData.repoUrl}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Live Demo URL</label>
                <input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  placeholder="http://localhost:3000/demo"
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-subtle">
            <label className="block text-xs font-medium text-secondary mb-2">Description Markdown</label>
            <textarea
              rows={12}
              value={formData.descriptionMarkdown}
              onChange={(e) => setFormData({ ...formData, descriptionMarkdown: e.target.value })}
              className="w-full p-3 rounded-lg bg-canvas border border-subtle text-primary font-mono text-xs focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Live Sanitized Preview Column */}
        <div className="p-6 rounded-xl bg-surface border border-subtle flex flex-col">
          <div className="text-xs uppercase tracking-wider text-secondary font-semibold mb-4 pb-2 border-b border-subtle">
            Live Preview
          </div>
          <div className="prose prose-invert max-w-none text-sm text-secondary overflow-y-auto flex-1">
            <h2 className="text-xl font-bold text-primary mb-1">{formData.title || 'Untitled Project'}</h2>
            <p className="text-xs text-accent mb-4">{formData.tagline || 'Short elevator pitch preview'}</p>
            <div
              dangerouslySetInnerHTML={{
                __html: formatMarkdownPreview(formData.descriptionMarkdown)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
