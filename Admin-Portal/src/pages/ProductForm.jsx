import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import api from '../api';
import ImageUploadField from '../components/ImageUploadField';

const emptyVariant = () => ({
  key: crypto.randomUUID(),
  id: null,
  color: '',
  storage: '',
  price: '',
  image_url: '',
  available: 0,
});

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const [form, setForm] = useState({ name: '', category_id: '', description: '', image_url: '', price: '' });
  const [variants, setVariants] = useState([]);
  const [originalVariantIds, setOriginalVariantIds] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/admin/products/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.name || '',
          category_id: data.category_id || '',
          description: data.description || '',
          image_url: data.image_url || '',
          price: data.price ?? '',
        });
        const loadedVariants = (data.variants || []).map((v) => ({
          key: v.id,
          id: v.id,
          color: v.attributes?.color || '',
          storage: v.attributes?.storage || '',
          price: v.price ?? '',
          image_url: v.image_url || '',
          available: v.available ?? 0,
        }));
        setVariants(loadedVariants);
        setOriginalVariantIds(loadedVariants.map((v) => v.id));
      })
      .catch((err) => setError(err.response?.data?.error || 'Failed to load product'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const updateVariant = (key, field, value) => {
    setVariants((prev) => prev.map((v) => (v.key === key ? { ...v, [field]: value } : v)));
  };

  const addVariant = () => setVariants((prev) => [...prev, emptyVariant()]);
  const removeVariant = (key) => setVariants((prev) => prev.filter((v) => v.key !== key));

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    try {
      const { data } = await api.post('/admin/categories', { name: newCategoryName.trim() });
      setCategories((prev) => [...prev, data]);
      setField('category_id', data.id);
      setNewCategoryName('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create category');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.category_id || form.price === '') {
      setError('Name, category, and price are required.');
      return;
    }
    for (const v of variants) {
      if (v.price === '' || v.price === null) {
        setError('Every variant needs a price.');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category_id: form.category_id,
        description: form.description || null,
        image_url: form.image_url || null,
        price: parseFloat(form.price),
      };

      if (!isEdit) {
        await api.post('/admin/products', {
          ...payload,
          variants: variants.map(({ color, storage, price, image_url, available }) => ({
            color, storage, price: parseFloat(price), image_url: image_url || null, available: Number(available) || 0,
          })),
        });
      } else {
        await api.put(`/admin/products/${id}`, payload);

        const currentIds = variants.filter((v) => v.id).map((v) => v.id);
        const toDelete = originalVariantIds.filter((oid) => !currentIds.includes(oid));

        await Promise.all([
          ...variants.map((v) => {
            const body = { color: v.color, storage: v.storage, price: parseFloat(v.price), image_url: v.image_url || null, available: Number(v.available) || 0 };
            return v.id
              ? api.put(`/admin/variants/${v.id}`, body)
              : api.post(`/admin/products/${id}/variants`, body);
          }),
          ...toDelete.map((vid) => api.delete(`/admin/variants/${vid}`)),
        ]);
      }

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!window.confirm(`Delete "${form.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/products/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete product');
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-sm text-gray-400">Loading product...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-dark mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to products
      </Link>

      <h1 className="text-2xl font-bold text-brand-dark tracking-tight mb-8">
        {isEdit ? 'Edit Product' : 'Add Product'}
      </h1>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Product Details</h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="e.g. iPhone 17 Pro Max"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Category</label>
              <select
                required
                value={form.category_id}
                onChange={(e) => setField('category_id', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark transition-colors bg-white"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-dark transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={addingCategory || !newCategoryName.trim()}
                  className="text-xs font-bold text-brand-dark hover:underline disabled:opacity-40 disabled:no-underline shrink-0"
                >
                  + Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Base Price (Tshs)
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark transition-colors"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">Used as a fallback if the product has no variants.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Short product description"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-dark transition-colors resize-none"
            />
          </div>

          <ImageUploadField
            label="Product Image (fallback / default)"
            value={form.image_url}
            onChange={(url) => setField('image_url', url)}
          />
        </div>

        {/* Variants */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Variants</h2>
              <p className="text-xs text-gray-400 mt-1">Colors and storage options, each with their own price, image, and stock.</p>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark border border-gray-200 rounded-full px-4 py-2 hover:border-brand-dark transition-colors"
            >
              <Plus size={13} /> Add Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No variants yet — the base price above will be used.</p>
          ) : (
            <div className="space-y-4">
              {variants.map((v) => (
                <div key={v.key} className="border border-gray-100 rounded-xl p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Color</label>
                      <input
                        type="text"
                        value={v.color}
                        onChange={(e) => updateVariant(v.key, 'color', e.target.value)}
                        placeholder="e.g. Black"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-dark transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Storage</label>
                      <input
                        type="text"
                        value={v.storage}
                        onChange={(e) => updateVariant(v.key, 'storage', e.target.value)}
                        placeholder="e.g. 256GB"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-dark transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Price (Tshs)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={v.price}
                        onChange={(e) => updateVariant(v.key, 'price', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-dark transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Stock</label>
                      <input
                        type="number"
                        min="0"
                        value={v.available}
                        onChange={(e) => updateVariant(v.key, 'available', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-dark transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <ImageUploadField
                        label="Variant Image"
                        value={v.image_url}
                        onChange={(url) => updateVariant(v.key, 'image_url', url)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(v.key)}
                      className="p-2.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          {isEdit ? (
            <button
              type="button"
              onClick={handleDeleteProduct}
              className="text-sm font-semibold text-red-500 hover:underline"
            >
              Delete this product
            </button>
          ) : <span />}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-brand-dark text-white text-sm font-bold px-8 py-3 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
