import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  ArrowRight,
  Flame,
  Award,
  Zap,
  Trash2
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { ScreenHeader } from '../shared/ScreenHeader';
import { ScreenAISolverWidget } from '../ScreenAISolverWidget';

interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  done: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: '1', title: 'Lock Primary Venue Rental Agreement & Floor Plan', category: 'Venue', done: true, priority: 'High' },
  { id: '2', title: 'Finalize Chef Curated Menu & Dietary Accommodations', category: 'Catering', done: true, priority: 'High' },
  { id: '3', title: 'Audio-Visual Rigging & Wireless Microphone Frequency Check', category: 'AV', done: true, priority: 'High' },
  { id: '4', title: 'Dispatch Digital QR Invitations to VIP Roster', category: 'Guests', done: true, priority: 'Medium' },
  { id: '5', title: 'Terracotta & Royal Gold Floral Staging Confirmation', category: 'Decor', done: false, priority: 'Medium' },
  { id: '6', title: 'Staff Briefing & Emergency Safety SOP Walkthrough', category: 'Staff', done: false, priority: 'High' },
  { id: '7', title: 'Verify Live Streaming 4K NDI Cameras & Redundancy', category: 'AV', done: false, priority: 'Low' },
];

export const DashboardScreen: React.FC = () => {
  const { 
    eventData, 
    currentUser, 
    selectedVenue, 
    totalBudget, 
    totalSpent, 
    remainingReserve, 
    guestList, 
    shiftHealth,
    scenarios,
    resolveScenario,
    setActiveScreenIndex
  } = useEvent();

  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('Production');

  const guestCountNum = Number(eventData.guestCount) || 450;
  const completedCount = checklist.filter((i) => i.done).length;
  const readinessPct = Math.round((completedCount / Math.max(1, checklist.length)) * 100);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const removeChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setChecklist((prev) => [
      ...prev,
      {
        id: `todo-${Date.now()}`,
        title: newTodoText.trim(),
        category: newTodoCategory,
        done: false,
        priority: 'Medium',
      },
    ]);
    setNewTodoText('');
  };

  const scenario1 = scenarios.find((s) => s.screenTarget === 1);

  return (
    <div className="w-full text-stone-100 pb-20">
      {/* 1. Consistent Sticky Header */}
      <ScreenHeader
        screenNumber={1}
        title="Screen 1: Dashboard"
        subtitle="Core Event Highlights & Master Preparation Checklist"
        badge="Executive Command"
        accent="orange"
        onQuickJump={setActiveScreenIndex}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* 2. Consistent Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Readiness Index</span>
              <Activity className="w-5 h-5 text-[#D96B27]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">{readinessPct}%</div>
            <div className="text-xs text-stone-400 mt-1">
              {completedCount} of {checklist.length} milestones cleared
            </div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Target Attendees</span>
              <Users className="w-5 h-5 text-[#D96B27]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">{guestCountNum}</div>
            <div className="text-xs text-stone-400 mt-1">
              {eventData.budgetTier} tier
            </div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Committed Budget</span>
              <DollarSign className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">${totalSpent.toLocaleString()}</div>
            <div className="text-xs text-stone-400 mt-1">
              Reserve: ${remainingReserve.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Shift Health</span>
              <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">{shiftHealth.score}%</div>
            <div className="text-xs text-stone-400 mt-1">
              {shiftHealth.fatiguedCount > 0 ? `${shiftHealth.fatiguedCount} fatigue alerts` : 'All shifts compliant'}
            </div>
          </div>
        </div>

        {/* 3. Consistent AI Conflict Card */}
        {scenario1 && (
          <ScreenAISolverWidget
            scenario={scenario1}
            onResolve={() => resolveScenario(scenario1.id)}
          />
        )}

        {/* 4. Core Event Highlights Card */}
        <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-5 sm:p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#2E241E]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D96B27]/20 text-[#FF7A3D] border border-[#D96B27]/40">
                  {eventData.eventType}
                </span>
                <span className="text-xs font-mono text-stone-400">
                  ID: EVT-{Math.abs(eventData.eventName.length * 37 + 104)}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight">
                {eventData.eventName}
              </h1>
              <p className="text-sm text-stone-300 mt-1">
                Honoree / Host:{' '}
                <span className="font-semibold text-[#FF7A3D]">
                  {eventData.honoreeOrHost || 'Evelyn & Julian Vance'}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3.5 py-2 rounded-lg bg-[#221A15] border border-[#3A2D24] text-xs text-stone-300">
                <div className="text-stone-400 font-mono">Theme Style</div>
                <div className="font-semibold text-stone-200">{eventData.themeStyle}</div>
              </div>
              <button
                onClick={() => setActiveScreenIndex(1)}
                className="px-4 py-2 rounded-lg bg-[#D96B27] hover:bg-[#EA580C] text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-[#D96B27]/20 cursor-pointer"
              >
                <span>Select Venues</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Key telemetry pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#140F0D] border border-[#2E241E]">
              <div className="w-10 h-10 rounded-lg bg-[#D96B27]/20 border border-[#D96B27]/40 flex items-center justify-center text-[#FF7A3D]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-stone-400">Assigned Venue</div>
                <div className="text-sm font-semibold text-stone-200 truncate">
                  {selectedVenue?.name || eventData.venueName}
                </div>
                <div className="text-xs text-stone-400">{eventData.venueCity || 'Metropolis Central'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#140F0D] border border-[#2E241E]">
              <div className="w-10 h-10 rounded-lg bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-stone-400">Scheduled Date</div>
                <div className="text-sm font-semibold text-stone-200">
                  {eventData.startDate} at {eventData.startTime}
                </div>
                <div className="text-xs text-stone-400">Multi-Day Window: Day -1 to Day 3</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#140F0D] border border-[#2E241E]">
              <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-stone-400">Total Authorized Budget</div>
                <div className="text-sm font-semibold text-stone-200">
                  ${totalBudget.toLocaleString()}
                </div>
                <div className="text-xs text-stone-400">
                  ~${Math.round(totalBudget / Math.max(1, guestCountNum))} per guest allocation
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Master Preparation Checklist */}
        <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-5 sm:p-6 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#D96B27]" />
                <span>Master Production Checklist</span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Critical path deliverables for seamless event execution
              </p>
            </div>

            <div className="w-full sm:w-48 bg-[#140F0D] rounded-full h-3 border border-[#2E241E] overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D96B27] to-[#10B981] h-full transition-all duration-500 rounded-full"
                style={{ width: `${readinessPct}%` }}
              />
            </div>
          </div>

          {/* List items */}
          <div className="space-y-2 pt-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`flex items-center justify-between p-3.5 rounded-lg border transition-all cursor-pointer ${
                  item.done
                    ? 'bg-[#15110E]/60 border-[#2E241E] text-stone-400'
                    : 'bg-[#201814] border-[#3E2D22] text-stone-200 hover:border-[#D96B27]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="focus:outline-none"
                    aria-label={item.done ? 'Mark task incomplete' : 'Mark task complete'}
                  >
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-500 hover:text-[#D96B27] shrink-0" />
                    )}
                  </button>
                  <span className={`text-sm font-medium ${item.done ? 'line-through text-stone-500' : 'text-stone-100'}`}>
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded bg-[#140F0D] border border-[#2E241E] text-stone-400">
                    {item.category}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      item.priority === 'High'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                        : item.priority === 'Medium'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                    }`}
                  >
                    {item.priority}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChecklistItem(item.id);
                    }}
                    className="p-1 text-stone-500 hover:text-rose-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add custom item form */}
          <form onSubmit={handleAddTodo} className="pt-3 flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add new production milestone or deliverable..."
              className="flex-1 w-full bg-[#140F0D] border border-[#2E241E] rounded-lg px-3.5 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D96B27]"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={newTodoCategory}
                onChange={(e) => setNewTodoCategory(e.target.value)}
                className="bg-[#140F0D] border border-[#2E241E] rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-[#D96B27]"
              >
                <option value="Production">Production</option>
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="AV">AV & Tech</option>
                <option value="Guests">Guests</option>
                <option value="Staff">Staff</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#D96B27] hover:bg-[#EA580C] text-white text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
