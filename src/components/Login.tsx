import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setRole }: { setRole: (role: string) => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setRole(data.role);
        navigate(data.role === 'admin' ? '/admin' : '/');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0c0a09] p-6">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <div className="absolute w-[80vw] h-[80vh] bg-brand-gold/5 rounded-full blur-[140px] mix-blend-screen animate-pulse" />
        <div className="absolute w-[60vw] h-[60vh] bg-brand-rose/5 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#13100e] border border-white/5 p-8 rounded-3xl glow-box relative z-10"
      >
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
          <Lock className="w-6 h-6 text-brand-gold" />
        </div>
        
        <h2 className="text-2xl font-display font-light text-white text-center mb-10 tracking-wide text-gray-200">
          Enter Password
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full bg-[#1b1714] border border-white/10 rounded-xl px-4 py-3 text-center tracking-widest text-white focus:outline-none focus:border-brand-gold transition-colors disabled:opacity-50"
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-sm text-center font-sans tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-brand-warm hover:bg-brand-warm/80 text-white font-semibold py-3 rounded-xl tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(212,163,115,0.3)] hover:shadow-[0_0_30px_rgba(212,163,115,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'VERIFYING...' : 'UNLOCK'}
          </button>

          <p className="text-xs text-center text-gray-600 mt-6 tracking-widest font-sans uppercase">
            
          </p>
        </form>
      </motion.div>
    </div>
  );
}
