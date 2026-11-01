import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ShieldAlert, 
  Sliders, 
  Zap, 
  TrendingUp, 
  RefreshCw, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Brain, 
  Activity, 
  Compass, 
  Scale, 
  Flame
} from 'lucide-react';
import { ProblemScenario, EventSetupData } from '../types';

interface AIProblemSolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarios: ProblemScenario[];
  onResolveScenario: (scenarioId: string) => void;
  onResolveAllScenarios: () => void;
  onRunCustomSimulation: (problem: string) => Promise<any>;
  eventData?: EventSetupData;
  activeScreenIndex: number;
  onJumpToScreen: (screenIndex: number) => void;
}

export const AIProblemSolverModal: React.FC<AIProblemSolverModalProps> = ({
  isOpen,
  onClose,
  scenarios,
  onResolveScenario,
  onResolveAllScenarios,
  onRunCustomSimulation,
  eventData,
  activeScreenIndex,
  onJumpToScreen,
}) => {
  const [selectedScreenFilter, setSelectedScreenFilter] = useState<number | 'all'>('all');
  const [expandedScenarioId, setExpandedScenarioId] = useState<string | null>(null);
  const [customProblemInput, setCustomProblemInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [customAnalysisResult, setCustomAnalysisResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'simulator'>('diagnostics');

  if (!isOpen) return null;

  const filteredScenarios = scenarios.filter((s) => {
    if (selectedScreenFilter === 'all') return true;
    return s.screenTarget === selectedScreenFilter;
  });

  const unresolvedCount = scenarios.filter((s) => !s.resolved).length;
  const criticalCount = scenarios.filter((s) => !s.resolved && s.severity === 'Critical').length;

  const toggleExpand = (id: string) => {
    setExpandedScenarioId((prev) => (prev === id ? null : id));
  };

  const handleSimulateSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customProblemInput.trim() || isSimulating) return;

    setIsSimulating(true);
    setCustomAnalysisResult(null);

    try {
      const result = await onRunCustomSimulation(customProblemInput.trim());
      setCustomAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const presetSimulations = [
    {
      title: 'Thunderstorm Forecast During Outdoor Cocktail',
      prompt: 'Weather radar reports 75% probability of sudden torrential rain 30 minutes before 18:00 outdoor guest arrival. 450 guests expected.',
      category: 'Weather & Spatial',
    },
    {
      title: '15% Unregistered VIP Entourage Surge (+65 Guests)',
      prompt: 'High-profile dignitary arrives with 65 unannounced security & executive staff at the entrance turnstiles. Seating is fully capped.',
      category: 'Crowd & Seating',
    },
    {
      title: 'Catering Supplier Meat & Dairy Recall Notice',
      prompt: 'At 15:00, main catering supplier notifies that the primary beef tenderloin shipment failed health inspection. Banquet service is at 19:30.',
      category: 'Catering Emergency',
    },
    {
      title: 'Main AV Power Circuit Breaker Overload',
      prompt: 'Intelligent lighting rig combined with subwoofers trips Stage B 200A main circuit during soundcheck. 45 minutes until doors open.',
      category: 'AV & Technical',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-4xl max-h-[92vh] bg-[#181310] border border-[#2E241E] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#FAF8F5]"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#1F1814]/90 border-b border-[#2A221D] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D96B27] to-[#EA580C] text-white flex items-center justify-center shadow-lg shadow-[#D96B27]/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>AI Logical Thinking & Problem Solver Engine</span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D96B27]/20 text-[#FF7A3D] border border-[#D96B27]/40">
                    Gemini 3.8 Flash Active
                  </span>
                </h2>
              </div>
              <p className="text-xs text-stone-400">
                Automated dilemma detection, constraint satisfaction, and trade-off synthesis across all 7 event screens
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unresolvedCount > 0 && (
              <button
                onClick={onResolveAllScenarios}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
                title="Automatically apply AI logical resolutions to all detected conflicts"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Auto-Solve All ({unresolvedCount})</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#140F0D] hover:bg-[#251D18] text-stone-400 hover:text-white border border-[#2E241E] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-[#181310] border-b border-[#241D18] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'diagnostics'
                  ? 'border-[#D96B27] text-white'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#D96B27]" />
              <span>Live Conflict Diagnostics</span>
              {unresolvedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-red-950 text-red-300 border border-red-800">
                  {unresolvedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'simulator'
                  ? 'border-[#D96B27] text-white'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#D96B27]" />
              <span>"What-If" Stress Simulator</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-stone-400 hidden md:block">
            Screen Active: <span className="text-[#FF7A3D] font-bold">Screen {activeScreenIndex + 1}</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === 'diagnostics' && (
            <div className="space-y-5">
              {/* Screen Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pb-2">
                <span className="text-[11px] font-mono text-stone-400 mr-1">Filter Screen:</span>
                <button
                  onClick={() => setSelectedScreenFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedScreenFilter === 'all'
                      ? 'bg-[#D96B27] text-white font-bold'
                      : 'bg-[#120E0C] text-stone-400 hover:text-white border border-[#241D18]'
                  }`}
                >
                  All Screens ({scenarios.length})
                </button>
                {[
                  { num: 1, label: '1. Dashboard' },
                  { num: 2, label: '2. Venues' },
                  { num: 3, label: '3. Guests' },
                  { num: 4, label: '4. Budget' },
                  { num: 5, label: '5. Staff' },
                  { num: 6, label: '6. Controls' },
                  { num: 7, label: '7. AI Chatbot' },
                ].map((s) => (
                  <button
                    key={s.num}
                    onClick={() => setSelectedScreenFilter(s.num)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedScreenFilter === s.num
                        ? 'bg-[#D96B27] text-white font-bold'
                        : 'bg-[#120E0C] text-stone-400 hover:text-white border border-[#241D18]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Status Alert Banner */}
              <div className="p-4 rounded-2xl bg-[#120E0C] border border-[#2A221C] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    criticalCount > 0 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {criticalCount > 0 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {unresolvedCount > 0 
                        ? `AI Logic Engine identified ${unresolvedCount} operational conflicts (${criticalCount} Critical)`
                        : 'All operational conflicts resolved. System at 100% logical equilibrium.'
                      }
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Logical deductions are computed continuously using event parameters ({eventData?.guestCount || 450} guests, budget ${Number(eventData?.totalBudget || 65000).toLocaleString()})
                    </p>
                  </div>
                </div>

                {unresolvedCount > 0 && (
                  <button
                    onClick={onResolveAllScenarios}
                    className="sm:hidden w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Auto-Solve All</span>
                  </button>
                )}
              </div>

              {/* Scenarios List */}
              <div className="space-y-3.5">
                {filteredScenarios.map((scenario) => {
                  const isExpanded = expandedScenarioId === scenario.id;
                  return (
                    <div
                      key={scenario.id}
                      className={`rounded-2xl border transition-all ${
                        scenario.resolved
                          ? 'bg-[#14100E] border-[#221B16] opacity-80'
                          : scenario.severity === 'Critical'
                          ? 'bg-[#1E1410] border-red-900/60 shadow-lg shadow-red-950/20'
                          : 'bg-[#1A1411] border-[#33251E]'
                      }`}
                    >
                      {/* Summary Row */}
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => toggleExpand(scenario.id)}
                            className="mt-0.5 p-1 rounded-lg bg-[#140F0D] hover:bg-[#201814] text-stone-400 hover:text-white"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-[#D96B27]/20 text-[#FF7A3D] border border-[#D96B27]/30">
                                {scenario.screenName}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                  scenario.severity === 'Critical'
                                    ? 'bg-red-950 text-red-300 border border-red-800'
                                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                                }`}
                              >
                                {scenario.severity}
                              </span>
                              <span className="text-[10px] font-mono text-stone-400">
                                {scenario.category}
                              </span>
                            </div>

                            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                              {scenario.title}
                            </h3>
                            <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                              <span className="text-stone-400 font-semibold">Conflict: </span>
                              {scenario.conflictIdentified}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => onJumpToScreen(scenario.screenTarget - 1)}
                            className="px-2.5 py-1.5 rounded-xl bg-[#140F0D] hover:bg-[#201814] text-stone-300 hover:text-white text-xs font-mono border border-[#2A221C] flex items-center gap-1"
                            title="Navigate directly to this screen"
                          >
                            <span>Screen {scenario.screenTarget}</span>
                            <ArrowRight className="w-3 h-3 text-[#D96B27]" />
                          </button>

                          {scenario.resolved ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Resolved</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => onResolveScenario(scenario.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#D96B27] hover:bg-[#EA580C] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#D96B27]/25 transition-all cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>Apply AI Solution</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable Chain-of-Thought Deep Dive */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-[#261E18] p-4 sm:p-5 bg-[#120E0C]/90 space-y-4"
                          >
                            {/* Premise */}
                            <div>
                              <span className="text-[10px] font-mono text-[#FF7A3D] uppercase tracking-wider block mb-1">
                                1. Established Axioms & Mathematical Constraints
                              </span>
                              <p className="text-xs text-stone-300 bg-[#16100D] p-3 rounded-xl border border-[#241C16]">
                                {scenario.premise}
                              </p>
                            </div>

                            {/* Chain of Thought Deductions */}
                            <div>
                              <span className="text-[10px] font-mono text-[#FF7A3D] uppercase tracking-wider block mb-1">
                                2. AI Chain-of-Thought Deductive Reasoning
                              </span>
                              <div className="space-y-1.5 bg-[#16100D] p-3 rounded-xl border border-[#241C16]">
                                {scenario.chainOfThought.map((thought, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-xs text-stone-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#D96B27] mt-1.5 shrink-0" />
                                    <span>{thought}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Multi-Criteria Trade-Off Evaluation */}
                            <div>
                              <span className="text-[10px] font-mono text-[#FF7A3D] uppercase tracking-wider block mb-1">
                                3. Trade-Off Analysis & Algorithmic Selection
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div className="p-3 rounded-xl bg-[#16100D] border border-[#241C16]">
                                  <span className="font-mono text-[10px] text-stone-400 block mb-1">OPTION A (Conservative)</span>
                                  <p className="text-stone-300 text-[11px]">{scenario.tradeOffAnalysis.optionA}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-[#16100D] border border-[#241C16]">
                                  <span className="font-mono text-[10px] text-stone-400 block mb-1">OPTION B (Optimized)</span>
                                  <p className="text-stone-300 text-[11px]">{scenario.tradeOffAnalysis.optionB}</p>
                                </div>
                              </div>
                              <div className="mt-2 p-2.5 rounded-xl bg-[#201712] border border-[#D96B27]/30 text-xs flex items-start gap-2">
                                <Scale className="w-4 h-4 text-[#D96B27] shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-white">AI Choice: {scenario.tradeOffAnalysis.aiSelected} — </span>
                                  <span className="text-stone-300">{scenario.tradeOffAnalysis.rationale}</span>
                                </div>
                              </div>
                            </div>

                            {/* Resolution Details */}
                            <div className="p-3 rounded-xl bg-gradient-to-r from-[#201813] to-[#1C1510] border border-[#3A2A20] flex items-center justify-between gap-3">
                              <div>
                                <span className="text-[10px] font-mono text-emerald-400 block uppercase font-bold">
                                  Prescribed Operational Action:
                                </span>
                                <h4 className="text-xs font-bold text-white mt-0.5">{scenario.resolutionTitle}</h4>
                                <p className="text-[11px] text-stone-400">{scenario.resolutionImpact}</p>
                              </div>

                              {!scenario.resolved && (
                                <button
                                  onClick={() => onResolveScenario(scenario.id)}
                                  className="px-3 py-1.5 rounded-xl bg-[#D96B27] hover:bg-[#EA580C] text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                                >
                                  <Zap className="w-3.5 h-3.5" />
                                  <span>Execute</span>
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="space-y-6">
              {/* Simulator Header */}
              <div className="bg-[#120E0C] border border-[#2A221C] p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FF7A3D]">
                  <Activity className="w-4 h-4 text-[#D96B27]" />
                  <span>CRISIS & STRESS SIMULATION WORKBENCH</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Test Your Event Plan Against Edge Cases & Emergent Bottlenecks
                </h3>
                <p className="text-xs text-stone-300">
                  Select a classic production curveball below, or type your own custom dilemma. The AI reasoning engine performs step-by-step constraint logic, stress-tests the schedule, and generates compensatory actions.
                </p>
              </div>

              {/* Preset Scenarios Grid */}
              <div>
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-2">
                  Rapid Stress Test Scenarios:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {presetSimulations.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCustomProblemInput(preset.prompt);
                      }}
                      className="p-3.5 rounded-2xl bg-[#140F0D] hover:bg-[#221A15] border border-[#281F19] hover:border-[#D96B27]/60 text-left transition-all space-y-1.5 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#FF7A3D] uppercase">{preset.category}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-colors" />
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#FF7A3D] transition-colors">
                        {preset.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 line-clamp-2">{preset.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input Form */}
              <form onSubmit={handleSimulateSubmit} className="space-y-3">
                <label className="block text-xs font-bold text-white">
                  Or enter any custom problem, dilemma, or unexpected constraint:
                </label>
                <textarea
                  value={customProblemInput}
                  onChange={(e) => setCustomProblemInput(e.target.value)}
                  rows={3}
                  placeholder="e.g. 3 VIP buses delayed by highway traffic, dinner catering will go cold if postponed 40 minutes..."
                  className="w-full px-4 py-3 bg-[#100D0B] border border-[#2A221C] rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#D96B27] placeholder-stone-500"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-stone-500">
                    Runs logical deduction matrix across timeline, budget, and guest safety
                  </span>

                  <button
                    type="submit"
                    disabled={isSimulating || !customProblemInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D96B27] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] disabled:bg-stone-800 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#D96B27]/25 transition-all cursor-pointer"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing Logic Chains...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-3.5 h-3.5" />
                        <span>Run AI Logical Deduction</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Custom Analysis Output */}
              {customAnalysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-[#140F0D] border border-[#D96B27]/50 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#281F19]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D96B27]" />
                      <span className="text-xs font-mono font-bold text-white uppercase">
                        AI Deduction & Problem Resolution Synthesis
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Logical Equilibrium Achieved
                    </span>
                  </div>

                  {/* Premise */}
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase block mb-1">Established Premise</span>
                    <p className="text-xs text-stone-200 bg-[#100D0B] p-3 rounded-xl border border-[#221B16]">
                      {customAnalysisResult.premise}
                    </p>
                  </div>

                  {/* Root Conflict */}
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase block mb-1">Root Conflict & Paradox</span>
                    <p className="text-xs text-red-200 bg-red-950/40 p-3 rounded-xl border border-red-900/40">
                      {customAnalysisResult.rootConflict}
                    </p>
                  </div>

                  {/* Chain of Thought */}
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase block mb-1">Chain-of-Thought Steps</span>
                    <div className="space-y-1 bg-[#100D0B] p-3 rounded-xl border border-[#221B16]">
                      {customAnalysisResult.chainOfThought?.map((step: string, i: number) => (
                        <div key={i} className="text-xs text-stone-300 flex items-start gap-2">
                          <span className="text-[#FF7A3D] font-mono font-bold">{i + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trade-Off Selection */}
                  {customAnalysisResult.tradeOff && (
                    <div className="p-3 rounded-xl bg-[#1B1410] border border-[#2D2119] space-y-1.5 text-xs">
                      <div className="font-bold text-white flex items-center gap-2">
                        <Scale className="w-3.5 h-3.5 text-[#D96B27]" />
                        <span>Chosen Path: {customAnalysisResult.tradeOff.aiSelected}</span>
                      </div>
                      <p className="text-stone-300 text-[11px]">{customAnalysisResult.tradeOff.rationale}</p>
                    </div>
                  )}

                  {/* Directive */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase block font-bold">
                        AI Recommended Operational Directive
                      </span>
                      <p className="text-xs font-bold text-white mt-0.5">
                        {customAnalysisResult.recommendedAction}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 cursor-pointer"
                    >
                      Apply To Live Plan
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#140F0D] border-t border-[#261E18] flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <Brain className="w-3.5 h-3.5 text-[#D96B27]" />
            <span>AI Reasoning Matrix V2.5 • Continuous Constraint Solver</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#201814] hover:bg-[#2A201B] text-stone-200 hover:text-white font-semibold transition-colors"
          >
            Close Panel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
