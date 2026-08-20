import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'https://future-fs-03-vert.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hs_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // The UI renders `err.response.data.error` directly in JSX, so it must
    // always be a string — unwrap `{ error: { message } }` shaped bodies
    // (e.g. from the backend's generic error handler) to avoid crashing React.
    const data = err.response?.data;
    if (data && typeof data.error === 'object' && data.error !== null) {
      data.error = data.error.message || 'Something went wrong. Please try again.';
    }
    if (err.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('hs_admin_token');
      localStorage.removeItem('hs_admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Resolves an image path/URL for display. Older catalog items store a
// site-relative path (e.g. "/products/foo.webp") meant to be served by the
// storefront, not this portal — point those at the live storefront so
// previews still render. Freshly-uploaded images are already full
// Supabase Storage URLs and pass through unchanged.
const STOREFRONT_URL = 'https://hsstore.co.tz';
export const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${STOREFRONT_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default api;
