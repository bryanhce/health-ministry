export const ROUTES = {
  HOME: '/',
  HEADACHES: '/headaches',
  MEDICATION: '/medication',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export const NAVIGATION_TAB_KEYS = {
  HEADACHES: 'HEADACHES',
  MEDICATION: 'MEDICATION',
} as const;

export type NavigationTabKey = (typeof NAVIGATION_TAB_KEYS)[keyof typeof NAVIGATION_TAB_KEYS];

export interface NavigationTabItem {
  readonly id: NavigationTabKey;
  readonly label: string;
  readonly href: RoutePath;
}

export const NAVIGATION_TABS: readonly NavigationTabItem[] = [
  {
    id: NAVIGATION_TAB_KEYS.HEADACHES,
    label: 'Headaches',
    href: ROUTES.HEADACHES,
  },
  {
    id: NAVIGATION_TAB_KEYS.MEDICATION,
    label: 'Medication',
    href: ROUTES.MEDICATION,
  },
] as const;

export const APP_HEADER_CONSTANTS = {
  BRAND_NAME: 'Health Ministry',
  NAV_ARIA_LABEL: 'Main Navigation',
} as const;

export const HEADACHE_SUBHEADER_CONSTANTS = {
  PAGE_TITLE: 'Headache & Migraine Analytics',
  PAGE_DESCRIPTION: 'Track symptom duration, intensity, and frequency patterns',
  LOG_BUTTON_TEXT: 'Log Headache',
  LOG_BUTTON_MOBILE_TEXT: 'Log',
  SEED_BUTTON_TEXT: 'Seed Demo Data',
  SEED_BUTTON_MOBILE_TEXT: 'Seed',
  SEED_BUTTON_TOOLTIP: 'Seed 90 days of realistic sample data',
} as const;

export const MEDICATION_PAGE_CONSTANTS = {
  PAGE_TITLE: 'Medication Tracking',
  PAGE_DESCRIPTION: 'Track and manage your prescriptions, preventive treatments, and acute relief medications.',
  EMPTY_STATE_TITLE: 'No Medications Added',
  EMPTY_STATE_DESCRIPTION: 'Medication and prescription logging will be available here soon.',
  STATUS_BADGE: 'Planned Feature',
} as const;
