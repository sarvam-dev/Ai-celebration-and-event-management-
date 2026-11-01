import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { 
  EventSetupData, 
  AuthUser, 
  ProblemScenario, 
  VenueOption, 
  ExpenseRecord, 
  GuestRecord, 
  StaffRecord 
} from '../types';
import { 
  calculateTotalSpent, 
  calculateRemainingReserve, 
  calculateCostPerGuest, 
  calculateQueueWaitTime, 
  calculateThroughputPerMinute, 
  calculateConfirmationPct, 
  calculateShiftHealth, 
  isVenueUnderCapacity, 
  calculateBudgetFitPct, 
  isStaffFatigued 
} from '../utils/calculations';

export interface CategoryAllocation {
  id: string;
  name: string;
  pct: number;
  color: string;
}

interface EventContextType {
  // Core Event Setup
  eventData: EventSetupData;
  currentUser: AuthUser | null;
  updateEventData: (data: Partial<EventSetupData>) => void;
  setCurrentUser: (user: AuthUser | null) => void;

  // Screen Navigation
  activeScreenIndex: number;
  setActiveScreenIndex: (index: number) => void;

  // Venue Management
  venues: VenueOption[];
  selectedVenue: VenueOption | null;
  isLoadingVenues: boolean;
  venueError: string | null;
  fetchVenues: (city?: string, count?: number, budget?: number) => Promise<void>;
  selectPrimaryVenue: (venue: VenueOption) => void;

  // Budget Management (Derived strictly from single source of truth)
  totalBudget: number;
  expenses: ExpenseRecord[];
  categoryAllocations: CategoryAllocation[];
  totalSpent: number;
  remainingReserve: number;
  costPerGuest: number;
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => boolean;
  removeExpense: (id: string) => void;
  rebalanceBudget: () => void;
  isRebalanced: boolean;

  // Guest Management
  guestList: GuestRecord[];
  turnstileGates: number;
  secondsPerGuest: number;
  setTurnstileGates: (gates: number | ((prev: number) => number)) => void;
  setSecondsPerGuest: (seconds: number) => void;
  toggleGuestCheckIn: (id: string) => void;
  updateGuestRsvp: (id: string, rsvp: 'Attending' | 'Pending' | 'Declined') => void;
  addGuest: (guest: Omit<GuestRecord, 'id'>) => void;
  removeGuest: (id: string) => void;
  totalInvited: number;
  attendingCount: number;
  pendingCount: number;
  declinedCount: number;
  checkedInCount: number;
  confirmationRate: string;
  queueWaitTime: number;
  throughputPerMinute: number;

  // Staff Management
  staffRoster: StaffRecord[];
  shiftHealth: { score: number; fatiguedCount: number; fatiguedNames: string[] };
  setStaffStatus: (id: string, status: 'On Duty' | 'On Break' | 'Scheduled') => void;
  resolveStaffHandover: (id: string) => void;
  addStaff: (staff: Omit<StaffRecord, 'id'>) => void;

  // AI Problem Solving & Conflicts
  scenarios: ProblemScenario[];
  resolveScenario: (id: string) => void;
  refreshAiConflicts: () => Promise<void>;
  isLoadingAiConflicts: boolean;

