import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import TeamDashboard from './pages/TeamDashboard';
import SubmissionEditor from './pages/SubmissionEditor';
import JudgePortal from './pages/JudgePortal';
import AdminDashboard from './pages/AdminDashboard';
import { ShieldCheck, LogOut, User } from 'lucide-react';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-subtle bg-surface/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-mono font-bold text-sm shadow-card">
              DF
            </span>
            <span>Dogfood <span className="text-accent">2026</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-secondary">
            <Link to="/gallery" className="hover:text-primary transition-colors">Showcase Gallery</Link>
            {user && (
              <>
                <Link to="/team" className="hover:text-primary transition-colors">My Team</Link>
                {(user.role === 'judge' || user.role === 'admin') && (
                  <Link to="/judging" className="hover:text-primary transition-colors">Judging Portal</Link>
                )}
                {(user.role === 'organizer' || user.role === 'admin') && (
                  <Link to="/admin" className="hover:text-primary transition-colors">Organizer Admin</Link>
                )}
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-raised border border-subtle text-[11px] text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AIR-GAPPED
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-secondary hidden sm:inline">
                {user.fullName} <span className="text-[10px] uppercase font-bold text-accent">({user.role})</span>
              </span>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-raised transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-lg bg-surface-raised border border-subtle hover:border-accent text-xs font-semibold text-primary transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-canvas text-primary flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/team" element={<TeamDashboard />} />
                <Route path="/submission" element={<SubmissionEditor />} />
                <Route path="/judging" element={<JudgePortal />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}
