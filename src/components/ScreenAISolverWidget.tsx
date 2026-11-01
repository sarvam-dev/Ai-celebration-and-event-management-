import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Scale, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ProblemScenario } from '../types';

interface ScreenAISolverWidgetProps {
  scenario?: ProblemScenario;
  onResolve: () => void;
  onOpenModal?: () => void;
  accentTitle?: string;
  metricComparison?: {
    beforeLabel: string;
    beforeValue: string;
    afterLabel: string;
    afterValue: string;
  };
  extraResolutionAction?: () => void;
  extraActionLabel?: string;
}

export const ScreenAISolverWidget: React.FC<ScreenAISolverWidgetProps> = ({
  scenario,
  onResolve,
  onOpenModal,
  accentTitle = 'AI LOGICAL THINKING & PROBLEM SOLVER',
  metricComparison,
  extraResolutionAction,
  extraActionLabel,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!scenario) return null;

  const handleResolveClick = () => {
    onResolve();
    if (extraResolutionAction) {
      extraResolutionAction();
    }
  };

  return (
    <div className={`rounded-3xl border transition-all overflow-hidden shadow-2xl ${
      scenario.resolved
        ? 'bg-[#15100E]/95 border-[#2E241E]'
        : scenario.severity === 'Critical'
        ? 'bg-[#1B120E]/95 border-[#D96B27]/80 ring-1 ring-[#D96B27]/30 shadow-[#D96B27]/10'
        : 'bg-[#181310]/95 border-[#38281F]'
    }`}>
      {/* Widget Header Banner */}
      <div className="p-5 sm:p-6 border-b border-[#281F19] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
            scenario.resolved 
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              : 'bg-gradient-to-br from-[#D96B27] to-[#EA580C] text-white shadow-[#D96B27]/30'
          }`}>
            {scenario.resolved ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Brain className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D96B27]/20 text-[#FF7A3D] border border-[#D96B27]/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D96B27]" />
                <span>{accentTitle}</span>
              </span>

              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                scenario.resolved
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : scenario.severity === 'Critical'
                  ? 'bg-red-950 text-red-300 border border-red-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {scenario.resolved ? 'Conflict Solved' : `${scenario.severity} Constraint`}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {scenario.title}
            </h3>
            <p className="text-sm text-stone-300 mt-1">
              <strong className="text-stone-400 font-semibold">Identified Conflict: </strong>
              {scenario.conflictIdentified}
            </p>
          </div>
        </div>

        {/* Header Right Action CTA */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2.5 rounded-xl bg-[#140F0D] hover:bg-[#201814] text-stone-200 hover:text-white border border-[#2A221C] text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            title="Inspect logical deductive chain of thought"
          >
            <span>{isExpanded ? 'Hide Logic' : 'View Chain of Thought'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {scenario.resolved ? (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-sm font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Optimal Equilibrium</span>
            </div>
          ) : (
            <button
              onClick={handleResolveClick}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D96B27] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#D96B27]/25 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{extraActionLabel || 'Apply AI Resolution'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Comparison Metrics Pill Strip (if provided) */}
      {metricComparison && (
        <div className="px-5 py-3.5 bg-[#120E0C] border-b border-[#241D18] flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-stone-400">{metricComparison.beforeLabel}:</span>
            <span className={`font-bold ${scenario.resolved ? 'line-through text-stone-500' : 'text-red-400'}`}>
              {metricComparison.beforeValue}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-stone-400">{metricComparison.afterLabel}:</span>
            <span className={`font-bold ${scenario.resolved ? 'text-emerald-400' : 'text-stone-200'}`}>
              {metricComparison.afterValue}
            </span>
          </div>

          {onOpenModal && (
            <button
              onClick={onOpenModal}
              className="text-xs font-mono text-[#FF7A3D] hover:underline flex items-center gap-1.5 ml-auto"
            >
              <span>Full AI Workbench</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Expandable Step-by-Step Chain-of-Thought Deep Dive */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-5 sm:p-6 bg-[#120E0C]/95 border-t border-[#261E18] space-y-4"
          >
            {/* Step 1: Physical Premise */}
            <div>
              <span className="text-xs font-mono text-[#FF7A3D] uppercase tracking-wider block mb-1 font-bold">
                Step 1: Established Physical & Logistical Premises
              </span>
              <p className="text-sm text-stone-200 bg-[#16100D] p-3.5 rounded-xl border border-[#241C16] leading-relaxed">
                {scenario.premise}
              </p>
            </div>

            {/* Step 2: Deductive Reasoning Steps */}
            <div>
              <span className="text-xs font-mono text-[#FF7A3D] uppercase tracking-wider block mb-1 font-bold">
                Step 2: Algorithmic Deductive Reasoning Trace
              </span>
              <div className="space-y-2 bg-[#16100D] p-3.5 rounded-xl border border-[#241C16]">
                {scenario.chainOfThought.map((thought, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-stone-200">
                    <span className="text-[#FF7A3D] font-mono font-bold shrink-0">{idx + 1}.</span>
                    <span>{thought}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Trade-Off Analysis */}
            <div>
              <span className="text-xs font-mono text-[#FF7A3D] uppercase tracking-wider block mb-1 font-bold">
                Step 3: Multi-Criteria Trade-Off Synthesis
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3.5 rounded-xl bg-[#16100D] border border-[#241C16]">
                  <span className="font-mono text-xs text-stone-400 block mb-1 font-bold">TRADEOFF A</span>
                  <p className="text-stone-200 text-sm">{scenario.tradeOffAnalysis.optionA}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#16100D] border border-[#241C16]">
                  <span className="font-mono text-xs text-stone-400 block mb-1 font-bold">TRADEOFF B</span>
                  <p className="text-stone-200 text-sm">{scenario.tradeOffAnalysis.optionB}</p>
                </div>
              </div>

              <div className="mt-2.5 p-3 rounded-xl bg-[#201712] border border-[#D96B27]/30 text-sm flex items-start gap-2.5">
                <Scale className="w-5 h-5 text-[#D96B27] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Optimal Synthesis: {scenario.tradeOffAnalysis.aiSelected} — </strong>
                  <span className="text-stone-200">{scenario.tradeOffAnalysis.rationale}</span>
                </div>
              </div>
            </div>

            {/* Step 4: Resolution Action */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#201813] to-[#1A140F] border border-[#3A2B20] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold block">
                  Prescribed Operational Directive:
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {scenario.resolutionTitle}
                </h4>
                <p className="text-sm text-stone-300 mt-0.5">
                  {scenario.resolutionImpact}
                </p>
              </div>

              {!scenario.resolved && (
                <button
                  onClick={handleResolveClick}
                  className="px-5 py-2.5 rounded-xl bg-[#D96B27] hover:bg-[#EA580C] text-white text-sm font-bold flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer shadow-md shadow-[#D96B27]/25"
                >
                  <Zap className="w-4 h-4" />
                  <span>Execute Solution Now</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
