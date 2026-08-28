import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [siteId, setSiteId] = useState('');

  const fetchData = async () => {
    try {
      const [matRes, siteRes] = await Promise.all([
        fetch('http://localhost:8000/api/materials/'),
        fetch('http://localhost:8000/api/sites/')
      ]);
      const matData = await matRes.json();
      const siteData = await siteRes.json();
      setMaterials(matData);
      setSites(siteData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/materials/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: itemName,
          quantity: quantity,
          status: 'Ordered',
          site_id: parseInt(siteId)
        })
      });
      if (res.ok) {
        setItemName('');
        setQuantity('');
        setSiteId('');
        setShowForm(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Ordered': return <Package className="w-4 h-4 mr-1 text-blue-500" />;
      case 'On the Way': return <Truck className="w-4 h-4 mr-1 text-amber-500" />;
      case 'Delivered': return <CheckCircle className="w-4 h-4 mr-1 text-green-500" />;
      default: return null;
    }
  };

  const getSiteName = (id) => {
    const site = sites.find(s => s.id === id);
    return site ? site.name : `Site #${id}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Materials & Logistics</h1>
          <p className="text-slate-500 mt-1">Track orders and material utilization across all sites.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          {showForm ? 'Cancel' : '+ Order Materials'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Order New Material</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Select Site</label>
              <select required value={siteId} onChange={e => setSiteId(e.target.value)} className="w-full border rounded-md py-2 px-3 text-sm">
                <option value="">-- Choose Site --</option>
                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Item Name</label>
              <input required type="text" value={itemName} onChange={e => setItemName(e.target.value)} className="w-full border rounded-md py-2 px-3 text-sm" placeholder="e.g. Steel Rebar" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Quantity</label>
              <input required type="text" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full border rounded-md py-2 px-3 text-sm" placeholder="e.g. 500 lbs" />
            </div>
            <div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700">Submit Order</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm">
              <th className="p-4 font-medium border-b border-slate-200">Destination Site</th>
              <th className="p-4 font-medium border-b border-slate-200">Material Item</th>
              <th className="p-4 font-medium border-b border-slate-200">Quantity</th>
              <th className="p-4 font-medium border-b border-slate-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-4 text-center text-slate-500">Loading materials...</td></tr>
            ) : materials.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-slate-500">No materials ordered yet.</td></tr>
            ) : materials.map((mat) => (
              <tr key={mat.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="p-4 font-semibold text-slate-900">{getSiteName(mat.site_id)}</td>
                <td className="p-4 text-slate-600">{mat.item_name}</td>
                <td className="p-4 text-slate-600 font-medium">{mat.quantity}</td>
                <td className="p-4">
                  <div className="flex items-center text-sm font-bold">
                    {getStatusIcon(mat.status)}
                    <span className={
                      mat.status === 'Delivered' ? 'text-green-700' : 
                      mat.status === 'On the Way' ? 'text-amber-700' : 'text-blue-700'
                    }>{mat.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
