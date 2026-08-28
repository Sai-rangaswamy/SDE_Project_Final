import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function WorkerLayout({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-20">
        <div className="font-black text-lg tracking-tight text-blue-600">BuildGig<span className="text-slate-900">Worker</span></div>
        <button onClick={handleLogout} className="text-slate-500 hover:text-slate-800 p-1 flex items-center">
          <LogOut className="w-5 h-5" />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
