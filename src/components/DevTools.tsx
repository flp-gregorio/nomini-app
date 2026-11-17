import React, { useState } from 'react';

import api from '../lib/api';

const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // If not in development, do not render this component
  if (!import.meta.env.DEV) {
    return null;
  }

  const handleLogin = async (username: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', {
        username,
        password: 'password123',
      });
      localStorage.setItem('jwt', res.data.token);
      window.location.reload(); // Reload to update auth state across the app
    } catch (error) {
      console.error('DevTools login failed:', error);
      alert(`Login failed for ${username}. Did you run the seed script?`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/login';
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold p-3 shadow-lg z-50 transition-all font-mono text-sm"
        title="Open DevTools"
      >
        🛠 Dev
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-zinc-900 border border-yellow-500 text-white p-4 shadow-2xl z-50 w-72 flex flex-col gap-4 font-mono text-sm">
      <div className="flex justify-between items-center border-b border-zinc-700 pb-2">
        <h3 className="font-bold text-yellow-500 text-lg">🛠 DevTools</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-zinc-400 hover:text-white font-bold px-2 py-1"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Quick Login</span>
        <button
          disabled={isLoading}
          onClick={() => handleLogin('admin_dev')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 text-left transition-colors flex justify-between items-center"
        >
          <span>Login as Admin</span>
          <span className="text-xs opacity-75">admin_dev</span>
        </button>
        <button
          disabled={isLoading}
          onClick={() => handleLogin('test_dev')}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-3 text-left transition-colors flex justify-between items-center"
        >
          <span>Login as User</span>
          <span className="text-xs opacity-75">test_dev</span>
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-3 text-left transition-colors mt-1"
        >
          Clear Session (Logout)
        </button>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-zinc-700">
        <span className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Navigation</span>
        <div className="grid grid-cols-2 gap-2">
          <a href="/" onClick={() => setIsOpen(false)} className="hover:text-yellow-400 hover:underline">/home</a>
          <a href="/login" onClick={() => setIsOpen(false)} className="hover:text-yellow-400 hover:underline">/login</a>
          <a href="/register" onClick={() => setIsOpen(false)} className="hover:text-yellow-400 hover:underline">/register</a>
          <a href="/nominees" onClick={() => setIsOpen(false)} className="hover:text-yellow-400 hover:underline">/nominees</a>
          <a href="/profile" onClick={() => setIsOpen(false)} className="hover:text-yellow-400 hover:underline">/profile</a>
          <a href="/leaderboard" onClick={() => setIsOpen(false)} className="hover:text-yellow-400 hover:underline">/leaderboard</a>
          <a href="/admin" onClick={() => setIsOpen(false)} className="hover:text-yellow-400 hover:underline">/admin</a>
        </div>
      </div>
    </div>
  );
};

export default DevTools;
