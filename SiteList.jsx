import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, TrendingUp, AlertTriangle, Users, ChevronRight, Trash2 } from 'lucide-react';

export default function SiteList() {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');

  const fetchSites = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/sites/');
      const data = await res.json();
      setSites(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const totalBudget = sites.reduce((sum, site) => sum + site.budget_allocated, 0);

  const handleCreateSite = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/sites/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          budget_allocated: parseFloat(budget),
          status: 'Active'
        })
      });
      if (res.ok) {
        setName('');
        setLocation('');
        setBudget('');
        setShowForm(false);
        fetchSites();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSite = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this site?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/sites/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchSites();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Site Management</h1>
          <p className="text-slate-500 mt-1">Overview of all active construction sites.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          {showForm ? 'Cancel' : '+ New Site'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <KpiCard title="Active Sites" value={loading ? '...' : sites.length} icon={<Building2 className="text-blue-500" />} trend="Current Total" />
        <KpiCard title="Total Budget" value={loading ? '...' : `$${totalBudget.toLocaleString()}`} icon={<TrendingUp className="text-green-500" />} trend="Allocated" />
        <KpiCard title="Active Subs" value="0" icon={<Users className="text-purple-500" />} trend="Awaiting assignment" />
        <KpiCard title="Safety Alerts" value="0" icon={<AlertTriangle className="text-amber-500" />} trend="All clear" />
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Create New Site</h3>
          <form onSubmit={handleCreateSite} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Site Name</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-md py-2 px-3 text-sm" placeholder="e.g. Downtown Tower" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
              <input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full border rounded-md py-2 px-3 text-sm" placeholder="City, State" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Total Budget ($)</label>
              <input required type="number" value={budget} onChange={e => setBudget(e.target.value)} className="w-full border rounded-md py-2 px-3 text-sm" placeholder="500000" />
            </div>
            <div>
              <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-md font-medium hover:bg-slate-800">Save Site</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center p-8 text-slate-500">Loading sites...</div>
        ) : sites.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-500">
            No active sites. Click "+ New Site" to create your first project!
          </div>
        ) : (
          sites.map(site => (
            <div 
              key={site.id} 
              onClick={() => navigate(`/corporate/sites/${site.id}`)}
              className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-2">{site.name}</h3>
                <div className="flex space-x-6 text-sm text-slate-600">
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1 text-slate-400" /> {site.location}</span>
                  <span className="flex items-center"><TrendingUp className="w-4 h-4 mr-1 text-slate-400" /> Budget: ${site.budget_allocated.toLocaleString()}</span>
                  <span className={`font-semibold text-blue-600`}>{site.status}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={(e) => handleDeleteSite(e, site.id)}
                  className="bg-slate-50 p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-slate-400 hover:text-red-600" />
                </button>
                <div className="bg-slate-50 p-2 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-500 font-medium text-sm">{title}</h3>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
      <p className="text-sm text-slate-400">{trend}</p>
    </div>
  );
}
