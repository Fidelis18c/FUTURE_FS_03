import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <CartDrawer />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/phones" element={<CategoryPage />} />
              <Route path="/phones/:category" element={<CategoryPage />} />
              <Route path="/audio" element={<CategoryPage />} />
              <Route path="/audio/:category" element={<CategoryPage />} />
              <Route path="/chargers" element={<CategoryPage />} />
              <Route path="/chargers/:category" element={<CategoryPage />} />
              <Route path="/covers" element={<CategoryPage />} />
              <Route path="/covers/:category" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              {/* Fallback for other routes */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
