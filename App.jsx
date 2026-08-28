import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WorkerLayout from './layouts/WorkerLayout';
import SubcontractorLayout from './layouts/SubcontractorLayout';
import CorporateLayout from './layouts/CorporateLayout';

import WorkerDashboard from './pages/Worker/Dashboard';
import SubcontractorDashboard from './pages/Subcontractor/Dashboard';
import CorporateMarketplace from './pages/Corporate/Marketplace';
import SiteList from './pages/Corporate/SiteList';
import SiteDetails from './pages/Corporate/SiteDetails';
import Materials from './pages/Corporate/Materials';
import Community from './pages/Corporate/Community';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

export default function App() {
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={!userRole ? <Login onLogin={handleLogin} /> : <Navigate to={`/${userRole}`} replace />} />
        <Route path="/signup" element={!userRole ? <Signup onLogin={handleLogin} /> : <Navigate to={`/${userRole}`} replace />} />

        {/* Protected Routes */}
        {userRole === 'worker' && (
          <Route path="/worker" element={<WorkerLayout onLogout={handleLogout} />}>
            <Route index element={<WorkerDashboard />} />
          </Route>
        )}

        {userRole === 'subcontractor' && (
          <Route path="/subcontractor" element={<SubcontractorLayout onLogout={handleLogout} />}>
            <Route index element={<SubcontractorDashboard />} />
          </Route>
        )}

        {userRole === 'corporate' && (
          <Route path="/corporate" element={<CorporateLayout onLogout={handleLogout} />}>
            <Route index element={<Navigate to="sites" replace />} />
            <Route path="sites" element={<SiteList />} />
            <Route path="sites/:id" element={<SiteDetails />} />
            <Route path="materials" element={<Materials />} />
            <Route path="marketplace" element={<CorporateMarketplace />} />
            <Route path="community" element={<Community />} />
          </Route>
        )}

        {/* Redirects */}
        <Route path="/" element={<Navigate to={userRole ? `/${userRole}` : '/login'} replace />} />
        <Route path="*" element={<Navigate to={userRole ? `/${userRole}` : '/login'} replace />} />
      </Routes>
    </Router>
  );
}
