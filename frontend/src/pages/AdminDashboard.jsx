import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Play, Calculator, Download, Trophy, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [mode, setMode] = useState('normalized');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/leaderboard', { params: { mode } });
      setLeaderboard(res.data.leaderboard || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [mode]);

  const handleAssignJudges = async () => {
    setMessage('');
    try {
      const res = await api.post('/admin/assign-judges');
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Assignment solver failed.');
    }
  };

  const handleNormalize = async () => {
    setMessage('');
    try {
      const res = await api.post('/admin/normalize-scores');
      setMessage('Statistical normalization successfully executed across all completed scorecards.');
      await fetchLeaderboard();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Normalization failed.');
    }
  };

  const handleExportCSV = () => {
    window.open('/api/v1/admin/export/csv', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Organizer Command Center</h1>
          <p className="text-xs text-secondary">Control judge assignment, compute score normalization, and review standings</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAssignJudges}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface border border-subtle hover:border-accent text-xs font-semibold text-primary transition-all"
          >
            <Play className="w-3.5 h-3.5 text-accent" /> Run Judge Assignment
          </button>
          <button
            onClick={handleNormalize}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-xs font-semibold text-white shadow-card transition-all"
          >
            <Calculator className="w-3.5 h-3.5" /> Normalize Scores
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface border border-subtle hover:bg-surface-raised text-xs font-semibold text-primary transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {message}
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="rounded-xl bg-surface border border-subtle overflow-hidden shadow-card">
        <div className="p-4 bg-surface-raised/40 border-b border-subtle flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-primary">Tournament Leaderboard</h3>
          </div>
          <div className="flex bg-canvas p-1 rounded-lg border border-subtle text-xs">
            <button
              onClick={() => setMode('normalized')}
              className={`px-3 py-1 rounded font-medium transition-all ${
                mode === 'normalized' ? 'bg-accent text-white' : 'text-secondary hover:text-primary'
              }`}
            >
              Normalized (0-100)
            </button>
            <button
              onClick={() => setMode('raw')}
              className={`px-3 py-1 rounded font-medium transition-all ${
                mode === 'raw' ? 'bg-accent text-white' : 'text-secondary hover:text-primary'
              }`}
            >
              Raw Average (1-10)
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-secondary text-sm">Calculating rankings...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-16 text-secondary text-sm">No submissions scored yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas border-b border-subtle text-secondary uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4">Track</th>
                  <th className="py-3 px-4">Ballots</th>
                  <th className="py-3 px-4">Raw Avg</th>
                  <th className="py-3 px-4">Normalized</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {leaderboard.map((item, idx) => (
                  <tr key={item.submissionId} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-accent">#{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-primary">{item.title}</td>
                    <td className="py-3 px-4 text-secondary">{item.teamName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-accent/10 text-accent font-medium">
                        {item.track}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-secondary">{item.scoresCount}</td>
                    <td className="py-3 px-4 font-mono text-secondary">{item.averageRawScore} / 10</td>
                    <td className="py-3 px-4 font-mono font-bold text-status-success">{item.averageNormalizedScore} / 100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
