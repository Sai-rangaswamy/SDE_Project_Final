import React, { useState, useEffect } from 'react';
import { Star, Search, Filter } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function CorporateMarketplace() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/auth/users/subcontractor');
        const data = await res.json();
        // Mocking some extra data since our users table only has basic fields
        const dynamicSubs = data.map(u => ({
          ...u,
          rating: (Math.random() * (5 - 4) + 4).toFixed(1), // Random between 4.0 and 5.0
          jobs: Math.floor(Math.random() * 150) + 10,
          specialty: 'General Contractor',
          status: 'Available'
        }));
        setSubs(dynamicSubs);
      } catch (err) {
        console.error("Failed to fetch subcontractors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Toaster />
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Subcontractor Marketplace</h1>
          <p className="text-slate-500 mt-1">Hire top-rated subs or rate your previous partners.</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" placeholder="Search specialties..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="bg-white border border-slate-200 p-2 rounded-lg hover:bg-slate-50 text-slate-600">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center text-slate-500 p-8">Loading real subcontractors...</div>
        ) : subs.length === 0 ? (
          <div className="col-span-3 text-center text-slate-500 p-8">No subcontractors have signed up yet.</div>
        ) : subs.map((sub) => (
          <SubcontractorCard key={sub.id} sub={sub} />
        ))}
      </div>
    </div>
  );
}

function SubcontractorCard({ sub }) {
  const [userRating, setUserRating] = useState(0);
  const [isRatingMode, setIsRatingMode] = useState(false);

  const handleHire = () => {
    toast.success(`Invitation sent to ${sub.name}!`);
  };

  const submitRating = (star) => {
    setUserRating(star);
    setIsRatingMode(false);
    toast.success(`Rated ${sub.name} ${star} Stars!`);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center mr-4 text-xl">
            {sub.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{sub.name}</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{sub.specialty}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 mb-6 mt-auto">
        <div className="flex items-center text-amber-500">
          <Star className="w-5 h-5 fill-current mr-1" />
          <span className="font-bold">{sub.rating}</span>
          <span className="text-slate-400 text-sm ml-1">({sub.jobs})</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${sub.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          {sub.status}
        </span>
      </div>

      {isRatingMode ? (
        <div className="flex flex-col space-y-2">
          <p className="text-xs text-slate-500 font-medium">Select a rating:</p>
          <div className="flex space-x-2">
            {[1,2,3,4,5].map(star => (
              <Star 
                key={star} 
                className={`w-8 h-8 cursor-pointer transition-colors ${userRating >= star ? 'text-amber-500 fill-current' : 'text-slate-200 hover:text-slate-300'}`}
                onClick={() => submitRating(star)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex space-x-2">
          <button 
            onClick={handleHire}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Hire
          </button>
          <button 
            onClick={() => setIsRatingMode(true)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Rate Sub
          </button>
        </div>
      )}
    </div>
  );
}
