import React, { useState } from 'react';
import { useSubmissions } from '../hooks/useSubmissions';
import api from '../services/api';
import { Search, ThumbsUp, ExternalLink, GitBranch } from 'lucide-react';

const TRACKS = ['All', 'AI/ML', 'Web3 & Blockchain', 'FinTech', 'HealthTech'];

export default function Gallery() {
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [search, setSearch] = useState('');
  const { submissions, loading, error, refetch } = useSubmissions(selectedTrack, search);
  const [votingId, setVotingId] = useState(null);

  const handleVote = async (submissionId) => {
    try {
      setVotingId(submissionId);
      await api.post('/votes', {
        submissionId,
        clientFingerprint: navigator.userAgent + window.screen.width
      });
      await refetch();
    } catch (err) {
      alert(err.response?.data?.error || 'Vote could not be processed');
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search and Track Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-secondary absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search projects, tags, or teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-subtle text-primary text-sm focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {TRACKS.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrack(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTrack === t
                  ? 'bg-accent text-white'
                  : 'bg-surface border border-subtle text-secondary hover:text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-secondary text-sm">Loading project showcase...</div>
      ) : error ? (
        <div className="text-center py-20 text-status-danger text-sm">{error}</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 text-secondary text-sm">No submissions found.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((sub) => (
            <div key={sub._id} className="rounded-xl bg-surface border border-subtle overflow-hidden flex flex-col justify-between shadow-card hover:border-accent/40 transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 border border-accent/30 text-accent">
                    {sub.track}
                  </span>
                  <button
                    onClick={() => handleVote(sub._id)}
                    disabled={votingId === sub._id}
                    className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-status-success font-medium transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{sub.publicVoteCount || 0}</span>
                  </button>
                </div>

                <h3 className="text-lg font-bold text-primary mb-1">{sub.title}</h3>
                <p className="text-xs text-secondary mb-4 line-clamp-2">{sub.tagline}</p>

                <div className="text-xs text-secondary space-y-1">
                  <div>Team: <span className="text-primary font-medium">{sub.teamId?.name || 'Independent'}</span></div>
                </div>
              </div>

              <div className="px-6 py-3 bg-surface-raised/40 border-t border-subtle flex items-center justify-between text-xs">
                {sub.repoUrl && (
                  <a
                    href={sub.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-secondary hover:text-primary transition-colors"
                  >
                    <GitBranch className="w-3.5 h-3.5" /> Repository
                  </a>
                )}
                {sub.demoUrl && (
                  <a
                    href={sub.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
