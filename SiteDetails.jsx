import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, Activity, Star, AlertCircle } from 'lucide-react';

export default function SiteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const siteName = id === '2' ? 'Tech Hub Phase 2' : id === '3' ? 'Metro Line Extension' : 'Oasis Residential Complex';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <button onClick={() => navigate('/corporate/sites')} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sites
      </button>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{siteName}</h1>
          <p className="text-slate-500 mt-1 flex items-center">
            Hudson Yards, NY • Status: <span className="text-green-600 font-semibold ml-1">Active</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Financials & Subcontractor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Current Subcontractor</h3>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center mr-3 text-lg">
                  A
                </div>
                <div>
                  <p className="font-bold text-xl text-slate-900">Apex Concrete</p>
                  <p className="text-sm text-amber-500 flex items-center font-medium"><Star className="w-3 h-3 fill-current mr-1" /> 4.9 Rating</p>
                </div>
              </div>
            </div>
            <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200">Message Sub</button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" /> Budget Overview
            </h3>
            <div className="flex justify-between mb-2">
              <span className="text-slate-500 font-medium">Spent: <span className="text-slate-900">$125,000</span></span>
              <span className="text-slate-500 font-medium">Allocated: <span className="text-slate-900">$200,000</span></span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden">
              <div className="bg-green-500 h-4 rounded-full" style={{ width: `62.5%` }}></div>
            </div>
            <p className="text-xs text-right text-slate-500">62.5% Utilized</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" /> Geofenced Attendance
            </h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-black text-slate-900">142</p>
                <p className="text-sm text-slate-500 mt-1">Workers checked-in on site today</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">+12% vs Yesterday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Churn Dashboard */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm bg-gradient-to-b from-white to-red-50/30">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-red-500" /> Worker Churn Prediction
            </h3>
            <div className="flex items-center justify-center py-6">
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200" />
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="351.85" strokeDashoffset={351.85 - (351.85 * 25) / 100} className="text-red-500" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900">25%</span>
                  <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">High Risk</span>
                </div>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">Top Churn Drivers:</p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Delayed Payments</p>
                    <p className="text-xs text-slate-500">Subcontractor average pay delay: 2.4 days</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Long Commutes</p>
                    <p className="text-xs text-slate-500">30% of crew travels &gt; 15 miles</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
