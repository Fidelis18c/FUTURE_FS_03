import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Tags, Layers, Boxes, AlertTriangle, PackageX, Plus, ImageOff } from 'lucide-react';
import api, { resolveImageUrl } from '../api';

const StatCard = ({ icon: Icon, label, value, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="bg-white border border-gray-100 rounded-2xl p-6"
  >
    <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-4">
      <Icon size={18} className="text-brand-orange" />
    </div>
    <p className="text-2xl font-bold text-brand-dark">{value}</p>
    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
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
    return <div className="p-16 text-center text-sm text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your store's catalog</p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center gap-2 bg-brand-orange text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-orange-700 transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Package} label="Total Products" value={products.length} delay={0} />
        <StatCard icon={Tags} label="Categories" value={categories.length} delay={0.05} />
        <StatCard icon={Layers} label="Variants (colors/sizes)" value={stats.totalVariants} delay={0.1} />
        <StatCard icon={Boxes} label="Units in Stock" value={stats.totalStock.toLocaleString()} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products by category */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-5">Products by Category</h2>
          {Object.keys(stats.byCategory).length === 0 ? (
            <p className="text-sm text-gray-400">No products yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([name, count]) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-32 truncate">{name}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-orange rounded-full"
                      style={{ width: `${(count / products.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-brand-dark w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock alerts */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-5">Stock Alerts</h2>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <PackageX size={16} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-dark">{stats.outOfStock.length} variant{stats.outOfStock.length !== 1 ? 's' : ''} out of stock</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-dark">{stats.lowStock.length} variant{stats.lowStock.length !== 1 ? 's' : ''} low on stock (≤5 units)</p>
            </div>
          </div>

          {stats.lowStock.length > 0 || stats.outOfStock.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {[...stats.outOfStock, ...stats.lowStock].slice(0, 8).map((v) => (
                <Link
                  key={v.id}
                  to={`/products/${v.productId}/edit`}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                >
                  <span className="text-gray-600 truncate">{v.productName} — {v.attributes?.color || v.name}</span>
                  <span className={`font-bold shrink-0 ml-2 ${v.available === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                    {v.available} left
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">All variants are well stocked.</p>
          )}
        </div>
      </div>

      {stats.noImage.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-5 flex items-center gap-2">
            <ImageOff size={14} /> Products missing an image ({stats.noImage.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.noImage.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}/edit`}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
