import React, { useState, useMemo } from 'react';
import { 
  Maximize2, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Move, 
  Eye, 
  Info, 
  RotateCcw,
  ShieldCheck,
  Compass,
  Utensils,
  Music,
  Tv,
  Coffee
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { GuestRecord } from '../../types';

interface FloorPlanTable {
  id: string;
  name: string;
  seats: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  tier: 'VIP Patron' | 'Executive' | 'General' | 'Family';
  assignedCaptain: string;
}

const DEFAULT_TABLES: FloorPlanTable[] = [
  { id: 'tbl-1', name: 'Table 01 (Patrons)', seats: 10, x: 25, y: 35, tier: 'VIP Patron', assignedCaptain: 'Chef Marcus & Sommelier Elena' },
  { id: 'tbl-2', name: 'Table 02 (Dignitaries)', seats: 10, x: 50, y: 35, tier: 'VIP Patron', assignedCaptain: 'Captain Julian' },
  { id: 'tbl-3', name: 'Table 03 (Sponsors)', seats: 10, x: 75, y: 35, tier: 'VIP Patron', assignedCaptain: 'Captain Julian' },
  { id: 'tbl-4', name: 'Table 04 (Executive)', seats: 10, x: 20, y: 55, tier: 'Executive', assignedCaptain: 'Server Lead Clara' },
  { id: 'tbl-5', name: 'Table 05 (Executive)', seats: 10, x: 40, y: 55, tier: 'Executive', assignedCaptain: 'Server Lead Clara' },
  { id: 'tbl-6', name: 'Table 06 (Patrons)', seats: 10, x: 60, y: 55, tier: 'Executive', assignedCaptain: 'Server Lead Mateo' },
  { id: 'tbl-7', name: 'Table 07 (Alumni)', seats: 10, x: 80, y: 55, tier: 'Executive', assignedCaptain: 'Server Lead Mateo' },
  { id: 'tbl-8', name: 'Table 08 (Guests)', seats: 10, x: 20, y: 75, tier: 'General', assignedCaptain: 'Server Sarah' },
  { id: 'tbl-9', name: 'Table 09 (Guests)', seats: 10, x: 40, y: 75, tier: 'General', assignedCaptain: 'Server Sarah' },
  { id: 'tbl-10', name: 'Table 10 (Guests)', seats: 10, x: 60, y: 75, tier: 'General', assignedCaptain: 'Server David' },
  { id: 'tbl-11', name: 'Table 11 (Media)', seats: 8, x: 80, y: 75, tier: 'General', assignedCaptain: 'Server David' },
  { id: 'tbl-12', name: 'Table 12 (Tech Crew)', seats: 8, x: 50, y: 88, tier: 'Family', assignedCaptain: 'Operations Lead' },
];

export const FloorPlanStudio: React.FC = () => {
  const { guestList, eventData, selectedVenue } = useEvent();
  
  const [tables, setTables] = useState<FloorPlanTable[]>(DEFAULT_TABLES);
  const [selectedTableId, setSelectedTableId] = useState<string>('tbl-1');
  const [activeLayoutPreset, setActiveLayoutPreset] = useState<'gala' | 'wedding' | 'summit'>('gala');
  const [showAisleGrid, setShowAisleGrid] = useState<boolean>(true);
  const [showDietaryHeatmap, setShowDietaryHeatmap] = useState<boolean>(false);

  // Group guests by table name
  const tableOccupancyMap = useMemo(() => {
    const map: Record<string, GuestRecord[]> = {};
    tables.forEach((t) => {
      map[t.name] = [];
    });
    guestList.forEach((g) => {
      // Find matching table by partial or exact name
      const matched = tables.find((t) => t.name.toLowerCase() === g.table.toLowerCase() || g.table.toLowerCase().includes(t.name.toLowerCase()));
      if (matched) {
        if (!map[matched.name]) map[matched.name] = [];
        map[matched.name].push(g);
      } else {
        // Fallback to table 1
        if (map[tables[0].name]) map[tables[0].name].push(g);
      }
    });
    return map;
  }, [tables, guestList]);

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0];
  const selectedTableGuests = tableOccupancyMap[selectedTable.name] || [];

  // Summary Metrics
  const totalSeatedGuests = Object.values(tableOccupancyMap).reduce((acc, curr) => acc + curr.length, 0);
  const totalTableCapacity = tables.reduce((acc, t) => acc + t.seats, 0);
  const guestCountNum = Number(eventData.guestCount) || 450;
  const danceFloorAreaSqFt = 750; // 25x30 ft
  const danceFloorSqFtPerGuest = totalSeatedGuests > 0 ? (danceFloorAreaSqFt / Math.min(totalSeatedGuests, 180)).toFixed(1) : '4.5';

  // Apply layout presets
  const handlePresetChange = (preset: 'gala' | 'wedding' | 'summit') => {
    setActiveLayoutPreset(preset);
    if (preset === 'wedding') {
      setTables(DEFAULT_TABLES.map((t, idx) => {
        if (idx === 0) return { ...t, name: 'Bridal Dais (Sweetheart Table)', seats: 4, x: 50, y: 28, tier: 'VIP Patron' };
        if (idx === 1) return { ...t, name: 'Table 02 (Bride Family)', x: 25, y: 38, tier: 'VIP Patron' };
        if (idx === 2) return { ...t, name: 'Table 03 (Groom Family)', x: 75, y: 38, tier: 'VIP Patron' };
        return t;
      }));
    } else if (preset === 'summit') {
      setTables(DEFAULT_TABLES.map((t, idx) => ({
        ...t,
        y: Math.min(88, t.y + 5),
        tier: idx < 3 ? 'VIP Patron' : 'General'
      })));
    } else {
      setTables(DEFAULT_TABLES);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#181310] border border-[#2E241E]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#D96B27]" />
            <h3 className="text-base font-bold text-stone-100">
              Interactive 2D Spatial Floor Plan & Seating Studio
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 font-semibold">
              ADA 6-Ft Compliant
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Visual spatial arrangement for {selectedVenue ? selectedVenue.name : `${eventData.venueCity || 'Metropolitan'} Ballroom`} ({guestCountNum} Guests Capacity)
          </p>
        </div>

        {/* View Options & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#120E0C] p-1 rounded-lg border border-[#2E241E] text-xs">
            <span className="text-[11px] text-stone-500 px-2 font-medium">Preset:</span>
            <button
              onClick={() => handlePresetChange('gala')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeLayoutPreset === 'gala' ? 'bg-[#D96B27] text-white font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Grand Gala
            </button>
            <button
              onClick={() => handlePresetChange('wedding')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeLayoutPreset === 'wedding' ? 'bg-[#D96B27] text-white font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Royal Wedding
            </button>
            <button
              onClick={() => handlePresetChange('summit')}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                activeLayoutPreset === 'summit' ? 'bg-[#D96B27] text-white font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Tech Summit
            </button>
          </div>

          <button
            onClick={() => setShowDietaryHeatmap(!showDietaryHeatmap)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showDietaryHeatmap
                ? 'bg-amber-950/80 border-amber-600/50 text-amber-300'
                : 'bg-[#140F0D] border-[#2E241E] text-stone-400 hover:text-stone-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Dietary Map</span>
          </button>

          <button
            onClick={() => setShowAisleGrid(!showAisleGrid)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showAisleGrid
                ? 'bg-[#2E241E] border-[#D96B27]/40 text-[#FF7A3D]'
                : 'bg-[#140F0D] border-[#2E241E] text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Aisle Grid</span>
          </button>
        </div>
      </div>

      {/* Main Floor Plan Canvas & Table Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual 2D Plan Canvas (Col Span 2) */}
        <div className="lg:col-span-2 bg-[#140F0D] border border-[#2E241E] rounded-xl p-5 relative overflow-hidden shadow-xl min-h-[520px] flex flex-col justify-between">
          {/* Subtle Grid Background */}
          {showAisleGrid && (
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none" 
              style={{
                backgroundImage: 'radial-gradient(circle, #D96B27 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
          )}

          {/* Top Architectural Fixtures (Stage & AV Truss) */}
          <div className="relative z-10 space-y-3">
            {/* North Wall: Emergency Exits & Fire Egress */}
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 px-4 py-1 rounded bg-emerald-950/30 border border-emerald-900/40">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                NORTH FIRE EGRESS (6.5 FT UNBLOCKED)
              </span>
              <span className="text-stone-400 font-sans">MAIN ARCHITECTURAL PROSCENIUM</span>
              <span className="flex items-center gap-1.5">
                EMERGENCY EXIT A
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Main Stage & Proscenium */}
            <div className="w-4/5 mx-auto h-14 bg-gradient-to-b from-[#2A201A] to-[#1C1512] border-2 border-[#D96B27]/60 rounded-lg flex items-center justify-between px-6 shadow-lg shadow-[#D96B27]/10">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#D96B27]" />
                <span className="text-xs font-bold text-stone-100 tracking-wider">
                  PRIMARY STAGE & KEYNOTE PODIUM
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400">
                <Tv className="w-3.5 h-3.5 text-cyan-400" />
                <span>LED Wall 4K • 32ft x 14ft</span>
              </div>
            </div>

            {/* Central Dance Floor / Activity Void */}
            <div className="w-2/3 mx-auto h-16 bg-[#1F1713]/80 border border-dashed border-[#D96B27]/40 rounded-lg flex items-center justify-center gap-4 text-xs text-stone-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div className="text-center">
                <div className="font-semibold text-stone-200">Italian Oak Dance Floor ({danceFloorAreaSqFt} sq. ft.)</div>
                <div className="text-[10px] text-stone-400 font-mono">{danceFloorSqFtPerGuest} sq.ft / active dancer capacity</div>
              </div>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>

          {/* Tables Interactive Canvas Area */}
          <div className="relative z-10 my-4 h-72 w-full">
            {tables.map((table) => {
              const isSelected = table.id === selectedTableId;
              const occupants = tableOccupancyMap[table.name] || [];
              const isFull = occupants.length >= table.seats;
              const hasDietaryWarning = occupants.some((o) => o.diet && (o.diet.includes('Nut') || o.diet.includes('Gluten') || o.diet.includes('Kosher') || o.diet.includes('Halal')));

              return (
                <button
                  key={table.id}
                  onClick={() => setSelectedTableId(table.id)}
                  style={{
                    left: `${table.x}%`,
                    top: `${table.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute group cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-1 rounded-full ${
                    isSelected
                      ? 'ring-4 ring-[#D96B27] scale-110 z-30 shadow-xl shadow-[#D96B27]/40'
                      : 'hover:scale-105 z-20'
                  }`}
                >
                  {/* Circular Table Shape */}
                  <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center border-2 shadow-md transition-colors ${
                    isSelected
                      ? 'bg-[#3A2417] border-[#FF7A3D] text-white'
                      : table.tier === 'VIP Patron'
                      ? 'bg-[#291A12] border-[#D96B27] text-stone-200'
                      : 'bg-[#1C1613] border-[#382B23] text-stone-300'
                  }`}>
                    <span className="text-[11px] font-bold font-mono">
                      {table.name.split(' ')[1] || table.name.slice(0, 3)}
                    </span>
                    <span className="text-[9px] text-stone-400">
                      {occupants.length}/{table.seats}
                    </span>
                  </div>

                  {/* Dietary Warning Badge */}
                  {showDietaryHeatmap && hasDietaryWarning && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center text-[10px] font-bold shadow animate-bounce">
                      !
                    </span>
                  )}

                  {/* VIP Crown / Badge */}
                  {table.tier === 'VIP Patron' && !showDietaryHeatmap && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D96B27] text-white flex items-center justify-center text-[9px] font-bold shadow">
                      ★
                    </span>
                  )}

                  {/* Mini Hover Tooltip */}
                  <div className="absolute -bottom-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-2 py-0.5 rounded text-[10px] text-stone-200 whitespace-nowrap pointer-events-none border border-[#2E241E]">
                    {table.name} ({occupants.length} seated)
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Architectural Fixtures (FOH Sound Booth & Main Entrance) */}
          <div className="relative z-10 space-y-2 pt-2 border-t border-[#2E241E]">
            <div className="flex items-center justify-between gap-4">
              {/* Beverage Bar */}
              <div className="px-3 py-1.5 rounded-lg bg-[#1F1713] border border-[#3A2D24] flex items-center gap-2 text-xs text-stone-300">
                <Coffee className="w-3.5 h-3.5 text-amber-500" />
                <span>Sommelier Bar Station</span>
              </div>

              {/* FOH Audio Visual Booth */}
              <div className="px-4 py-1.5 rounded-lg bg-[#181310] border border-[#2E241E] flex items-center gap-2 text-xs text-stone-300">
                <Tv className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-[11px]">FOH Audio/Lighting Command Console</span>
              </div>

              {/* Main Ingress Doors */}
              <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DOORS & TURNSTILES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Table Inspector & Guest Roster Assignment (Col Span 1) */}
        <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-4">
            {/* Table Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#2E241E]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#2E241E] text-[#FF7A3D] border border-[#D96B27]/40">
                    {selectedTable.tier}
                  </span>
                  <span className="text-xs text-stone-400 font-mono">ID: {selectedTable.id}</span>
                </div>
                <h4 className="text-lg font-bold text-stone-100 mt-1">{selectedTable.name}</h4>
                <p className="text-xs text-stone-400">Head Waiter: {selectedTable.assignedCaptain}</p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-stone-100">
                  {selectedTableGuests.length} <span className="text-sm text-stone-400 font-normal">/ {selectedTable.seats}</span>
                </div>
                <div className="text-[10px] text-stone-500 font-mono">Chairs Reserved</div>
              </div>
            </div>

            {/* Table Dietary & Allergen Profile */}
            <div className="p-3 rounded-lg bg-[#140F0D] border border-[#281F1A] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400 font-medium flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-500" />
                  Table Dietary Profile:
                </span>
                <span className="text-stone-300 font-semibold text-[11px]">
                  {selectedTableGuests.some((g) => g.diet && g.diet !== 'Standard Executive') ? 'Custom Diets Active' : 'All Standard Executive'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {Array.from(new Set(selectedTableGuests.map((g) => g.diet).filter(Boolean))).map((diet) => (
                  <span 
                    key={diet}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      diet.includes('Nut') || diet.includes('Gluten')
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                        : 'bg-[#221A15] text-stone-300 border border-[#3A2D24]'
                    }`}
                  >
                    {diet}
                  </span>
                ))}
              </div>
            </div>

            {/* Seated Guests List */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-300 mb-2">
                <span>Assigned Table Guests ({selectedTableGuests.length})</span>
                <span className="text-[11px] text-[#D96B27]">
                  {selectedTable.seats - selectedTableGuests.length} Chairs Open
                </span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {selectedTableGuests.length > 0 ? (
                  selectedTableGuests.map((guest, idx) => (
                    <div 
                      key={guest.id || idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#140F0D] border border-[#281F1A] text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-[#2A201A] text-stone-300 flex items-center justify-center text-[10px] font-mono shrink-0">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <div className="font-semibold text-stone-200 truncate">{guest.name}</div>
                          <div className="text-[10px] text-stone-400 truncate">{guest.tier} • {guest.diet}</div>
                        </div>
                      </div>

                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                        guest.checkedIn 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' 
                          : 'bg-stone-800/80 text-stone-400'
                      }`}>
                        {guest.checkedIn ? 'Inside' : 'RSVPed'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg bg-[#140F0D] border border-[#241B16] text-center text-xs text-stone-500">
                    No guests currently mapped to this table.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Spatial Telemetry Card */}
          <div className="pt-3 border-t border-[#2E241E] space-y-2 text-xs">
            <div className="flex items-center justify-between text-stone-400">
              <span>Overall Ballroom Occupancy:</span>
              <span className="font-semibold text-stone-200 font-mono">
                {totalSeatedGuests} / {totalTableCapacity} chairs ({Math.round((totalSeatedGuests / totalTableCapacity) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-[#140F0D] h-2 rounded-full overflow-hidden border border-[#281F1A]">
              <div 
                className="bg-gradient-to-r from-[#D96B27] to-[#FF7A3D] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((totalSeatedGuests / totalTableCapacity) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
