/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppStep, AuthUser, EventSetupData } from './types';
import { SplashAnimationScreen } from './components/SplashAnimationScreen';
import { SignScreen } from './components/SignScreen';
import { EventSetupScreen } from './components/EventSetupScreen';
import { SwipeHubScreen } from './components/SwipeHubScreen';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('splash');
  const [splashKey, setSplashKey] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [eventData, setEventData] = useState<EventSetupData>({
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
      runOfShowClock: true,
      multiTrackAgenda: true,
      vipGateRadar: true,
      avLightingMatrix: true,
      crowdFlowHeatmap: true,
      emergencyDispatch: true,
    },
  });

  // Transitions
  const handleSplashComplete = () => {
    setCurrentStep('sign');
  };

  const handleSignContinue = (user?: AuthUser) => {
    if (user) {
      setCurrentUser(user);
    }
    setCurrentStep('event-setup');
  };

  const handleSetupContinue = (data?: EventSetupData) => {
    if (data) {
      setEventData(data);
    }
    setCurrentStep('swipe-screens');
  };

  const handleRestartSplash = () => {
    setSplashKey((prev) => prev + 1);
    setCurrentStep('splash');
  };

  const steps: { id: AppStep; index: number }[] = [
    { id: 'splash', index: 1 },
    { id: 'sign', index: 2 },
    { id: 'event-setup', index: 3 },
    { id: 'swipe-screens', index: 4 },
  ];

  return (
    <div
      className={`w-full bg-[#120E0C] relative ${
        currentStep === 'splash'
          ? 'h-screen overflow-hidden select-none'
          : 'min-h-screen'
      }`}
    >
      {/* Discreet floating stage switcher for easy navigation on subsequent screens */}
      {currentStep !== 'splash' && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-1.5 p-1 rounded-full bg-slate-900/40 backdrop-blur-md border border-stone-800/80 shadow-md">
          {steps.map((st) => {
            const isActive = currentStep === st.id;
            return (
              <button
                key={st.id}
                onClick={() => {
                  if (st.id === 'splash') {
                    handleRestartSplash();
                  } else {
                    setCurrentStep(st.id);
                  }
                }}
                className={`w-6 h-6 rounded-full text-[11px] font-mono flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#D96B27] text-white font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
                title={`Stage ${st.index}`}
              >
                {st.index}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Screen Views */}
      <AnimatePresence mode="wait">
        {currentStep === 'splash' && (
          <motion.div
            key={`splash-${splashKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <SplashAnimationScreen
              onComplete={handleSplashComplete}
              autoPlayDuration={5.8}
            />
          </motion.div>
        )}

        {currentStep === 'sign' && (
          <motion.div
            key="sign"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full min-h-screen"
          >
            <SignScreen
              onContinue={handleSignContinue}
              onBackToSplash={handleRestartSplash}
            />
          </motion.div>
        )}

        {currentStep === 'event-setup' && (
          <motion.div
            key="event-setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full min-h-screen"
          >
            <EventSetupScreen
              onContinue={handleSetupContinue}
              onBackToSign={() => setCurrentStep('sign')}
              currentUser={currentUser}
              initialData={eventData}
            />
          </motion.div>
        )}

        {currentStep === 'swipe-screens' && (
          <motion.div
            key="swipe-screens"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-h-screen"
          >
            <SwipeHubScreen
              eventData={eventData}
              onBackToSetup={() => setCurrentStep('event-setup')}
              onEditSetup={() => setCurrentStep('event-setup')}
              onUpdateEventData={(data) => setEventData((prev) => ({ ...prev, ...data }))}
              onLogOut={() => {
                setCurrentUser(null);
                setCurrentStep('sign');
              }}
              onEndEvent={() => {
                setCurrentStep('splash');
                setSplashKey((k) => k + 1);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
