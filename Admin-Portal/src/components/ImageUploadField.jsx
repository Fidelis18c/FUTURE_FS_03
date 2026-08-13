import { useRef, useState } from 'react';
import { Upload, Loader2, ImageOff } from 'lucide-react';
import api, { resolveImageUrl } from '../api';

// value/onChange are the raw image_url string stored on the product/variant.
const ImageUploadField = ({ value, onChange, label = 'Image' }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [broken, setBroken] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(data.url);
      setBroken(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const resolved = resolveImageUrl(value);

  return (
    <div>
      {label && <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">{label}</label>}
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-xl border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden shrink-0">
          {resolved && !broken ? (
            <img src={resolved} alt="" className="w-full h-full object-contain" onError={() => setBroken(true)} />
          ) : (
            <ImageOff size={20} className="text-gray-300 dark:text-zinc-600" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-gray-200 dark:border-zinc-600 dark:text-zinc-300 hover:border-brand-dark dark:hover:border-brand-orange transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => { onChange(e.target.value); setBroken(false); }}
            placeholder="Or paste an image URL"
            className="w-full border border-gray-200 dark:border-zinc-600 dark:bg-zinc-900 rounded-lg px-3 py-1.5 text-xs text-gray-500 dark:text-zinc-400 focus:outline-none focus:border-brand-dark dark:focus:border-brand-orange transition-colors"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadField;
