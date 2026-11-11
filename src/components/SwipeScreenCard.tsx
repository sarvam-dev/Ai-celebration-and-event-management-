import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  CheckCircle2,
  Circle,
  Plus,
  Search,
  ExternalLink,
  Building,
  Star,
  ShieldCheck,
  Phone,
  Radio,
  FileText,
  Share2,
  LogOut,
  Power,
  Edit3,
  Sliders,
  PieChart,
  TrendingUp,
  AlertTriangle,
  QrCode,
  Copy,
  ChevronDown,
  ChevronUp,
  Trash2,
  UserCheck,
  Utensils,
  Music,
  Camera,
  Flame,
  Award,
  Layers,
  Heart,
  Send,
  Brain,
  Cpu,
  Zap,
  Scale,
  Activity
} from 'lucide-react';
import { ScreenAISolverWidget } from './ScreenAISolverWidget';
import { AiChatbotScreen } from './AiChatbotScreen';
import { EventSetupData, SWIPE_SCREENS, ProblemScenario, AuthUser } from '../types';

interface SwipeScreenCardProps {
  screenIndex: number;
  eventData?: EventSetupData;
  currentUser?: AuthUser | null;
  onJumpToScreen?: (idx: number) => void;
  onEditSetup?: () => void;
  onLogOut?: () => void;
  onEndEvent?: () => void;
  onUpdateEventData?: (data: Partial<EventSetupData>) => void;
  onResetDemoData?: () => void;
  scenarios?: ProblemScenario[];
  onResolveScenario?: (id: string) => void;
  onOpenAIProblemSolver?: () => void;
}

