import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  Clock, 
  Mic, 
  Zap, 
  Tv, 
  Utensils, 
  Radio, 
  Plus, 
  Download, 
  CheckCircle2, 
  Flame, 
  Volume2,
  ChevronRight,
  Sparkles,
  Users
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export interface ShowCue {
  id: string;
  cueNumber: string;
  time: string; // "18:00"
  durationMin: number;
  title: string;
  department: 'Audio' | 'Lighting' | 'Video' | 'Stage' | 'Catering' | 'All';
  audioNote: string;
  lightingState: string;
  videoGraphic: string;
  stageTalent: string;
  cateringMilestone: string;
  status: 'Completed' | 'Active' | 'Pending';
}

const DEFAULT_CUES: ShowCue[] = [
  {
    id: 'cue-1',
    cueNumber: 'CUE-01',
    time: '18:00',
    durationMin: 30,
    title: 'Doors Open & Ingress Reception',
    department: 'All',
    audioNote: 'Acoustic Jazz Playlist at -14dB (Background Level)',
    lightingState: 'Warm Amber 30% Architectural Uplighting',
    videoGraphic: 'Event Brand Emblem 4K Seamless Loop',
    stageTalent: 'Door Chaperones & Turnstile Ushers',
    cateringMilestone: 'Champagne Flutes & Passed Hors d’Oeuvres',
    status: 'Completed'
  },
  {
    id: 'cue-2',
    cueNumber: 'CUE-02',
    time: '18:30',
    durationMin: 15,
    title: 'Chime Chimes & Call to Dinner',
    department: 'Audio',
    audioNote: 'Three-Tone Chime Stinger (Bells) + Voice of God "Please be seated"',
    lightingState: 'Main Dining Chandelier Ramp to 60%',
    videoGraphic: 'Seating Guide & Table Matrix on Side Displays',
    stageTalent: 'Hostess Captains Directing Guests to Tables',
    cateringMilestone: 'Bread Baskets & Artisan Herb Butter Plated',
    status: 'Completed'
  },
  {
    id: 'cue-3',
    cueNumber: 'CUE-03',
    time: '18:45',
    durationMin: 10,
    title: 'Producer Welcoming Address & House Rules',
    department: 'Stage',
    audioNote: 'Podium Mic 1 HOT (Compressor ON, EQ High-Pass at 80Hz)',
    lightingState: 'Follow-Spot on Keynote Lectern, Ambient House 25%',
    videoGraphic: 'Producer Intro Card & Live Camera 1 Feed',
    stageTalent: 'Executive Producer Quantrom',
    cateringMilestone: 'Wine Service: Chablis & Pinot Noir First Pour',
    status: 'Active'
  },
  {
    id: 'cue-4',
    cueNumber: 'CUE-04',
    time: '18:55',
    durationMin: 35,
    title: 'First Course Service & String Quartet Interlude',
    department: 'Catering',
    audioNote: 'String Quartet Mics 3-6 Active with Light Hall Reverb',
    lightingState: 'Romantic Terracotta Ceiling Wash (40% Lumens)',
    videoGraphic: 'Subtle Gold Filigree Ambient Visualizer',
    stageTalent: 'String Quartet on Stage Left Platform',
    cateringMilestone: 'First Course: Heirloom Burrata & Gold Leaf Greens',
    status: 'Pending'
  },
  {
    id: 'cue-5',
    cueNumber: 'CUE-05',
    time: '19:30',
    durationMin: 20,
    title: 'Honoree Tribute & Cinematic Video Screening',
    department: 'Video',
    audioNote: 'Video 5.1 Surround Sound Track Playback at -6dB',
    lightingState: 'Full Blackout on Ballroom, Blue Accent on Truss',
    videoGraphic: '4K Tribute Film VT-01 (Duration: 7m 22s)',
    stageTalent: 'Grand Honoree at Center Dais',
    cateringMilestone: 'Main Course Pre-Staging in Hot Boxes',
    status: 'Pending'
  },
  {
    id: 'cue-6',
    cueNumber: 'CUE-06',
    time: '19:50',
    durationMin: 40,
    title: 'Entrée Service & Chef Presentation',
    department: 'Catering',
    audioNote: 'Contemporary Lounge Playlist (-12dB)',
    lightingState: 'Warm Candlelight Glow 50% Intensity',
    videoGraphic: 'Culinary Menu Tasting Notes & Winery Profile',
    stageTalent: 'Executive Chef Introduction on Floor',
    cateringMilestone: 'Entrée Drop: Wagyu Tenderloin / Halal Chilean Seabass',
    status: 'Pending'
  },
  {
    id: 'cue-7',
    cueNumber: 'CUE-07',
    time: '20:30',
    durationMin: 15,
    title: 'Champagne Toast & Opening of Grand Dance Floor',
    department: 'Stage',
    audioNote: 'Wireless Handheld 2 HOT + Live Band Segue Fanfare',
    lightingState: 'Dramatic Gold Strobes Transition -> Moving Heads Active',
    videoGraphic: 'Celebration Fireworks Graphics Particle System',
    stageTalent: 'Master of Ceremonies & Keynote Speaker',
    cateringMilestone: 'Vintage Champagne Poured at all Tables',
    status: 'Pending'
  },
  {
    id: 'cue-8',
    cueNumber: 'CUE-08',
    time: '20:45',
    durationMin: 90,
    title: 'Live 9-Piece Show Band & Afterparty Revelry',
    department: 'Audio',
    audioNote: 'Full Band Master Mix (32 Channels Live FOH)',
    lightingState: 'Party Club Moving Beams & Haze Machine Active',
    videoGraphic: 'Live Audio-Reactive Visuals & Crowd Camera',
    stageTalent: 'Pinnacle 9-Piece Show Band',
    cateringMilestone: 'Late-Night Dessert Stations & Espresso Bar Open',
    status: 'Pending'
  }
];

