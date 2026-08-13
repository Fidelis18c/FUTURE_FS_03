import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import api from '../api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    setCreating(true);
    try {
      const { data } = await api.post('/admin/categories', { name: name.trim() });
      setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-dark dark:text-zinc-100 tracking-tight mb-1">Categories</h1>
      <p className="text-sm text-gray-500 dark:text-zinc-400 mb-8">Products are organized under these when you create or edit them.</p>

      <form onSubmit={handleCreate} className="flex items-center gap-3 mb-8">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark dark:focus:border-brand-orange transition-colors bg-white dark:bg-zinc-800 dark:text-zinc-100"
        />
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="inline-flex items-center gap-2 bg-brand-orange text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-orange-700 transition-colors disabled:opacity-50 shrink-0"
        >
          {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          Add
        </button>
      </form>

      {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-sm text-red-600 dark:text-red-400">{error}</div>}

      <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-sm text-gray-400 dark:text-zinc-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-16 text-center text-sm text-gray-400 dark:text-zinc-500">No categories yet.</div>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-zinc-700/60 last:border-0">
              <span className="font-semibold text-brand-dark dark:text-zinc-100">{c.name}</span>
              <span className="text-xs text-gray-400 dark:text-zinc-500 font-mono">{c.slug}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Categories;
