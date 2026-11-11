import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  QrCode, 
  Trash2,
  Sliders,
  Utensils,
  ShieldCheck,
  ChevronRight,
  Layers,
  Camera,
  Share2,
  Maximize2
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { ScreenHeader } from '../shared/ScreenHeader';
import { ScreenAISolverWidget } from '../ScreenAISolverWidget';
import { GuestRecord } from '../../types';
import { FloorPlanStudio } from '../venue/FloorPlanStudio';
import { DoorScannerSimulator } from '../guests/DoorScannerSimulator';
import { DigitalInvitationModal } from '../guests/DigitalInvitationModal';

export const GuestManagerScreen: React.FC = () => {
  const { 
    eventData, 
    guestList, 
    toggleGuestCheckIn, 
    updateGuestRsvp, 
    addGuest, 
    removeGuest,
    turnstileGates,
    secondsPerGuest,
    setTurnstileGates,
    totalInvited,
    attendingCount,
    pendingCount,
    declinedCount,
    checkedInCount,
    confirmationRate,
    queueWaitTime,
    throughputPerMinute,
    scenarios,
    resolveScenario,
    setActiveScreenIndex
  } = useEvent();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRsvp, setFilterRsvp] = useState<'All' | 'Attending' | 'Pending' | 'Declined'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTier, setNewTier] = useState('Standard');
  const [newTable, setNewTable] = useState('Table 06 (Patrons)');
  const [newDiet, setNewDiet] = useState('Standard Executive');
  const [activeViewTab, setActiveViewTab] = useState<'roster' | 'floorplan' | 'scanner'>('roster');
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [invitationGuest, setInvitationGuest] = useState<GuestRecord | null>(null);

  const scenario3 = scenarios.find((s) => s.screenTarget === 3);

  // Filtered guest list
  const filteredGuests = useMemo(() => {
    return guestList.filter((g) => {
      const matchSearch = 
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.diet.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRsvp = filterRsvp === 'All' || g.rsvp === filterRsvp;
      return matchSearch && matchRsvp;
    });
  }, [guestList, searchQuery, filterRsvp]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addGuest({
      name: newName.trim(),
      rsvp: 'Attending',
      tier: newTier,
      table: newTable,
      diet: newDiet,
      checkedIn: false,
      phone: '+1 (555) ' + Math.floor(1000000 + Math.random() * 9000000).toString().replace(/(\d{3})(\d{4})/, '$1-$2'),
    });
    setNewName('');
    setShowAddModal(false);
  };

  return (
    <div className="w-full text-stone-100 pb-20">
      {/* 1. Consistent Sticky Header */}
      <ScreenHeader
        screenNumber={3}
        title="Screen 3: Guest Manager"
        subtitle="Real-Time RSVP Roster & Door Turnstile Ingress Formula"
        badge="Hospitality Ops"
        accent="orange"
        onQuickJump={setActiveScreenIndex}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* 2. Consistent Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Invited Target</span>
              <Users className="w-5 h-5 text-[#D96B27]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">{totalInvited}</div>
            <div className="text-xs text-stone-400 mt-1">Host master count</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Confirmed Attending</span>
              <UserCheck className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">{attendingCount}</div>
            <div className="text-xs text-stone-400 mt-1">{confirmationRate}% of sample cohort</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Pending Response</span>
              <Clock className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">{pendingCount}</div>
            <div className="text-xs text-stone-400 mt-1">Follow-up active</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Declined</span>
              <Users className="w-5 h-5 text-stone-500" />
            </div>
            <div className="text-2xl font-bold text-stone-100">{declinedCount}</div>
            <div className="text-xs text-stone-400 mt-1">Released covers</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Door Checked-In</span>
              <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">{checkedInCount}</div>
            <div className="text-xs text-stone-400 mt-1">Badges verified</div>
          </div>
        </div>

        {/* 3. Consistent AI Conflict Card */}
        {scenario3 && (
          <ScreenAISolverWidget
            scenario={scenario3}
            onResolve={() => resolveScenario(scenario3.id)}
          />
        )}

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl bg-[#181310] border border-[#2E241E]">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveViewTab('roster')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeViewTab === 'roster'
                  ? 'bg-[#D96B27] text-white shadow-md'
                  : 'bg-[#140F0D] text-stone-400 hover:text-stone-200 border border-[#241B16]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Guest Roster & Ingress Math</span>
            </button>

            <button
              onClick={() => setActiveViewTab('floorplan')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeViewTab === 'floorplan'
                  ? 'bg-[#D96B27] text-white shadow-md'
                  : 'bg-[#140F0D] text-stone-400 hover:text-stone-200 border border-[#241B16]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2D Spatial Floor Plan & Seating Studio</span>
            </button>

            <button
              onClick={() => setActiveViewTab('scanner')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeViewTab === 'scanner'
                  ? 'bg-[#D96B27] text-white shadow-md'
                  : 'bg-[#140F0D] text-stone-400 hover:text-stone-200 border border-[#241B16]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Turnstile Door Scanner & Simulator</span>
            </button>
          </div>

          <button
            onClick={() => {
              setInvitationGuest(guestList[0] || null);
              setShowInvitationModal(true);
            }}
            className="px-3.5 py-2 rounded-lg bg-[#27170E] hover:bg-[#341F13] border border-[#D96B27]/40 text-[#FF7A3D] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Preview VIP Digital Invitation</span>
          </button>
        </div>

        {activeViewTab === 'roster' && (
          <>
            {/* 4. Turnstile Mathematical Queue Intelligence Card */}
            <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-5 sm:p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-[#2E241E]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#D96B27]/20 text-[#FF7A3D] border border-[#D96B27]/40">
                  Ingress Telemetry
                </span>
                <span className="text-xs font-mono text-stone-400">
                  Equation: (Guests × {secondsPerGuest}s) ÷ (Gates × 60s)
                </span>
              </div>
              <h2 className="text-xl font-bold text-stone-100">
                Door Turnstile Queue & Wait-Time Math
              </h2>
              <p className="text-xs text-stone-300">
                Mathematical ingress queue model calibrated for {totalInvited} guests at {secondsPerGuest}s per ticket scan.
              </p>
            </div>

            {/* Interactive Gate Stepper */}
            <div className="flex items-center gap-3 bg-[#140F0D] p-2.5 rounded-xl border border-[#2E241E]">
              <span className="text-xs text-stone-400 font-medium">Turnstile Gates:</span>
              <button
                type="button"
                onClick={() => setTurnstileGates((prev) => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-lg bg-[#221A15] hover:bg-[#2E241E] border border-[#3A2D24] text-stone-200 font-bold flex items-center justify-center transition-colors cursor-pointer"
                title="Decrease gates"
              >
                -
              </button>
              <span className="font-mono text-lg font-bold text-[#FF7A3D] w-6 text-center">
                {turnstileGates}
              </span>
              <button
                type="button"
                onClick={() => setTurnstileGates((prev) => Math.min(8, prev + 1))}
                className="w-8 h-8 rounded-lg bg-[#221A15] hover:bg-[#2E241E] border border-[#3A2D24] text-stone-200 font-bold flex items-center justify-center transition-colors cursor-pointer"
                title="Increase gates"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
            <div className="p-4 rounded-xl bg-[#140F0D] border border-[#2E241E]">
              <div className="text-xs text-stone-400">Total Peak Wait Time</div>
              <div className="text-2xl font-black text-[#FF7A3D] mt-1">
                {queueWaitTime} minutes
              </div>
              <div className="text-xs text-stone-400 mt-1 font-mono">
                ({totalInvited} × {secondsPerGuest}s) ÷ ({turnstileGates} × 60s)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#140F0D] border border-[#2E241E]">
              <div className="text-xs text-stone-400">Ingress Throughput</div>
              <div className="text-2xl font-black text-[#10B981] mt-1">
                {throughputPerMinute} guests / min
              </div>
              <div className="text-xs text-stone-400 mt-1 font-mono">
                Across {turnstileGates} synchronized scanners
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#140F0D] border border-[#2E241E]">
              <div className="text-xs text-stone-400">Ingress Status</div>
              <div className="text-base font-bold mt-1 text-stone-200 flex items-center gap-2">
                {queueWaitTime > 25 ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300">Bottleneck (Add Gate)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Optimal Fluid Ingress</span>
                  </>
                )}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                Recommendation: {queueWaitTime > 25 ? 'Open Gate 3 for VIP priority' : 'Flow is optimal'}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Guest Roster & Seating Registry */}
        <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-5 sm:p-6 shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D96B27]" />
                <span>Guest Roster & Seating Sanctuary</span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Sample cohort: {guestList.length} registered guests shown ({attendingCount} attending, {confirmationRate}% confirmation rate).
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-lg bg-[#D96B27] hover:bg-[#EA580C] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-[#D96B27]/20 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Guest</span>
            </button>
          </div>

          {/* Search & RSVP Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest by name, table, or dietary protocol..."
                className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg pl-9 pr-4 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D96B27]"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#140F0D] p-1 rounded-lg border border-[#2E241E] w-full sm:w-auto">
              {(['All', 'Attending', 'Pending', 'Declined'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterRsvp(status)}
                  className={`flex-1 sm:flex-none px-3 py-1 rounded text-xs transition-colors ${
                    filterRsvp === status
                      ? 'bg-[#2E241E] text-stone-100 font-semibold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Guest Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {filteredGuests.length === 0 && (
              <div className="col-span-full py-12 text-center text-stone-500 bg-[#140F0D] rounded-xl border border-dashed border-[#2E241E]">
                <Users className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                <p className="text-sm font-medium text-stone-400">No guests registered yet</p>
                <p className="text-xs text-stone-500 mt-1">Click "+ Add Guest" above to begin building your attendee roster.</p>
              </div>
            )}
            {filteredGuests.map((guest) => {
              const isSophia = guest.name.includes('Sophia');
              return (
                <div
                  key={guest.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    guest.checkedIn
                      ? 'bg-[#181411] border-emerald-900/50 ring-1 ring-emerald-800/30'
                      : 'bg-[#15110E] border-[#2E241E] hover:border-[#3E2D22]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="text-sm font-bold text-stone-100">{guest.name}</div>
                        <div className="text-xs text-stone-400">{guest.phone}</div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          guest.tier.includes('Diamond') || guest.tier.includes('Honor')
                            ? 'bg-[#D96B27]/20 text-[#FF7A3D] border border-[#D96B27]/40'
                            : guest.tier.includes('Dignitary') || guest.tier.includes('Gold')
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                            : 'bg-[#221A15] text-stone-300 border border-[#3A2D24]'
                        }`}
                      >
                        {guest.tier}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-stone-300 bg-[#120E0C] p-2.5 rounded-lg border border-[#2E241E]">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Seating:</span>
                        <span className="font-semibold text-stone-200 truncate max-w-[170px]">
                          {guest.table}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Dietary:</span>
                        <span
                          className={`font-semibold truncate max-w-[170px] ${
                            guest.diet.toLowerCase().includes('allergy')
                              ? 'text-rose-400'
                              : 'text-stone-200'
                          }`}
                        >
                          {guest.diet}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 mt-3 border-t border-[#2E241E] flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleGuestCheckIn(guest.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        guest.checkedIn
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                          : 'bg-[#221A15] hover:bg-[#2E241E] text-stone-300 border border-[#3A2D24]'
                      }`}
                    >
                      {guest.checkedIn ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Checked In</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-stone-400" />
                          <span>Check In</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <select
                        value={guest.rsvp}
                        onChange={(e) => updateGuestRsvp(guest.id, e.target.value as any)}
                        className="bg-[#140F0D] border border-[#2E241E] rounded text-xs px-2 py-1 text-stone-300 focus:outline-none"
                      >
                        <option value="Attending">Attending</option>
                        <option value="Pending">Pending</option>
                        <option value="Declined">Declined</option>
                      </select>

                      <button
                        onClick={() => {
                          setInvitationGuest(guest);
                          setShowInvitationModal(true);
                        }}
                        className="p-1 text-stone-400 hover:text-[#FF7A3D] transition-colors"
                        title="View VIP Digital Invitation Pass"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => removeGuest(guest.id)}
                        className="p-1 text-stone-500 hover:text-rose-400 transition-colors"
                        title="Remove guest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </>
        )}

        {/* 2D Spatial Floor Plan & Seating Studio Tab */}
        {activeViewTab === 'floorplan' && <FloorPlanStudio />}

        {/* Turnstile Door Scanner & Simulator Tab */}
        {activeViewTab === 'scanner' && <DoorScannerSimulator />}

        {/* Modal: Add Guest */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-stone-100">Add New Guest</h3>
              <form onSubmit={handleAddSubmit} className="space-y-3">
                <div>
                  <label className="text-xs text-stone-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Guest name..."
                    className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#D96B27]"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400">VIP Tier</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value)}
                    className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-[#D96B27]"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Gold VIP">Gold VIP</option>
                    <option value="Diamond VIP">Diamond VIP</option>
                    <option value="Dignitary VIP">Dignitary VIP</option>
                    <option value="Family VIP">Family VIP</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-400">Table Assignment</label>
                  <input
                    type="text"
                    value={newTable}
                    onChange={(e) => setNewTable(e.target.value)}
                    className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#D96B27]"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400">Dietary Protocol</label>
                  <input
                    type="text"
                    value={newDiet}
                    onChange={(e) => setNewDiet(e.target.value)}
                    placeholder="Standard, Vegan, Halal, Nut Allergy..."
                    className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#D96B27]"
                  />
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
        
        {/* VIP Digital Invitation Modal */}
        <DigitalInvitationModal
          isOpen={showInvitationModal}
          onClose={() => setShowInvitationModal(false)}
          guest={invitationGuest}
        />
      </div>
    </div>
  );
};