export const RunOfShowCueSheet: React.FC = () => {
  const { eventData } = useEvent();
  const [cues, setCues] = useState<ShowCue[]>(DEFAULT_CUES);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [holdDelayMin, setHoldDelayMin] = useState<number>(0);
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(145);
  const [walkieAlert, setWalkieAlert] = useState<string | null>(null);

  // Show Clock Timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeCue = cues.find((c) => c.status === 'Active') || cues[2];
  const nextCue = cues.find((c) => c.status === 'Pending');

  // Trigger CUE GO
  const handleTriggerNextCue = () => {
    const activeIndex = cues.findIndex((c) => c.id === activeCue.id);
    if (activeIndex >= 0 && activeIndex < cues.length - 1) {
      const updated = [...cues];
      updated[activeIndex].status = 'Completed';
      updated[activeIndex + 1].status = 'Active';
      setCues(updated);
      setSecondsRemaining(updated[activeIndex + 1].durationMin * 60);

      // Walkie Dispatch Alert
      const alertMsg = `CUE GO: ${updated[activeIndex + 1].cueNumber} - ${updated[activeIndex + 1].title}`;
      setWalkieAlert(alertMsg);
      setTimeout(() => setWalkieAlert(null), 4000);
    }
  };

  // Add 5 min emergency hold delay
  const handleEmergencyHold = (minutes: number) => {
    setHoldDelayMin((prev) => prev + minutes);
    setSecondsRemaining((prev) => prev + minutes * 60);
    setWalkieAlert(`PRODUCER HOLD DELAY: +${minutes} min added to run-of-show. Standby.`);
    setTimeout(() => setWalkieAlert(null), 4000);
  };

  const filteredCues = cues.filter((c) => deptFilter === 'All' || c.department === deptFilter || c.department === 'All');

  // Format seconds to mm:ss
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleExportCsv = () => {
    const header = ['Cue Number', 'Scheduled Time', 'Duration (min)', 'Segment Title', 'Department', 'Audio Note', 'Lighting State', 'Video Graphic', 'Stage Talent', 'Catering Milestone', 'Status'];
    const rows = cues.map((c) => [
      c.cueNumber,
      c.time,
      c.durationMin,
      `"${c.title}"`,
      c.department,
      `"${c.audioNote}"`,
      `"${c.lightingState}"`,
      `"${c.videoGraphic}"`,
      `"${c.stageTalent}"`,
      `"${c.cateringMilestone}"`,
      c.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Run_Of_Show_${eventData.eventName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Walkie Dispatch Broadcast Banner */}
      {walkieAlert && (
        <div className="p-3 rounded-xl bg-amber-950/90 border border-amber-500/60 text-amber-200 text-xs font-semibold flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-mono uppercase tracking-wider">ALL-CHANNELS WALKIE PAGING:</span>
            <span>{walkieAlert}</span>
          </div>
          <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded border border-amber-500/40">
            TRANSMITTING TO CH 1-4
          </span>
        </div>
      )}

      {/* Master Show-Caller Clock Command Deck */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1E1612] via-[#18110E] to-[#120E0C] border-2 border-[#D96B27]/50 shadow-2xl flex flex-wrap items-center justify-between gap-6">
        {/* Left: Clock Status & Active Cue Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-300">
              {isPlaying ? 'MASTER SHOW CLOCK RUNNING' : 'SHOW CLOCK PAUSED'}
            </span>
            {holdDelayMin > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-bold">
                HOLD OFFSET: +{holdDelayMin}m
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-stone-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#D96B27]" />
            Active: <span className="text-[#FF7A3D]">{activeCue.cueNumber}</span> — {activeCue.title}
          </h3>
          <p className="text-xs text-stone-400">
            Next: {nextCue ? `${nextCue.cueNumber} (${nextCue.title}) at ${nextCue.time}` : 'End of Run of Show'}
          </p>
        </div>

        {/* Center: Countdown Display */}
        <div className="text-center bg-[#100C0A] px-6 py-3 rounded-xl border border-[#2E241E] shadow-inner">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">
            NEXT CUE IN
          </span>
          <span className="text-4xl font-mono font-bold text-stone-100 tracking-wider">
            {formatTimer(secondsRemaining)}
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            Cue Window: {activeCue.durationMin} mins
          </span>
        </div>

        {/* Right: Master Show Caller Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isPlaying
                ? 'bg-[#2E241E] text-stone-200 hover:bg-[#382B24] border border-[#3A2D24]'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-700/30'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause Show' : 'Resume Show'}</span>
          </button>

          <button
            onClick={handleTriggerNextCue}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D96B27] to-[#FF7A3D] text-white text-xs font-bold shadow-xl shadow-[#D96B27]/40 hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>TRIGGER CUE GO</span>
          </button>

          {/* Emergency Hold Delay Buttons */}
          <div className="flex items-center gap-1 pl-2 border-l border-[#2E241E]">
            <button
              onClick={() => handleEmergencyHold(5)}
              className="px-2.5 py-2 rounded-lg bg-[#241510] hover:bg-[#341F16] border border-amber-600/40 text-amber-300 text-xs font-medium cursor-pointer"
              title="Add 5-minute hold delay"
            >
              +5m Hold
            </button>
            <button
              onClick={() => handleEmergencyHold(10)}
              className="px-2.5 py-2 rounded-lg bg-[#241510] hover:bg-[#341F16] border border-amber-600/40 text-amber-300 text-xs font-medium cursor-pointer"
              title="Add 10-minute hold delay"
            >
              +10m Hold
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Export Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-[#181310] border border-[#2E241E]">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-stone-500 font-medium px-2">Filter Track:</span>
          {['All', 'Audio', 'Lighting', 'Video', 'Stage', 'Catering'].map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                deptFilter === dept
                  ? 'bg-[#D96B27] text-white font-bold'
                  : 'text-stone-400 hover:text-stone-200 bg-[#120E0C] border border-[#2E241E]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3 py-1.5 rounded-lg bg-[#140F0D] hover:bg-[#201814] border border-[#2E241E] text-stone-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Cue Sheet (CSV)</span>
        </button>
      </div>

      {/* Cue Sheet Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#2E241E] bg-[#140F0D] shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#1C1512] text-stone-400 border-b border-[#2E241E] uppercase font-mono text-[11px]">
              <th className="py-3 px-4">Cue #</th>
              <th className="py-3 px-3">Time</th>
              <th className="py-3 px-4">Segment Title</th>
              <th className="py-3 px-3">Dept</th>
              <th className="py-3 px-4">Audio / Mic Cue</th>
              <th className="py-3 px-4">Lighting State</th>
              <th className="py-3 px-4">Video / LED Wall</th>
              <th className="py-3 px-4">Stage Talent</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#221A16]">
            {filteredCues.map((cue) => {
              const isActive = cue.status === 'Active';
              const isCompleted = cue.status === 'Completed';

              return (
                <tr 
                  key={cue.id}
                  className={`transition-colors ${
                    isActive 
                      ? 'bg-[#2E1E14] border-l-4 border-l-[#FF7A3D]' 
                      : isCompleted 
                      ? 'bg-[#120E0C]/60 opacity-70 hover:opacity-100' 
                      : 'hover:bg-[#1A1411]'
                  }`}
                >
                  {/* Cue # */}
                  <td className="py-3 px-4 font-mono font-bold text-stone-200">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      isActive 
                        ? 'bg-[#D96B27] text-white font-extrabold shadow' 
                        : 'bg-[#221A15] text-stone-300 border border-[#3A2D24]'
                    }`}>
                      {cue.cueNumber}
                    </span>
                  </td>

                  {/* Scheduled Time */}
                  <td className="py-3 px-3 font-mono font-semibold text-stone-300">
                    {cue.time}
                    <span className="block text-[10px] text-stone-500 font-normal">+{cue.durationMin}m</span>
                  </td>

                  {/* Segment Title */}
                  <td className="py-3 px-4 font-semibold text-stone-100">
                    {cue.title}
                    <span className="block text-[10px] text-stone-400 font-normal">
                      Floor: {cue.cateringMilestone}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1E1713] text-stone-300 border border-[#2E241E]">
                      {cue.department}
                    </span>
                  </td>

                  {/* Audio */}
                  <td className="py-3 px-4 text-stone-300 max-w-xs">
                    <div className="flex items-start gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{cue.audioNote}</span>
                    </div>
                  </td>

                  {/* Lighting */}
                  <td className="py-3 px-4 text-stone-300 max-w-xs">
                    <div className="flex items-start gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{cue.lightingState}</span>
                    </div>
                  </td>

                  {/* Video */}
                  <td className="py-3 px-4 text-stone-300 max-w-xs">
                    <div className="flex items-start gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{cue.videoGraphic}</span>
                    </div>
                  </td>

                  {/* Stage Talent */}
                  <td className="py-3 px-4 text-stone-300">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#D96B27] shrink-0" />
                      <span>{cue.stageTalent}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    {cue.status === 'Completed' ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Done
                      </span>
                    ) : cue.status === 'Active' ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-[#FF7A3D] font-bold animate-pulse">
                        <Zap className="w-3.5 h-3.5 fill-[#FF7A3D]" />
                        LIVE
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-stone-500">
                        Queued
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
