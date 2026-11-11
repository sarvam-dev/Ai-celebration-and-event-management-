import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Users, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Heart, 
  Cake, 
  Wine, 
  PartyPopper, 
  Tent, 
  Cpu, 
  Music, 
  Crown, 
  CheckCircle2, 
  Sliders, 
  SlidersHorizontal,
  Flame,
  Radio,
  Tv,
  Activity,
  Layers,
  ShieldCheck,
  Building,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EventSetupData, AuthUser } from '../types';

interface EventSetupScreenProps {
  onContinue: (data: EventSetupData) => void;
  onBackToSign?: () => void;
  currentUser?: AuthUser | null;
  initialData?: Partial<EventSetupData>;
}

export const EventSetupScreen: React.FC<EventSetupScreenProps> = ({
  onContinue,
  onBackToSign,
  currentUser,
  initialData,
}) => {
  // Event Name
  const [eventName, setEventName] = useState(
    initialData?.eventName || 'Royal Heritage Grand Wedding Gala'
  );

  // Event Type
  const [eventType, setEventType] = useState<EventSetupData['eventType']>(
    initialData?.eventType || 'Wedding'
  );

  // Number of guests
  const [guestCount, setGuestCount] = useState(
    initialData?.guestCount || '450'
  );

  // Place / Venue
  const [venueName, setVenueName] = useState(
    initialData?.venueName || 'The Grand Amber Palace - Crystal Ballroom'
  );
  const [venueCity, setVenueCity] = useState('Metropolis Central');
  const [venueLayout, setVenueLayout] = useState<'Indoor Ballroom' | 'Outdoor Garden' | 'Hybrid Staging'>('Indoor Ballroom');

  // Date & Time
  const [startDate, setStartDate] = useState(
    initialData?.startDate || '2026-11-20'
  );
  const [startTime, setStartTime] = useState(
    initialData?.startTime || '18:00'
  );

  // Multi-Day Itinerary Synchronization helper
  const computeOffsetDate = (baseStr: string, offsetDays: number): string => {
    try {
      const parts = baseStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(Date.UTC(year, month, day));
        d.setUTCDate(d.getUTCDate() + offsetDays);
        return d.toISOString().split('T')[0];
      }
      return baseStr;
    } catch {
      return baseStr;
    }
  };

  const multiDaySchedule = {
    dayMinus1: computeOffsetDate(startDate, -1),
    day1: startDate,
    day2: computeOffsetDate(startDate, 1),
    day3: computeOffsetDate(startDate, 2),
  };

  // Honoree / Host
  const [honoreeOrHost, setHonoreeOrHost] = useState(
    initialData?.honoreeOrHost || 'Evelyn & Julian Vance'
  );

  // Atmosphere / Theme Palette
  const [themeStyle, setThemeStyle] = useState(
    initialData?.themeStyle || 'Claude Terracotta & Royal Gold'
  );

  // Production Level Tier & Total Budget
  const [budgetTier, setBudgetTier] = useState<EventSetupData['budgetTier']>(
    initialData?.budgetTier || 'Grand Celebration'
  );
  const [totalBudget, setTotalBudget] = useState<number>(
    initialData?.totalBudget || 65000
  );

  // 6 Swipe Screen Module Activations matching the actual tabs
  const [modules, setModules] = useState({
    dashboardChecklist: true,
    venueDiscovery: true,
    guestRegistry: true,
    budgetLedger: true,
    staffOps: true,
    eventControls: true,
  });

  const toggleModule = (key: keyof typeof modules) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Form Validation & Error state
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) {
      setValidationError('Please enter a valid event celebration name');
      return;
    }
    if (!guestCount.trim() || Number(guestCount) <= 0) {
      setValidationError('Please specify a positive guest attendance capacity');
      return;
    }
    if (totalBudget < 1000) {
      setValidationError('Total budget must be at least $1,000 USD');
      return;
    }

    setValidationError(null);
    const finalData: EventSetupData = {
      eventName: eventName.trim() || 'Royal Heritage Grand Wedding Gala',
      eventType,
      venueName: venueName.trim() || 'The Grand Amber Palace - Crystal Ballroom',
      venueCity: venueCity.trim() || 'Metropolis Central',
      guestCount: guestCount || '450',
      totalBudget: Number(totalBudget) || 65000,
      startDate,
      startTime,
      honoreeOrHost: honoreeOrHost.trim() || 'Evelyn & Julian Vance',
      themeStyle,
      budgetTier,
      multiDaySchedule,
      enabledModules: {
        ...modules,
        runOfShowClock: modules.dashboardChecklist,
        multiTrackAgenda: modules.venueDiscovery,
        vipGateRadar: modules.guestRegistry,
        avLightingMatrix: modules.budgetLedger,
        crowdFlowHeatmap: modules.staffOps,
        emergencyDispatch: modules.eventControls,
      },
    };
    onContinue(finalData);
  };
  const eventTypesCatalog: {
    id: EventSetupData['eventType'];
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultTheme: string;
    suggestedHostLabel: string;
    suggestedName: string;
  }[] = [
    {
      id: 'Wedding',
      title: 'Wedding',
      description: 'Ceremony, royal vows, banquet & dancing',
      icon: Heart,
      defaultTheme: 'Claude Terracotta & Royal Gold',
      suggestedHostLabel: 'Bride & Groom Names',
      suggestedName: 'The Vance & Sterling Royal Wedding Gala',
    },
    {
      id: 'Birthday',
      title: 'Birthday',
      description: 'Milestone celebrations, jubilees & grand parties',
      icon: Cake,
      defaultTheme: 'Vibrant Sunset Orange & Gold',
      suggestedHostLabel: 'Celebrant Name & Age',
      suggestedName: 'Marcus 30th Grand Milestone Celebration',
    },
    {
      id: 'Anniversary',
      title: 'Anniversary',
      description: 'Silver/golden jubilees & couple milestones',
      icon: Wine,
      defaultTheme: 'Warm Amber Champagne & Ivory',
      suggestedHostLabel: 'Celebrating Couple',
      suggestedName: 'Golden 50th Anniversary Dinner & Concert',
    },
    {
      id: 'Gala Celebration',
      title: 'Gala Celebration',
      description: 'Charity galas, red carpet & award ceremonies',
      icon: PartyPopper,
      defaultTheme: 'Midnight Velvet & Warm Terracotta',
      suggestedHostLabel: 'Hosting Foundation / Chair',
      suggestedName: 'Annual Horizon Charity & Honors Gala 2026',
    },
    {
      id: 'Festival',
      title: 'Festival',
      description: 'Multi-stage cultural, culinary or arts gathering',
      icon: Tent,
      defaultTheme: 'Energetic Terracotta & Turquoise',
      suggestedHostLabel: 'Festival Director',
      suggestedName: 'Lumina Sun & Sound Arts Festival',
    },
    {
      id: 'Tech Expo & Summit',
      title: 'Tech Expo & Summit',
      description: 'Keynotes, breakout tracks & innovation showcases',
      icon: Cpu,
      defaultTheme: 'Cyber Obsidian & Claude Orange',
      suggestedHostLabel: 'Keynote Lead / Organization',
      suggestedName: 'Global AI Summit & Systems Showcase 2026',
    },
    {
      id: 'Concert / Live Show',
      title: 'Concert / Live Show',
      description: 'Arena audio/visual spectacles & musical sets',
      icon: Music,
      defaultTheme: 'High-Luminance Amber & Laser Cyan',
      suggestedHostLabel: 'Headlining Artist / Act',
      suggestedName: 'Symphony of Lights Arena Tour',
    },
    {
      id: 'VIP Private Party',
      title: 'VIP Private Party',
      description: 'Intimate soirees, penthouses & exclusive salons',
      icon: Crown,
      defaultTheme: 'Rich Espresso & Terracotta Glow',
      suggestedHostLabel: 'Host or VIP Patron',
      suggestedName: 'The Solstice Private Penthouse Soiree',
    },
  ];

  // Quick Guest Count Presets
  const guestPresets = ['50', '150', '350', '500', '1,200', '3,500+'];

  // Handle Event Type Change with smart defaults
  const handleSelectEventType = (typeId: EventSetupData['eventType']) => {
    setEventType(typeId);
    const found = eventTypesCatalog.find((t) => t.id === typeId);
    if (found) {
      setThemeStyle(found.defaultTheme);
      // If user hasn't heavily customized the event name, suggest a matching title
      if (!eventName || eventName.includes('Wedding') || eventName.includes('Summit') || eventName.includes('Birthday')) {
        setEventName(found.suggestedName);
      }
    }
  };


  return (
    <div className="relative min-h-screen w-full bg-[#120E0C] text-[#FAF8F5] flex flex-col justify-between font-sans px-4 py-6 sm:py-8 pb-24 touch-pan-y">
      {/* Background Ambient Lighting in Claude Terracotta Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full bg-[#D96B27]/14 blur-[180px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#EA580C]/10 blur-[140px]" />
        <div className="absolute top-1/4 left-10 w-[400px] h-[400px] rounded-full bg-[#3B82F6]/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(8,6,5,0.8)_100%)]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between pb-4 border-b border-[#2A221D]">
        <div className="flex items-center gap-3">
          {onBackToSign && (
            <button
              type="button"
              onClick={onBackToSign}
              className="p-2 rounded-xl bg-[#1C1714] border border-[#2A221C] text-stone-400 hover:text-white hover:border-[#D96B27] transition-all"
              title="Back to Sign In Screen"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="relative w-10 h-10 rounded-full bg-[#1C1714] border border-[#D96B27]/40 flex items-center justify-center p-0.5 shadow-md shadow-black/40 overflow-hidden">
            <img
              src="/assets/aistudio/utsavam_circle_logo.png"
              alt="Utsavam AI Logo"
              className="w-full h-full rounded-full object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                Event Setup & Configuration
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D96B27]/20 text-[#FF7A3D] border border-[#D96B27]/40">
                STAGE 3 OF 4
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Configure parameters before launching the 6 live swipe workspaces
            </p>
          </div>
        </div>

        {/* Current User Clearance Badge */}
        {currentUser && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1C1714] border border-[#2A221C] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-stone-300 font-medium truncate max-w-[120px]">{currentUser.name}</span>
            <span className="text-[10px] font-mono text-[#FF7A3D] bg-[#D96B27]/10 px-1.5 py-0.5 rounded">
              {currentUser.role}
            </span>
          </div>
        )}
      </header>

      {/* Main Configuration Form Arena */}
      <main className="relative z-20 flex-1 max-w-5xl w-full mx-auto my-6 sm:my-8">
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Section 1: Event Identity & Type Selection */}
          <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#2A221D]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D96B27]/20 border border-[#D96B27]/40 text-[#FF7A3D] flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Event Type & Core Identity
                  </h2>
                  <p className="text-xs text-stone-400">
                    Select your celebration format to tune templates & run-of-show
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-[#FF7A3D] bg-[#D96B27]/10 px-2.5 py-1 rounded-full border border-[#D96B27]/30">
                REQUIRED
              </span>
            </div>

            {/* Event Type Grid (8 Given Options) */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-stone-300 mb-2.5">
                Choose Event Type (Wedding, Birthday, Gala, etc.)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {eventTypesCatalog.map((item) => {
                  const active = eventType === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectEventType(item.id)}
                      className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                        active
                          ? 'bg-gradient-to-b from-[#D96B27]/25 to-[#1C1714] border-[#D96B27] text-white shadow-lg shadow-[#D96B27]/15 ring-1 ring-[#D96B27]/50'
                          : 'bg-[#120E0C] border-[#2A221C] text-stone-400 hover:text-stone-200 hover:border-stone-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              active ? 'bg-[#D96B27] text-white' : 'bg-stone-900 text-stone-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          {active && <CheckCircle2 className="w-4 h-4 text-[#FF7A3D]" />}
                        </div>
                        <span className={`text-xs font-bold block ${active ? 'text-white' : 'text-stone-300'}`}>
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 mt-1 line-clamp-1">
                        {item.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event Name Input */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center justify-between">
                  <span>Event Title / Celebration Name</span>
                  <span className="text-[10px] text-[#FF7A3D] font-mono">PRIMARY TITLE</span>
                </label>
                <div className="relative">
                  <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D96B27]" />
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Royal Heritage Grand Wedding Gala"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D96B27] focus:ring-1 focus:ring-[#D96B27] transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Host / Celebrant Name */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Honoree or Host Names
                </label>
                <input
                  type="text"
                  value={honoreeOrHost}
                  onChange={(e) => setHonoreeOrHost(e.target.value)}
                  placeholder="e.g. Evelyn & Julian Vance"
                  className="w-full px-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D96B27] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Venue, Guests, Date & Time */}
          <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#2A221D]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EA580C]/20 border border-[#EA580C]/40 text-[#FF7A3D] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Place, Scale & Timing
                  </h2>
                  <p className="text-xs text-stone-400">
                    Location logistics, capacity limits, and master scheduling
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-[#38BDF8] bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-800/40">
                LOGISTICS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {/* Place / Venue Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Place / Venue Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    required
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="e.g. The Grand Amber Palace - Crystal Ballroom"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D96B27] transition-all"
                  />
                </div>
              </div>

              {/* City / Area */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  City / Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    value={venueCity}
                    onChange={(e) => setVenueCity(e.target.value)}
                    placeholder="e.g. Metropolis Central"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D96B27] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Guests & Staging Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* No. of Guests with quick presets */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center justify-between">
                  <span>Number of Expected Guests</span>
                  <span className="text-[10px] text-stone-400 font-mono">CAPACITY</span>
                </label>
                <div className="relative mb-2">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    required
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    placeholder="e.g. 450"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D96B27] transition-all font-mono"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono text-stone-500">Presets:</span>
                  {guestPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setGuestCount(preset)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono border transition-all ${
                        guestCount === preset
                          ? 'bg-[#D96B27] text-white border-[#D96B27]'
                          : 'bg-[#100D0B] text-stone-400 border-[#2A221C] hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Staging Layout Format */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Venue Staging Layout
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Indoor Ballroom', 'Outdoor Garden', 'Hybrid Staging'] as const).map((format) => {
                    const active = venueLayout === format;
                    return (
                      <button
                        key={format}
                        type="button"
                        onClick={() => setVenueLayout(format)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                          active
                            ? 'bg-[#D96B27]/20 border-[#D96B27] text-white shadow-sm'
                            : 'bg-[#120E0C] border-[#2A221C] text-stone-400 hover:text-white'
                        }`}
                      >
                        {format}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Date & Start Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#2A221D]">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Target Opening Date (Day 1)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#D96B27] transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Showtime / Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#D96B27] transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Multi-Day Event Schedule Preview (Synchronized with AI Chatbot Day -1 to Day 3) */}
            <div className="mt-4 p-4 rounded-2xl bg-[#120E0C] border border-[#281F19] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D96B27]" />
                  <span>Synchronized Multi-Day Itinerary (Day −1 to Day 3)</span>
                </span>
                <span className="text-[11px] font-mono text-[#FF7A3D] bg-[#D96B27]/15 px-2 py-0.5 rounded border border-[#D96B27]/30">
                  4-Phase Timeline
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-[#1A130F] border border-[#2A221C]">
                  <span className="text-[10px] font-mono text-stone-400 block uppercase">Day −1 (Load-In)</span>
                  <span className="text-xs font-bold text-white font-mono">{multiDaySchedule.dayMinus1}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5 truncate">Rigging & AV Tuning</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1A130F] border border-[#D96B27]/40 ring-1 ring-[#D96B27]/20">
                  <span className="text-[10px] font-mono text-[#FF7A3D] block uppercase font-bold">Day 1 (Opening)</span>
                  <span className="text-xs font-bold text-white font-mono">{multiDaySchedule.day1}</span>
                  <span className="text-[10px] text-stone-300 block mt-0.5 truncate">Welcome & VIP Dinner</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1A130F] border border-[#2A221C]">
                  <span className="text-[10px] font-mono text-stone-400 block uppercase">Day 2 (Grand Gala)</span>
                  <span className="text-xs font-bold text-white font-mono">{multiDaySchedule.day2}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5 truncate">Masterclasses & Band</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1A130F] border border-[#2A221C]">
                  <span className="text-[10px] font-mono text-stone-400 block uppercase">Day 3 (Adjourn)</span>
                  <span className="text-xs font-bold text-white font-mono">{multiDaySchedule.day3}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5 truncate">Farewell & Safe Strike</span>
                </div>
              </div>
            </div>
          </div>

          {/* Validation Error Alert if triggered */}
          {validationError && (
            <div className="p-4 rounded-2xl bg-red-950/80 border border-red-700 text-red-200 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section 3: Atmosphere, Theme & 6-Screen Activation Grid */}
          <div className="bg-[#181310]/95 border border-[#2E241E] rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#2A221D]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Workspace Tabs & Management Modules (6 Screens)
                  </h2>
                  <p className="text-xs text-stone-400">
                    The 6 sliding workspaces matched to your production operations
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/40">
                ALL 6 TABS ACTIVE
              </span>
            </div>

            {/* 6 Engine Modules Grid Matching Actual Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-5">
              {[
                {
                  key: 'dashboardChecklist' as const,
                  title: 'Screen 1: Event Dashboard',
                  desc: 'Master readiness checklist, countdown & honoree summary',
                  icon: Activity,
                  color: 'text-[#D96B27]',
                },
                {
                  key: 'venueDiscovery' as const,
                  title: 'Screen 2: Venue Intelligence',
                  desc: 'Live web-matched venues, pricing tiers & capacity fit',
                  icon: Building,
                  color: 'text-[#38BDF8]',
                },
                {
                  key: 'guestRegistry' as const,
                  title: 'Screen 3: Guest Management',
                  desc: 'Searchable guest registry, VIP tables & allergy protocols',
                  icon: Users,
                  color: 'text-[#F59E0B]',
                },
                {
                  key: 'budgetLedger' as const,
                  title: 'Screen 4: Smart Budget',
                  desc: 'Automated subdivisions, paid/pending ledger & reserve',
                  icon: Sliders,
                  color: 'text-[#10B981]',
                },
                {
                  key: 'staffOps' as const,
                  title: 'Screen 5: Staff Ops & Health',
                  desc: 'Roster shifts, encrypted radios & fatigue safety watch',
                  icon: Radio,
                  color: 'text-[#EC4899]',
                },
                {
                  key: 'eventControls' as const,
                  title: 'Screen 6: Event Controls',
                  desc: 'Safe end event, revise setup, share pass, T&C & sign out',
                  icon: ShieldCheck,
                  color: 'text-[#A855F7]',
                },
              ].map((m) => {
                const isEnabled = modules[m.key];
                const Icon = m.icon;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => toggleModule(m.key)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isEnabled
                        ? 'bg-[#120E0C] border-stone-700 text-stone-100 shadow-sm'
                        : 'bg-[#100D0B]/60 border-[#221B16] text-stone-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-lg bg-stone-900 border border-stone-800 ${m.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${isEnabled ? 'text-[#FF7A3D]' : 'text-stone-600'}`}>
                        {isEnabled ? 'ACTIVE' : 'MUTED'}
                      </span>
                    </div>
                    <span className="text-xs font-bold block text-white truncate">
                      {m.title}
                    </span>
                    <span className="text-xs text-stone-300 block mt-0.5 line-clamp-1">
                      {m.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Atmosphere & Budget Tier Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#2A221D]">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Visual Palette & Atmosphere
                </label>
                <div className="relative">
                  <Flame className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D96B27]" />
                  <input
                    type="text"
                    value={themeStyle}
                    onChange={(e) => setThemeStyle(e.target.value)}
                    placeholder="e.g. Claude Terracotta & Royal Gold"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#D96B27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Production Level Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Intimate Boutique', 'Grand Celebration', 'Enterprise Ultra'] as const).map((tier) => {
                    const active = budgetTier === tier;
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => {
                          setBudgetTier(tier);
                          if (tier === 'Intimate Boutique') setTotalBudget(25000);
                          else if (tier === 'Grand Celebration') setTotalBudget(65000);
                          else if (tier === 'Enterprise Ultra') setTotalBudget(175000);
                        }}
                        className={`py-2 px-1.5 rounded-xl text-[11px] font-semibold border text-center transition-all truncate ${
                          active
                            ? 'bg-[#D96B27] text-white border-[#D96B27] shadow-sm'
                            : 'bg-[#120E0C] border-[#2A221C] text-stone-400 hover:text-white'
                        }`}
                      >
                        {tier.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Total Budget Numerical Input & Smart Split Preview */}
            <div className="pt-4 border-t border-[#2A221D] mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="w-full sm:w-1/2">
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Total Event Budget ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D96B27] font-bold text-sm">$</span>
                    <input
                      type="number"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(Math.max(1000, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2.5 bg-[#100D0B] border border-[#2A221C] rounded-xl text-xs sm:text-sm text-white font-mono font-bold focus:outline-none focus:border-[#D96B27]"
                      placeholder="65000"
                    />
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="block text-[11px] font-medium text-stone-400 mb-1.5">
                    Quick Budget Presets
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[15000, 45000, 85000, 150000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTotalBudget(amt)}
                        className={`py-2 rounded-xl text-[11px] font-mono transition-all border ${
                          totalBudget === amt
                            ? 'bg-[#D96B27] text-white border-[#D96B27] font-bold'
                            : 'bg-[#120E0C] text-stone-300 border-[#2A221C] hover:border-stone-600'
                        }`}
                      >
                        ${amt >= 1000 ? `${amt / 1000}k` : amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-2">
                Screen 4 will intelligently divide this budget across Catering, Venue, Decor, AV & Entertainment.
              </p>
            </div>
          </div>

          {/* Action Footer: Launch 6 Swipe Screens */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {onBackToSign && (
              <button
                type="button"
                onClick={onBackToSign}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#181310] border border-[#2A221C] text-xs font-semibold text-stone-300 hover:text-white hover:border-stone-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </button>
            )}

            <button
              type="submit"
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D96B27] via-[#EA580C] to-[#F59E0B] hover:brightness-110 active:scale-[0.98] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#D96B27]/30 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Initialize & Launch 6-Screen Event Hub</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </motion.form>
      </main>

      {/* Footer Info */}
      <footer className="relative z-20 w-full max-w-5xl mx-auto pt-4 text-center border-t border-[#2A221D]/60">
        <p className="text-[11px] text-stone-500">
          UTSAVAM AI – Smart Event Management Platform • Stage 3 Setup • Next: 6 Sliding Side-by-Side Swipe Screens
        </p>
      </footer>

      {/* Floating Smooth Slide Up / Slide Down Controls */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 rounded-full bg-[#181310]/95 hover:bg-[#D96B27] text-stone-300 hover:text-white border border-[#2E241E] shadow-xl flex items-center justify-center transition-all backdrop-blur-md active:scale-95 cursor-pointer"
          title="Slide to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          className="w-10 h-10 rounded-full bg-[#181310]/95 hover:bg-[#D96B27] text-stone-300 hover:text-white border border-[#2E241E] shadow-xl flex items-center justify-center transition-all backdrop-blur-md active:scale-95 cursor-pointer"
          title="Slide to Bottom (Launch Action)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
