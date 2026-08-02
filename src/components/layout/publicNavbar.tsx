import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Menu, X } from 'lucide-react';

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-surface)]/90 backdrop-blur border-b border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
        <Link to="/" className="text-lg font-bold text-[var(--text-main)]">
          ChMS
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-main)]">
          <button onClick={() => scrollTo('features')} className="hover:text-brand-600">Features</button>
          <Link to="/pricing" className="hover:text-brand-600">Pricing</Link>
          <Link to="/pricing#faq" className="hover:text-brand-600">FAQ</Link>
          <Link to="/contact" className="hover:text-brand-600">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/auth')}
            className="text-sm font-medium text-[var(--text-main)] px-4 py-2"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-4 py-2"
          >
            Get Started
          </button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm font-medium text-[var(--text-main)]">
          <button onClick={() => scrollTo('features')} className="text-left">Features</button>
          <Link to="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
          <Link to="/pricing#faq" onClick={() => setOpen(false)}>FAQ</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <button
            onClick={() => navigate('/auth')}
            className="bg-brand-600 text-white rounded-lg px-4 py-2 mt-2"
          >
            Get Started
          </button>
        </div>
      )}
    </header>
  );
}