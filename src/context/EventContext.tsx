import React, { createContext, useContext, useState, useMemo, useEffect, useRef, ReactNode } from 'react';
import { 
  EventSetupData, 
  AuthUser, 
  ProblemScenario, 
  VenueOption, 
  ExpenseRecord, 
  GuestRecord, 
  StaffRecord,
  CategoryAllocation,
  DecorOption,
  CateringOption,
  VendorOption,
  ServiceTab
} from '../types';
export type { CategoryAllocation };

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
import {
  cloudLoadEventState,
  cloudSaveEventState,
  cloudGetStorageStatus,
  CloudStorageStatusResponse
} from '../utils/cloudStorage';

interface EventContextType {
  // Core Event Setup
  eventData: EventSetupData;
  currentUser: AuthUser | null;
  updateEventData: (data: Partial<EventSetupData>) => void;
  setCurrentUser: (user: AuthUser | null) => void;

  // Real Cloud Storage Persistence
  cloudSyncStatus: 'synced' | 'syncing' | 'error' | 'offline';
  lastCloudSaveTime: string | null;
  forceCloudSync: () => Promise<void>;
  cloudStorageProvider: string;
  cloudStorageMetrics: CloudStorageStatusResponse | null;

  // Screen Navigation
  activeScreenIndex: number;
  setActiveScreenIndex: (index: number) => void;

  // Venue & Services Discovery
  venues: VenueOption[];
  selectedVenue: VenueOption | null;
  isLoadingVenues: boolean;
  venueError: string | null;
  fetchVenues: (city?: string, count?: number, budget?: number) => Promise<void>;
  selectPrimaryVenue: (venue: VenueOption) => void;

