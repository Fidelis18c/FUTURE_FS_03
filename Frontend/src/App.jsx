import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import SupportCenter from './pages/SupportCenter';
import ShippingPolicy from './pages/ShippingPolicy';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
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
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/support" element={<SupportCenter />} />
                <Route path="/shipping" element={<ShippingPolicy />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

