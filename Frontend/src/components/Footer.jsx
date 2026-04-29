import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-brand-dark">
            HS STORE
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Premium devices and accessories for the smart generation. Quality you can trust, service you'll love.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-brand-dark hover:text-white transition-all">
              <FiFacebook />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-brand-dark hover:text-white transition-all">
              <FiInstagram />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-brand-dark hover:text-white transition-all">
              <FiTwitter />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-brand-dark hover:text-white transition-all">
              <FiYoutube />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-brand-dark mb-6">Quick Links</h4>
          <ul className="space-y-4">
            {['About Us', 'Contact Us', 'Support Center', 'Shipping Policy', 'Returns & Refunds'].map((link) => (
              <li key={link}>
                <Link to="#" className="text-sm text-gray-500 hover:text-brand-dark transition-colors">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-brand-dark mb-6">Categories</h4>
          <ul className="space-y-4">
            {['Phones', 'Audio & Pods', 'Chargers', 'Cases & Covers', 'Accessories'].map((link) => (
              <li key={link}>
                <Link to={`/${link.toLowerCase().split(' ')[0]}`} className="text-sm text-gray-500 hover:text-brand-dark transition-colors">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-brand-dark mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="text-sm text-gray-500">
              <span className="block font-bold text-brand-dark mb-1">Email:</span>
              support@hsstore.com
            </li>
            <li className="text-sm text-gray-500">
              <span className="block font-bold text-brand-dark mb-1">Phone:</span>
              +255 700 000 000
            </li>
            <li className="text-sm text-gray-500">
              <span className="block font-bold text-brand-dark mb-1">Address:</span>
              P.O. Box 1234, Dar es Salaam, Tanzania
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-100 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} HS STORE. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="#" className="text-xs text-gray-400 hover:text-brand-dark">Privacy Policy</Link>
          <Link to="#" className="text-xs text-gray-400 hover:text-brand-dark">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
