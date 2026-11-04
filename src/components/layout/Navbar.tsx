'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Languages', href: '#languages' },
  { label: 'About', href: '#about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-black/5'
            : 'bg-transparent',
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-0.5 select-none">
              <span className="font-serif text-2xl font-bold text-editorial-blue tracking-tight">
                LinguaLearn
              </span>
              <span className="font-serif text-2xl font-bold text-coral tracking-tight">
                AI
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors duration-200',
                    scrolled
                      ? 'text-ink hover:text-editorial-blue'
                      : 'text-ink/80 hover:text-ink',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-editorial-blue text-white text-sm font-semibold hover:bg-editorial-blue/90 transition-colors duration-200 shadow-sm"
              >
                Start Learning
              </Link>

              {/* Hamburger */}
              <button
                aria-label="Toggle menu"
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden p-2 rounded-lg text-ink hover:bg-black/5 transition-colors"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 bg-ivory flex flex-col pt-20 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-2 mt-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 text-xl font-semibold text-ink border-b border-black/5 hover:text-editorial-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-6 py-3 rounded-full bg-editorial-blue text-white text-base font-semibold hover:bg-editorial-blue/90 transition-colors shadow-sm"
              >
                Start Learning
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
