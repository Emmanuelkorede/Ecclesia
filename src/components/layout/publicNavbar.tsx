import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Menu, X } from 'lucide-react';
import { Logo } from '../ui/Logo';

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)]/90 backdrop-blur border-b border-[var(--border)] transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
        <Link to="/" className="flex items-center">
          <Logo className="h-7 w-auto text-[var(--text-h)]" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-h)]">
          <button onClick={() => scrollTo('features')} className="hover:text-brand-600 transition-colors cursor-pointer">Features</button>
          <Link to="/pricing" className="hover:text-brand-600 transition-colors">Pricing</Link>
          <Link to="/pricing#faq" className="hover:text-brand-600 transition-colors">FAQ</Link>
          <Link to="/contact" className="hover:text-brand-600 transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/auth')}
            className="text-sm font-medium text-[var(--text-h)] px-4 py-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="text-sm font-medium bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-xl px-4 py-2 shadow-sm transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>

        <button className="md:hidden text-[var(--text-h)] cursor-pointer" onClick={() => setOpen(!open)} aria-label="Toggle Menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-5 pt-2 flex flex-col gap-3 text-sm font-medium text-[var(--text-h)] bg-[var(--surface)] border-b border-[var(--border)]">
          <button onClick={() => scrollTo('features')} className="text-left py-1.5">Features</button>
          <Link to="/pricing" onClick={() => setOpen(false)} className="py-1.5">Pricing</Link>
          <Link to="/pricing#faq" onClick={() => setOpen(false)} className="py-1.5">FAQ</Link>
          <Link to="/contact" onClick={() => setOpen(false)} className="py-1.5">Contact</Link>
          <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)]">
            <button
              onClick={() => navigate('/auth')}
              className="w-full text-center py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-h)]"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="w-full bg-brand-600 text-white rounded-xl py-2.5 shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}