  // Studio Reset
  resetDemoData: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Initial Default Event Data
export const INITIAL_EVENT_DATA: EventSetupData = {
  eventName: 'Royal Heritage Grand Wedding Gala',
  eventType: 'Wedding',
  venueName: 'The Grand Amber Palace - Crystal Ballroom',
  venueCity: 'Metropolis Central',
  guestCount: '450',
  totalBudget: 65000,
  startDate: '2026-11-20',
  startTime: '18:00',
  honoreeOrHost: 'Evelyn & Julian Vance',
  themeStyle: 'Claude Terracotta & Royal Gold',
  budgetTier: 'Grand Celebration',
  multiDaySchedule: {
    dayMinus1: '14:00 Rigging & Acoustic Frequency Sweep, 18:00 Vendor Load-in',
    day1: '16:00 VIP Red Carpet, 18:00 Welcome Gala, 20:30 Chef Tasting',
    day2: '17:00 Royal Ceremony, 19:30 Grand Banquet, 22:00 Live Orchestra',
    day3: '11:00 Farewell Brunch & Honors, 15:00 Teardown & Logistics Wrap'
  },
  enabledModules: {
    dashboardChecklist: true,
    venueDiscovery: true,
    guestRegistry: true,
    budgetLedger: true,
    staffOps: true,
    eventControls: true,
  },
};

// Initial Initial Expenses (strictly positive, Paid or Pending)
const INITIAL_EXPENSES: ExpenseRecord[] = [
  { id: 'exp-1', name: 'Crystal Ballroom Base Rental Deposit', category: 'Venue', amount: 18500, status: 'Paid' },
  { id: 'exp-2', name: 'Grand Banquet 4-Course Dinner & Cellar Pairing', category: 'Catering & Bar', amount: 22000, status: 'Paid' },
  { id: 'exp-3', name: 'NDI 4K Cameras & Line-Array Acoustic Rigging', category: 'AV & Production', amount: 9200, status: 'Paid' },
  { id: 'exp-4', name: 'Royal Gold Silk Drapery & Custom Floral Staging', category: 'Decor & Floral', amount: 6450, status: 'Pending' },
  { id: 'exp-5', name: 'String Quartet & Headliner Jazz Sextet', category: 'Entertainment', amount: 4500, status: 'Paid' },
];

// Initial Categories Allocation (summing strictly to 100%)
const INITIAL_ALLOCATIONS: CategoryAllocation[] = [
  { id: 'cat-venue', name: 'Venue & Facilities', pct: 30, color: '#D96B27' },
  { id: 'cat-catering', name: 'Catering & Bar', pct: 35, color: '#EA580C' },
  { id: 'cat-av', name: 'AV & Production', pct: 15, color: '#38BDF8' },
  { id: 'cat-decor', name: 'Decor & Floral', pct: 10, color: '#F59E0B' },
  { id: 'cat-ent', name: 'Entertainment', pct: 5, color: '#A855F7' },
  { id: 'cat-buffer', name: 'Safety & Contingency Buffer', pct: 5, color: '#10B981' },
];

// Initial Real Guest List Sample Cohort
const INITIAL_GUEST_LIST: GuestRecord[] = [
  { id: 'gst-1', name: 'Sophia Dubois', rsvp: 'Attending', tier: 'Diamond VIP', table: 'Table 01 (Hypoallergenic)', diet: 'Anaphylactic Nut Allergy', checkedIn: true, phone: '+1 (555) 019-2834' },
  { id: 'gst-2', name: 'Ambassador Tariq', rsvp: 'Attending', tier: 'Dignitary VIP', table: 'Table 02 (Dignitary)', diet: 'Halal Certified', checkedIn: true, phone: '+1 (555) 018-4920' },
  { id: 'gst-3', name: 'Lord Montgomery', rsvp: 'Attending', tier: 'Gold VIP', table: 'Table 02 (Dignitary)', diet: 'Gluten-Free & Pescatarian', checkedIn: false, phone: '+1 (555) 014-9382' },
  { id: 'gst-4', name: 'Dr. Aris Thorne', rsvp: 'Attending', tier: 'Guest of Honor', table: 'Table 01 (Hypoallergenic)', diet: 'Strict Vegan', checkedIn: true, phone: '+1 (555) 017-7463' },
  { id: 'gst-5', name: 'Helena Vance', rsvp: 'Attending', tier: 'Family VIP', table: 'Table 03 (Host Family)', diet: 'Standard Executive', checkedIn: true, phone: '+1 (555) 012-3849' },
  { id: 'gst-6', name: 'Christian Vance', rsvp: 'Attending', tier: 'Family VIP', table: 'Table 03 (Host Family)', diet: 'Standard Executive', checkedIn: true, phone: '+1 (555) 012-3850' },
  { id: 'gst-7', name: 'Lady Vivienne Sterling', rsvp: 'Attending', tier: 'Gold VIP', table: 'Table 04 (Ambassador)', diet: 'Dairy-Free', checkedIn: false, phone: '+1 (555) 015-8291' },
  { id: 'gst-8', name: 'Gov. Richard Hayes', rsvp: 'Pending', tier: 'Dignitary VIP', table: 'Table 04 (Ambassador)', diet: 'Standard Executive', checkedIn: false, phone: '+1 (555) 019-4820' },
  { id: 'gst-9', name: 'Elena Rostova-Cole', rsvp: 'Attending', tier: 'Gold VIP', table: 'Table 05 (Royal Circle)', diet: 'Vegetarian', checkedIn: false, phone: '+1 (555) 011-9284' },
  { id: 'gst-10', name: 'Marcus K. Aurelius', rsvp: 'Attending', tier: 'Standard', table: 'Table 06 (Patrons)', diet: 'Standard Executive', checkedIn: false, phone: '+1 (555) 016-8371' },
  { id: 'gst-11', name: 'Celeste Fontaine', rsvp: 'Pending', tier: 'Standard', table: 'Table 06 (Patrons)', diet: 'Pescatarian', checkedIn: false, phone: '+1 (555) 013-4927' },
  { id: 'gst-12', name: 'Siddharth Patel', rsvp: 'Attending', tier: 'Standard', table: 'Table 07 (Patrons)', diet: 'Jain Vegetarian', checkedIn: false, phone: '+1 (555) 017-3829' },
  { id: 'gst-13', name: 'Genevieve LaRue', rsvp: 'Attending', tier: 'Standard', table: 'Table 07 (Patrons)', diet: 'Standard Executive', checkedIn: false, phone: '+1 (555) 018-2940' },
  { id: 'gst-14', name: 'Capt. Jonathan Drake', rsvp: 'Declined', tier: 'Standard', table: 'Unassigned', diet: 'Standard Executive', checkedIn: false, phone: '+1 (555) 014-8293' },
  { id: 'gst-15', name: 'Baroness Clara Von Stein', rsvp: 'Attending', tier: 'Gold VIP', table: 'Table 05 (Royal Circle)', diet: 'Low Sodium', checkedIn: false, phone: '+1 (555) 012-9471' },
  { id: 'gst-16', name: 'Prof. Arthur Pendelton', rsvp: 'Pending', tier: 'Standard', table: 'Table 08 (Faculty)', diet: 'Standard Executive', checkedIn: false, phone: '+1 (555) 016-3918' },
  { id: 'gst-17', name: 'Zoya Al-Mansoor', rsvp: 'Attending', tier: 'Gold VIP', table: 'Table 02 (Dignitary)', diet: 'Halal Certified', checkedIn: false, phone: '+1 (555) 019-3821' },
  { id: 'gst-18', name: 'Henrik Lindqvist', rsvp: 'Declined', tier: 'Standard', table: 'Unassigned', diet: 'Standard Executive', checkedIn: false, phone: '+1 (555) 011-4829' },
];

// Initial Staff Roster
const INITIAL_STAFF_ROSTER: StaffRecord[] = [
  { id: 'stf-1', name: 'Marcus Sterling', role: 'AV Technical Director', dept: 'Production', shift: '12:00 - 01:00 (13h Continuous)', status: 'On Duty', channel: 'Ch 1 - AV Control', phone: '+1 (555) 012-9481' },
  { id: 'stf-2', name: 'Chef Antoine Laurent', role: 'Executive Banquet Chef', dept: 'Catering', shift: '10:00 - 23:00 (13h Continuous)', status: 'On Duty', channel: 'Ch 2 - Culinary', phone: '+1 (555) 013-8274' },
  { id: 'stf-3', name: 'Elena Rostov', role: 'Stage & Run of Show Manager', dept: 'Operations', shift: '14:00 - 22:00 (8h Standard)', status: 'On Duty', channel: 'Ch 3 - Stage Comms', phone: '+1 (555) 014-7382' },
  { id: 'stf-4', name: 'Devon Vance', role: 'VIP Hospitality Escort', dept: 'Guest Protocol', shift: '16:00 - 00:00 (8h Standard)', status: 'On Break', channel: 'Ch 4 - VIP Security', phone: '+1 (555) 015-6291' },
  { id: 'stf-5', name: 'Maya Lin', role: 'Architectural Lighting Tech', dept: 'Production', shift: '15:00 - 23:00 (8h Standard)', status: 'On Duty', channel: 'Ch 1 - AV Control', phone: '+1 (555) 016-5182' },
  { id: 'stf-6', name: 'Jackson Reed', role: 'Security & Ingress Turnstile Lead', dept: 'Security', shift: '16:00 - 00:00 (8h Standard)', status: 'Scheduled', channel: 'Ch 5 - Perimeter', phone: '+1 (555) 017-4073' },
];

// Initial Initial Scenarios
const INITIAL_SCENARIOS: ProblemScenario[] = [
  {
    id: 'sc1',
    title: 'Acoustic Tuning & Early VIP Arrival Conflict',
    screenTarget: 1,
    screenName: 'Screen 1: Dashboard',
    severity: 'Critical',
    category: 'Timeline',
    premise: 'VIP Guests commence arrival at 17:15. Primary Sound Check and wireless microphone line tests are scheduled for 17:00-17:45 in the main foyer.',
    conflictIdentified: 'Acoustic line tests (105dB pink noise) directly overlap with VIP red-carpet arrival window, creating acute guest discomfort and communications blackout.',
    chainOfThought: [
      'Axiom 1: Audio rigging calibration requires 35 minutes of uninterruptible acoustic sweep.',
      'Axiom 2: VIP protocol dictates quiet, ambient welcome hospitality with zero high-decibel disturbance.',
      'Deduction 3: Delaying sound check past 18:00 risks keynote microphone feedback during opening addresses.',
      'Synthesis 4: Advancing AV testing to 15:45 clears the hall 90 minutes prior to doors, fully resolving the collision.'
    ],
    tradeOffAnalysis: {
      optionA: 'Mute line test and rely on software simulation (risks live acoustic feedback).',
      optionB: 'Advance crew call by 45 minutes to execute acoustic checks early.',
      aiSelected: 'Option B (Rigorous Early Calibration)',
      rationale: 'Eliminates 100% of live performance failure risk while preserving dignified VIP welcome.'
    },
    resolutionTitle: 'Advance AV Frequency & Acoustic Check to 15:45',
    resolutionImpact: 'Sound check completed early; master readiness elevated to 94%.',
    resolved: false,
    resolutionType: 'auto_checklist',
  },
  {
    id: 'sc2',
    title: 'Ballroom Circulation Choke-Point vs Dance Floor',
    screenTarget: 2,
    screenName: 'Screen 2: Venue Intelligence',
    severity: 'Warning',
    category: 'Spatial',
    premise: 'Grand Amber Palace provides 6,500 sq ft. At 450 guests plus a 700 sq ft dance floor and 8-station buffet, aisle widths contract to 3.2 ft.',
    conflictIdentified: 'Egress corridor width violates 5.0 ft municipal safety standard, risking a 14-minute dinner buffet queue bottleneck.',
    chainOfThought: [
      'Axiom 1: Spatial safety standards require minimum 5.0 ft clear egress corridors.',
      'Axiom 2: 8 buffet stations occupy 1,200 sq ft perimeter queuing envelope.',
      'Deduction 3: Converting to Synchronized Butler Plated Service reclaims 850 sq ft of floor plate.',
      'Synthesis 4: Expanding perimeter walkway to 6.2 ft achieves optimal traffic circulation.'
    ],
    tradeOffAnalysis: {
      optionA: 'Reduce guest seating count by 40 guests (violates host invitation list).',
      optionB: 'Convert to Synchronized Butler Plated Service and compact AV rear-projection.',
      aiSelected: 'Option B (Layout Geometry Optimization)',
      rationale: 'Reclaims 850 sq ft of open circulation without dropping a single invited guest.'
    },
    resolutionTitle: 'Adopt Synchronized Plated Service Layout (+45% Aisle Width)',
    resolutionImpact: 'Egress expanded to 6.2 ft; ballroom circulation certified 100% hazard-free.',
    resolved: false,
    resolutionType: 'contingency_venue',
  },
  {
    id: 'sc3',
    title: 'Cross-Allergen Proximity & Table 02 Seating Clash',
    screenTarget: 3,
    screenName: 'Screen 3: Guest Management',
    severity: 'Critical',
    category: 'Seating',
    premise: 'Sophia Dubois (Anaphylactic Peanut/Tree Nut Allergy) and Ambassador Tariq (Halal dietary protocol) are seated at Table 02 adjacent to the primary pastry tray service corridor.',
    conflictIdentified: 'Pastry serving station features hazelnut praline platters traversing within 1.2m of Table 02, creating an unacceptable cross-contamination hazard.',
    chainOfThought: [
      'Axiom 1: Allergen airborne and touch transfer risk is severe within 2.5m of moving pastry platters.',
      'Axiom 2: Ambassador Tariq requires designated certified Halal culinary runners.',
      'Deduction 3: Moving Sophia Dubois to Table 01 (Diamond VIP - hypoallergenic zone) provides 6m physical buffer.',
      'Synthesis 4: Table 02 runner route relocated to South Corridor, isolating all allergen vectors.'
    ],
    tradeOffAnalysis: {
      optionA: 'Eliminate all nut-based pastries from the entire 450-person menu (host objection).',
      optionB: 'Re-seat Sophia to Table 01 Hypoallergenic Sanctuary & establish 6m buffer zone.',
      aiSelected: 'Option B (Targeted Micro-Routing)',
      rationale: 'Guarantees absolute medical safety for Sophia while honoring host culinary wishes.'
    },
    resolutionTitle: 'Transfer Sophia Dubois to Table 01 Hypoallergenic Sanctuary',
    resolutionImpact: 'Hypoallergenic buffer active; zero cross-contamination exposure path.',
    resolved: false,
    resolutionType: 'optimize_seating',
  },
  {
    id: 'sc4',
    title: 'Late Bar Surge & Decor Overspend Budget Squeeze',
    screenTarget: 4,
    screenName: 'Screen 4: Smart Budget',
    severity: 'Warning',
    category: 'Budget',
    premise: 'Late addition of imported champagne reserves ($3,800) threatens to pierce the $4,350 Contingency Reserve by 87%.',
    conflictIdentified: 'Unchecked beverage expansion depletes safety margin to $550, leaving the event vulnerable to overtime venue penalties.',
    chainOfThought: [
      'Axiom 1: Prudent fiscal governance requires maintaining at least $4,000 contingency buffer.',
      'Axiom 2: Decor line item currently holds $6,450 for imported silk fabric drape rentals.',
      'Deduction 3: Reallocating 2% ($1,300) from non-critical floral drapery into Contingency cushions the bar surge.',
      'Synthesis 4: Net budget total remains strictly preserved at $65,000 with zero overdraft.'
    ],
    tradeOffAnalysis: {
      optionA: 'Cancel champagne upgrade and serve house sparkling wine (host preferred champagne).',
      optionB: 'Execute 2% non-destructive category reallocation from drape rentals to contingency.',
      aiSelected: 'Option B (Smart Capital Reallocation)',
      rationale: 'Absorbs beverage surge while keeping overall budget strictly balanced at $65,000.'
    },
    resolutionTitle: 'Non-Destructive Rebalance: Reallocate 2% to Contingency Reserve',
    resolutionImpact: 'Contingency preserved at $4,350; category percentages balance to exactly 100%.',
    resolved: false,
    resolutionType: 'rebalance_budget',
  },
  {
    id: 'sc5',
    title: 'Dual 13-Hour Continuous Shift Fatigue Risk',
    screenTarget: 5,
    screenName: 'Screen 5: Staff Ops',
    severity: 'Critical',
    category: 'Staffing',
    premise: 'Marcus Sterling (AV Director) and Chef Antoine Laurent (Banquet Chef) are both rostered for 13 continuous hours without scheduled break coverage or handover.',
    conflictIdentified: 'Consecutive hours exceed occupational safety thresholds (12+ hrs), causing Shift Health to plunge to 57% and risking critical production misfires.',
    chainOfThought: [
      'Axiom 1: Continuous operations over 12 hours induce a 64% increase in human error rates.',
      'Axiom 2: Marcus holds sole control of live 4K switching; Chef Antoine oversees 450 plated entrees.',
      'Deduction 3: Scheduling Maya Lin as AV Deputy and Sous-Chef Bernard as Culinary Deputy creates mandatory 45-min relief windows.',
      'Synthesis 4: Fatigue warnings cleared; Shift Health score surges from 57% to 92%.'
    ],
    tradeOffAnalysis: {
      optionA: 'Shorten banquet reception duration by 2 hours (violates client contract).',
      optionB: 'Appoint certified secondary deputies for 45-minute staggered handover rotations.',
      aiSelected: 'Option B (Deputy Station Rotation)',
      rationale: 'Guarantees uninterrupted operational excellence while protecting staff welfare.'
    },
    resolutionTitle: 'Assign Staggered Deputy Handover & 45-Min Rest Windows',
    resolutionImpact: 'Fatigue cleared for Marcus and Chef Antoine; Shift Health restored to 92%.',
    resolved: false,
    resolutionType: 'redeploy_staff',
  },
  {
    id: 'sc6',
    title: 'Rain Ingress vs Valet Porte-Cochere Queue',
    screenTarget: 6,
    screenName: 'Screen 6: Event Hub',
    severity: 'Optimization',
    category: 'Safety',
    premise: 'Meteorological telemetry forecasts 45% probability of sudden evening squall between 20:30 and 22:00 during valet egress.',
    conflictIdentified: 'Single porte-cochere canopy can only shelter 12 guests simultaneously, creating queue congestion if 150+ guests request vehicles together.',
    chainOfThought: [
      'Axiom 1: Heavy rain will force all departing guests to congregate under the front canopy.',
      'Axiom 2: Valet vehicle retrieval averages 4.5 minutes per ticket in wet pavement conditions.',
      'Deduction 3: Deploying South Covered Gallery as secondary heated waiting lounge eliminates overcrowding.',
      'Synthesis 4: Dispatches automated SMS vehicle readiness alerts to departing guests.'
    ],
    tradeOffAnalysis: {
      optionA: 'Hire 10 additional valet drivers (incurs $2,400 unbudgeted fee).',
      optionB: 'Activate Covered South Gallery lounge and SMS dispatch staging.',
      aiSelected: 'Option B (Facility Staging Reconfiguration)',
      rationale: 'Provides luxurious dry guest experience at zero incremental operational expenditure.'
    },
    resolutionTitle: 'Deploy South Gallery Lounge & SMS Valet Notification',
    resolutionImpact: 'Canopy bottleneck eliminated; guest departure experience rated 5-stars.',
    resolved: false,
    resolutionType: 'protocol_shutdown',
  },
  {
    id: 'sc7',
    title: 'Day 2 Ceremony Timeline Overlap with Orchestral Tuning',
    screenTarget: 7,
    screenName: 'Screen 7: AI Concierge',
    severity: 'Optimization',
    category: 'Timeline',
    premise: 'Live orchestra load-in on Day 2 is scheduled for 16:30, conflicting with the bridal party private pre-ceremony photography at 16:45.',
    conflictIdentified: 'Brass and cello flight-case movement through South Transept disrupts private photography session.',
    chainOfThought: [
      'Axiom 1: Pre-ceremony photography requires undisturbed private access to South Transept architectural background.',
      'Axiom 2: Orchestral instruments require 30 minutes acclimatization prior to rehearsal.',
      'Deduction 3: Re-routing orchestra load-in through the North Freight Elevator bypasses photography zone entirely.',
      'Synthesis 4: Both schedules proceed simultaneously with zero visual or physical collision.'
    ],
    tradeOffAnalysis: {
      optionA: 'Shorten private photography session by 30 minutes.',
      optionB: 'Enforce North Service Corridor routing for all orchestra equipment.',
      aiSelected: 'Option B (Service Routing Separation)',
      rationale: 'Protects intimate host photography without compressing musical preparation.'
    },
    resolutionTitle: 'Reroute Orchestra Load-In via North Freight Elevator',
    resolutionImpact: 'Full photo schedule preserved; orchestra staging complete 15 min early.',
    resolved: false,
    resolutionType: 'auto_checklist',
  }
];

export const EventProvider: React.FC<{
  initialData?: EventSetupData;
  initialUser?: AuthUser | null;
  children: ReactNode;
}> = ({ initialData, initialUser, children }) => {
  const [eventData, setEventData] = useState<EventSetupData>(initialData || INITIAL_EVENT_DATA);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(initialUser || {
    name: 'Director Quantrom',
    email: 'quantromxx@gmail.com',
    role: 'Producer',
    provider: 'email',
    token: 'auth-token-quantrom',
    signedInAt: '12:00:00',
  });

  // Always open on Screen 1 (Dashboard, index 0)
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);

