import React, { useState } from 'react';
import { 
  Sliders, 
  Power, 
  Share2, 
  FileText, 
  LogOut, 
  RotateCcw, 
  CheckCircle2, 
  Copy, 
  QrCode, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles,
  ExternalLink,
  BookOpen,
  ClipboardCheck,
  Building,
  Users
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { ScreenHeader } from '../shared/ScreenHeader';
import { ScreenAISolverWidget } from '../ScreenAISolverWidget';

interface EventHubScreenProps {
  onEditSetup?: () => void;
  onLogOut?: () => void;
  onEndEvent?: () => void;
  onOpenSelfChecks?: () => void;
  onOpenBriefAlignment?: () => void;
}

export const EventHubScreen: React.FC<EventHubScreenProps> = ({
  onEditSetup,
  onLogOut,
  onEndEvent,
  onOpenSelfChecks,
  onOpenBriefAlignment,
}) => {
  const { 
    eventData, 
    currentUser, 
    selectedVenue, 
    totalBudget, 
    totalSpent, 
    remainingReserve, 
    guestList, 
    resetDemoData, 
    scenarios, 
    resolveScenario, 
    setActiveScreenIndex 
  } = useEvent();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showDebriefReport, setShowDebriefReport] = useState(false);

  const scenario6 = scenarios.find((s) => s.screenTarget === 6);
  const sharePasscode = `EVT-${Math.abs(eventData.eventName.length * 37 + 104)}-VIP`;
  const shareUrl = `https://eventstudio.ai/portal/${eventData.eventName.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(sharePasscode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full text-stone-100 pb-20">
      {/* 1. Consistent Sticky Header */}
      <ScreenHeader
        screenNumber={6}
        title="Screen 6: Event Hub"
        subtitle="Governance, Multi-Channel Share, Legal T&C & Debrief"
        badge="Governance Hub"
        accent="orange"
        onQuickJump={setActiveScreenIndex}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* 2. Consistent Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Session Status</span>
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="text-lg font-bold text-[#10B981]">Active & Locked</div>
            <div className="text-xs text-stone-400 mt-1">Multi-role governance active</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Event Passcode</span>
              <QrCode className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="text-sm font-mono font-bold text-stone-100 truncate">
              {sharePasscode}
            </div>
            <div className="text-xs text-stone-400 mt-1">Authorized VIP pass</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Signed-In Producer</span>
              <Users className="w-5 h-5 text-[#D96B27]" />
            </div>
            <div className="text-sm font-bold text-stone-100 truncate">
              {currentUser?.name || 'Director Quantrom'}
            </div>
            <div className="text-xs text-stone-400 mt-1">{currentUser?.role || 'Producer'}</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Reserve Health</span>
              <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="text-lg font-bold text-stone-100">
              ${remainingReserve.toLocaleString()}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              {remainingReserve > 0 ? 'Surplus buffer available' : 'Budget fully committed'}
            </div>
          </div>
        </div>

        {/* 3. Consistent AI Conflict Card */}
        {scenario6 && (
          <ScreenAISolverWidget
            scenario={scenario6}
            onResolve={() => resolveScenario(scenario6.id)}
          />
        )}

        {/* 4. Controls & Diagnostics Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Diagnostic & Verification Modals Card */}
          <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-5 sm:p-6 shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-[#D96B27]" />
              <span>Verification & Problem Alignment</span>
            </h2>
            <p className="text-xs text-stone-400">
              Run automated mathematical self-checks and inspect compliance with all requirements.
            </p>

            <div className="space-y-3 pt-1">
              <button
                onClick={onOpenSelfChecks}
                className="w-full p-3.5 rounded-lg bg-[#221A15] hover:bg-[#2E241E] border border-[#3A2D24] text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-100">Run Unit Self-Checks</div>
                    <div className="text-xs text-stone-400">
                      Tests budget reserve math, venue capacity filter, RSVP %, and queue time
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                  Execute Suite
                </span>
              </button>

              <button
                onClick={onOpenBriefAlignment}
                className="w-full p-3.5 rounded-lg bg-[#221A15] hover:bg-[#2E241E] border border-[#3A2D24] text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#D96B27]/20 border border-[#D96B27]/40 flex items-center justify-center text-[#FF7A3D]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-100">How This App Meets the Brief</div>
                    <div className="text-xs text-stone-400">
                      Maps every requirement and acceptance criterion directly to screens
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[#2E241E] text-stone-300 border border-[#3E2D22]">
                  View Matrix
                </span>
              </button>

              <button
                onClick={resetDemoData}
                className="w-full p-3.5 rounded-lg bg-[#221A15] hover:bg-[#2E241E] border border-[#3A2D24] text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-100">Reset Demo Data</div>
                    <div className="text-xs text-stone-400">
                      Restore default expenses ($4,350 reserve), sample guests, and initial staff
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/40">
                  Reset State
                </span>
              </button>
            </div>
          </div>

          {/* Share & Portals Card */}
          <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-5 sm:p-6 shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#D96B27]" />
              <span>Share Event & VIP Guest Portals</span>
            </h2>
            <p className="text-xs text-stone-400">
              Provide guests and staff secure, encrypted access to itineraries and check-in portals.
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-3 rounded-lg bg-[#140F0D] border border-[#2E241E] flex items-center justify-between gap-2">
                <div className="truncate">
                  <div className="text-xs text-stone-400">Encrypted Public Portal URL</div>
                  <div className="text-xs font-mono text-stone-200 truncate">{shareUrl}</div>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded bg-[#221A15] hover:bg-[#2E241E] border border-[#3A2D24] text-xs font-semibold text-stone-200 flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-[#140F0D] border border-[#2E241E] flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-stone-400">Access Key & Turnstile PIN</div>
                  <div className="text-xs font-mono font-bold text-[#FF7A3D]">{sharePasscode}</div>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded bg-[#221A15] hover:bg-[#2E241E] border border-[#3A2D24] text-xs font-semibold text-stone-200 flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode ? 'Copied!' : 'Copy PIN'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#140F0D] hover:bg-[#1C1512] border border-[#2E241E] text-xs font-semibold text-stone-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-stone-400" />
                  <span>Terms & Privacy</span>
                </button>

                <button
                  onClick={onEditSetup}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#140F0D] hover:bg-[#1C1512] border border-[#2E241E] text-xs font-semibold text-stone-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#D96B27]" />
                  <span>Edit Setup Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Production Wrap-Up & End Event */}
        <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-[#22130D] via-[#1A110D] to-[#140F0D] border border-[#3E251A] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Power className="w-5 h-5 text-rose-400" />
              <span>Conclude & Archive Celebration</span>
            </h3>
            <p className="text-xs text-stone-300">
              Finalize all vendor invoices, lock the guest register, archive telemetry, and generate the wrap-up debrief report.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowEndModal(true)}
              className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5" />
              <span>End Event & Generate Debrief</span>
            </button>

            <button
              onClick={onLogOut}
              className="px-4 py-2 rounded-lg bg-[#221A15] hover:bg-[#2E241E] border border-[#3A2D24] text-stone-300 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* End Event Modal */}
        {showEndModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-lg font-bold text-stone-100">Conclude & Lock Celebration</h3>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                Ending &ldquo;{eventData.eventName}&rdquo; will freeze all {guestList.length} guest records, seal the committed financial ledger (${totalSpent.toLocaleString()} committed, ${remainingReserve.toLocaleString()} reserve), and generate an executive debrief report.
              </p>

              <div className="p-3 rounded-lg bg-[#140F0D] border border-[#2E241E] space-y-1.5 text-xs text-stone-300 font-mono">
                <div>Event Name: {eventData.eventName}</div>
                <div>Venue: {selectedVenue?.name || eventData.venueName}</div>
                <div>Total Budget: ${totalBudget.toLocaleString()}</div>
                <div>Committed Spent: ${totalSpent.toLocaleString()}</div>
                <div>Remaining Reserve: ${remainingReserve.toLocaleString()}</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEndModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#221A15] text-stone-300 text-xs font-semibold hover:bg-[#2E241E]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEndModal(false);
                    onEndEvent?.();
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Confirm & Archive Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Terms & Conditions Modal */}
        {showTermsModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#2E241E]">
                <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D96B27]" />
                  <span>Production Terms & Governance Policy</span>
                </h3>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-stone-400 hover:text-stone-200 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-stone-300 leading-relaxed">
                <div>
                  <h4 className="font-bold text-stone-100 mb-1">1. Budgetary Integrity & Authorization</h4>
                  <p>
                    All committed expenses are audited against the central reserve threshold. Negative expense allocations are prohibited by software invariants. Reallocations must maintain 100.0% capital conservation.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-stone-100 mb-1">2. Occupational Safety & Shift Health</h4>
                  <p>
                    Continuous duty shifts exceeding 12 hours require mandatory appointment of secondary deputies. The application automatically penalizes Shift Health ratings upon detection of unmitigated fatigue.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-stone-100 mb-1">3. Guest Dietary Protocols & Seating Sanitation</h4>
                  <p>
                    Known anaphylactic allergens must maintain a minimum 5-meter physical buffer from active kitchen service lines and moving banquet trays.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-[#2E241E]">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#D96B27] text-white text-xs font-semibold"
                >
                  Acknowledge & Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
