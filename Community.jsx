import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/community/');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/community/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      if (res.ok) {
        toast.success("Discussion posted!");
        setTitle('');
        setContent('');
        setShowForm(false);
        fetchPosts();
      } else {
        toast.error("Failed to post discussion.");
      }
    } catch (err) {
      toast.error("Error connecting to server.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <Toaster />
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Community Forum</h1>
          <p className="text-slate-500 mt-1">Share updates, ask questions, and collaborate with other companies.</p>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" /> Corporate Discussions
          </h2>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          {showForm ? 'Cancel' : 'New Discussion'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handlePost} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discussion Title</label>
              <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Best practices for downtown concrete pours?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message Content</label>
              <textarea required value={content} onChange={e => setContent(e.target.value)} className="w-full border border-slate-300 rounded-md py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500" rows="4" placeholder="Share your thoughts..." />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Post Discussion
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center p-12 text-slate-500">Loading discussions...</div>
        ) : posts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-slate-100 text-slate-500">
            No discussions yet. Be the first to start one!
          </div>
        ) : posts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg text-slate-900 mb-2">{post.title}</h3>
            <p className="text-slate-600 text-sm mb-4 whitespace-pre-wrap">{post.content}</p>
            <div className="flex items-center text-xs text-slate-400">
              <span className="font-medium text-slate-600 mr-2">{post.author_name}</span>
              <span>•</span>
              <span className="ml-2">{new Date(post.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
