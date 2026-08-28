import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, HardHat, Hammer } from 'lucide-react';

export default function Signup({ onLogin }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('worker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Run migration script to add phone column to database
    fetch('http://localhost:8000/api/auth/migrate').catch(console.error);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const payload = {
      name,
      password,
      role: selectedRole
    };

    if (selectedRole === 'worker') {
      payload.phone = phone;
    } else {
      payload.email = email;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Signup failed');
      }

      // Auto-login after signup is too complex for now, just navigate to login
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Create an Account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          {error && <div className="mb-4 text-red-600 text-sm font-medium text-center">{error}</div>}
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">I want to join as a:</label>
              <div className="grid grid-cols-3 gap-3">
                <RoleOption 
                  icon={<Building2 className="w-6 h-6 mb-1" />} label="Corporate" value="corporate" 
                  selected={selectedRole === 'corporate'} onClick={() => setSelectedRole('corporate')} 
                />
                <RoleOption 
                  icon={<Hammer className="w-6 h-6 mb-1" />} label="Subcontractor" value="subcontractor" 
                  selected={selectedRole === 'subcontractor'} onClick={() => setSelectedRole('subcontractor')} 
                />
                <RoleOption 
                  icon={<HardHat className="w-6 h-6 mb-1" />} label="Worker" value="worker" 
                  selected={selectedRole === 'worker'} onClick={() => setSelectedRole('worker')} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" />
            </div>
            
            {selectedRole === 'worker' ? (
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="(555) 555-5555" />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="you@company.com" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50"
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="font-medium text-blue-600 hover:text-blue-500">
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleOption({ icon, label, selected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
        selected ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-200 hover:border-slate-300 text-slate-500 hover:bg-slate-50'
      }`}
    >
      {icon}
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
}
