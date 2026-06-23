import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const quickLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Support Center', path: '/support' },
  { label: 'Shipping Policy', path: '/shipping' },
];

const categories = [
  { label: 'Phones', path: '/phones' },
  { label: 'Audio & Pods', path: '/audio' },
  { label: 'Tablets', path: '/tablets' },
  { label: 'Cases & Covers', path: '/covers' },
  { label: 'Accessories', path: '/accessories' },
];

const AccordionSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 lg:border-none">
      {/* Mobile toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 lg:py-0 lg:pointer-events-none"
      >
        <h4 className="text-sm font-bold uppercase tracking-widest text-brand-dark">{title}</h4>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="lg:hidden"
        >
          <FiChevronDown size={16} className="text-gray-400" />
        </motion.span>
      </button>

      {/* Desktop: always visible · Mobile: collapsible */}
      <div className="hidden lg:block lg:mt-6">{children}</div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden lg:hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-14 pb-10 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">

        {/* Top grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 lg:gap-8">

          {/* Brand — always fully visible */}
          <div className="space-y-5 pb-8 lg:pb-0 border-b border-gray-100 lg:border-none mb-2 lg:mb-0">
            <Link to="/" className="flex items-center justify-center lg:justify-start">
              <img src="/HSSTORELOGO.png" alt="HS STORE" className="h-20 md:h-24 object-contain" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed text-center lg:text-left max-w-xs mx-auto lg:mx-0">
              Premium devices and accessories for the smart generation. Quality you can trust, service you'll love.
            </p>
            <div className="flex space-x-3 justify-center lg:justify-start">
              {[FiFacebook, FiInstagram, FiTwitter, FiYoutube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-brand-dark hover:text-white transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links — accordion on mobile */}
          <AccordionSection title="Quick Links">
            <ul className="space-y-0 lg:space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="flex items-center py-3 lg:py-0 text-sm text-gray-500 hover:text-brand-orange active:text-brand-orange transition-colors border-b border-gray-50 lg:border-none last:border-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionSection>

          {/* Categories — accordion on mobile */}
          <AccordionSection title="Categories">
            <ul className="space-y-0 lg:space-y-4">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    to={cat.path}
                    className="flex items-center py-3 lg:py-0 text-sm text-gray-500 hover:text-brand-orange active:text-brand-orange transition-colors border-b border-gray-50 lg:border-none last:border-none"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionSection>

          {/* Contact — accordion on mobile */}
          <AccordionSection title="Contact Us">
            <ul className="space-y-0 lg:space-y-4">
              {[
                { label: 'Email', value: 'support@hsstore.com' },
                { label: 'Phone', value: '+255 700 000 000' },
                { label: 'Address', value: 'P.O. Box 1234, Dar es Salaam, Tanzania' },
              ].map((item) => (
                <li key={item.label} className="py-3 lg:py-0 border-b border-gray-50 lg:border-none last:border-none">
                  <span className="block text-xs font-bold text-brand-dark mb-0.5">{item.label}:</span>
                  <span className="text-sm text-gray-500">{item.value}</span>
                </li>
              ))}
            </ul>
          </AccordionSection>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            © {new Date().getFullYear()} HS STORE. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="#" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
