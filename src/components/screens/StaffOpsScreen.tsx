import React, { useState } from 'react';
import { 
  Users, 
  Radio, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Phone, 
  Sparkles, 
  ArrowRight,
  Activity,
  UserCheck,
  ListChecks,
  Zap
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { ScreenHeader } from '../shared/ScreenHeader';
import { ScreenAISolverWidget } from '../ScreenAISolverWidget';
import { StaffRecord } from '../../types';
import { isStaffFatigued } from '../../utils/calculations';
import { RunOfShowCueSheet } from '../staff/RunOfShowCueSheet';

export const StaffOpsScreen: React.FC = () => {
  const { 
    staffRoster, 
    shiftHealth, 
    setStaffStatus, 
    resolveStaffHandover, 
    addStaff, 
    scenarios, 
    resolveScenario, 
    setActiveScreenIndex 
  } = useEvent();

  const [activeStaffTab, setActiveStaffTab] = useState<'roster' | 'runofshow'>('roster');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState('Production');
  const [newShift, setNewShift] = useState('14:00 - 22:00 (8h Standard)');
  const [newChannel, setNewChannel] = useState('Ch 1 - AV Control');

  const scenario5 = scenarios.find((s) => s.screenTarget === 5);
  const activeDutyCount = staffRoster.filter((s) => s.status === 'On Duty').length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addStaff({
      name: newName.trim(),
      role: newRole.trim() || 'General Operations Lead',
      dept: newDept,
      shift: newShift,
      status: 'On Duty',
      channel: newChannel,
      phone: '+1 (555) ' + Math.floor(1000000 + Math.random() * 9000000).toString().replace(/(\d{3})(\d{4})/, '$1-$2'),
    });
    setNewName('');
    setNewRole('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full text-stone-100 pb-20">
      {/* 1. Consistent Sticky Header */}
      <ScreenHeader
        screenNumber={5}
        title="Screen 5: Staff Ops"
        subtitle="Crew Shift Health, Duty Stations & Fatigue Mitigation"
        badge="Personnel Matrix"
        accent="orange"
        onQuickJump={setActiveScreenIndex}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* 2. Consistent Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Shift Health</span>
              <Activity className={`w-5 h-5 ${shiftHealth.score < 80 ? 'text-amber-400' : 'text-[#10B981]'}`} />
            </div>
            <div className={`text-2xl font-bold ${shiftHealth.score < 80 ? 'text-amber-400' : 'text-[#10B981]'}`}>
              {shiftHealth.score}%
            </div>
            <div className="text-xs text-stone-400 mt-1">
              {shiftHealth.fatiguedCount > 0 ? `${shiftHealth.fatiguedCount} fatigue warnings` : 'Zero fatigue risks'}
            </div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">On-Duty Personnel</span>
              <Users className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">
              {activeDutyCount} / {staffRoster.length}
            </div>
            <div className="text-xs text-stone-400 mt-1">Active on floor</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Comms Matrix</span>
              <Radio className="w-5 h-5 text-[#D96B27]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">5 Channels</div>
            <div className="text-xs text-stone-400 mt-1">RF encrypted trunking</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Break Compliance</span>
              <Clock className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">
              {shiftHealth.fatiguedCount === 0 ? '100%' : '67%'}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              {shiftHealth.fatiguedCount > 0 ? 'Handover required' : 'OSHA standard compliant'}
            </div>
          </div>
        </div>

        {/* 3. Consistent AI Conflict Card */}
        {scenario5 && (
          <ScreenAISolverWidget
            scenario={scenario5}
            onResolve={() => resolveScenario(scenario5.id)}
          />
        )}

        {/* Staff Ops Sub-Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#181310] border border-[#2E241E]">
          <button
            onClick={() => setActiveStaffTab('roster')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeStaffTab === 'roster'
                ? 'bg-[#D96B27] text-white shadow-md font-bold'
                : 'text-stone-400 hover:text-stone-200 bg-[#120E0C] border border-[#2E241E]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Crew Roster & Stations</span>
          </button>

          <button
            onClick={() => setActiveStaffTab('runofshow')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeStaffTab === 'runofshow'
                ? 'bg-[#D96B27] text-white shadow-md font-bold'
                : 'text-stone-400 hover:text-stone-200 bg-[#120E0C] border border-[#2E241E]'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Live Run-of-Show & Show Clock</span>
          </button>
        </div>

        {activeStaffTab === 'roster' && (
          <>
            {/* Fatigue Warning Banner if fatigue is active */}
            {shiftHealth.fatiguedCount > 0 && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-sm font-bold">
                      Fatigue Warning Active: {shiftHealth.fatiguedCount} staff members scheduled ≥12 hours without handover
                    </div>
                    <div className="text-xs text-amber-300/80">
                      Affecting: {shiftHealth.fatiguedNames.join(', ')}. Shift health score calibrated down to {shiftHealth.score}%.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    shiftHealth.fatiguedNames.forEach((name) => {
                      const staff = staffRoster.find((s) => s.name === name);
                      if (staff) resolveStaffHandover(staff.id);
                    });
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Assign Deputy Handover to All</span>
                </button>
              </div>
            )}

            {/* 4. Staff Directory & Duty Matrix */}
            <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-5 sm:p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D96B27]" />
                <span>Operational Roster & Duty Stations</span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Personnel deployment, active shifts, and walkie-talkie communication channels
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-lg bg-[#D96B27] hover:bg-[#EA580C] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-[#D96B27]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Staff</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {staffRoster.map((staff) => {
              const isFatigued = isStaffFatigued(staff);

              return (
                <div
                  key={staff.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isFatigued
                      ? 'bg-[#1E1410] border-amber-800/60 ring-1 ring-amber-700/40'
                      : 'bg-[#140F0D] border-[#2E241E] hover:border-[#3E2D22]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="text-sm font-bold text-stone-100 flex items-center gap-1.5">
                          <span>{staff.name}</span>
                          {isFatigued && (
                            <span className="p-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800" title="Fatigue Alert: ≥12h shift">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-400">{staff.role}</div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-xs bg-[#221A15] border border-[#3A2D24] text-stone-300">
                        {staff.dept}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-stone-300 bg-[#100D0B] p-2.5 rounded-lg border border-[#2E241E]">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Shift Window:</span>
                        <span className={`font-semibold ${isFatigued ? 'text-amber-400' : 'text-stone-200'}`}>
                          {staff.shift}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Radio Channel:</span>
                        <span className="font-mono text-[#D96B27] font-semibold">
                          {staff.channel}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Direct Comms:</span>
                        <span className="text-stone-300">{staff.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 mt-3 border-t border-[#2E241E] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {(['On Duty', 'On Break', 'Scheduled'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setStaffStatus(staff.id, status)}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            staff.status === status
                              ? status === 'On Duty'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 font-semibold'
                                : status === 'On Break'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50 font-semibold'
                                : 'bg-[#2E241E] text-stone-200 font-semibold'
                              : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                    {isFatigued && (
                      <button
                        onClick={() => resolveStaffHandover(staff.id)}
                        className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-stone-900 rounded text-xs font-bold transition-colors cursor-pointer"
                        title="Assign deputy handover"
                      >
                        Handover
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </>
        )}

        {/* Live Run-of-Show & Show Clock Tab */}
        {activeStaffTab === 'runofshow' && <RunOfShowCueSheet />}

        {/* Modal: Add Staff */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-stone-100">Add Operational Staff Member</h3>
              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div>
                  <label className="text-xs text-stone-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Staff name..."
                    className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#D96B27]"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400">Operational Role</label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Lead Sound Engineer"
                    className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#D96B27]"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-[#D96B27]"
                  >
                    <option value="Production">Production</option>
                    <option value="Catering">Catering</option>
                    <option value="Operations">Operations</option>
                    <option value="Guest Protocol">Guest Protocol</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-400">Shift Window</label>
                  <input
                    type="text"
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#D96B27]"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400">Radio Channel</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-[#D96B27]"
                  >
                    <option value="Ch 1 - AV Control">Ch 1 - AV Control</option>
                    <option value="Ch 2 - Culinary">Ch 2 - Culinary</option>
                    <option value="Ch 3 - Stage Comms">Ch 3 - Stage Comms</option>
                    <option value="Ch 4 - VIP Security">Ch 4 - VIP Security</option>
                    <option value="Ch 5 - Perimeter">Ch 5 - Perimeter</option>
                  </select>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg bg-[#221A15] text-stone-300 text-xs font-semibold hover:bg-[#2E241E]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#D96B27] hover:bg-[#EA580C] text-white text-xs font-semibold"
                  >
                    Confirm Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