  // Venues State
  const [venues, setVenues] = useState<VenueOption[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<VenueOption | null>(null);
  const [isLoadingVenues, setIsLoadingVenues] = useState<boolean>(false);
  const [venueError, setVenueError] = useState<string | null>(null);

  // Budget State
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [categoryAllocations, setCategoryAllocations] = useState<CategoryAllocation[]>(INITIAL_ALLOCATIONS);
  const [isRebalanced, setIsRebalanced] = useState<boolean>(false);

  // Guest State
  const [guestList, setGuestList] = useState<GuestRecord[]>(INITIAL_GUEST_LIST);
  const [turnstileGates, setTurnstileGates] = useState<number>(2);
  const [secondsPerGuest, setSecondsPerGuest] = useState<number>(8);

  // Staff State
  const [staffRoster, setStaffRoster] = useState<StaffRecord[]>(INITIAL_STAFF_ROSTER);

  // AI Scenarios State
  const [scenarios, setScenarios] = useState<ProblemScenario[]>(INITIAL_SCENARIOS);
  const [isLoadingAiConflicts, setIsLoadingAiConflicts] = useState<boolean>(false);

  // Sync eventData totalBudget to budget calculations
  const totalBudget = Number(eventData.totalBudget) || 65000;
  const guestCount = Number(eventData.guestCount) || 450;

  // Derived Budget calculations from pure formulas
  const totalSpent = useMemo(() => calculateTotalSpent(expenses), [expenses]);
  const remainingReserve = useMemo(() => calculateRemainingReserve(totalBudget, expenses), [totalBudget, expenses]);
  const costPerGuest = useMemo(() => calculateCostPerGuest(totalBudget, guestCount), [totalBudget, guestCount]);

  // Derived Guest calculations
  const totalInvited = guestCount;
  const attendingCount = useMemo(() => guestList.filter((g) => g.rsvp === 'Attending').length, [guestList]);
  const pendingCount = useMemo(() => guestList.filter((g) => g.rsvp === 'Pending').length, [guestList]);
  const declinedCount = useMemo(() => guestList.filter((g) => g.rsvp === 'Declined').length, [guestList]);
  const checkedInCount = useMemo(() => guestList.filter((g) => g.checkedIn).length, [guestList]);
  const confirmationRate = useMemo(() => calculateConfirmationPct(attendingCount, guestList.length), [attendingCount, guestList.length]);

  const queueWaitTime = useMemo(
    () => calculateQueueWaitTime(totalInvited, secondsPerGuest, turnstileGates),
    [totalInvited, secondsPerGuest, turnstileGates]
  );

  const throughputPerMinute = useMemo(
    () => calculateThroughputPerMinute(secondsPerGuest, turnstileGates),
    [secondsPerGuest, turnstileGates]
  );

  // Derived Staff Health
  const shiftHealth = useMemo(() => calculateShiftHealth(staffRoster), [staffRoster]);

  // Fetch Venues function
  const fetchVenues = async (city?: string, count?: number, budget?: number) => {
    const searchCity = city || eventData.venueCity || 'Metropolis Central';
    const searchCount = count || guestCount;
    const searchBudget = budget || totalBudget;

    setIsLoadingVenues(true);
    setVenueError(null);

    try {
      const response = await fetch(
        `/api/venues?city=${encodeURIComponent(searchCity)}&guests=${searchCount}&budget=${searchBudget}&type=${encodeURIComponent(eventData.eventType)}`
      );
      if (!response.ok) {
        throw new Error(`Venue search failed with status ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data.venues) && data.venues.length > 0) {
        setVenues(data.venues);
        // If no venue currently selected, auto-select first matching venue
        if (!selectedVenue) {
          const firstEligible = data.venues.find((v: VenueOption) => v.capacity >= searchCount) || data.venues[0];
          setSelectedVenue(firstEligible);
        }
      }
    } catch (err: any) {
      console.warn('Venue fetch fallback:', err.message);
      setVenueError(err.message || 'Unable to retrieve venues from server. Displaying cached curated registry.');
    } finally {
      setIsLoadingVenues(false);
    }
  };

  // Initial fetch on mount or when city/guests/budget change
  useEffect(() => {
    fetchVenues(eventData.venueCity, guestCount, totalBudget);
  }, [eventData.venueCity, eventData.guestCount, eventData.totalBudget]);

  // Update Event Data
  const updateEventData = (partial: Partial<EventSetupData>) => {
    setEventData((prev) => ({
      ...prev,
      ...partial,
      enabledModules: {
        ...prev.enabledModules,
        ...(partial.enabledModules || {}),
      },
    }));
  };

  // Select Primary Venue: updates event venue name and syncs budget line item
  const selectPrimaryVenue = (venue: VenueOption) => {
    // Prevent selection if under capacity
    if (isVenueUnderCapacity(venue.capacity, guestCount)) {
      return;
    }
    setSelectedVenue(venue);
    updateEventData({ venueName: venue.name });

    // Update or add the Venue expense line in expenses
    setExpenses((prev) => {
      const venueExpIndex = prev.findIndex((e) => e.category === 'Venue');
      if (venueExpIndex >= 0) {
        const copy = [...prev];
        copy[venueExpIndex] = {
          ...copy[venueExpIndex],
          name: `${venue.name} Rental & Facilities`,
          amount: Math.max(0, venue.estimatedRent),
        };
        return copy;
      } else {
        return [
          {
            id: `exp-venue-${Date.now()}`,
            name: `${venue.name} Rental & Facilities`,
            category: 'Venue',
            amount: Math.max(0, venue.estimatedRent),
            status: 'Paid',
          },
          ...prev,
        ];
      }
    });
  };

  // Add Expense with strict non-negative check
  const addExpense = (expense: Omit<ExpenseRecord, 'id'>): boolean => {
    const safeAmount = Math.max(0, Number(expense.amount) || 0);
    const newRecord: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      name: expense.name.trim() || 'Uncategorized Production Expense',
      category: expense.category,
      amount: safeAmount,
      status: expense.status || 'Paid',
    };
    setExpenses((prev) => [newRecord, ...prev]);
    return true;
  };

  // Remove Expense
  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // AI Rebalance: Non-destructive reallocation between categories preserving 100% total
  const rebalanceBudget = () => {
    setCategoryAllocations((prev) => {
      // Reallocate 2% from Decor (10% -> 8%) to Contingency Buffer (5% -> 7%)
      return prev.map((cat) => {
        if (cat.name.includes('Decor')) {
          return { ...cat, pct: 8 };
        }
        if (cat.name.includes('Contingency') || cat.name.includes('Buffer')) {
          return { ...cat, pct: 7 };
        }
        return cat;
      });
    });
    setIsRebalanced(true);

    // Also mark scenario 4 as resolved
    setScenarios((prev) =>
      prev.map((sc) => (sc.id === 'sc4' ? { ...sc, resolved: true } : sc))
    );
  };

  // Guest actions
  const toggleGuestCheckIn = (id: string) => {
    setGuestList((prev) =>
      prev.map((g) => (g.id === id ? { ...g, checkedIn: !g.checkedIn } : g))
    );
  };

  const updateGuestRsvp = (id: string, rsvp: 'Attending' | 'Pending' | 'Declined') => {
    setGuestList((prev) =>
      prev.map((g) => (g.id === id ? { ...g, rsvp } : g))
    );
  };

  const addGuest = (guest: Omit<GuestRecord, 'id'>) => {
    const newGuest: GuestRecord = {
      id: `gst-${Date.now()}`,
      ...guest,
    };
    setGuestList((prev) => [newGuest, ...prev]);
  };

  const removeGuest = (id: string) => {
    setGuestList((prev) => prev.filter((g) => g.id !== id));
  };

  // Staff actions
  const setStaffStatus = (id: string, status: 'On Duty' | 'On Break' | 'Scheduled') => {
    setStaffRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const resolveStaffHandover = (id: string) => {
    setStaffRoster((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            shift: s.shift.replace(/\(13h Continuous\)/, '(Handover Assigned / Deputy On Call)'),
            status: 'On Duty',
          };
        }
        return s;
      })
    );

    // Mark scenario 5 as resolved
    setScenarios((prev) =>
      prev.map((sc) => (sc.id === 'sc5' ? { ...sc, resolved: true } : sc))
    );
  };

  const addStaff = (staff: Omit<StaffRecord, 'id'>) => {
    const newStaff: StaffRecord = {
      id: `stf-${Date.now()}`,
      ...staff,
    };
    setStaffRoster((prev) => [...prev, newStaff]);
  };

  // Resolve Scenario
  const resolveScenario = (id: string) => {
    setScenarios((prev) =>
      prev.map((sc) => {
        if (sc.id === id) {
          // Trigger contextual actions based on scenario resolution
          if (sc.resolutionType === 'rebalance_budget') {
            rebalanceBudget();
          } else if (sc.resolutionType === 'redeploy_staff') {
            // Assign handovers to fatigued staff
            setStaffRoster((staff) =>
              staff.map((s) => ({
                ...s,
                shift: s.shift.replace(/\(13h Continuous\)/, '(Handover Assigned / Deputy On Call)'),
              }))
            );
          } else if (sc.resolutionType === 'optimize_seating') {
            // Move Sophia Dubois to Table 01
            setGuestList((guests) =>
              guests.map((g) =>
                g.name.includes('Sophia')
                  ? { ...g, table: 'Table 01 (Hypoallergenic Sanctuary)' }
                  : g
              )
            );
          }
          return { ...sc, resolved: true };
        }
        return sc;
      })
    );
  };

  // Refresh AI Conflicts with live state
  const refreshAiConflicts = async () => {
    setIsLoadingAiConflicts(true);
    try {
      const response = await fetch('/api/ai-conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: eventData.eventType,
          eventName: eventData.eventName,
          honoreeOrHost: eventData.honoreeOrHost,
          guestCount,
          totalBudget,
          city: eventData.venueCity,
          venue: selectedVenue?.name || eventData.venueName,
          remainingReserve,
          shiftHealthScore: shiftHealth.score,
          fatiguedStaff: shiftHealth.fatiguedNames,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.scenarios) && data.scenarios.length > 0) {
          setScenarios(data.scenarios);
        }
      }
    } catch (e) {
      console.warn('AI conflicts refresh error:', e);
    } finally {
      setIsLoadingAiConflicts(false);
    }
  };

  // Reset Demo Data
  const resetDemoData = () => {
    setEventData(INITIAL_EVENT_DATA);
    setExpenses(INITIAL_EXPENSES);
    setCategoryAllocations(INITIAL_ALLOCATIONS);
    setIsRebalanced(false);
    setGuestList(INITIAL_GUEST_LIST);
    setStaffRoster(INITIAL_STAFF_ROSTER);
    setScenarios(INITIAL_SCENARIOS);
    setTurnstileGates(2);
    setSecondsPerGuest(8);
    setActiveScreenIndex(0);
    fetchVenues(INITIAL_EVENT_DATA.venueCity, 450, 65000);
  };

  return (
    <EventContext.Provider
      value={{
        eventData,
        currentUser,
        updateEventData,
        setCurrentUser,
        activeScreenIndex,
        setActiveScreenIndex,
        venues,
        selectedVenue,
        isLoadingVenues,
        venueError,
        fetchVenues,
        selectPrimaryVenue,
        totalBudget,
        expenses,
        categoryAllocations,
        totalSpent,
        remainingReserve,
        costPerGuest,
        addExpense,
        removeExpense,
        rebalanceBudget,
        isRebalanced,
        guestList,
        turnstileGates,
        secondsPerGuest,
        setTurnstileGates,
        setSecondsPerGuest,
        toggleGuestCheckIn,
        updateGuestRsvp,
        addGuest,
        removeGuest,
        totalInvited,
        attendingCount,
        pendingCount,
        declinedCount,
        checkedInCount,
        confirmationRate,
        queueWaitTime,
        throughputPerMinute,
        staffRoster,
        shiftHealth,
        setStaffStatus,
        resolveStaffHandover,
        addStaff,
        scenarios,
        resolveScenario,
        refreshAiConflicts,
        isLoadingAiConflicts,
        resetDemoData,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