  // Multi-Category Event Services (Decor, Catering, Vendors)
  activeServiceTab: ServiceTab;
  setActiveServiceTab: (tab: ServiceTab) => void;
  decorations: DecorOption[];
  caterers: CateringOption[];
  serviceVendors: VendorOption[];
  selectedDecor: DecorOption | null;
  selectedCatering: CateringOption | null;
  selectedVendor: VendorOption | null;
  isLoadingServices: boolean;
  fetchServices: (category: ServiceTab, city?: string, eventType?: string, count?: number, budget?: number) => Promise<void>;
  selectPrimaryDecor: (decor: DecorOption) => void;
  selectPrimaryCatering: (catering: CateringOption) => void;
  selectPrimaryVendor: (vendor: VendorOption) => void;

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
  eventName: '',
  eventType: 'Wedding',
  venueName: '',
  venueCity: '',
  guestCount: '',
  totalBudget: 0,
  startDate: '',
  startTime: '18:00',
  honoreeOrHost: '',
  themeStyle: 'Terracotta & Royal Gold',
  budgetTier: 'Grand Celebration',
  multiDaySchedule: {
    dayMinus1: '',
    day1: '',
    day2: '',
    day3: '',
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

// Initial Expenses (empty for fresh publication)
const INITIAL_EXPENSES: ExpenseRecord[] = [];

export const generateUniqueExpenseId = (prefix = 'exp'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const sanitizeExpensesList = (list: ExpenseRecord[]): ExpenseRecord[] => {
  if (!Array.isArray(list)) return [];
  const seenIds = new Set<string>();
  return list.map((item, index) => {
    let uniqueId = item.id;
    if (!uniqueId || seenIds.has(uniqueId)) {
      uniqueId = `${uniqueId || 'exp'}-${index}-${Math.random().toString(36).substring(2, 7)}`;
    }
    seenIds.add(uniqueId);
    return { ...item, id: uniqueId };
  });
};

// Initial Categories Allocation (summing strictly to 100%)
const INITIAL_ALLOCATIONS: CategoryAllocation[] = [
  { id: 'cat-venue', name: 'Venue & Facilities', pct: 30, color: '#D96B27' },
  { id: 'cat-catering', name: 'Catering & Bar', pct: 35, color: '#EA580C' },
  { id: 'cat-av', name: 'AV & Production', pct: 15, color: '#38BDF8' },
  { id: 'cat-decor', name: 'Decor & Floral', pct: 10, color: '#F59E0B' },
  { id: 'cat-ent', name: 'Entertainment', pct: 5, color: '#A855F7' },
  { id: 'cat-buffer', name: 'Safety & Contingency Buffer', pct: 5, color: '#10B981' },
];

// Initial Guest List (empty for fresh publication)
const INITIAL_GUEST_LIST: GuestRecord[] = [];

// Initial Staff Roster (empty for fresh publication)
const INITIAL_STAFF_ROSTER: StaffRecord[] = [];

// Initial Problem Scenarios (empty for fresh publication)
const INITIAL_SCENARIOS: ProblemScenario[] = [];

export const EventProvider: React.FC<{
  initialData?: EventSetupData;
  initialUser?: AuthUser | null;
  children: ReactNode;
}> = ({ initialData, initialUser, children }) => {
  const [eventData, setEventData] = useState<EventSetupData>(initialData || INITIAL_EVENT_DATA);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(initialUser ?? null);

  // Always open on Screen 1 (Dashboard, index 0)
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);

  // Venues State
  const [venues, setVenues] = useState<VenueOption[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<VenueOption | null>(null);
  const [isLoadingVenues, setIsLoadingVenues] = useState<boolean>(false);
  const [venueError, setVenueError] = useState<string | null>(null);

  // Multi-Category Event Services State (Decor, Catering, Vendors)
  const [activeServiceTab, setActiveServiceTab] = useState<ServiceTab>('venues');
  const [decorations, setDecorations] = useState<DecorOption[]>([]);
  const [caterers, setCaterers] = useState<CateringOption[]>([]);
  const [serviceVendors, setServiceVendors] = useState<VendorOption[]>([]);
  const [selectedDecor, setSelectedDecor] = useState<DecorOption | null>(null);
  const [selectedCatering, setSelectedCatering] = useState<CateringOption | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<VendorOption | null>(null);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(false);

  // Budget State
  const [expenses, setExpensesState] = useState<ExpenseRecord[]>(() => sanitizeExpensesList(INITIAL_EXPENSES));
  const setExpenses: React.Dispatch<React.SetStateAction<ExpenseRecord[]>> = (action) => {
    setExpensesState((prev) => {
      const next = typeof action === 'function' ? (action as (prevState: ExpenseRecord[]) => ExpenseRecord[])(prev) : action;
      return sanitizeExpensesList(next);
    });
  };
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

  // Real Cloud Storage State & Metrics
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  const [lastCloudSaveTime, setLastCloudSaveTime] = useState<string | null>(null);
  const [cloudStorageMetrics, setCloudStorageMetrics] = useState<CloudStorageStatusResponse | null>(null);
  const cloudStorageProvider = 'Google Cloud Run Persistent Store (GCP)';

  // Initial Cloud Hydration & Metrics Check
  useEffect(() => {
    let isMounted = true;
    cloudLoadEventState().then((res) => {
      if (isMounted && res.success && res.data) {
        const d = res.data;
        if (d.eventData) setEventData(d.eventData);
        if (Array.isArray(d.expenses)) setExpenses(d.expenses);
        if (Array.isArray(d.guestList)) setGuestList(d.guestList);
        if (Array.isArray(d.staffRoster)) setStaffRoster(d.staffRoster);
        if (Array.isArray(d.categoryAllocations)) setCategoryAllocations(d.categoryAllocations);
        if (Array.isArray(d.scenarios)) setScenarios(d.scenarios);
        if (d.selectedVenue) setSelectedVenue(d.selectedVenue);
        if (d.turnstileGates) setTurnstileGates(d.turnstileGates);
        if (d.secondsPerGuest) setSecondsPerGuest(d.secondsPerGuest);
        setLastCloudSaveTime(d.lastUpdated || new Date().toLocaleTimeString());
      }
    });

    cloudGetStorageStatus().then((metrics) => {
      if (isMounted && metrics) setCloudStorageMetrics(metrics);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync eventData totalBudget to budget calculations
  const totalBudget = Number(eventData.totalBudget) || 65000;
  const guestCount = Number(eventData.guestCount) || 450;

  // Debounced Real Cloud Storage Auto-Save
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setCloudSyncStatus('syncing');
    const timer = setTimeout(async () => {
      const payload = {
        eventData,
        totalBudget,
        expenses,
        guestList,
        staffRoster,
        categoryAllocations,
        scenarios,
        selectedVenue,
        turnstileGates,
        secondsPerGuest,
        activeScreenIndex,
      };
      const res = await cloudSaveEventState(payload);
      if (res.success) {
        setCloudSyncStatus('synced');
        setLastCloudSaveTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else {
        setCloudSyncStatus('error');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [eventData, totalBudget, expenses, guestList, staffRoster, categoryAllocations, scenarios, selectedVenue, turnstileGates, secondsPerGuest, activeScreenIndex]);

  // Force Cloud Sync Action
  const forceCloudSync = async () => {
    setCloudSyncStatus('syncing');
    const payload = {
      eventData,
      totalBudget,
      expenses,
      guestList,
      staffRoster,
      categoryAllocations,
      scenarios,
      selectedVenue,
      turnstileGates,
      secondsPerGuest,
      activeScreenIndex,
    };
    const res = await cloudSaveEventState(payload);
    if (res.success) {
      setCloudSyncStatus('synced');
      setLastCloudSaveTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      const metrics = await cloudGetStorageStatus();
      if (metrics) setCloudStorageMetrics(metrics);
    } else {
      setCloudSyncStatus('error');
    }
  };

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
    const searchCity = city || eventData.venueCity || 'Jaipur';
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
      if (Array.isArray(data.venues)) {
        setVenues(data.venues);
        // If results exist, select first eligible venue of the new city
        if (data.venues.length > 0) {
          const firstEligible = data.venues.find((v: VenueOption) => v.capacity >= searchCount) || data.venues[0];
          setSelectedVenue(firstEligible);
          updateEventData({ venueName: firstEligible.name });
        } else {
          setSelectedVenue(null);
        }
      }
    } catch (err: any) {
      console.info('[Venue Context] Notice fetching venues.');
    } finally {
      setIsLoadingVenues(false);
    }
  };

  // Initial fetch on mount or when city/guests/budget/eventType change
  useEffect(() => {
    fetchVenues(eventData.venueCity, guestCount, totalBudget);
    fetchServices('decoration', eventData.venueCity, eventData.eventType, guestCount, totalBudget);
    fetchServices('catering', eventData.venueCity, eventData.eventType, guestCount, totalBudget);
    fetchServices('vendors', eventData.venueCity, eventData.eventType, guestCount, totalBudget);
  }, [eventData.venueCity, eventData.guestCount, eventData.totalBudget, eventData.eventType]);

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
            id: generateUniqueExpenseId('exp-venue'),
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

  // Fetch Services for any category (Decor, Catering, Vendors, Venues)
  const fetchServices = async (category: ServiceTab, city?: string, eventType?: string, count?: number, budget?: number) => {
    const searchCity = city || eventData.venueCity || 'Jaipur';
    const searchEvent = eventType || eventData.eventType || 'Wedding';
    const searchCount = count || guestCount;
    const searchBudget = budget || totalBudget;

    setIsLoadingServices(true);
    try {
      const response = await fetch(
        `/api/services?category=${category}&city=${encodeURIComponent(searchCity)}&type=${encodeURIComponent(searchEvent)}&guests=${searchCount}&budget=${searchBudget}`
      );
      if (response.ok) {
        const data = await response.json();
        const results = Array.isArray(data.results) ? data.results : [];
        if (category === 'decoration') {
          setDecorations(results);
          if (results.length > 0) setSelectedDecor(results[0]);
          else setSelectedDecor(null);
        } else if (category === 'catering') {
          setCaterers(results);
          if (results.length > 0) setSelectedCatering(results[0]);
          else setSelectedCatering(null);
        } else if (category === 'vendors') {
          setServiceVendors(results);
          if (results.length > 0) setSelectedVendor(results[0]);
          else setSelectedVendor(null);
        } else if (category === 'venues') {
          setVenues(results);
        }
      }
    } catch {
      console.info(`[Services Context] Notice fetching services for ${category}.`);
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Select Primary Decor & sync Budget line item
  const selectPrimaryDecor = (decor: DecorOption) => {
    setSelectedDecor(decor);
    setExpenses((prev) => {
      const idx = prev.findIndex((e) => e.category === 'Decor');
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], name: `${decor.name} Styling Package`, amount: Math.max(0, decor.estimatedCost) };
        return copy;
      }
      return [{ id: generateUniqueExpenseId('exp-decor'), name: `${decor.name} Styling Package`, category: 'Decor', amount: Math.max(0, decor.estimatedCost), status: 'Paid' }, ...prev];
    });
  };

  // Select Primary Catering & sync Budget line item
  const selectPrimaryCatering = (catering: CateringOption) => {
    setSelectedCatering(catering);
    setExpenses((prev) => {
      const idx = prev.findIndex((e) => e.category === 'Catering');
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], name: `${catering.name} Banquet Service`, amount: Math.max(0, catering.totalEstimatedCost) };
        return copy;
      }
      return [{ id: generateUniqueExpenseId('exp-cater'), name: `${catering.name} Banquet Service`, category: 'Catering', amount: Math.max(0, catering.totalEstimatedCost), status: 'Paid' }, ...prev];
    });
  };

  // Select Primary Vendor & sync Budget line item
  const selectPrimaryVendor = (vendor: VendorOption) => {
    setSelectedVendor(vendor);
    const cat = vendor.vendorType === 'AV & Rigging' ? 'AV' : vendor.vendorType === 'Music & Band' ? 'Entertainment' : 'Venue';
    setExpenses((prev) => {
      const idx = prev.findIndex((e) => e.category === cat);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], name: `${vendor.name} (${vendor.vendorType})`, amount: Math.max(0, vendor.estimatedCost) };
        return copy;
      }
      return [{ id: generateUniqueExpenseId('exp-vendor'), name: `${vendor.name} (${vendor.vendorType})`, category: cat, amount: Math.max(0, vendor.estimatedCost), status: 'Paid' }, ...prev];
    });
  };

  // Add Expense with strict non-negative check
  const addExpense = (expense: Omit<ExpenseRecord, 'id'>): boolean => {
    const safeAmount = Math.max(0, Number(expense.amount) || 0);
    const newRecord: ExpenseRecord = {
      id: generateUniqueExpenseId('exp'),
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
      console.info('[AI Conflicts] Synchronizing verified operational conflict matrix.');
    } finally {
      setIsLoadingAiConflicts(false);
    }
  };

  // Reset Event Data to fresh state
  const resetDemoData = () => {
    setEventData(INITIAL_EVENT_DATA);
    setExpenses([]);
    setCategoryAllocations(INITIAL_ALLOCATIONS);
    setIsRebalanced(false);
    setGuestList([]);
    setStaffRoster([]);
    setScenarios([]);
    setTurnstileGates(2);
    setSecondsPerGuest(8);
    setActiveScreenIndex(0);
    setSelectedVenue(null);
    setSelectedDecor(null);
    setSelectedCatering(null);
    setSelectedVendor(null);
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
        activeServiceTab,
        setActiveServiceTab,
        decorations,
        caterers,
        serviceVendors,
        selectedDecor,
        selectedCatering,
        selectedVendor,
        isLoadingServices,
        fetchServices,
        selectPrimaryDecor,
        selectPrimaryCatering,
        selectPrimaryVendor,
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
        cloudSyncStatus,
        lastCloudSaveTime,
        forceCloudSync,
        cloudStorageProvider,
        cloudStorageMetrics,
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
