import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Package, Users, Bell, LogOut, MessageSquare } from 'lucide-react';

export default function CorporateLayout({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6">
          <div className="font-black text-2xl tracking-tight text-white mb-8">
            BuildGig<span className="text-blue-500">Corp</span>
          </div>
          <nav className="space-y-2">
            <NavItem 
              to="/corporate/sites" 
              icon={<Building2 />} 
              label="Site Management" 
              active={location.pathname.includes('/corporate/sites')} 
            />
            <NavItem 
              to="/corporate/materials" 
              icon={<Package />} 
              label="Materials & Logistics" 
              active={location.pathname === '/corporate/materials'} 
            />
            <NavItem 
              to="/corporate/marketplace" 
              icon={<Users />} 
              label="Subcontractor Market" 
              active={location.pathname === '/corporate/marketplace'} 
            />
            <NavItem 
              to="/corporate/community" 
              icon={<MessageSquare />} 
              label="Community Forum" 
              active={location.pathname === '/corporate/community'} 
            />
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 hover:text-white text-slate-400"
          >
            <div className="w-5 h-5 mr-3"><LogOut className="w-5 h-5" /></div>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-end px-8">
          <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors mr-4">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden">
            <img src="https://i.pravatar.cc/150?u=corp" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, active }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
        active ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'
      }`}
    >
      <div className="w-5 h-5 mr-3">{icon}</div>
      <span>{label}</span>
    </Link>
  );
}
