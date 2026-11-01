export type AppStep = 'splash' | 'sign' | 'event-setup' | 'swipe-screens';

export interface AuthUser {
  name: string;
  email: string;
  role: 'Producer' | 'AV Director' | 'Host' | 'VIP Coordinator';
  provider: 'google' | 'email';
  avatar?: string;
  token: string;
  signedInAt: string;
}

export interface SentEmailNotification {
  id: string;
  to: string;
  subject: string;
  snippet: string;
  fullContent: string;
  sentAt: string;
  securityCode: string;
}

export type SwipeScreenId = 
  | 'dashboard'
  | 'venues'
  | 'guests'
  | 'budget'
  | 'staff'
  | 'controls'
  | 'aichat';

export interface SwipeScreenInfo {
  id: SwipeScreenId;
  screenNumber: number; // 1 to 6
  shortTitle: string;
  title: string;
  tagline: string;
  purpose: string;
  themeAccent: 'cyan' | 'orange';
  features: string[];
}

export const SWIPE_SCREENS: SwipeScreenInfo[] = [
  {
    id: 'dashboard',
    screenNumber: 1,
    shortTitle: 'Dashboard',
    title: 'Screen 1: Event Dashboard',
    tagline: 'Core Details & Master Preparation Checklist',
    purpose: 'Core event summary metrics, countdown telemetry, honoree highlights, and comprehensive operational checklists.',
    themeAccent: 'orange',
    features: [
      'Core Event Highlights & Summary',
      'Interactive Event Readiness Checklist',
      'Timeline & Countdown Status',
      'Live Operational Pulse'
    ]
  },
  {
    id: 'venues',
    screenNumber: 2,
    shortTitle: 'Venue Search',
    title: 'Screen 2: Venue Intelligence & Selection',
    tagline: 'Web-Searched Venues Matched to Guests & Location',
    purpose: 'Live smart venue discovery for the specified place and guest count, pricing tiers, layout compatibility, and budget fit.',
    themeAccent: 'cyan',
    features: [
      'Smart Location & Capacity Web Matcher',
      'Curated Venues with Ratings & Photos',
      'Pricing & Budget Fit Calculator',
      'Instant Venue Selector & Contract Sync'
    ]
  },
  {
    id: 'guests',
    screenNumber: 3,
    shortTitle: 'Guest Manager',
    title: 'Screen 3: Guest & RSVP Management',
    tagline: 'Comprehensive Guest List, Tables & Check-Ins',
    purpose: 'Complete guest directory, RSVP tracking, VIP tier tagging, table seating assignments, and dietary alerts.',
    themeAccent: 'orange',
    features: [
      'Searchable Attendee & VIP Registry',
      'RSVP & Check-in Status Engine',
      'Interactive Seating & Table Allocations',
      'Dietary Requirements & Allergy Monitor'
    ]
  },
  {
    id: 'budget',
    screenNumber: 4,
    shortTitle: 'Smart Budget',
    title: 'Screen 4: Intelligent Budget Management',
    tagline: 'Automated Allocation Across Venue, Catering & Decor',
    purpose: 'Intelligently subdivides the total budget into catering, decor, venue, audio-visual, entertainment, and safety buffers.',
    themeAccent: 'cyan',
    features: [
      'Smart Automated Budget Subdivision',
      'Catering & Venue Cost Distribution',
      'Decor, Production & AV Breakdown',
      'Real-Time Expense Logger & Variance'
    ]
  },
  {
    id: 'staff',
    screenNumber: 5,
    shortTitle: 'Staff Ops',
    title: 'Screen 5: Staff & Crew Management',
    tagline: 'Roster, Shift Schedules & Duty Stations',
    purpose: 'Manages event team personnel, roles, coordinators, chefs, AV technicians, shifts, and communications.',
    themeAccent: 'orange',
    features: [
      'Staff Directory & Active Shift Status',
      'Role & Zone Duty Station Mapping',
      'Direct Contact & Walkie-Talkie Dispatch',
      'Task Delegation & Shift Handover'
    ]
  },
  {
    id: 'controls',
    screenNumber: 6,
    shortTitle: 'Event Hub',
    title: 'Screen 6: Event Controls & Wrap-Up',
    tagline: 'End Event, Edit Setup, Share, T&C & Sign Out',
    purpose: 'Administrative control room to end the event with wrap-up reports, edit setup configurations, share invites, review terms, and sign out.',
    themeAccent: 'cyan',
    features: [
      'Safe End Event & Wrap-Up Engine',
      'Edit Setup Parameters Quick Link',
      'Share Event Link & Passcode Generator',
      'Legal Terms, Privacy & Sign Out'
    ]
  },
  {
    id: 'aichat',
    screenNumber: 7,
    shortTitle: 'AI Chatbot',
    title: 'Screen 7: Multi-Day AI Event Concierge',
    tagline: 'Timeline Intelligence, Schedule Querying & Day-by-Day Answers',
    purpose: 'Real-time conversational intelligence across all event days, runs of show, speaker timings, vendor load-ins, dietary routing, and crisis mitigations.',
    themeAccent: 'orange',
    features: [
      'Multi-Day Timeline Matrix (Day -1 to Day 3)',
      'Natural Language Day-by-Day Q&A (Gemini 3.8 Flash)',
      'Real-Time Schedule & Conflict Verification',
      'Quick-Prompt Day Navigator & Run of Show Answers'
    ]
  }
];

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  dayTag?: string;
  modelSource?: string;
}

