import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Brain,
  Cpu,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { SwipeScreenCard } from './SwipeScreenCard';
import { AIProblemSolverModal } from './AIProblemSolverModal';
import { EventSetupData, SWIPE_SCREENS, ProblemScenario } from '../types';

interface SwipeHubScreenProps {
  onBackToSetup?: () => void;
  onEditSetup?: () => void;
  onLogOut?: () => void;
  onEndEvent?: () => void;
  eventData?: EventSetupData;
  onUpdateEventData?: (data: Partial<EventSetupData>) => void;
}

export const SwipeHubScreen: React.FC<SwipeHubScreenProps> = ({ 
  onBackToSetup, 
  onEditSetup,
  onLogOut,
  onEndEvent,
  eventData,
  onUpdateEventData
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAIProblemSolver, setShowAIProblemSolver] = useState(false);
  const totalScreens = 6;

  // Active AI Problem Scenarios covering all 6 screens
  const [scenarios, setScenarios] = useState<ProblemScenario[]>([
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
        optionA: 'Mute line test and rely on software simulation (risks live feedback).',
        optionB: 'Advance crew call by 45 minutes to execute acoustic checks early.',
        aiSelected: 'Option B (Rigorous Verification)',
        rationale: 'Eliminates 100% of live performance failure risk while preserving dignified VIP welcome.'
      },
      resolutionTitle: 'Advance AV Frequency & Acoustic Check to 15:45',
      resolutionImpact: 'Added task to Master Checklist; readiness score boosted to 88%.',
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
      premise: `Grand Amber Palace provides 6,500 sq ft. At ${eventData?.guestCount || 450} guests plus a 700 sq ft dance floor and 8-station buffet, aisle widths contract to 3.2 ft.`,
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
        optionA: 'Ban nuts entirely across the 450-person menu (compromises honoree signature dessert).',
        optionB: 'Re-seat Sophia Dubois to Table 01 Diamond & designate Table 02 as a certified Halal pod.',
        aiSelected: 'Option B (Precision Partitioning)',
        rationale: 'Guarantees 100% biological allergen isolation while preserving the curated signature menu.'
      },
      resolutionTitle: 'Relocate Sophia Dubois to Table 01 Hypoallergenic Pod',
      resolutionImpact: 'Cross-allergen exposure risk reduced from Severe (88%) to Zero (0%).',
      resolved: false,
      resolutionType: 'optimize_seating',
    },
    {
      id: 'sc4',
      title: 'Floral Decor Inflation & Contingency Deficit',
      screenTarget: 4,
      screenName: 'Screen 4: Smart Budget',
      severity: 'Critical',
      category: 'Budget',
      premise: `Committed floral and staging costs exceeded initial estimates by $3,200, reducing the Contingency & Reserve Fund to only $450 (0.7% of budget).`,
      conflictIdentified: 'A 0.7% reserve buffer violates safety guidelines (minimum 3.0%), leaving the production exposed to overtime AV penalties or emergency weather rentals.',
      chainOfThought: [
        'Axiom 1: Elasticity test: Floral centerpieces have high cost elasticity; AV/Sound has near-zero elasticity.',
        'Axiom 2: Converting table arrangements from imported orchids to local terracotta seasonal flora saves $2,400.',
        'Deduction 3: Reallocating $1,500 from print signage to digital QR programs recovers additional margin.',
        'Synthesis 4: Replenishes Contingency Reserve to $4,350 (6.7% of budget), restoring financial resilience.'
      ],
      tradeOffAnalysis: {
        optionA: 'Cut live 7-piece band hours by 50% (damages guest evening entertainment value).',
        optionB: 'Trim floral foliage density by 12% and substitute digital LED signage for print boards.',
        aiSelected: 'Option B (Elasticity Rebalance)',
        rationale: 'Zero noticeable aesthetic reduction while regaining a healthy $4,350 emergency safety net.'
      },
      resolutionTitle: 'Apply AI Elasticity Rebalance & Replenish Reserve to 6.7%',
      resolutionImpact: 'Saved $3,900 across decor elasticity; contingency fund fortified to $4,350.',
      resolved: false,
      resolutionType: 'rebalance_budget',
    },
    {
      id: 'sc5',
      title: 'Single-Point Failure at VIP Turnstile & 12h Lead Fatigue',
      screenTarget: 5,
      screenName: 'Screen 5: Staff Ops',
      severity: 'Warning',
      category: 'Staffing',
      premise: 'Executive Producer Marcus Sterling is scheduled for 12 consecutive hours with no deputy. VIP Concierge Camilla Reyes is the lone host at the main door during the 17:30-18:30 arrival peak.',
      conflictIdentified: `Processing ${eventData?.guestCount || 450} guests through 1 concierge requires 8 seconds/guest, resulting in a 38-minute arrival queue backing up into the street.`,
      chainOfThought: [
        'Axiom 1: Ingress rate calculation: 450 guests / 60 minutes = 7.5 guests per minute.',
        'Axiom 2: One check-in terminal max throughput: 2.5 guests/minute -> 200% deficit.',
        'Deduction 3: Devon Brooks (Scheduled AV standby at 16:30) can be cross-deployed to Door Scanner B.',
        'Synthesis 4: Staggering Marcus Sterling with Sarah Jenkins for a 45-minute command break at 19:00 prevents cognitive fatigue.'
      ],
      tradeOffAnalysis: {
        optionA: 'Hire 2 emergency agency hosts at double-overtime cost ($800).',
        optionB: 'Re-task standby AV crew to Dual-Gate Scanner mode between 17:30 and 18:30.',
        aiSelected: 'Option B (Cross-Functional Optimization)',
        rationale: 'Triples door ingress throughput to 7.5 guests/min with zero incremental payroll cost.'
      },
      resolutionTitle: 'Activate Dual-Gate Ingress Scanning & 19:00 Deputy Handover',
      resolutionImpact: 'Arrival queue time collapsed from 38 mins to 4 mins; crew fatigue eliminated.',
      resolved: false,
      resolutionType: 'redeploy_staff',
    },
    {
      id: 'sc6',
      title: 'Post-Event Equipment Strike Safety & Curfew Overtime',
      screenTarget: 6,
      screenName: 'Screen 6: Event Controls',
      severity: 'Optimization',
      category: 'Safety',
      premise: 'Contracted venue curfew is 01:30. Rigging breakdown requires 90 minutes. Guests historically linger up to 45 minutes past midnight.',
      conflictIdentified: 'Heavy overhead truss lowering while lingering guests remain in the ballroom poses a direct occupational hazard and $1,200/hr venue overtime fees.',
      chainOfThought: [
        'Axiom 1: Safety regulations prohibit overhead rigging de-rigging in presence of unescorted attendees.',
        'Axiom 2: Overtime fee begins at 01:31 sharp ($20/minute).',
        'Deduction 3: Opening the After-Party Terrace Lounge at 23:45 smoothly draws lingering guests away from the main floor.',
        'Synthesis 4: Allows AV strike crew to start stage breakdown at 00:05, completing by 01:20 without penalty.'
      ],
      tradeOffAnalysis: {
        optionA: 'Abrupt house lights and immediate security sweep at 00:00 (harsh guest experience).',
        optionB: 'Staged Soft Migration: Coffee & digestif service opened on West Terrace at 23:45.',
        aiSelected: 'Option B (Staged Soft Migration)',
        rationale: 'Preserves warm celebration memories while clearing the ballroom floor for safe rigging strike.'
      },
      resolutionTitle: 'Activate Staged West Terrace Soft Migration & 4-Stage Shutdown Protocol',
      resolutionImpact: 'Ballroom cleared safely at 00:05; zero curfew fines; 100% safety compliance.',
      resolved: false,
      resolutionType: 'protocol_shutdown',
    },
  ]);

  const handleResolveScenario = (id: string) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, resolved: true } : s))
    );
  };

  const handleResolveAllScenarios = () => {
    setScenarios((prev) => prev.map((s) => ({ ...s, resolved: true })));
  };

  const handleRunCustomSimulation = async (problem: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch('/api/ai-reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          problem,
          screenContext: SWIPE_SCREENS[currentIndex]?.title,
          eventData,
        }),
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data.success && data.analysis) {
        return data.analysis;
      }
    } catch (e) {
      console.warn('API reason failed or timed out, fallback to local deduction tree', e);
    }

    // Local deterministic logical fallback
    return {
      premise: `Analysis for ${eventData?.eventName || 'Event'} (${eventData?.guestCount || 450} guests): Constraint "${problem}"`,
      rootConflict: `Contradiction detected between physical guest throughput and operational milestone limit.`,
      chainOfThought: [
        '1. Identified resource constraints and physical flow thresholds.',
        '2. Discovered non-linear delay propagation across downstream stages.',
        '3. Evaluated compensatory trade-offs against host priorities and safety regulations.',
        '4. Formulated highest-utility mitigation path minimizing cost and schedule friction.'
      ],
      tradeOff: {
        aiSelected: 'Adaptive Buffer Reallocation',
        rationale: 'Absorbs variation within non-critical timeline windows with zero quality degradation.'
      },
      recommendedAction: `Deploy calibrated protocol: Adjust adjacent milestones by 15 mins, dispatch support channel CH-2, and notify stage coordinator.`
    };
  };

  // Touch swipe detection that respects vertical scroll
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const goToNext = () => {
    if (currentIndex < totalScreens - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToIndex = (index: number) => {
    if (index >= 0 && index < totalScreens) {
      setCurrentIndex(index);
    }
  };

  // Keyboard navigation support (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;

    // Only trigger horizontal swipe if horizontal displacement is significantly greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 60) {
      if (deltaX > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const currentScreenInfo = SWIPE_SCREENS[currentIndex];

  return (
    <div 
      className="relative w-full h-screen bg-[#120E0C] text-[#FAF8F5] overflow-hidden flex flex-col font-sans"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Navigation Bar */}
      <header className="relative z-30 w-full bg-[#181310]/95 border-b border-[#2A221D] px-4 py-3 sm:px-6 backdrop-blur-xl shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Back to Event Setup & Brand */}
          <div className="flex items-center gap-3">
            {onBackToSetup && (
              <button
                onClick={onBackToSetup}
                className="p-2 rounded-xl bg-[#201814] border border-[#2E241E] text-stone-300 hover:text-white hover:border-[#D96B27] transition-all flex items-center gap-1.5 text-xs font-semibold"
                title="Back to Event Setup form"
              >
                <ArrowLeft className="w-4 h-4 text-[#D96B27]" />
                <span className="hidden sm:inline">Event Setup</span>
              </button>
            )}

            {/* Uploaded Gemini Star Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#201814] border border-[#D96B27]/40 flex items-center justify-center p-1 shadow-md">
                <img
                  src="/assets/aistudio/IMG_5a0d88a6-87e9-4a7b-a776-fc739159b4b6_10c628f5.png"
                  alt="Gemini Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xs font-extrabold text-white tracking-tight leading-none truncate max-w-[200px]">
                  {eventData?.eventName || 'AI Celebration Studio'}
                </h1>
                <span className="text-[10px] text-stone-400 font-mono">
                  {eventData?.eventType || 'Gala'} • {eventData?.venueName || 'Main Arena'}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Screen Quick Tabs */}
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-[#120E0C] border border-[#2A221C]">
            {SWIPE_SCREENS.map((s, idx) => {
              const active = currentIndex === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => goToIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#D96B27] text-white shadow-sm font-bold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className="font-mono text-[11px] opacity-80">#{idx + 1}</span>
                  <span>{s.shortTitle}</span>
                </button>
              );
            })}
          </div>

          {/* Right: AI Problem Solver & Prev / Next Navigation Arrows */}
          <div className="flex items-center gap-2">
            {/* AI Problem Solver Trigger Button */}
            <button
              onClick={() => setShowAIProblemSolver(true)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-md ${
                scenarios.filter((s) => !s.resolved).length > 0
                  ? 'bg-[#22150E] border-[#D96B27] text-[#FF7A3D] hover:bg-[#D96B27] hover:text-white shadow-[#D96B27]/20'
                  : 'bg-[#181310] border-emerald-800 text-emerald-400 hover:bg-emerald-950'
              }`}
              title="Open AI Logical Thinking & Problem Solver Console"
            >
              <Brain className="w-3.5 h-3.5 text-[#D96B27]" />
              <span className="hidden sm:inline">AI Problem Solver</span>
              {scenarios.filter((s) => !s.resolved).length > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#D96B27] text-white font-black">
                  {scenarios.filter((s) => !s.resolved).length}
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-900 text-emerald-300">
                  Optimal
                </span>
              )}
            </button>

            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className={`p-2 rounded-xl border transition-all ${
                currentIndex === 0
                  ? 'bg-stone-900/50 border-stone-800 text-stone-600 cursor-not-allowed'
                  : 'bg-[#201814] border-[#2E241E] text-stone-200 hover:text-white hover:border-[#D96B27]'
              }`}
              title="Previous Screen (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-bold text-[#FF7A3D] px-1 sm:px-2">
              {currentIndex + 1} / {totalScreens}
            </span>

            <button
              onClick={goToNext}
              disabled={currentIndex === totalScreens - 1}
              className={`p-2 rounded-xl border transition-all ${
                currentIndex === totalScreens - 1
                  ? 'bg-stone-900/50 border-stone-800 text-stone-600 cursor-not-allowed'
                  : 'bg-[#201814] border-[#2E241E] text-stone-200 hover:text-white hover:border-[#D96B27]'
              }`}
              title="Next Screen (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 6 Sliding Side-by-Side Screen Container */}
      <div className="relative flex-1 w-full overflow-hidden">
        <motion.div
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 30,
            mass: 0.9,
          }}
          className="flex w-full h-full"
        >
          {Array.from({ length: totalScreens }).map((_, idx) => (
            <div
              key={idx}
              className="w-full h-full shrink-0 overflow-hidden"
              style={{ minWidth: '100%' }}
            >
              <SwipeScreenCard 
                screenIndex={idx} 
                eventData={eventData} 
                onJumpToScreen={goToIndex}
                onEditSetup={onEditSetup}
                onLogOut={onLogOut}
                onEndEvent={onEndEvent}
                onUpdateEventData={onUpdateEventData}
                scenarios={scenarios}
                onResolveScenario={handleResolveScenario}
                onOpenAIProblemSolver={() => setShowAIProblemSolver(true)}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* AI Problem Solver Modal */}
      <AIProblemSolverModal
        isOpen={showAIProblemSolver}
        onClose={() => setShowAIProblemSolver(false)}
        scenarios={scenarios}
        onResolveScenario={handleResolveScenario}
        onResolveAllScenarios={handleResolveAllScenarios}
        onRunCustomSimulation={handleRunCustomSimulation}
        eventData={eventData}
        activeScreenIndex={currentIndex}
        onJumpToScreen={(screenIdx) => {
          goToIndex(screenIdx);
          setShowAIProblemSolver(false);
        }}
      />

      {/* Bottom Sticky Screen Navigation & Dots */}
      <footer className="relative z-30 w-full bg-[#181310]/95 border-t border-[#2A221D] py-2.5 px-4 backdrop-blur-xl shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-[11px] text-stone-400 font-mono hidden sm:block">
            Slide screen up/down for controls • Swipe left/right for other screens
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            {Array.from({ length: totalScreens }).map((_, idx) => {
              const active = currentIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => goToIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active
                      ? 'w-7 bg-[#D96B27] shadow-sm shadow-[#D96B27]/50'
                      : 'w-2 bg-stone-700 hover:bg-stone-500'
                  }`}
                  aria-label={`Go to Screen ${idx + 1}`}
                  title={SWIPE_SCREENS[idx]?.title}
                />
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-[#FF7A3D] font-bold">
            SCREEN {currentIndex + 1}: {currentScreenInfo?.shortTitle}
          </div>
        </div>
      </footer>
    </div>
  );
};
