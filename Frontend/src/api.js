import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'https://future-fs-03-vert.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// The UI renders `err.response.data.error` directly in JSX, so it must always
// be a string — unwrap `{ error: { message } }` shaped bodies (e.g. from the
// backend's generic error handler) to avoid crashing React.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data;
    if (data && typeof data.error === 'object' && data.error !== null) {
      data.error = data.error.message || 'Something went wrong. Please try again.';
    }
    return Promise.reject(err);
  }
);

export default api;