export interface MultiDaySchedule {
  dayMinus1: string; // T-1 Setup & Rigging
  day1: string;      // Day 1 Welcome & Gala
  day2: string;      // Day 2 Core Celebration & Band
  day3: string;      // Day 3 Farewell & Teardown
}

export interface EventSetupData {
  eventName: string;
  eventType: 'Wedding' | 'Birthday' | 'Anniversary' | 'Gala Celebration' | 'Festival' | 'Tech Expo & Summit' | 'Concert / Live Show' | 'VIP Private Party';
  venueName: string;
  venueCity?: string;
  guestCount: string;
  totalBudget: number;
  startDate: string;
  startTime: string;
  honoreeOrHost: string;
  themeStyle: string;
  budgetTier: 'Intimate Boutique' | 'Grand Celebration' | 'Enterprise Ultra';
  multiDaySchedule?: MultiDaySchedule;
  enabledModules: {
    dashboardChecklist?: boolean;
    venueDiscovery?: boolean;
    guestRegistry?: boolean;
    budgetLedger?: boolean;
    staffOps?: boolean;
    eventControls?: boolean;
    // Legacy compatibility keys
    runOfShowClock?: boolean;
    multiTrackAgenda?: boolean;
    vipGateRadar?: boolean;
    avLightingMatrix?: boolean;
    crowdFlowHeatmap?: boolean;
    emergencyDispatch?: boolean;
  };
}

export type LogicSeverity = 'Critical' | 'Warning' | 'Optimization';

export interface ProblemScenario {
  id: string;
  title: string;
  screenTarget: number; // 1 to 6
  screenName: string;
  severity: LogicSeverity;
  category: 'Timeline' | 'Spatial' | 'Seating' | 'Budget' | 'Staffing' | 'Safety';
  premise: string;
  conflictIdentified: string;
  chainOfThought: string[];
  tradeOffAnalysis: {
    optionA: string;
    optionB: string;
    aiSelected: string;
    rationale: string;
  };
  resolutionTitle: string;
  resolutionImpact: string;
  resolved: boolean;
  resolutionType: 
    | 'auto_checklist'
    | 'rebalance_budget'
    | 'optimize_seating'
    | 'redeploy_staff'
    | 'contingency_venue'
    | 'protocol_shutdown';
  isAiGenerated?: boolean;
  aiModel?: string;
  metricComparison?: {
    beforeLabel: string;
    beforeValue: string;
    afterLabel: string;
    afterValue: string;
  };
}

export interface VenueOption {
  id: string;
  name: string;
  area: string;
  capacity: number;
  estimatedRent: number;
  rating: number;
  amenities: string[];
  whyItFits: string;
  indoorOutdoor?: string;
  sourceUrl?: string;
  image?: string;
  isAiSuggested?: boolean;
}

export interface ExpenseRecord {
  id: string;
  name: string;
  category: string;
  amount: number;
  status: 'Paid' | 'Pending';
}

export interface GuestRecord {
  id: string;
  name: string;
  rsvp: 'Attending' | 'Pending' | 'Declined';
  tier: string;
  table: string;
  diet: string;
  checkedIn: boolean;
  phone: string;
}

export interface StaffRecord {
  id: string;
  name: string;
  role: string;
  dept: string;
  shift: string;
  status: 'On Duty' | 'On Break' | 'Scheduled';
  channel: string;
  phone: string;
}

export interface SelfCheckResult {
  id: string;
  name: string;
  category: string;
  status: 'PASS' | 'FAIL' | 'RUNNING';
  description: string;
  expected: string;
  actual: string;
  details?: string;
}
