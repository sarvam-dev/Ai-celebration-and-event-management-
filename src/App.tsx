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
import { EventProvider } from './context/EventContext';

function isAutomatedCrawler(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /bot|crawl|spider|slurp|googlebot|google-inspectiontool|bingbot|duckduckbot|baiduspider|yandex|applebot|gptbot|oai-searchbot|chatgpt-user|claudebot|claude-web|anthropic-ai|perplexitybot|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|lighthouse/i.test(
    navigator.userAgent
  );
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>(() =>
    isAutomatedCrawler() ? 'sign' : 'splash'
  );
  const [splashKey, setSplashKey] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [eventData, setEventData] = useState<EventSetupData>({
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
    enabledModules: {
      dashboardChecklist: true,
      venueDiscovery: true,
      guestRegistry: true,
      budgetLedger: true,
      staffOps: true,
      eventControls: true,
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

  const onboardingSteps: { id: AppStep; index: number; label: string }[] = [
    { id: 'splash', index: 1, label: 'Intro' },
    { id: 'sign', index: 2, label: 'Sign In' },
    { id: 'event-setup', index: 3, label: 'Event Setup' },
  ];

  return (
    <div
      className={`w-full bg-[#120E0C] relative ${
        currentStep === 'splash'
          ? 'h-screen overflow-hidden select-none'
          : 'min-h-screen'
      }`}
    >
      {/* Onboarding Stage Stepper: Hidden after login/in workspace (Bug 10) */}
      {(currentStep === 'sign' || currentStep === 'event-setup') && (
        <div className="fixed top-4 right-4 z-40 flex items-center gap-1.5 p-1.5 rounded-full bg-[#181310]/90 backdrop-blur-md border border-[#2E241E] shadow-xl">
          <span className="text-xs font-mono text-stone-400 px-2 font-medium">Stage</span>
          {onboardingSteps.map((st) => {
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
                className={`w-7 h-7 rounded-full text-xs font-mono flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D96B27] text-white font-bold shadow-md shadow-[#D96B27]/30 ring-1 ring-[#FF7A3D]'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                }`}
                title={`Stage ${st.index}: ${st.label}`}
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
            <EventProvider initialData={eventData} initialUser={currentUser}>
              <SwipeHubScreen
                onBackToSetup={() => setCurrentStep('event-setup')}
                onEditSetup={() => setCurrentStep('event-setup')}
                onLogOut={() => {
                  setCurrentUser(null);
                  setCurrentStep('sign');
                }}
                onEndEvent={() => {
                  setCurrentStep('splash');
                  setSplashKey((k) => k + 1);
                }}
              />
            </EventProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
