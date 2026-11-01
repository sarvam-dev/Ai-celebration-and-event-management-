import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  Sparkles, 
  FlaskConical, 
  BookOpen, 
  RotateCcw,
  ShieldCheck,
  Brain,
  MapPin,
  Users,
  DollarSign
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { SHARED_SCREENS } from '../constants/screens';
import { DashboardScreen } from './screens/DashboardScreen';
import { VenueSearchScreen } from './screens/VenueSearchScreen';
import { GuestManagerScreen } from './screens/GuestManagerScreen';
import { SmartBudgetScreen } from './screens/SmartBudgetScreen';
import { StaffOpsScreen } from './screens/StaffOpsScreen';
import { EventHubScreen } from './screens/EventHubScreen';
import { AiConciergeScreen } from './screens/AiConciergeScreen';
import { SelfChecksModal } from './SelfChecksModal';
import { BriefAlignmentModal } from './BriefAlignmentModal';
import { AIProblemSolverModal } from './AIProblemSolverModal';

interface SwipeHubScreenProps {
  onBackToSetup?: () => void;
  onEditSetup?: () => void;
  onLogOut?: () => void;
  onEndEvent?: () => void;
}

export const SwipeHubScreen: React.FC<SwipeHubScreenProps> = ({
  onBackToSetup,
  onEditSetup,
  onLogOut,
  onEndEvent,
}) => {
  const { 
    activeScreenIndex, 
    setActiveScreenIndex, 
    currentUser, 
    eventData, 
    resetDemoData,
    scenarios,
    resolveScenario
  } = useEvent();

  const [showSelfChecks, setShowSelfChecks] = useState(false);
  const [showBriefAlignment, setShowBriefAlignment] = useState(false);
  const [showAiSolverModal, setShowAiSolverModal] = useState(false);

  // Guarantee: on mount, always reset window scroll to (0,0) and ensure Screen 1 (index 0)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    setActiveScreenIndex(0);
  }, []);

  const totalScreens = SHARED_SCREENS.length;
  const currentScreen = SHARED_SCREENS[activeScreenIndex] || SHARED_SCREENS[0];
  const nextScreen = activeScreenIndex < totalScreens - 1 ? SHARED_SCREENS[activeScreenIndex + 1] : null;
  const prevScreen = activeScreenIndex > 0 ? SHARED_SCREENS[activeScreenIndex - 1] : null;

  const goToPrevious = () => {
    if (activeScreenIndex > 0) {
      setActiveScreenIndex(activeScreenIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNext = () => {
    if (activeScreenIndex < totalScreens - 1) {
      setActiveScreenIndex(activeScreenIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeConflictsCount = scenarios.filter((s) => !s.resolved).length;

  return (
    <div className="w-full min-h-screen bg-[#120E0C] text-stone-100 flex flex-col justify-between selection:bg-[#D96B27]/30 selection:text-white">
      {/* Top Global Utility Bar */}
      <div className="sticky top-0 z-40 bg-[#16110E]/95 backdrop-blur-md border-b border-[#2E241E] px-4 py-2 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D96B27] animate-pulse" />
            <span className="font-mono text-xs font-bold text-stone-200 uppercase tracking-wider">
              Event Studio
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#2E241E] text-xs text-stone-400">
            <span>Signed in as:</span>
            <span className="text-stone-200 font-semibold">{currentUser?.name || 'Director Quantrom'}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#221A15] border border-[#3A2D24] text-stone-300">
              {currentUser?.role || 'Producer'}
            </span>
          </div>
        </div>

        {/* Global Action Chips */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSelfChecks(true)}
            className="px-2.5 py-1.5 rounded-lg bg-[#1D1713] hover:bg-[#281F1A] border border-[#3A2D24] text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Run Unit Self-Checks"
          >
            <FlaskConical className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="hidden md:inline">Self-Checks</span>
          </button>

          <button
            onClick={() => setShowBriefAlignment(true)}
            className="px-2.5 py-1.5 rounded-lg bg-[#1D1713] hover:bg-[#281F1A] border border-[#3A2D24] text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="View Brief Alignment"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden md:inline">Brief Matrix</span>
          </button>

          <button
            onClick={() => setShowAiSolverModal(true)}
            className="px-2.5 py-1.5 rounded-lg bg-[#27170E] hover:bg-[#341F13] border border-[#D96B27]/40 text-[#FF7A3D] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open Master AI Problem Solver"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>AI Solver</span>
            {activeConflictsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                {activeConflictsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Screen Quick-Jump Navigation Tabs */}
      <div className="bg-[#140F0D] border-b border-[#2E241E] px-4 py-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max max-w-7xl mx-auto">
          {SHARED_SCREENS.map((screen, idx) => {
            const isActive = activeScreenIndex === idx;
            return (
              <button
                key={screen.id}
                onClick={() => {
                  setActiveScreenIndex(idx);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#D96B27] text-white shadow-md shadow-[#D96B27]/25 font-bold'
                    : 'bg-[#181310] text-stone-400 hover:text-stone-200 hover:bg-[#201814] border border-[#2E241E]'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-stone-800 text-stone-400'
                }`}>
                  {screen.screenNumber}
                </span>
                <span>{screen.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Screen Container */}
      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {activeScreenIndex === 0 && (
            <motion.div
              key="screen-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <DashboardScreen />
            </motion.div>
          )}

          {activeScreenIndex === 1 && (
            <motion.div
              key="screen-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <VenueSearchScreen />
            </motion.div>
          )}

          {activeScreenIndex === 2 && (
            <motion.div
              key="screen-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <GuestManagerScreen />
            </motion.div>
          )}

          {activeScreenIndex === 3 && (
            <motion.div
              key="screen-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SmartBudgetScreen />
            </motion.div>
          )}

          {activeScreenIndex === 4 && (
            <motion.div
              key="screen-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <StaffOpsScreen />
            </motion.div>
          )}

          {activeScreenIndex === 5 && (
            <motion.div
              key="screen-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <EventHubScreen
                onEditSetup={onEditSetup}
                onLogOut={onLogOut}
                onEndEvent={onEndEvent}
                onOpenSelfChecks={() => setShowSelfChecks(true)}
                onOpenBriefAlignment={() => setShowBriefAlignment(true)}
              />
            </motion.div>
          )}

          {activeScreenIndex === 6 && (
            <motion.div
              key="screen-7"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AiConciergeScreen isActive={activeScreenIndex === 6} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Consistent Sticky Workspace Footer */}
      <footer className="sticky bottom-0 z-40 bg-[#16110E]/95 backdrop-blur-md border-t border-[#2E241E] px-4 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Previous Screen Button */}
          <button
            onClick={goToPrevious}
            disabled={activeScreenIndex === 0}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeScreenIndex === 0
                ? 'opacity-30 text-stone-600 cursor-not-allowed'
                : 'bg-[#221A15] hover:bg-[#2E241E] border border-[#3A2D24] text-stone-200 cursor-pointer shadow-sm'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">
              {prevScreen ? `Screen ${prevScreen.screenNumber}: ${prevScreen.shortTitle}` : 'Previous'}
            </span>
            <span className="sm:hidden">Prev</span>
          </button>

          {/* Current Screen Indicator & Dots */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1">
              {SHARED_SCREENS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveScreenIndex(idx);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeScreenIndex === idx
                      ? 'bg-[#D96B27] w-6'
                      : 'bg-[#2E241E] hover:bg-stone-600'
                  }`}
                  title={s.title}
                />
              ))}
            </div>

            <div className="text-xs font-bold text-stone-300">
              Screen {currentScreen.screenNumber} of {totalScreens}:{' '}
              <span className="text-[#FF7A3D]">{currentScreen.shortTitle}</span>
            </div>
          </div>

          {/* Next Screen Button */}
          <button
            onClick={goToNext}
            disabled={activeScreenIndex === totalScreens - 1}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeScreenIndex === totalScreens - 1
                ? 'opacity-30 text-stone-600 cursor-not-allowed'
                : 'bg-[#D96B27] hover:bg-[#EA580C] text-white cursor-pointer shadow-md shadow-[#D96B27]/20'
            }`}
          >
            <span className="hidden sm:inline">
              {nextScreen ? `Screen ${nextScreen.screenNumber}: ${nextScreen.shortTitle}` : 'Next'}
            </span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Modals */}
      <SelfChecksModal
        isOpen={showSelfChecks}
        onClose={() => setShowSelfChecks(false)}
      />

      <BriefAlignmentModal
        isOpen={showBriefAlignment}
        onClose={() => setShowBriefAlignment(false)}
      />

      <AIProblemSolverModal
        isOpen={showAiSolverModal}
        onClose={() => setShowAiSolverModal(false)}
        scenarios={scenarios}
        onResolveScenario={resolveScenario}
      />
    </div>
  );
};
