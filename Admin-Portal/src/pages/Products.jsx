import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, ImageOff } from 'lucide-react';
import api, { resolveImageUrl } from '../api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/products');
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.category_name?.toLowerCase().includes(q));
  }, [products, query]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name.trim()}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    try {
      await api.delete(`/admin/products/${product.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} product{products.length !== 1 ? 's' : ''} in the catalog</p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center gap-2 bg-brand-orange text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-orange-700 transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark transition-colors bg-white"
        />
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-sm text-gray-400">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-sm text-gray-400">No products found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Variants</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const img = resolveImageUrl(p.image_url);
                return (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                          {img ? (
                            <img src={img} alt="" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                          ) : (
                            <ImageOff size={14} className="text-gray-300" />
                          )}
                        </div>
                        <span className="font-semibold text-brand-dark">{p.name.trim()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{p.category_name || '—'}</td>
                    <td className="px-6 py-4 font-medium text-brand-dark">Tshs {Number(p.price || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500">{(p.variants || []).length}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/${p.id}/edit`}
                          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-dark transition-colors"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={deletingId === p.id}
                          className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Products;
