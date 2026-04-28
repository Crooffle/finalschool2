import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Story from './components/Story';
import Login from './components/Login';
import Admin from './components/Admin';

export default function App() {
  const [role, setRole] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setRole(null);
      setIsVerifying(false);
      return;
    }
    
    fetch('/api/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setRole(data.role || null);
      })
      .catch(() => setRole(null))
      .finally(() => setIsVerifying(false));
  }, []);

  if (isVerifying) {
    return <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
             <div className="absolute w-[80vw] h-[80vh] bg-brand-blue/10 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
           </div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!role ? <Login setRole={setRole} /> : <Navigate to={role === 'admin' ? '/admin' : '/'} />} 
        />
        <Route 
          path="/admin" 
          element={role === 'admin' ? <Admin setRole={setRole} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={role ? <Story setRole={setRole} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}
