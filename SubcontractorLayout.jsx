import React from 'react';
import { Outlet } from 'react-router-dom';

export default function SubcontractorLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="font-black text-xl tracking-tight text-blue-600">BuildGig<span className="text-slate-900">Pro</span></div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
            <img src="https://i.pravatar.cc/150?u=sub" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
