/**
 * Single source of truth for the 7 Event Studio screens.
 * Fixed Order:
 * 1. Dashboard
 * 2. Venue Search
 * 3. Guest Manager
 * 4. Smart Budget
 * 5. Staff Ops
 * 6. Event Hub
 * 7. AI Concierge
 */

export type ScreenId = 
  | 'dashboard'
  | 'venues'
  | 'guests'
  | 'budget'
  | 'staff'
  | 'controls'
  | 'aichat';

export interface ScreenConfig {
  id: ScreenId;
  screenNumber: number;
  shortTitle: string;
  title: string;
  subtitle: string;
  description: string;
  themeAccent: 'orange' | 'cyan';
  badge: string;
}

export const SHARED_SCREENS: ScreenConfig[] = [
  {
    id: 'dashboard',
    screenNumber: 1,
    shortTitle: 'Dashboard',
    title: 'Screen 1: Dashboard',
    subtitle: 'Core Event Highlights & Master Preparation Checklist',
    description: 'Executive summary telemetry, countdown readiness, honoree highlights, and milestone verification.',
    themeAccent: 'orange',
    badge: 'Executive Command'
  },
  {
    id: 'venues',
    screenNumber: 2,
    shortTitle: 'Venue Search',
    title: 'Screen 2: Venue Search',
    subtitle: 'Live City Venue Discovery & Grounded Capacity Matching',
    description: 'Real-time search-grounded venue listings, dynamic budget fit, capacity validation, and contract line integration.',
    themeAccent: 'orange',
    badge: 'Spatial Intelligence'
  },
  {
    id: 'guests',
    screenNumber: 3,
    shortTitle: 'Guest Manager',
    title: 'Screen 3: Guest Manager',
    subtitle: 'Real-Time RSVP Roster & Door Turnstile Ingress Formula',
    description: 'Live attendance registry, allergen pods, table assignments, and mathematical queue wait time analytics.',
    themeAccent: 'orange',
    badge: 'Hospitality Ops'
  },
  {
    id: 'budget',
    screenNumber: 4,
    shortTitle: 'Smart Budget',
    title: 'Screen 4: Smart Budget',
    subtitle: 'Intelligent Budget Allocation & Non-Destructive Rebalancing',
    description: 'Central reserve ledger, 100% category allocation, strictly positive expenses, and AI elasticity reallocation.',
    themeAccent: 'orange',
    badge: 'Financial Ledger'
  },
  {
    id: 'staff',
    screenNumber: 5,
    shortTitle: 'Staff Ops',
    title: 'Screen 5: Staff Ops',
    subtitle: 'Crew Shift Health, Duty Stations & Fatigue Mitigation',
    description: 'Dynamic fatigue auditing, radio channel assignments, station rotations, and deputy handover resolutions.',
    themeAccent: 'orange',
    badge: 'Personnel Matrix'
  },
  {
    id: 'controls',
    screenNumber: 6,
    shortTitle: 'Event Hub',
    title: 'Screen 6: Event Hub',
    subtitle: 'Governance, Multi-Channel Share, Legal T&C & Debrief',
    description: 'Operational controls, event wrap-up archive, guest invite link generation, legal agreements, and studio reset.',
    themeAccent: 'orange',
    badge: 'Governance Hub'
  },
  {
    id: 'aichat',
    screenNumber: 7,
    shortTitle: 'AI Concierge',
    title: 'Screen 7: AI Concierge',
    subtitle: 'Multi-Day Autonomous Reasoning & Grounded Intelligence',
    description: 'Context-aware intelligence answering strictly from live event state across Day -1 through Day 3.',
    themeAccent: 'orange',
    badge: 'Gemini 3.8 Flash'
  }
];