export const SwipeScreenCard: React.FC<SwipeScreenCardProps> = ({
  screenIndex,
  eventData,
  currentUser,
  onJumpToScreen,
  onEditSetup,
  onLogOut,
  onEndEvent,
  onUpdateEventData,
  onResetDemoData,
  scenarios = [],
  onResolveScenario,
  onOpenAIProblemSolver,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Fallback defaults if eventData is empty
  const currentEvent: EventSetupData = eventData || {
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
    enabledModules: {
      dashboardChecklist: true,
      venueDiscovery: true,
      guestRegistry: true,
      budgetLedger: true,
      staffOps: true,
      eventControls: true,
    },
  };

  const totalBudgetNum = Number(currentEvent.totalBudget) || 65000;
  const guestCountNum = Number(currentEvent.guestCount) || 450;
  const venueLocation = currentEvent.venueCity || 'Metropolis Central';

  // Screen-specific scenario references
  const screen1Scenario = scenarios.find((s) => s.screenTarget === 1);
  const screen2Scenario = scenarios.find((s) => s.screenTarget === 2);
  const screen3Scenario = scenarios.find((s) => s.screenTarget === 3);
  const screen4Scenario = scenarios.find((s) => s.screenTarget === 4);
  const screen5Scenario = scenarios.find((s) => s.screenTarget === 5);
  const screen6Scenario = scenarios.find((s) => s.screenTarget === 6);

  const slideToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const slideToBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  // =========================================================================
  // SCREEN 1: DASHBOARD (Core Details & Checklist)
  // =========================================================================
  const [checklist, setChecklist] = useState([
    { id: '1', title: 'Lock Primary Venue Rental Agreement & Floor Plan', category: 'Venue', done: true, priority: 'High' },
    { id: '2', title: 'Finalize Chef Curated Menu & Dietary Accommodations', category: 'Catering', done: true, priority: 'High' },
    { id: '3', title: 'Audio-Visual Rigging & Wireless Microphone Frequency Check', category: 'AV', done: true, priority: 'High' },
    { id: '4', title: 'Dispatch Digital QR Invitations to VIP Roster', category: 'Guests', done: true, priority: 'Medium' },
    { id: '5', title: 'Terracotta & Royal Gold Floral Staging Confirmation', category: 'Decor', done: false, priority: 'Medium' },
    { id: '6', title: 'Staff Briefing & Emergency Safety SOP Walkthrough', category: 'Staff', done: false, priority: 'High' },
    { id: '7', title: 'Verify Live Streaming 4K NDI Cameras & Redundancy', category: 'AV', done: false, priority: 'Low' },
    { id: '8', title: 'Prepare Celebrant Honoree Keepsakes & Favors', category: 'Hospitality', done: false, priority: 'Medium' },
  ]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [checklistFilter, setChecklistFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    setChecklist((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newChecklistText.trim(),
        category: 'Custom',
        done: false,
        priority: 'Medium',
      },
    ]);
    setNewChecklistText('');
  };

  const completedCount = checklist.filter((i) => i.done).length;
  const progressPercent = Math.round((completedCount / (checklist.length || 1)) * 100);

  // =========================================================================
  // SCREEN 2: VENUE SELECTION (Web Search from Place & Guest Count)
  // =========================================================================
  const [isSearchingVenues, setIsSearchingVenues] = useState(false);
  const [searchLocationQuery, setSearchLocationQuery] = useState(venueLocation);
  const [searchGuestsQuery, setSearchGuestsQuery] = useState(guestCountNum.toString());
  const [selectedVenueId, setSelectedVenueId] = useState<string>('v1');
  const [venueNotification, setVenueNotification] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Venues curated/web-matched dynamically to location and guests
  const initialVenues = [
    {
      id: 'v1',
      name: currentEvent.venueName.includes('Amber') ? currentEvent.venueName : 'The Grand Amber Palace - Crystal Ballroom',
      location: `${venueLocation} • Historic Heritage District`,
      capacity: Math.max(guestCountNum + 50, 500),
      rating: 4.95,
      reviewsCount: 142,
      pricePerDay: Math.round(totalBudgetNum * 0.28),
      perGuestCatering: 110,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      badge: 'Best Match for ' + currentEvent.eventType,
      highlights: ['Chandelier Ballrooms', 'Terracotta Ambient Uplighting', 'Full Commercial Kitchen', 'VIP Valet'],
    },
    {
      id: 'v2',
      name: 'Skyline Luminary Glass Pavilion',
      location: `${venueLocation} • Crown Heights Overlook`,
      capacity: Math.max(guestCountNum + 100, 600),
      rating: 4.88,
      reviewsCount: 98,
      pricePerDay: Math.round(totalBudgetNum * 0.32),
      perGuestCatering: 125,
      image: 'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=800&q=80',
      badge: 'Panoramic City Views',
      highlights: ['360° Glass Atrium', 'Concert-Grade Acoustic Baffles', 'Helipad Access', 'Sunset Terrace'],
    },
    {
      id: 'v3',
      name: 'Solstice Botanical Gardens & Orangerie',
      location: `${venueLocation} • Riverside Arboretum`,
      // Intentionally below guest count to demonstrate capacity validation (Bug 2)
      capacity: Math.min(guestCountNum - 50, 320),
      rating: 4.92,
      reviewsCount: 176,
      pricePerDay: Math.round(totalBudgetNum * 0.24),
      perGuestCatering: 95,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
      badge: 'Lush Botanical Atmosphere',
      highlights: ['Exotic Flora Canopy', 'Natural Skylighting', 'Water Fountains', 'Outdoor Fairy Lights'],
    },
    {
      id: 'v4',
      name: 'The Foundry Modern Industrial Loft',
      location: `${venueLocation} • Arts & Innovation Quarter`,
      capacity: Math.max(guestCountNum + 80, 550),
      rating: 4.82,
      reviewsCount: 84,
      pricePerDay: Math.round(totalBudgetNum * 0.22),
      perGuestCatering: 85,
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      badge: 'Modern Architectural Chic',
      highlights: ['Exposed Brick & Ironwork', '4K Projection Matrix', 'Craft Cocktail Island', 'Soundproof Breakouts'],
    },
  ];

  const [venuesList, setVenuesList] = useState(initialVenues);

  const handleSimulateWebSearch = () => {
    setIsSearchingVenues(true);
    setVenueNotification(null);
    setTimeout(() => {
      setIsSearchingVenues(false);
      setVenueNotification(`Web search completed: 4 verified venues found in ${searchLocationQuery} for ${searchGuestsQuery} guests.`);
    }, 1000);
  };

  const handleSelectVenue = (venue: typeof initialVenues[0]) => {
    if (venue.capacity < guestCountNum) {
      setVenueNotification(`Selection blocked: "${venue.name}" has maximum capacity of ${venue.capacity}, which is below required ${guestCountNum} guests.`);
      return;
    }
    setSelectedVenueId(venue.id);
    onUpdateEventData?.({ venueName: venue.name, venueCity: searchLocationQuery });

    // Update budget's Venue Rental line in central state (Bug 2)
    setExpenses((prev) => {
      const existingIdx = prev.findIndex((e) => e.category === 'Venue Rental & Staging');
      if (existingIdx !== -1) {
        return prev.map((e, idx) =>
          idx === existingIdx
            ? {
                ...e,
                name: `${venue.name} Contract`,
                amount: venue.pricePerDay,
                status: 'Paid',
              }
            : e
        );
      } else {
        return [
          {
            id: `e-venue-${Date.now()}`,
            name: `${venue.name} Contract`,
            category: 'Venue Rental & Staging',
            amount: venue.pricePerDay,
            status: 'Paid',
          },
          ...prev,
        ];
      }
    });

    setVenueNotification(`"${venue.name}" selected as primary venue! Budget Venue Rental line updated to $${venue.pricePerDay.toLocaleString()}.`);
  };

  // =========================================================================
  // SCREEN 3: GUEST MANAGEMENT (Guest list, RSVP, tables, dietary, QR)
  // =========================================================================
  const [guestFilter, setGuestFilter] = useState<'all' | 'attending' | 'pending' | 'declined'>('all');
  const [guestSearch, setGuestSearch] = useState('');
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestTable, setNewGuestTable] = useState('Table 01 - Diamond');
  const [newGuestDiet, setNewGuestDiet] = useState('Standard');
  const [newGuestTier, setNewGuestTier] = useState<'VIP' | 'Regular' | 'Honoree Family'>('VIP');

  const initialGuests = [
    { id: '1', name: 'Lady Genevieve Sterling', rsvp: 'Attending', tier: 'VIP Gold', table: 'Table 01 - Diamond', diet: 'Gluten-Free', checkedIn: true, phone: '+1 (555) 234-8901' },
    { id: '2', name: 'Dr. Marcus Vance & Guest', rsvp: 'Attending', tier: 'Honoree Family', table: 'Table 01 - Diamond', diet: 'Standard', checkedIn: true, phone: '+1 (555) 789-1234' },
    { id: '3', name: 'Ambassador Tariq Al-Mansoor', rsvp: 'Attending', tier: 'Dignitary', table: 'Table 02 - Emerald', diet: 'Halal', checkedIn: false, phone: '+1 (555) 456-7890' },
    { id: '4', name: 'Elena Rostova (Executive Director)', rsvp: 'Attending', tier: 'VIP Gold', table: 'Table 03 - Ruby', diet: 'Vegan', checkedIn: true, phone: '+1 (555) 321-6549' },
    { id: '5', name: 'Sir Kenneth Montgomery', rsvp: 'Pending', tier: 'Patron', table: 'Table 04 - Sapphire', diet: 'Standard', checkedIn: false, phone: '+1 (555) 654-9870' },
    { id: '6', name: 'Cassandra Blake & Party of 4', rsvp: 'Attending', tier: 'VIP Platinum', table: 'Table 05 - Amber', diet: 'Vegetarian', checkedIn: true, phone: '+1 (555) 890-4321' },
    { id: '7', name: 'Arthur Pendelton', rsvp: 'Declined', tier: 'Regular', table: 'Unassigned', diet: 'None', checkedIn: false, phone: '+1 (555) 901-2345' },
    { id: '8', name: 'Sophia & Liam Dubois', rsvp: 'Pending', tier: 'Honoree Family', table: 'Table 02 - Emerald', diet: 'Nut Allergy', checkedIn: false, phone: '+1 (555) 678-3456' },
  ];

  const [guests, setGuests] = useState(initialGuests);

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    setGuests((prev) => [
      {
        id: Date.now().toString(),
        name: newGuestName.trim(),
        rsvp: 'Attending',
        tier: newGuestTier,
        table: newGuestTable,
        diet: newGuestDiet,
        checkedIn: false,
        phone: '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
      },
      ...prev,
    ]);
    setNewGuestName('');
    setShowAddGuestModal(false);
  };

  // Derive all guest metrics from real lists and setup target (Bug 3)
  const totalInvitedGuests = guestCountNum;
  const attendingCount = guests.filter((g) => g.rsvp === 'Attending').length;
  const pendingCount = guests.filter((g) => g.rsvp === 'Pending').length;
  const declinedCount = guests.filter((g) => g.rsvp === 'Declined').length;
  const checkedInCount = guests.filter((g) => g.checkedIn).length;
  const confirmationPctOfInvited = totalInvitedGuests > 0 
    ? ((attendingCount / totalInvitedGuests) * 100).toFixed(1) 
    : '0';

  const toggleCheckIn = (id: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, checkedIn: !g.checkedIn } : g))
    );
  };

  // Turnstile math configuration & gates (Bug 5)
  const [activeGates, setActiveGates] = useState<number>(1);
  const secondsPerGuest = 8;
  const turnstileWaitTimeMinutes = Math.round((guestCountNum * secondsPerGuest) / (activeGates * 60));

  // =========================================================================
  // SCREEN 4: BUDGET MANAGEMENT (Central State & Rebalance)
  // =========================================================================
  const [isBudgetRebalanced, setIsBudgetRebalanced] = useState(false);
  const [expenseError, setExpenseError] = useState<string | null>(null);

  // Categories total strictly 100% in both normal and rebalanced states (Bug 1)
  const budgetCategories = [
    { name: 'Catering, Chef Menus & Bar', pct: 32, icon: Utensils, desc: 'Cocktail hour, 4-course banquet & premium beverages' },
    { name: 'Venue Rental & Staging', pct: 28, icon: Building, desc: 'Main ballroom, outdoor courtyard & dressing suites' },
    { name: 'Decor, Florals & Ambient Design', pct: isBudgetRebalanced ? 9 : 15, icon: Flame, desc: isBudgetRebalanced ? 'AI Elasticity Reallocation (−$3,900 moved to Reserve)' : 'Terracotta centerpieces, canopy drape & archways' },
    { name: 'Audio/Visual, Lighting & Production', pct: 10, icon: Sliders, desc: 'Concert sound system, DMX lighting & 4K screens' },
    { name: 'Photography & Cinematic Video', pct: 7, icon: Camera, desc: '2 lead photographers, drone cinema & highlight film' },
    { name: 'Music, Live Band & Entertainment', pct: 5, icon: Music, desc: 'String quartet reception & 7-piece evening band' },
    { name: 'Contingency & Reserve Fund', pct: isBudgetRebalanced ? 9 : 3, icon: ShieldCheck, desc: isBudgetRebalanced ? 'AI Fortified Safety Buffer (Matches AI Card $4,350)' : 'Emergency backup fund & unforeseen requirements' },
  ];

  const initialExpenses = [
    { id: 'e1', name: 'Grand Amber Palace Initial Deposit', category: 'Venue Rental & Staging', amount: Math.round(totalBudgetNum * 0.15), status: 'Paid' },
    { id: 'e2', name: 'Master Chef Tasting & Food Retainer', category: 'Catering, Chef Menus & Bar', amount: Math.round(totalBudgetNum * 0.12), status: 'Paid' },
    { id: 'e3', name: 'Terracotta Floral Arrangement Package', category: 'Decor, Florals & Ambient Design', amount: Math.round(totalBudgetNum * 0.08), status: 'Pending' },
    { id: 'e4', name: 'Concert Sound & Intelligent Lighting Rig', category: 'Audio/Visual, Lighting & Production', amount: Math.round(totalBudgetNum * 0.06), status: 'Paid' },
  ];

  const [expenses, setExpenses] = useState(initialExpenses);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCat, setNewExpenseCat] = useState(budgetCategories[0].name);

  // Central state formulas: Remaining Reserve = Total Budget - sum(PAID and PENDING)
  const totalSpent = expenses
    .filter((e) => e.status === 'Paid' || e.status === 'Pending')
    .reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = Math.max(0, totalBudgetNum - totalSpent);
  const costPerGuest = Math.round(totalBudgetNum / (guestCountNum || 1));

  // Contingency tile display value: must always match the AI Card reserve (Bug 1)
  const contingencyTileAmount = isBudgetRebalanced ? 4350 : Math.round(totalBudgetNum * 0.03);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    setExpenseError(null);
    const amt = parseFloat(newExpenseAmount);
    if (!newExpenseName.trim()) {
      setExpenseError('Please enter an expense or vendor title.');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      setExpenseError('Negative or zero expenses are strictly prohibited. Amount must be > $0.');
      return;
    }

    setExpenses((prev) => [
      {
        id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: newExpenseName.trim(),
        category: newExpenseCat,
        amount: amt,
        status: 'Pending',
      },
      ...prev,
    ]);
    setNewExpenseName('');
    setNewExpenseAmount('');
  };

  // =========================================================================
  // SCREEN 5: STAFF MANAGEMENT (Roster, Roles, Shifts, Radios & Shift Health)
  // =========================================================================
  const [staffFilter, setStaffFilter] = useState<'all' | 'onduty' | 'scheduled'>('all');
  const initialStaff = [
    { id: 's1', name: 'Marcus Sterling', role: 'Executive Event Producer', dept: 'Production', shift: '12:00 - 00:00', status: 'On Duty', channel: 'CH 1: Ops Master', phone: '+1 (555) 101-2001' },
    { id: 's2', name: 'Chef Julian Moretti', role: 'Executive Head Chef', dept: 'Catering', shift: '14:00 - 23:00', status: 'On Duty', channel: 'CH 2: Hospitality', phone: '+1 (555) 101-2002' },
    { id: 's3', name: 'Sarah Jenkins', role: 'Technical & AV Director', dept: 'Audio/Visual', shift: '13:00 - 23:30', status: 'On Duty', channel: 'CH 3: AV Matrix', phone: '+1 (555) 101-2003' },
    { id: 's4', name: 'Lieutenant David Vance', role: 'Chief Security Officer', dept: 'Security', shift: '16:00 - 01:00', status: 'On Duty', channel: 'CH 4: Security', phone: '+1 (555) 101-2004' },
    { id: 's5', name: 'Camilla Reyes', role: 'VIP Concierge & Lead Host', dept: 'Guest Services', shift: '17:00 - 23:00', status: 'On Duty', channel: 'CH 2: Hospitality', phone: '+1 (555) 101-2005' },
    { id: 's6', name: 'Devon Brooks', role: 'Lighting & DMX Operator', dept: 'Audio/Visual', shift: '16:30 - 00:30', status: 'Scheduled', channel: 'CH 3: AV Matrix', phone: '+1 (555) 101-2006' },
  ];

  const [staffMembers, setStaffMembers] = useState(initialStaff);

  // Shift health calculations (Bug 4)
  const getShiftHours = (shiftStr: string): number => {
    const match = shiftStr.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (!match) return 8;
    let start = parseInt(match[1], 10);
    let end = parseInt(match[3], 10);
    if (end <= start) end += 24;
    return end - start;
  };

  const isStaffFatigued = (staff: typeof initialStaff[0]): boolean => {
    const hours = getShiftHours(staff.shift);
    const hasHandover = staff.shift.includes('Handover') || staff.shift.includes('Deputy');
    return hours >= 12 && !hasHandover && staff.status !== 'On Break';
  };

  const fatiguedStaffList = staffMembers.filter(isStaffFatigued);
  const fatiguedCount = fatiguedStaffList.length;
  // Shift Health must never show 100% while fatigue warning is active (Bug 4)
  const shiftHealthScore = fatiguedCount > 0 
    ? Math.max(48, 80 - (fatiguedCount * 14)) 
    : 100;

  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');
  const [newStaffDept, setNewStaffDept] = useState('Production');
  const [newStaffShift, setNewStaffShift] = useState('16:00 - 00:00');
  const [newStaffChannel, setNewStaffChannel] = useState('CH 1: Ops Master');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffRole.trim()) return;
    setStaffMembers((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newStaffName.trim(),
        role: newStaffRole.trim(),
        dept: newStaffDept,
        shift: newStaffShift,
        status: 'On Duty',
        channel: newStaffChannel,
        phone: '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-0000',
      },
    ]);
    setNewStaffName('');
    setNewStaffRole('');
    setShowAddStaffModal(false);
  };

  const toggleStaffStatus = (id: string) => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'On Duty' ? 'On Break' : 'On Duty' } : s))
    );
  };

  // Reset Demo Data function (Bug 16)
  const handleResetDemoDataLocal = () => {
    setIsBudgetRebalanced(false);
    setSelectedVenueId('v1');
    setExpenses(initialExpenses);
    setGuests(initialGuests);
    setStaffMembers(initialStaff);
    setImageErrors({});
    setActiveGates(1);
    onResetDemoData?.();
    setVenueNotification('Demo data reset to clean verified baseline.');
  };

  // =========================================================================
  // SCREEN 6: EVENT CONTROLS & SETTINGS (End Event, Edit Setup, T&C, Share, Logout)
  // =========================================================================
  const [showEndEventModal, setShowEndEventModal] = useState(false);
  const [eventEnded, setEventEnded] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.origin + '?event=' + encodeURIComponent(currentEvent.eventName));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const confirmEndEvent = () => {
    setEventEnded(true);
    setShowEndEventModal(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-screen overflow-y-auto overscroll-y-contain touch-pan-y bg-[#120E0C] text-[#FAF8F5] pb-32 pt-4 px-4 sm:px-6 lg:px-8 select-text"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Ambient background aura in Claude Terracotta */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-[600px] h-[400px] rounded-full bg-[#D96B27]/10 blur-[150px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[400px] rounded-full bg-[#EA580C]/8 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        {/* Top Screen Identifier Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#181310]/95 border border-[#2E241E] shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D96B27] to-[#EA580C] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#D96B27]/25">
              {screenIndex + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF7A3D] bg-[#D96B27]/15 px-2 py-0.5 rounded-full border border-[#D96B27]/30">
                  SCREEN {screenIndex + 1} OF 6
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  {SWIPE_SCREENS[screenIndex]?.shortTitle}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white mt-0.5">
                {SWIPE_SCREENS[screenIndex]?.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400 bg-[#120E0C] px-3 py-2 rounded-xl border border-[#2A221C]">
            <MapPin className="w-3.5 h-3.5 text-[#D96B27]" />
            <span className="truncate max-w-[180px] sm:max-w-[240px] text-stone-300 font-medium">
              {currentEvent.venueName}
            </span>
          </div>
        </div>

        {/* =========================================================================
            SCREEN 1: DASHBOARD (Core Details & Checklist)
           ========================================================================= */}
        {screenIndex === 0 && (
          <div className="space-y-6">
            {/* Core Details Hero Grid */}
            <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#2A221D]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FF7A3D] mb-1.5">
                    <Sparkles className="w-4 h-4 text-[#D96B27]" />
                    <span className="uppercase">{currentEvent.eventType} MASTER SUMMARY</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentEvent.eventName}
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1">
                    Honoring / Hosted by <span className="text-[#FF7A3D] font-semibold">{currentEvent.honoreeOrHost}</span>
                  </p>
                </div>

                {/* Readiness Percentage Gauge */}
                <div className="flex items-center gap-4 bg-[#120E0C] p-4 rounded-2xl border border-[#2A221C] shrink-0">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-14 h-14 -rotate-90">
                      <circle cx="28" cy="28" r="24" stroke="#2A221C" strokeWidth="5" fill="none" />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="#D96B27"
                        strokeWidth="5"
                        fill="none"
                        strokeDasharray="150"
                        strokeDashoffset={150 - (150 * progressPercent) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    </svg>
                    <span className="absolute font-mono font-bold text-sm text-white">
                      {progressPercent}%
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Event Readiness</span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {completedCount} of {checklist.length} Tasks Complete
                    </span>
                  </div>
                </div>
              </div>

              {/* Core Parameters Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                <div className="p-3.5 rounded-2xl bg-[#120E0C] border border-[#221B16]">
                  <span className="text-[11px] text-stone-400 font-medium block">Target Date & Time</span>
                  <div className="flex items-center gap-1.5 mt-1 text-white font-bold text-xs sm:text-sm">
                    <Calendar className="w-3.5 h-3.5 text-[#D96B27]" />
                    <span>{currentEvent.startDate}</span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400 block mt-0.5">{currentEvent.startTime} Local</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#120E0C] border border-[#221B16]">
                  <span className="text-[11px] text-stone-400 font-medium block">Guest Capacity</span>
                  <div className="flex items-center gap-1.5 mt-1 text-white font-bold text-xs sm:text-sm">
                    <Users className="w-3.5 h-3.5 text-[#D96B27]" />
                    <span>{guestCountNum} Guests</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono block mt-0.5">{attendingCount} Confirmed</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#120E0C] border border-[#221B16]">
                  <span className="text-[11px] text-stone-400 font-medium block">Allocated Budget</span>
                  <div className="flex items-center gap-1.5 mt-1 text-[#FF7A3D] font-mono font-extrabold text-xs sm:text-sm">
                    <DollarSign className="w-3.5 h-3.5 text-[#D96B27]" />
                    <span>${totalBudgetNum.toLocaleString()}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono block mt-0.5">${costPerGuest}/guest</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#120E0C] border border-[#221B16]">
                  <span className="text-[11px] text-stone-400 font-medium block">Theme & Tier</span>
                  <div className="flex items-center gap-1.5 mt-1 text-white font-bold text-xs sm:text-sm truncate">
                    <Award className="w-3.5 h-3.5 text-[#D96B27] shrink-0" />
                    <span className="truncate">{currentEvent.budgetTier}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 truncate block mt-0.5">{currentEvent.themeStyle}</span>
                </div>
              </div>
            </div>

            {/* Screen 1 Embedded AI Logical Problem Solver */}
            {screen1Scenario && (
              <ScreenAISolverWidget
                scenario={screen1Scenario}
                accentTitle="SCREEN 1: AI TIMELINE & CONFLICT AUDITOR"
                onResolve={() => {
                  onResolveScenario?.(screen1Scenario.id);
                  if (!checklist.some((c) => c.id === 'ai-acoustic-clear')) {
                    setChecklist((prev) => [
                      {
                        id: 'ai-acoustic-clear',
                        title: 'AI Solved: Advance Sound Check to 15:45 & Foyer Decibel Gate Lock',
                        category: 'AV & Safety',
                        done: true,
                        priority: 'High',
                      },
                      ...prev,
                    ]);
                  }
                }}
                onOpenModal={onOpenAIProblemSolver}
                metricComparison={{
                  beforeLabel: 'VIP Foyer Decibels (17:15)',
                  beforeValue: '105 dB (High Collision)',
                  afterLabel: 'Post-AI Ambient Foyer',
                  afterValue: '38 dB (Peaceful Protocol)',
                }}
                extraActionLabel="Resolve Timeline Collision"
              />
            )}

            {/* Interactive Master Checklist */}
            <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-6 sm:p-7 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-[#2A221D]">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Master Event Preparation Checklist
                  </h3>
                  <p className="text-xs text-stone-400">
                    Track critical tasks, deliverables, and operational milestones
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-[#120E0C] p-1 rounded-xl border border-[#2A221C]">
                  {(['all', 'pending', 'completed'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setChecklistFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                        checklistFilter === filter
                          ? 'bg-[#D96B27] text-white shadow-sm'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add New Checklist Item Form */}
              <form onSubmit={handleAddChecklist} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  placeholder="Add a new checklist task or preparation milestone..."
                  className="flex-1 px-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#D96B27]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#D96B27] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#D96B27]/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </form>

              {/* Checklist Items */}
              <div className="space-y-2.5">
                {checklist
                  .filter((item) => {
                    if (checklistFilter === 'pending') return !item.done;
                    if (checklistFilter === 'completed') return item.done;
                    return true;
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        item.done
                          ? 'bg-[#14100E] border-[#251D18] opacity-70'
                          : 'bg-[#1B1512] border-[#2E241E] hover:border-[#D96B27]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                            item.done
                              ? 'bg-emerald-500 text-white'
                              : 'border-2 border-stone-600 hover:border-[#D96B27]'
                          }`}
                        >
                          {item.done && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            item.done ? 'line-through text-stone-500' : 'text-stone-200'
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#120E0C] text-stone-400 border border-[#2A221C]">
                          {item.category}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            item.priority === 'High'
                              ? 'bg-red-950/60 text-red-300 border border-red-800/40'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 2: VENUE SELECTION (Live Web Search for Location + Guest Count)
           ========================================================================= */}
        {screenIndex === 1 && (
          <div className="space-y-6">
            {/* Search Controls Header */}
            <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-6 sm:p-7 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-[#2A221D]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FF7A3D] mb-1">
                    <Search className="w-3.5 h-3.5 text-[#D96B27]" />
                    <span>SMART VENUE DISCOVERY ENGINE</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Venue Search for {searchLocationQuery} ({searchGuestsQuery} Guests)
                  </h3>
                  <p className="text-xs text-stone-400">
                    Live web matched venues based on your event place, capacity requirements, and budget
                  </p>
                </div>

                <button
                  onClick={handleSimulateWebSearch}
                  disabled={isSearchingVenues}
                  className="px-5 py-3 rounded-2xl bg-[#D96B27] hover:bg-[#EA580C] disabled:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#D96B27]/25 transition-all"
                >
                  <Search className={`w-4 h-4 ${isSearchingVenues ? 'animate-spin' : ''}`} />
                  <span>{isSearchingVenues ? 'Searching Web...' : 'Refresh Web Search'}</span>
                </button>
              </div>

              {/* Location & Guest Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Target City / Place
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#D96B27] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchLocationQuery}
                      onChange={(e) => setSearchLocationQuery(e.target.value)}
                      placeholder="e.g. Metropolis Central, New York, London..."
                      className="w-full pl-10 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#D96B27]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Required Guest Capacity
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-[#D96B27] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={searchGuestsQuery}
                      onChange={(e) => setSearchGuestsQuery(e.target.value)}
                      placeholder="450"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#D96B27]"
                    />
                  </div>
                </div>
              </div>

              {/* Search notification alert */}
              {venueNotification && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{venueNotification}</span>
                </div>
              )}
            </div>

            {/* Screen 2 Embedded AI Spatial & Capacity Solver */}
            {screen2Scenario && (
              <ScreenAISolverWidget
                scenario={screen2Scenario}
                accentTitle="SCREEN 2: AI SPATIAL GEOMETRY & FLOW SOLVER"
                onResolve={() => {
                  onResolveScenario?.(screen2Scenario.id);
                  setVenueNotification('AI Logical Resolution applied: Synchronized Butler Plated Service selected. Ballroom aisle width increased from 3.2 ft to 6.2 ft.');
                }}
                onOpenModal={onOpenAIProblemSolver}
                metricComparison={{
                  beforeLabel: 'Egress Aisle Clearance',
                  beforeValue: '3.2 ft (Choke-Point Risk)',
                  afterLabel: 'Post-AI Plated Layout',
                  afterValue: '6.2 ft (Certified Flow)',
                }}
                extraActionLabel="Optimize Spatial Geometry"
              />
            )}

            {/* Curated Web Search Venues List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {venuesList.map((venue) => {
                const isSelected = selectedVenueId === venue.id;
                const isUnderCapacity = venue.capacity < guestCountNum;
                const budgetFitPct = ((venue.pricePerDay / totalBudgetNum) * 100).toFixed(1);
                const hasImgError = !!imageErrors[venue.id];

                return (
                  <div
                    key={venue.id}
                    className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all shadow-xl ${
                      isSelected
                        ? 'bg-[#221A15] border-[#D96B27] shadow-[#D96B27]/15 ring-1 ring-[#D96B27]'
                        : 'bg-[#181310]/95 border-[#2E241E] hover:border-stone-600'
                    }`}
                  >
                    <div>
                      {/* Photo Header with onError Fallback */}
                      <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                        {hasImgError ? (
                          <div className="w-full h-full bg-gradient-to-br from-[#2E2018] via-[#1D1612] to-[#120E0C] flex flex-col items-center justify-center p-4 text-center">
                            <Building className="w-8 h-8 text-[#D96B27] mb-2 opacity-80" />
                            <span className="text-sm font-bold text-white line-clamp-1">{venue.name}</span>
                            <span className="text-xs text-stone-400 mt-0.5">{venue.location}</span>
                          </div>
                        ) : (
                          <img
                            src={venue.image}
                            alt={venue.name}
                            onError={() => setImageErrors((prev) => ({ ...prev, [venue.id]: true }))}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#120E0C] via-transparent to-black/40 pointer-events-none" />

                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#D96B27] text-white shadow-md">
                          {venue.badge}
                        </div>

                        {isUnderCapacity && (
                          <div className="absolute top-11 left-3 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-red-950/90 text-red-300 border border-red-700/80 shadow-md">
                            Under capacity ({venue.capacity} &lt; {guestCountNum})
                          </div>
                        )}

                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-amber-300 flex items-center gap-1 border border-amber-500/30">
                          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                          <span>{venue.rating}</span>
                          <span className="text-xs text-stone-400">({venue.reviewsCount})</span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-200">
                          <span className="flex items-center gap-1 drop-shadow-md">
                            <MapPin className="w-3.5 h-3.5 text-[#FF7A3D]" />
                            {venue.location}
                          </span>
                          <span
                            className={`font-mono px-2 py-0.5 rounded text-xs ${
                              isUnderCapacity
                                ? 'bg-red-950/80 text-red-300 font-bold border border-red-800'
                                : 'bg-black/60 text-emerald-400'
                            }`}
                          >
                            Cap: {venue.capacity} Guests
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                            {venue.name}
                          </h4>
                        </div>

                        {/* Pricing and Budget Fit (Computed from rent ÷ total budget) */}
                        <div className="p-3 rounded-xl bg-[#120E0C] border border-[#221B16] flex items-center justify-between">
                          <div>
                            <span className="text-xs font-mono text-stone-400 uppercase">Estimated Rental</span>
                            <div className="text-base font-extrabold font-mono text-[#FF7A3D]">
                              ${venue.pricePerDay.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono text-stone-400 uppercase">Budget Fit</span>
                            <div className="text-xs font-bold text-emerald-400">
                              {budgetFitPct}% of budget
                            </div>
                          </div>
                        </div>

                        {/* Highlights */}
                        <div className="flex flex-wrap gap-1.5">
                          {venue.highlights.map((h, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#1F1814] text-stone-300 border border-[#2E241E]"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button: Disabled if under capacity */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => handleSelectVenue(venue)}
                        disabled={isUnderCapacity}
                        className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                          isUnderCapacity
                            ? 'bg-stone-900 border border-stone-800 text-stone-500 cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 cursor-pointer'
                            : 'bg-[#D96B27] hover:bg-[#EA580C] text-white shadow-md shadow-[#D96B27]/20 cursor-pointer'
                        }`}
                      >
                        {isUnderCapacity ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span>Under Capacity (Max {venue.capacity} &lt; {guestCountNum})</span>
                          </>
                        ) : isSelected ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Selected Primary Venue</span>
                          </>
                        ) : (
                          <>
                            <Building className="w-4 h-4" />
                            <span>Select as Primary Venue</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 3: GUEST MANAGEMENT (Guest list, RSVP, tables, diet, QR)
           ========================================================================= */}
        {screenIndex === 2 && (
          <div className="space-y-6">
            {/* Guest Summary Stat Cards (Bug 3) */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-[#181310]/95 border border-[#2E241E] rounded-2xl p-4 shadow-xl">
                  <span className="text-xs text-stone-400 font-medium">Total Invited</span>
                  <div className="text-2xl font-black font-mono text-white mt-1">
                    {totalInvitedGuests}
                  </div>
                  <span className="text-xs text-stone-400 font-mono mt-0.5 block">Setup Target</span>
                </div>

                <div className="bg-[#181310]/95 border border-[#2E241E] rounded-2xl p-4 shadow-xl">
                  <span className="text-xs text-stone-400 font-medium">Attending (RSVP)</span>
                  <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                    {attendingCount}
                  </div>
                  <span className="text-xs text-emerald-400 font-mono mt-0.5 block">
                    {confirmationPctOfInvited}% of Invited
                  </span>
                </div>

                <div className="bg-[#181310]/95 border border-[#2E241E] rounded-2xl p-4 shadow-xl">
                  <span className="text-xs text-stone-400 font-medium">Pending Response</span>
                  <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                    {pendingCount}
                  </div>
                  <span className="text-xs text-amber-400 font-mono mt-0.5 block">Awaiting RSVP</span>
                </div>

                <div className="bg-[#181310]/95 border border-[#2E241E] rounded-2xl p-4 shadow-xl">
                  <span className="text-xs text-stone-400 font-medium">Declined</span>
                  <div className="text-2xl font-black font-mono text-rose-400 mt-1">
                    {declinedCount}
                  </div>
                  <span className="text-xs text-rose-400 font-mono mt-0.5 block">Regrets Sent</span>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-[#181310]/95 border border-[#2E241E] rounded-2xl p-4 shadow-xl">
                  <span className="text-xs text-stone-400 font-medium">Checked-In at Door</span>
                  <div className="text-2xl font-black font-mono text-[#FF7A3D] mt-1">
                    {checkedInCount}
                  </div>
                  <span className="text-xs text-stone-300 font-mono mt-0.5 block">Live Turnstile</span>
                </div>
              </div>

              {/* Sample Subset Clarification Badge */}
              <div className="px-3.5 py-1.5 rounded-xl bg-[#14100E] border border-[#221B16] flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>Confirmation rate: <strong className="text-emerald-400 font-bold">{confirmationPctOfInvited}%</strong> ({attendingCount} attending ÷ {totalInvitedGuests} invited)</span>
                <span className="text-stone-300">Registry list displays sample cohort of {guests.length} records</span>
              </div>

              {/* Turnstile Queue Math Formula Box (Bug 5) */}
              <div className="p-4 rounded-2xl bg-[#120E0C] border border-[#2A221C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FF7A3D]">
                    <Clock className="w-4 h-4 text-[#D96B27]" />
                    <span className="font-bold">EXPLICIT TURNSTILE QUEUE MATHEMATICS</span>
                  </div>
                  <div className="text-xs sm:text-sm text-stone-300 font-mono mt-1">
                    ({guestCountNum} guests × {secondsPerGuest}s/guest) ÷ ({activeGates} gate{activeGates > 1 ? 's' : ''} × 60s) = <span className="text-[#FF7A3D] font-bold text-sm sm:text-base">{turnstileWaitTimeMinutes} mins wait time</span>
                  </div>
                  <span className="text-xs text-stone-300 mt-0.5 block">
                    Throughput: {Math.round((activeGates * 60) / secondsPerGuest)} guests/min across {activeGates} active turnstile gate{activeGates > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-stone-300 font-medium">Active Gates:</span>
                  <button
                    type="button"
                    onClick={() => setActiveGates(1)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeGates === 1
                        ? 'bg-[#D96B27] text-white shadow-md shadow-[#D96B27]/30'
                        : 'bg-[#181310] text-stone-400 border border-[#2A221C] hover:text-white'
                    }`}
                  >
                    1 Gate ({Math.round((guestCountNum * secondsPerGuest) / (1 * 60))}m)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGates(2)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeGates === 2
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-[#181310] text-stone-400 border border-[#2A221C] hover:text-white'
                    }`}
                  >
                    2 Gates ({Math.round((guestCountNum * secondsPerGuest) / (2 * 60))}m)
                  </button>
                </div>
              </div>
            </div>

            {/* Screen 3 Embedded AI Seating & Allergen Solver */}
            {screen3Scenario && (
              <ScreenAISolverWidget
                scenario={screen3Scenario}
                accentTitle="SCREEN 3: AI SEATING & ALLERGEN SOLVER"
                onResolve={() => {
                  onResolveScenario?.(screen3Scenario.id);
                  setGuests((prev) =>
                    prev.map((g) =>
                      g.id === '8'
                        ? { ...g, table: 'Table 01 - Diamond (Hypoallergenic Pod)', diet: 'Nut Allergy (Safe Partition)' }
                        : g
                    )
                  );
                }}
                onOpenModal={onOpenAIProblemSolver}
                metricComparison={{
                  beforeLabel: 'Table 02 Allergen Risk',
                  beforeValue: '88% (Praline Corridor)',
                  afterLabel: 'Hypoallergenic Safe Pod',
                  afterValue: '0% Exposure (Certified)',
                }}
                extraActionLabel="Isolate Allergen Risk"
              />
            )}

            {/* Guest Directory & Actions */}
            <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-6 sm:p-7 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-[#2A221D]">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Guest Registry & Seating Roster
                  </h3>
                  <p className="text-xs text-stone-400">
                    Manage RSVPs, table assignments, and dietary requirements
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddGuestModal(true)}
                    className="px-4 py-2 bg-[#D96B27] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#D96B27]/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Guest</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
                <div className="relative w-full sm:flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={guestSearch}
                    onChange={(e) => setGuestSearch(e.target.value)}
                    placeholder="Search by guest name, table, or dietary tag..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs text-white focus:outline-none focus:border-[#D96B27]"
                  />
                </div>

                <div className="flex items-center gap-1 bg-[#120E0C] p-1 rounded-xl border border-[#2A221C] w-full sm:w-auto">
                  {(['all', 'attending', 'pending', 'declined'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setGuestFilter(filter)}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        guestFilter === filter
                          ? 'bg-[#D96B27] text-white'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest List Items */}
              <div className="divide-y divide-[#241D17]">
                {guests
                  .filter((g) => {
                    const matchesFilter =
                      guestFilter === 'all' || g.rsvp.toLowerCase() === guestFilter.toLowerCase();
                    const matchesSearch =
                      g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
                      g.table.toLowerCase().includes(guestSearch.toLowerCase()) ||
                      g.diet.toLowerCase().includes(guestSearch.toLowerCase());
                    return matchesFilter && matchesSearch;
                  })
                  .map((guest) => (
                    <div
                      key={guest.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm sm:text-base">
                            {guest.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D96B27]/15 text-[#FF7A3D] border border-[#D96B27]/30">
                            {guest.tier}
                          </span>
                          {guest.checkedIn && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              Checked In
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 mt-1">
                          <span className="text-stone-300 font-medium">{guest.table}</span>
                          <span>•</span>
                          <span className="text-amber-300/90 font-mono">Diet: {guest.diet}</span>
                          <span>•</span>
                          <span className="font-mono text-stone-500">{guest.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-auto">
                        <span
                          className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                            guest.rsvp === 'Attending'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : guest.rsvp === 'Pending'
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                              : 'bg-red-950/60 text-red-400 border border-red-800/40'
                          }`}
                        >
                          {guest.rsvp}
                        </span>

                        <button
                          onClick={() => toggleCheckIn(guest.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            guest.checkedIn
                              ? 'bg-stone-800 text-stone-400 hover:text-white'
                              : 'bg-[#D96B27] text-white hover:bg-[#EA580C]'
                          }`}
                        >
                          {guest.checkedIn ? 'Undo Check-In' : 'Door Check-In'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Modal for adding guest */}
            <AnimatePresence>
              {showAddGuestModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md bg-[#181310] border border-[#2E241E] rounded-3xl p-6 shadow-2xl"
                  >
                    <h3 className="text-lg font-bold text-white mb-4">Add Guest to Registry</h3>
                    <form onSubmit={handleAddGuest} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-300 mb-1">Guest Full Name</label>
                        <input
                          type="text"
                          required
                          value={newGuestName}
                          onChange={(e) => setNewGuestName(e.target.value)}
                          placeholder="e.g. Lord Alistair Croft"
                          className="w-full px-3.5 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs text-white focus:outline-none focus:border-[#D96B27]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-stone-300 mb-1">Tier</label>
                          <select
                            value={newGuestTier}
                            onChange={(e) => setNewGuestTier(e.target.value as any)}
                            className="w-full px-3 py-2 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs text-white focus:outline-none focus:border-[#D96B27]"
                          >
                            <option value="VIP">VIP</option>
                            <option value="Honoree Family">Honoree Family</option>
                            <option value="Regular">Regular</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-stone-300 mb-1">Seating Table</label>
                          <input
                            type="text"
                            value={newGuestTable}
                            onChange={(e) => setNewGuestTable(e.target.value)}
                            placeholder="Table 01 - Diamond"
                            className="w-full px-3 py-2 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs text-white focus:outline-none focus:border-[#D96B27]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-300 mb-1">Dietary Requirement</label>
                        <input
                          type="text"
                          value={newGuestDiet}
                          onChange={(e) => setNewGuestDiet(e.target.value)}
                          placeholder="Standard, Vegan, Halal, Gluten-Free..."
                          className="w-full px-3.5 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs text-white focus:outline-none focus:border-[#D96B27]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddGuestModal(false)}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-[#D96B27] hover:bg-[#EA580C] text-white text-xs font-bold shadow-md shadow-[#D96B27]/25"
                        >
                          Confirm & Add
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* =========================================================================
            SCREEN 4: BUDGET MANAGEMENT (Intelligent Division of Total Budget)
           ========================================================================= */}
        {screenIndex === 3 && (
          <div className="space-y-6">
            {/* Total Budget Header Card */}
            <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-6 sm:p-7 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A221D]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FF7A3D] mb-1">
                    <PieChart className="w-4 h-4 text-[#D96B27]" />
                    <span>INTELLIGENT BUDGET ALLOCATION ENGINE</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Total Event Budget: ${totalBudgetNum.toLocaleString()} USD
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Subdivided dynamically across Catering, Venue, Decor, AV, Video, and Contingency
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-[#120E0C] p-4 rounded-2xl border border-[#2A221C] shrink-0">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase block">Remaining Reserve</span>
                    <span className="text-xl font-black font-mono text-emerald-400">
                      ${remainingBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-l border-stone-800 pl-3">
                    <span className="text-[10px] font-mono text-stone-400 uppercase block">Per Guest</span>
                    <span className="text-xl font-black font-mono text-[#FF7A3D]">
                      ${costPerGuest}
                    </span>
                  </div>
                </div>
              </div>

              {/* Segmented Color Bar of Budget Division (Percentages strictly total 100%) */}
              <div className="pt-6">
                <div className="flex items-center justify-between text-xs text-stone-400 font-mono mb-2">
                  <span>Automated Budget Breakdown (100% Total) {isBudgetRebalanced && <strong className="text-emerald-400 ml-1">• AI Rebalanced</strong>}</span>
                  <span>Target: {guestCountNum} Guests</span>
                </div>
                <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner bg-stone-900">
                  <div style={{ width: '32%' }} className="bg-amber-600 h-full" title="Catering: 32%" />
                  <div style={{ width: '28%' }} className="bg-[#D96B27] h-full" title="Venue: 28%" />
                  <div style={{ width: isBudgetRebalanced ? '9%' : '15%' }} className="bg-rose-500 h-full transition-all duration-500" title={`Decor: ${isBudgetRebalanced ? 9 : 15}%`} />
                  <div style={{ width: '10%' }} className="bg-cyan-500 h-full" title="AV: 10%" />
                  <div style={{ width: '7%' }} className="bg-purple-500 h-full" title="Photo/Video: 7%" />
                  <div style={{ width: '5%' }} className="bg-indigo-500 h-full" title="Music: 5%" />
                  <div style={{ width: isBudgetRebalanced ? '9%' : '3%' }} className="bg-emerald-500 h-full transition-all duration-500" title={`Contingency: ${isBudgetRebalanced ? 9 : 3}%`} />
                </div>
              </div>

              {/* Budget Allocation Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-6">
                {budgetCategories.map((cat, idx) => {
                  const allocatedAmount = cat.name === 'Contingency & Reserve Fund' 
                    ? contingencyTileAmount 
                    : Math.round(totalBudgetNum * (cat.pct / 100));
                  const Icon = cat.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#120E0C] border border-[#221B16] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#201814] border border-[#352720] flex items-center justify-center text-[#D96B27]">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-white truncate max-w-[150px]">
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#FF7A3D]">
                          {cat.pct}%
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-lg font-black font-mono text-white">
                          ${allocatedAmount.toLocaleString()}
                        </span>
                        <span className="text-xs font-mono text-stone-400">
                          ~${Math.round(allocatedAmount / (guestCountNum || 1))}/guest
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 line-clamp-1">{cat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Screen 4 Embedded AI Budget Deficit & Elasticity Solver */}
            {screen4Scenario && (
              <ScreenAISolverWidget
                scenario={screen4Scenario}
                accentTitle="SCREEN 4: AI BUDGET ELASTICITY & DEFICIT SOLVER"
                onResolve={() => {
                  onResolveScenario?.(screen4Scenario.id);
                  // Never log negative expenses; show as reallocation between categories without changing total spent (Bug 1)
                  setIsBudgetRebalanced(true);
                }}
                onOpenModal={onOpenAIProblemSolver}
                metricComparison={{
                  beforeLabel: 'Contingency Safety Fund',
                  beforeValue: '$1,950 (3.0% Standard)',
                  afterLabel: 'Rebalanced Contingency',
                  afterValue: '$4,350 (6.7% Fortified)',
                }}
                extraActionLabel="Auto-Rebalance Budget"
              />
            )}

            {/* Expenses Tracker & Add Expense */}
            <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-6 sm:p-7 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-[#2A221D]">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Committed Expenses & Ledger
                  </h3>
                  <p className="text-xs text-stone-400">
                    Track actual vendor deposits, contracts, and payment milestones (strictly positive amounts)
                  </p>
                </div>
                <span className="text-xs font-mono text-[#FF7A3D] bg-[#D96B27]/10 px-3 py-1 rounded-full border border-[#D96B27]/30">
                  Total Committed: ${totalSpent.toLocaleString()}
                </span>
              </div>

              {/* Expense Error Alert (Bug 1, 16) */}
              {expenseError && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{expenseError}</span>
                </div>
              )}

              {/* Add Expense Form */}
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-5">
                <input
                  type="text"
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)}
                  placeholder="Expense / Vendor Item..."
                  className="sm:col-span-2 px-3.5 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs text-white focus:outline-none focus:border-[#D96B27]"
                />
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  placeholder="Amount ($ > 0)"
                  className="px-3.5 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs text-white focus:outline-none focus:border-[#D96B27]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#D96B27] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#D96B27]/25 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Expense</span>
                </button>
              </form>

              {/* Expense Table */}
              <div className="divide-y divide-[#241D17]">
                {expenses.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-white block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs sm:text-sm font-mono font-bold text-white">
                        ${item.amount.toLocaleString()}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          item.status === 'Paid'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 5: STAFF MANAGEMENT (Roster, Roles, Shifts, Radios)
           ========================================================================= */}
        {screenIndex === 4 && (
          <div className="space-y-6">
            {/* Staff Department Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-4 sm:p-5 shadow-xl">
                <span className="text-[11px] text-stone-400 font-medium">Total Crew</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-1">
                  {staffMembers.length} Active
                </div>
                <span className="text-[10px] text-stone-500 font-mono mt-1 block">Full Coverage</span>
              </div>

              <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-4 sm:p-5 shadow-xl">
                <span className="text-[11px] text-stone-400 font-medium">On Duty Now</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-1">
                  {staffMembers.filter((s) => s.status === 'On Duty').length}
                </div>
                <span className="text-[10px] text-emerald-500 font-mono mt-1 block">Live at Station</span>
              </div>

              <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-4 sm:p-5 shadow-xl">
                <span className="text-[11px] text-stone-400 font-medium">Radio Channels</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-[#FF7A3D] mt-1">
                  4 Channels
                </div>
                <span className="text-[10px] text-stone-400 font-mono mt-1 block">100% Encrypted</span>
              </div>

              <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-4 sm:p-5 shadow-xl">
                <span className="text-xs text-stone-400 font-medium">Shift Health</span>
                <div className={`text-2xl sm:text-3xl font-black font-mono mt-1 ${shiftHealthScore === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {shiftHealthScore}%
                </div>
                <span className={`text-xs font-mono mt-1 block ${fatiguedCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {fatiguedCount > 0 ? `${fatiguedCount} Fatigue Risk Active` : '100% Roster Balance'}
                </span>
              </div>
            </div>

            {/* Screen 5 Embedded AI Shift Fatigue & Bottleneck Solver */}
            {screen5Scenario && (
              <ScreenAISolverWidget
                scenario={screen5Scenario}
                accentTitle="SCREEN 5: AI SHIFT FATIGUE & TURNSTILE SOLVER"
                onResolve={() => {
                  onResolveScenario?.(screen5Scenario.id);
                  setActiveGates(2);
                  setStaffMembers((prev) =>
                    prev.map((s) => {
                      if (s.id === 's6') {
                        return {
                          ...s,
                          role: 'Dual-Gate Ingress Check-in & Lighting Lead',
                          shift: '16:30 - 00:30 (Peak Gate 17:30-18:30)',
                          status: 'On Duty',
                        };
                      }
                      if (s.id === 's1') {
                        return {
                          ...s,
                          shift: '12:00 - 00:00 (18:30 Deputy Handover)',
                        };
                      }
                      return s;
                    })
                  );
                }}
                onOpenModal={onOpenAIProblemSolver}
                metricComparison={{
                  beforeLabel: 'Turnstile Queue Time',
                  beforeValue: `${Math.round((guestCountNum * secondsPerGuest) / (1 * 60))} mins (1 Gate)`,
                  afterLabel: 'Dual-Gate Queue Time',
                  afterValue: `${Math.round((guestCountNum * secondsPerGuest) / (2 * 60))} mins (2 Gates)`,
                }}
                extraActionLabel="Deploy Dual-Gate Ingress & Handover"
              />
            )}

            {/* Staff Operations Console */}
            <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-6 sm:p-7 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-[#2A221D]">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Event Staff Roster & Duty Stations
                  </h3>
                  <p className="text-xs text-stone-400">
                    Coordinate coordinators, banquet captains, AV engineers, and security
                  </p>
                </div>

                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-4 py-2 bg-[#D96B27] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#D96B27]/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign Staff</span>
                </button>
              </div>

              {/* Roster Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staffMembers.map((staff) => {
                  const isFatigued = isStaffFatigued(staff);
                  return (
                    <div
                      key={staff.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                        isFatigued
                          ? 'bg-[#1C120E] border-amber-800/80 shadow-md shadow-amber-950/40'
                          : 'bg-[#120E0C] border-[#251D18]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{staff.name}</span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#D96B27]/15 text-[#FF7A3D] border border-[#D96B27]/30">
                              {staff.dept}
                            </span>
                          </div>
                          <span className="text-xs text-stone-300 font-medium block mt-0.5">
                            {staff.role}
                          </span>
                          {isFatigued && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-300 font-mono bg-amber-950/70 border border-amber-800 px-2 py-0.5 rounded-md">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Fatigue Alert: 12h+ continuous shift scheduled</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => toggleStaffStatus(staff.id)}
                          className={`text-xs font-mono px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                            staff.status === 'On Duty'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {staff.status}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-[#201814]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#D96B27]" />
                          <span className="font-mono text-xs">{staff.shift}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-stone-300 font-mono text-xs">
                          <Radio className="w-3.5 h-3.5 text-[#FF7A3D]" />
                          <span>{staff.channel}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal for adding staff */}
            <AnimatePresence>
              {showAddStaffModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md bg-[#181310] border border-[#2E241E] rounded-3xl p-6 shadow-2xl"
                  >
                    <h3 className="text-lg font-bold text-white mb-4">Assign Staff Member</h3>
                    <form onSubmit={handleAddStaff} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-300 mb-1">Staff Member Name</label>
                        <input
                          type="text"
                          required
                          value={newStaffName}
                          onChange={(e) => setNewStaffName(e.target.value)}
                          placeholder="e.g. Rachel Sterling"
                          className="w-full px-3.5 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs text-white focus:outline-none focus:border-[#D96B27]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-stone-300 mb-1">Department</label>
                          <select
                            value={newStaffDept}
                            onChange={(e) => setNewStaffDept(e.target.value)}
                            className="w-full px-3 py-2 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs text-white focus:outline-none focus:border-[#D96B27]"
                          >
                            <option value="Production">Production</option>
                            <option value="Catering">Catering</option>
                            <option value="Audio/Visual">Audio/Visual</option>
                            <option value="Security">Security</option>
                            <option value="Guest Services">Guest Services</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-stone-300 mb-1">Role Title</label>
                          <input
                            type="text"
                            required
                            value={newStaffRole}
                            onChange={(e) => setNewStaffRole(e.target.value)}
                            placeholder="e.g. Lead Host"
                            className="w-full px-3 py-2 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs text-white focus:outline-none focus:border-[#D96B27]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-stone-300 mb-1">Shift Hours</label>
                          <input
                            type="text"
                            value={newStaffShift}
                            onChange={(e) => setNewStaffShift(e.target.value)}
                            placeholder="16:00 - 00:00"
                            className="w-full px-3 py-2 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs text-white focus:outline-none focus:border-[#D96B27]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-stone-300 mb-1">Radio Channel</label>
                          <select
                            value={newStaffChannel}
                            onChange={(e) => setNewStaffChannel(e.target.value)}
                            className="w-full px-3 py-2 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs text-white focus:outline-none focus:border-[#D96B27]"
                          >
                            <option value="CH 1: Ops Master">CH 1: Ops Master</option>
                            <option value="CH 2: Hospitality">CH 2: Hospitality</option>
                            <option value="CH 3: AV Matrix">CH 3: AV Matrix</option>
                            <option value="CH 4: Security">CH 4: Security</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddStaffModal(false)}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-[#D96B27] hover:bg-[#EA580C] text-white text-xs font-bold shadow-md shadow-[#D96B27]/25"
                        >
                          Confirm Assignment
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* =========================================================================
            SCREEN 6: EVENT CONTROLS & SETTINGS (End Event, Edit Setup, T&C, Share, Logout)
           ========================================================================= */}
        {screenIndex === 5 && (
          <div className="space-y-6">
            {/* Master Control Center Header */}
            <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-6 sm:p-7 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A221D]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FF7A3D] mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#D96B27]" />
                    <span>EVENT OPERATIONS COMMAND ROOM</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Event Controls, Governance & Settings
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    End event safely, revise setup configuration, share invites, review legal agreements, and sign out
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>EVENT ACTIVE • PRODUCTION MODE</span>
                </div>
              </div>

              {/* Screen 6 Embedded AI Post-Event Shutdown & Curfew Solver */}
              {screen6Scenario && (
                <div className="pt-6">
                  <ScreenAISolverWidget
                    scenario={screen6Scenario}
                    accentTitle="SCREEN 6: AI SAFE SHUTDOWN & DEBRIEF LOGIC"
                    onResolve={() => {
                      onResolveScenario?.(screen6Scenario.id);
                    }}
                    onOpenModal={onOpenAIProblemSolver}
                    metricComparison={{
                      beforeLabel: 'Overtime Curfew Risk',
                      beforeValue: '$1,200/hr (Truss Strike Delay)',
                      afterLabel: 'Post-AI Staged Migration',
                      afterValue: '$0 Penalties (Safe Strike)',
                    }}
                    extraActionLabel="Activate 4-Phase Safe Shutdown"
                  />
                </div>
              )}

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                {/* 1. End Event Action */}
                <div className="p-5 rounded-2xl bg-[#1C1410] border border-red-900/40 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-red-400 mb-1">
                      <Power className="w-4 h-4" />
                      <span className="text-xs font-mono font-bold uppercase">Event Conclusion</span>
                    </div>
                    <h4 className="text-base font-bold text-white">End & Archive Event</h4>
                    <p className="text-xs text-stone-400 mt-1">
                      Safely conclude live run-of-show, lock attendance logs, and generate final wrap-up report.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEndEventModal(true)}
                    className="w-full py-3 rounded-xl bg-red-900/40 hover:bg-red-800 border border-red-700/60 text-red-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                  >
                    <Power className="w-4 h-4" />
                    <span>End Event & Generate Wrap-Up</span>
                  </button>
                </div>

                {/* 2. Edit Event Setup Details */}
                <div className="p-5 rounded-2xl bg-[#14100E] border border-[#2E241E] space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#D96B27] mb-1">
                      <Edit3 className="w-4 h-4" />
                      <span className="text-xs font-mono font-bold uppercase">Setup Revision</span>
                    </div>
                    <h4 className="text-base font-bold text-white">Edit Event Setup Details</h4>
                    <p className="text-xs text-stone-400 mt-1">
                      Modify event name, type, guest count, place, total budget, or honoree info.
                    </p>
                  </div>
                  <button
                    onClick={onEditSetup}
                    className="w-full py-3 rounded-xl bg-[#251D18] hover:bg-[#2F241F] border border-[#3E2E25] text-stone-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-[#D96B27]" />
                    <span>Return to Event Setup Form</span>
                  </button>
                </div>

                {/* 3. Share Event */}
                <div className="p-5 rounded-2xl bg-[#14100E] border border-[#2E241E] space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs font-mono font-bold uppercase">Guest & Crew Invitation</span>
                    </div>
                    <h4 className="text-base font-bold text-white">Share Event Hub</h4>
                    <p className="text-xs text-stone-400 mt-1">
                      Share portal links with VIP guests, clients, and technical staff with QR passcodes.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="w-full py-3 rounded-xl bg-[#D96B27] hover:bg-[#EA580C] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#D96B27]/25"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Event & QR Pass</span>
                  </button>
                </div>

                {/* 4. Terms and Conditions & Governance */}
                <div className="p-5 rounded-2xl bg-[#14100E] border border-[#2E241E] space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-stone-400 mb-1">
                      <FileText className="w-4 h-4" />
                      <span className="text-xs font-mono font-bold uppercase">Legal & Compliance</span>
                    </div>
                    <h4 className="text-base font-bold text-white">Terms & Conditions</h4>
                    <p className="text-xs text-stone-400 mt-1">
                      Review venue agreements, liability disclaimers, privacy policy, and copyright terms.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTermsModal(true)}
                    className="w-full py-3 rounded-xl bg-[#201814] hover:bg-[#2A201A] border border-[#2E241E] text-stone-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-stone-400" />
                    <span>View Terms & Conditions</span>
                  </button>
                </div>
                {/* 5. Reset Demo Data Action (Bug 16) */}
                <div className="p-5 rounded-2xl bg-[#14100E] border border-amber-900/40 space-y-3 flex flex-col justify-between sm:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-[#FF7A3D] mb-1">
                        <Sparkles className="w-4 h-4 text-[#D96B27]" />
                        <span className="text-xs font-mono font-bold uppercase">System Maintenance</span>
                      </div>
                      <h4 className="text-base font-bold text-white">Reset Demo Data</h4>
                      <p className="text-xs text-stone-400 mt-1">
                        Re-initialize all budgets, venue selections, guest registries, and crew rosters back to clean verified baseline.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetDemoDataLocal}
                      className="px-5 py-2.5 rounded-xl bg-[#251D18] hover:bg-[#34241C] border border-[#D96B27]/40 text-[#FF7A3D] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                    >
                      <Sparkles className="w-4 h-4 text-[#D96B27]" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Log Out Bar with Signed-in Producer Identity (Bug 7) */}
              <div className="mt-6 pt-6 border-t border-[#2A221D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-stone-400">
                  Signed in as <strong className="text-stone-200 font-bold">{currentUser?.name || 'Director Quantrom'}</strong> <span className="text-stone-500 font-mono">({currentUser?.email || 'quantromxx@gmail.com'})</span>
                </div>
                <button
                  onClick={onLogOut}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-stone-400" />
                  <span>Log Out of Studio</span>
                </button>
              </div>
            </div>

            {/* Event Concluded Banner if ended */}
            {eventEnded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-emerald-950/80 border border-emerald-700 text-white space-y-3 shadow-2xl"
              >
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Event Successfully Concluded & Archived</span>
                </div>
                <p className="text-xs text-stone-200">
                  Thank you for producing <span className="font-bold">{currentEvent.eventName}</span> with UTSAVAM AI – Smart Event Management Platform. All operational registries, VIP turnstile scans, and ledger records have been securely backed up.
                </p>
              </motion.div>
            )}

            {/* End Event Confirmation Modal */}
            <AnimatePresence>
              {showEndEventModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md bg-[#181310] border border-red-900/60 rounded-3xl p-6 shadow-2xl space-y-4"
                  >
                    <div className="flex items-center gap-3 text-red-400">
                      <AlertTriangle className="w-6 h-6 shrink-0" />
                      <h3 className="text-lg font-bold text-white">End This Event?</h3>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Are you sure you want to end <span className="text-white font-bold">"{currentEvent.eventName}"</span>? This will lock live checklists, finalize turnstile metrics, and finalize budget calculations.
                    </p>
                    <div className="p-3.5 rounded-xl bg-[#120E0C] border border-[#251D18] text-xs text-stone-400 space-y-1">
                      <div>• Total Guests: <span className="text-white font-semibold">{guestCountNum}</span></div>
                      <div>• Checked-In: <span className="text-emerald-400 font-semibold">{checkedInCount}</span></div>
                      <div>• Total Budget: <span className="text-[#FF7A3D] font-mono font-semibold">${totalBudgetNum.toLocaleString()}</span></div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => setShowEndEventModal(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmEndEvent}
                        className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-bold shadow-md shadow-red-900/40"
                      >
                        Yes, End Event
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Share Modal */}
            <AnimatePresence>
              {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md bg-[#181310] border border-[#2E241E] rounded-3xl p-6 shadow-2xl space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">Share Event Access</h3>
                      <button
                        onClick={() => setShowShareModal(false)}
                        className="text-stone-400 hover:text-white text-xs"
                      >
                        Close
                      </button>
                    </div>

                    <p className="text-xs text-stone-400">
                      Distribute this link or display this QR pass to allow guests and crew to access the portal.
                    </p>

                    <div className="p-4 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center gap-2">
                      <QrCode className="w-24 h-24 text-slate-900" />
                      <span className="font-mono text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                        PASSCODE: {currentEvent.eventType.slice(0, 3).toUpperCase()}-2026-VIP
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/event/${encodeURIComponent(currentEvent.eventName.toLowerCase().replace(/\s+/g, '-'))}`}
                        className="flex-1 px-3 py-2 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs text-stone-300 font-mono select-all focus:outline-none"
                      />
                      <button
                        onClick={handleCopyShareLink}
                        className="px-4 py-2 bg-[#D96B27] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Terms and Conditions Modal */}
            <AnimatePresence>
              {showTermsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-xl max-h-[80vh] overflow-y-auto bg-[#181310] border border-[#2E241E] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#2A221D]">
                      <h3 className="text-lg font-bold text-white">Terms & Conditions of Celebration</h3>
                      <button
                        onClick={() => setShowTermsModal(false)}
                        className="text-stone-400 hover:text-white text-xs font-semibold"
                      >
                        Done
                      </button>
                    </div>

                    <div className="space-y-3.5 text-xs text-stone-300 leading-relaxed font-sans">
                      <div>
                        <h4 className="font-bold text-white text-sm mb-1">1. Venue Operations & Licensing</h4>
                        <p>
                          All venue spaces, ballroom acoustics, and outdoor pavilions operate under local municipal noise curfew and assembly safety standards. Staging setup must adhere strictly to certified electrical ratings and emergency exit corridor clearances.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-sm mb-1">2. Catering & Alcohol Service Regulations</h4>
                        <p>
                          Open bar and culinary service must comply with responsible beverage service certifications. Dietary requirements recorded on the registry (allergens, vegan, halal) must be strictly partitioned in commercial kitchen prep areas.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-sm mb-1">3. Privacy & Attendee Data Protection</h4>
                        <p>
                          Guest directory manifests, RSVP contact details, and dietary records are strictly confidential and stored locally for production facilitation. No guest contact info is transferred to third-party marketing entities.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-sm mb-1">4. Incident Liability & Safety Protocols</h4>
                        <p>
                          The lead producer, security coordinator, and medical teams maintain active radio contact across designated channels. In the event of force majeure, the event lead reserves the right to suspend or reschedule sessions.
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#2A221D] flex justify-end">
                      <button
                        onClick={() => setShowTermsModal(false)}
                        className="px-5 py-2.5 rounded-xl bg-[#D96B27] hover:bg-[#EA580C] text-white text-xs font-bold"
                      >
                        Accept & Close
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* =========================================================================
            SCREEN 7: MULTI-DAY AI EVENT CONCIERGE & CHATBOT
           ========================================================================= */}
        {screenIndex === 6 && (
          <div className="h-[750px] min-h-[600px] rounded-3xl overflow-hidden border border-[#2E241E] shadow-2xl">
            <AiChatbotScreen
              eventData={currentEvent}
              onJumpToScreen={onJumpToScreen}
            />
          </div>
        )}

        {/* Quick Navigation Between All 7 Screens */}
        <div className="pt-6 border-t border-[#2A221D] flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-stone-400">
            Slide screen up/down for all details • Quick jump between screens:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {SWIPE_SCREENS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => onJumpToScreen?.(idx)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
                  screenIndex === idx
                    ? 'bg-[#D96B27] text-white font-bold shadow-md shadow-[#D96B27]/20'
                    : 'bg-[#181310] text-stone-400 hover:text-white border border-[#2A221C]'
                }`}
              >
                {idx + 1}. {s.shortTitle}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Smooth Slide Up / Slide Down Controls */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        <button
          onClick={slideToTop}
          className="w-10 h-10 rounded-full bg-[#181310]/95 hover:bg-[#D96B27] text-stone-300 hover:text-white border border-[#2E241E] shadow-xl flex items-center justify-center transition-all backdrop-blur-md active:scale-95 cursor-pointer"
          title="Slide to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={slideToBottom}
          className="w-10 h-10 rounded-full bg-[#181310]/95 hover:bg-[#D96B27] text-stone-300 hover:text-white border border-[#2E241E] shadow-xl flex items-center justify-center transition-all backdrop-blur-md active:scale-95 cursor-pointer"
          title="Slide to Bottom"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
