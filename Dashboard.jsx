import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign, Star, Calendar, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // State for dynamic data
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const jobsRes = await fetch('http://localhost:8000/api/jobs/');
      const jobsData = await jobsRes.json();
      setJobs(jobsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-20">
      <Toaster />
      <div className="bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-10 flex justify-between space-x-2">
        <button 
          onClick={() => setActiveTab('jobs')} 
          className={`flex-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${activeTab === 'jobs' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          Job Board
        </button>
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`flex-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
        >
          My Overview
        </button>
      </div>

      <div className="p-4 flex-1">
        {loading ? (
          <div className="text-center p-8 text-slate-500">Loading your profile...</div>
        ) : (
          <>
            {activeTab === 'jobs' && <JobBoard jobs={jobs} />}
            {activeTab === 'overview' && <WorkerOverview />}
          </>
        )}
      </div>
    </div>
  );
}

function JobBoard({ jobs }) {
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg text-slate-800 mb-2">Jobs Near You</h2>
      {jobs.length === 0 ? (
        <div className="text-center p-8 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100">
          No jobs have been posted by Subcontractors yet.
        </div>
      ) : jobs.map(job => (
        <div key={job.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-900">{job.title}</h3>
            <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded text-sm">${job.wage}/hr</span>
          </div>
          <p className="text-sm text-slate-600 mb-2 font-medium">Subcontractor ID: {job.posted_by_id}</p>
          <p className="text-xs text-slate-400 flex items-center mb-5">
            <MapPin className="w-3 h-3 mr-1"/> Site ID: {job.site_id}
          </p>
          <button onClick={() => toast.success('Application Sent!')} className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2.5 rounded-lg font-medium text-sm">
            Apply Now
          </button>
        </div>
      ))}
    </div>
  );
}

function WorkerOverview() {
  const [rating, setRating] = useState(0);
  
  return (
    <div className="space-y-6 mt-2">
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Your Active Site</h2>
        <p className="text-slate-500 text-sm flex items-center mb-6">
          <MapPin className="w-4 h-4 mr-1" /> Not currently assigned to a site.
        </p>
        
        <div className="space-y-4">
          {/* Attendance Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 opacity-60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600 flex items-center">
                <Calendar className="w-4 h-4 mr-2" /> Today's Attendance
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-slate-900 text-lg">Not on site</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Geofencing inactive</p>
          </div>

          {/* Payment Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 opacity-60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" /> Today's Wage
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-slate-900 text-2xl">$0.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-2">Rate Your Subcontractor</h3>
        <p className="text-sm text-slate-500 mb-4">You can rate your Subcontractor once you are assigned to a site.</p>
        <div className="flex justify-center space-x-3 py-2 opacity-50 pointer-events-none">
          {[1,2,3,4,5].map(star => (
            <Star 
              key={star} 
              className={`w-9 h-9 transition-colors text-slate-200`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
