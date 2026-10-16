'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Pill } from 'lucide-react';
import {
  APP_HEADER_CONSTANTS,
  NAVIGATION_TABS,
  NAVIGATION_TAB_KEYS,
  ROUTES,
  type NavigationTabKey,
} from '@/frontend/config/routes';

export interface NavbarProps {
  currentPath?: string;
}

const TAB_ICONS: Record<NavigationTabKey, React.ComponentType<{ className?: string }>> = {
  [NAVIGATION_TAB_KEYS.HEADACHES]: Activity,
  [NAVIGATION_TAB_KEYS.MEDICATION]: Pill,
};

export function isTabActive(tabHref: string, currentPath: string): boolean {
  if (tabHref === ROUTES.HEADACHES) {
    return currentPath === ROUTES.HOME || currentPath.startsWith(ROUTES.HEADACHES);
  }
  return currentPath.startsWith(tabHref);
}

export function Navbar({ currentPath }: NavbarProps) {
  const pathnameFromRouter = usePathname();
  const effectivePath = currentPath ?? pathnameFromRouter ?? ROUTES.HEADACHES;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href={ROUTES.HEADACHES}
          className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-150">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              {APP_HEADER_CONSTANTS.BRAND_NAME}
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav aria-label={APP_HEADER_CONSTANTS.NAV_ARIA_LABEL} className="flex items-center gap-1.5 sm:gap-2">
          {NAVIGATION_TABS.map((tab) => {
            const isActive = isTabActive(tab.href, effectivePath);
            const Icon = TAB_ICONS[tab.id];

            return (
              <Link
                key={tab.id}
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 border ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200/80 dark:border-teal-800/80 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
