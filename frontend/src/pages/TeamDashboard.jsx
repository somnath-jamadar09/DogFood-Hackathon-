import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Users, Key, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TeamDashboard() {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState('');
  const [track, setTrack] = useState('AI/ML');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teams/my-team');
      setTeam(res.data.team);
    } catch (err) {
      setTeam(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/teams', { name: teamName, track });
      await fetchTeam();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create team');
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/teams/join', { joinCode });
      await fetchTeam();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not join team');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-secondary text-sm">Loading team status...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {team ? (
        <div className="space-y-6">
          <div className="p-8 rounded-xl bg-surface border border-subtle shadow-card">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-subtle">
              <div>
                <span className="text-xs uppercase tracking-wider text-accent font-semibold">{team.track} Track</span>
                <h1 className="text-2xl font-bold text-primary mt-1">{team.name}</h1>
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-surface-raised border border-subtle">
                <Key className="w-4 h-4 text-secondary" />
                <div>
                  <div className="text-[10px] text-secondary font-medium uppercase">Invite Code</div>
                  <div className="font-mono text-sm font-bold text-primary tracking-widest">{team.joinCode}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-secondary mb-3">Team Roster ({team.members?.length || 0}/4 Members)</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {team.members?.map((m) => (
                  <div key={m._id} className="p-3 rounded-lg bg-canvas border border-subtle flex items-center justify-between text-xs">
                    <span className="font-medium text-primary">{m.fullName}</span>
                    <span className="text-secondary">{m.email}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs">
                {team.hasSubmitted ? (
                  <span className="inline-flex items-center gap-1.5 text-status-success font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Final Submission Queued
                  </span>
                ) : (
                  <span className="text-status-warning font-medium">Draft in Progress</span>
                )}
              </div>
              <Link
                to="/submission"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-card transition-all"
              >
                Open Project Editor <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Team Card */}
          <div className="p-6 rounded-xl bg-surface border border-subtle">
            <Users className="w-6 h-6 text-accent mb-3" />
            <h2 className="text-lg font-bold text-primary mb-1">Create New Team</h2>
            <p className="text-xs text-secondary mb-6">Form a squad and invite up to 3 collaborators.</p>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. CyberDinos"
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">Track</label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary text-sm focus:outline-none focus:border-accent"
                >
                  <option>AI/ML</option>
                  <option>Web3 & Blockchain</option>
                  <option>FinTech</option>
                  <option>HealthTech</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium text-xs transition-all"
              >
                Create Team
              </button>
            </form>
          </div>

          {/* Join Team Card */}
          <div className="p-6 rounded-xl bg-surface border border-subtle">
            <Key className="w-6 h-6 text-status-success mb-3" />
            <h2 className="text-lg font-bold text-primary mb-1">Join with Code</h2>
            <p className="text-xs text-secondary mb-6">Enter the 6-character code provided by your captain.</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1">6-Character Secret Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="RAPTOR"
                  className="w-full px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-accent"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-surface-raised border border-subtle hover:border-accent text-primary font-medium text-xs transition-all"
              >
                Join Team
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
