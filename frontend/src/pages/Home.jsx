import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, Cpu, Trophy, Terminal, ArrowRight } from 'lucide-react';

export default function Home() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/gallery');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, 'Raptor2026!');
      navigate('/gallery');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Air-Gapped • Zero Cloud Egress
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
          Dogfood <span className="text-accent">2026</span>
        </h1>
        <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto">
          Self-hosted, offline-first hackathon submission, statistical judging, and community platform for Hackathon Raptors 2026.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium shadow-card transition-all"
          >
            Explore Project Gallery <ArrowRight className="w-4 h-4" />
          </Link>
          {user && (
            <Link
              to="/team"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-surface border border-subtle hover:bg-surface-raised text-primary font-medium transition-all"
            >
              My Team & Submission
            </Link>
          )}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 rounded-xl bg-surface border border-subtle">
          <Cpu className="w-8 h-8 text-accent mb-4" />
          <h3 className="text-lg font-bold text-primary mb-2">Statistical Normalization</h3>
          <p className="text-sm text-secondary">
            Z-score and Empirical Bayesian shrinkage eliminate judge severity bias, ensuring objective project evaluation.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-surface border border-subtle">
          <ShieldCheck className="w-8 h-8 text-status-success mb-4" />
          <h3 className="text-lg font-bold text-primary mb-2">Route Isolation Security</h3>
          <p className="text-sm text-secondary">
            Ballot inspection is guarded at the HTTP controller level. Judges cannot view competitor scores or other tracks.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-surface border border-subtle">
          <Trophy className="w-8 h-8 text-status-warning mb-4" />
          <h3 className="text-lg font-bold text-primary mb-2">Live Tournament Standings</h3>
          <p className="text-sm text-secondary">
            Real-time toggling between raw averages and normalized distributions with one-click audit-compliant CSV export.
          </p>
        </div>
      </div>

      {/* Quick Access Sign In / Demo Switcher */}
      {!user && (
        <div className="max-w-md mx-auto p-8 rounded-xl bg-surface border border-subtle shadow-card">
          <h2 className="text-xl font-bold text-primary mb-2 text-center">Fast Tournament Access</h2>
          <p className="text-xs text-secondary text-center mb-6">Sign in or click a seeded persona below</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleQuickLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@raptors.local"
                className="w-full px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-canvas border border-subtle text-primary text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium text-sm transition-all"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="pt-4 border-t border-subtle">
            <span className="block text-xs font-medium text-secondary mb-3 text-center">Quick One-Click Demo Personas:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('organizer@raptors.local')}
                className="px-2 py-1.5 rounded bg-surface-raised border border-subtle hover:border-accent text-xs text-primary transition-all"
              >
                Organizer
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('judge.ai@raptors.local')}
                className="px-2 py-1.5 rounded bg-surface-raised border border-subtle hover:border-accent text-xs text-primary transition-all"
              >
                AI Judge
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('judge.web3@raptors.local')}
                className="px-2 py-1.5 rounded bg-surface-raised border border-subtle hover:border-accent text-xs text-primary transition-all"
              >
                Web3 Judge
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('hacker@raptors.local')}
                className="px-2 py-1.5 rounded bg-surface-raised border border-subtle hover:border-accent text-xs text-primary transition-all"
              >
                Participant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
