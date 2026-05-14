import { Link, useLocation } from 'react-router-dom';
import { Cloud, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const navLinks = [
    { to: '/wizard', label: t('nav.cloudWizard') },
    { to: '/compare', label: t('nav.compare'), match: (p) => p === '/compare' || p.startsWith('/providers') },
    { to: '/pricing', label: t('nav.pricing') },
    { to: '/glossary', label: t('nav.glossary') },
  ];

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hy' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-sm shadow-primary-500/25">
              <Cloud className="w-4 h-4 text-white" />
            </div>
            <span className="text-[1.1rem] font-extrabold tracking-tight leading-none select-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Cloud</span>
              <span className="text-slate-900 dark:text-white">Advisor</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.match ? link.match(location.pathname) : location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Language switcher */}
            <button
              onClick={toggleLang}
              className="hidden md:inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors select-none"
              aria-label={t('common.switchLanguage')}
            >
              {i18n.language === 'en' ? t('nav.langHy') : t('nav.langEn')}
            </button>
            <Link
              to="/wizard"
              className="hidden md:inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {t('nav.startFree')}
            </Link>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={t('common.toggleMenu')}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = link.match ? link.match(location.pathname) : location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex gap-2 pt-1">
            <button
              onClick={toggleLang}
              className="flex-1 text-center px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {i18n.language === 'en' ? t('nav.langHy') : t('nav.langEn')}
            </button>
            <Link
              to="/wizard"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center px-4 py-2.5 bg-primary-500 text-white text-sm font-medium rounded-lg"
            >
              {t('nav.startFree')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
