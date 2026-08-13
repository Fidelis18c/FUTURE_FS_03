import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

const StatCard = ({ label, value, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl p-6"
  >
    <p className="text-2xl font-bold text-brand-dark dark:text-zinc-100">{value}</p>
    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">{label}</p>
  </motion.div>
);

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/admin/products'), api.get('/categories')])
      .then(([p, c]) => {
        setProducts(p.data);
        setCategories(c.data);
      })
      .catch((err) => setError(err.response?.data?.error || 'Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const allVariants = products.flatMap((p) => (p.variants || []).map((v) => ({ ...v, productName: p.name.trim(), productId: p.id })));
    const totalStock = allVariants.reduce((sum, v) => sum + (v.available || 0), 0);
    const outOfStock = allVariants.filter((v) => (v.available || 0) === 0);
    const lowStock = allVariants.filter((v) => (v.available || 0) > 0 && v.available <= 5);

    const byCategory = {};
    for (const p of products) {
      const name = p.category_name || 'Uncategorized';
      byCategory[name] = (byCategory[name] || 0) + 1;
    }

    const noImage = products.filter((p) => !p.image_url);

    return { totalVariants: allVariants.length, totalStock, outOfStock, lowStock, byCategory, noImage };
  }, [products]);

  if (loading) {
    return <div className="p-16 text-center text-sm text-gray-400 dark:text-zinc-500">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark dark:text-zinc-100 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Overview of your store's catalog</p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center gap-2 bg-brand-orange text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-orange-700 transition-colors"
        >
          Add Product
        </Link>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-sm text-red-600 dark:text-red-400">{error}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Products" value={products.length} delay={0} />
        <StatCard label="Categories" value={categories.length} delay={0.05} />
        <StatCard label="Variants (colors/sizes)" value={stats.totalVariants} delay={0.1} />
        <StatCard label="Units in Stock" value={stats.totalStock.toLocaleString()} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products by category */}
        <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-5">Products by Category</h2>
          {Object.keys(stats.byCategory).length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-zinc-500">No products yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([name, count]) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-zinc-300 w-32 truncate">{name}</span>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-orange rounded-full"
                      style={{ width: `${(count / products.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-brand-dark dark:text-zinc-100 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock alerts */}
        <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-5">Stock Alerts</h2>

          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-brand-dark dark:text-zinc-100">Out of stock</p>
            <span className="text-sm font-bold text-red-500">{stats.outOfStock.length}</span>
          </div>

          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-brand-dark dark:text-zinc-100">Low stock (≤5 units)</p>
            <span className="text-sm font-bold text-amber-500">{stats.lowStock.length}</span>
          </div>

          {stats.lowStock.length > 0 || stats.outOfStock.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 border-t border-gray-100 dark:border-zinc-700 pt-4">
              {[...stats.outOfStock, ...stats.lowStock].slice(0, 8).map((v) => (
                <Link
                  key={v.id}
                  to={`/products/${v.productId}/edit`}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700/60 transition-colors text-xs"
                >
                  <span className="text-gray-600 dark:text-zinc-400 truncate">{v.productName} — {v.attributes?.color || v.name}</span>
                  <span className={`font-bold shrink-0 ml-2 ${v.available === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                    {v.available} left
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-zinc-500">All variants are well stocked.</p>
          )}
        </div>
      </div>

      {stats.noImage.length > 0 && (
        <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl p-6 mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-5">
            Products missing an image ({stats.noImage.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.noImage.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}/edit`}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
              >
                {p.name.trim()}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
