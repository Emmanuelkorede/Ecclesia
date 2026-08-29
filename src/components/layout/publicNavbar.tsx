import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../ui/Logo';

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated to check both pathname and hash so Pricing and FAQ highlight separately
  const isActive = (path: string, hash: string = '') => {
    return location.pathname === path && location.hash === hash;
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-4 px-4 sm:px-6 pointer-events-none">
      <div 
        className={`pointer-events-auto max-w-6xl mx-auto rounded-full transition-all duration-300 ${
          scrolled 
            ? 'bg-[#0B0A10]/85 border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl' 
            : 'bg-[#12111A]/60 border border-white/[0.08] backdrop-blur-xl shadow-lg shadow-black/20'
        } px-4 sm:px-6 py-2.5 flex items-center justify-between`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity pl-1">
          <Logo className="h-10 w-auto text-violet-500" />
        </Link>

        {/* Floating Centered Pill Navigation */}
        <nav className="hidden md:flex items-center bg-white/[0.04] border border-white/[0.06] p-1 rounded-full">
          <Link
            to="/"
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              isActive('/')
                ? 'bg-white text-[#0B0A10] shadow-md font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            to="/pricing"
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              isActive('/pricing')
                ? 'bg-white text-[#0B0A10] shadow-md font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Pricing
          </Link>
          <Link
            to="/pricing#faq"
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              isActive('/pricing', '#faq')
                ? 'bg-white text-[#0B0A10] shadow-md font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            FAQ
          </Link>
          <Link
            to="/contact"
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              isActive('/contact')
                ? 'bg-white text-[#0B0A10] shadow-md font-bold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="text-xs font-semibold text-white/80 hover:text-white transition-colors cursor-pointer px-2"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="relative group bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-full px-5 py-2.5 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-violet-500/25 cursor-pointer"
          >
            Get started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-white/70 hover:text-white rounded-full transition-colors cursor-pointer" 
          onClick={() => setOpen(!open)} 
          aria-label="Toggle Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="pointer-events-auto max-w-6xl mx-auto mt-3 rounded-3xl bg-[#0B0A10]/95 backdrop-blur-2xl border border-white/[0.12] p-6 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col space-y-4 text-sm font-medium">
              <Link 
                to="/" 
                onClick={() => setOpen(false)} 
                className={`py-1 transition-colors ${isActive('/') ? 'text-white font-bold' : 'text-white/80 hover:text-white'}`}
              >
                Home
              </Link>
              <Link 
                to="/pricing" 
                onClick={() => setOpen(false)} 
                className={`py-1 transition-colors ${isActive('/pricing') ? 'text-white font-bold' : 'text-white/80 hover:text-white'}`}
              >
                Pricing
              </Link>
              <Link 
                to="/pricing#faq" 
                onClick={() => setOpen(false)} 
                className={`py-1 transition-colors ${isActive('/pricing', '#faq') ? 'text-white font-bold' : 'text-white/80 hover:text-white'}`}
              >
                FAQ
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setOpen(false)} 
                className={`py-1 transition-colors ${isActive('/contact') ? 'text-white font-bold' : 'text-white/80 hover:text-white'}`}
              >
                Contact
              </Link>
              
              <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  onClick={() => { setOpen(false); navigate('/auth'); }}
                  className="w-full text-center py-2.5 rounded-full border border-white/[0.12] bg-white/[0.03] text-white font-medium hover:bg-white/[0.08] transition-colors cursor-pointer text-xs"
                >
                  Sign in
                </button>
                <button
                  onClick={() => { setOpen(false); navigate('/auth'); }}
                  className="w-full text-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-full py-2.5 text-xs font-semibold shadow-lg shadow-violet-500/25 transition-all cursor-pointer"
                >
                  Get started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}