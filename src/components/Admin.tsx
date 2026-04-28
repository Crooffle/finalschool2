import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'motion/react';
import { LogOut, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Submission {
  id: string;
  text: string;
  createdAt: string;
}

export default function Admin({ setRole }: { setRole: (role: string | null) => void }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/submissions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      } else if (res.status === 401 || res.status === 403) {
        setRole(null);
        navigate('/login');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    await fetch('/api/logout', { method: 'POST' });
    setRole(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#0c0a09] p-6 text-gray-200 font-sans">
      <div className="max-w-5xl mx-auto py-12">
        <header className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-display font-bold glow-text text-brand-gold">Dashboard</h1>
            <p className="text-gray-500 text-sm tracking-wide mt-2">Emotional Storytelling Submissions</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={fetchSubmissions}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <RefreshCcw className={`w-5 h-5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors tracking-wide text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT
            </button>
          </div>
        </header>

        <main className="space-y-6">
          {isLoading && submissions.length === 0 ? (
            <div className="text-center py-20 text-gray-500 animate-pulse tracking-widest text-sm uppercase">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/[0.02]">
              <p className="text-gray-500 text-lg font-light">No submissions yet.</p>
            </div>
          ) : (
            submissions.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <p className="text-gray-300 text-lg font-light leading-relaxed">{sub.text}</p>
                </div>
                <div className="text-xs text-gray-600 tracking-widest uppercase mt-4 flex items-center">
                  <span>{formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(sub.createdAt).toLocaleString()}</span>
                </div>
              </motion.div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
