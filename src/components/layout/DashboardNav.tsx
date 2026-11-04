'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Brain,
  Swords,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Library', href: '/library', icon: BookOpen },
  { label: 'Learning Studio', href: '/learning', icon: GraduationCap },
  { label: 'Topic Intelligence', href: '/topics', icon: Brain },
  { label: 'Practice Arena', href: '/practice', icon: Swords },
  { label: 'My Progress', href: '/progress', icon: TrendingUp },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={cn(
          'flex items-center border-b border-black/8 shrink-0',
          collapsed && !mobile ? 'justify-center px-3 py-5' : 'px-5 py-5',
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-0.5 select-none min-w-0">
          <span
            className={cn(
              'font-serif font-bold text-editorial-blue tracking-tight whitespace-nowrap',
              collapsed && !mobile ? 'hidden' : 'text-xl',
            )}
          >
            LinguaLearn
          </span>
          <span
            className={cn(
              'font-serif font-bold text-coral tracking-tight',
              collapsed && !mobile ? 'text-2xl' : 'text-xl',
            )}
          >
            {collapsed && !mobile ? 'L' : 'AI'}
          </span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname?.startsWith(href + '/');
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center rounded-xl transition-all duration-150 group',
                    collapsed && !mobile
                      ? 'justify-center p-3'
                      : 'gap-3 px-3 py-2.5',
                    isActive
                      ? 'bg-editorial-blue text-white shadow-sm'
                      : 'text-ink/60 hover:bg-black/5 hover:text-ink',
                  )}
                  title={collapsed && !mobile ? label : undefined}
                >
                  <Icon
                    size={18}
                    className={cn(
                      'shrink-0',
                      isActive ? 'text-white' : 'text-ink/50 group-hover:text-ink',
                    )}
                  />
                  {(!collapsed || mobile) && (
                    <span className="text-sm font-medium truncate">{label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle (desktop only) */}
      {!mobile && (
        <div className="p-3 border-t border-black/8">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              'flex items-center justify-center w-full rounded-xl p-2.5 text-ink/50 hover:bg-black/5 hover:text-ink transition-colors',
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden md:flex flex-col h-screen bg-soft-neutral border-r border-black/8 sticky top-0 shrink-0 overflow-hidden"
      >
        <NavContent />
      </motion.aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-soft-neutral border-b border-black/8 px-4 h-14 sticky top-0 z-30">
        <Link href="/dashboard" className="flex items-center gap-0.5 select-none">
          <span className="font-serif text-lg font-bold text-editorial-blue">LinguaLearn</span>
          <span className="font-serif text-lg font-bold text-coral">AI</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-ink hover:bg-black/5 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-soft-neutral border-r border-black/8 md:hidden"
            >
              <NavContent mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
