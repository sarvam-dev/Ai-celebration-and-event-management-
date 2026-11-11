import React, { useState } from 'react';
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Sparkles, 
  Utensils, 
  ShieldCheck, 
  Flame, 
  RefreshCw,
  Users,
  Volume2
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { GuestRecord } from '../../types';

export const DoorScannerSimulator: React.FC = () => {
  const { 
    guestList, 
    toggleGuestCheckIn, 
    turnstileGates, 
    secondsPerGuest, 
    queueWaitTime, 
    throughputPerMinute,
    checkedInCount,
    totalInvited
  } = useEvent();

  const [isScanning, setIsScanning] = useState(false);
  const [scannedGuest, setScannedGuest] = useState<GuestRecord | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [kitchenAlertSent, setKitchenAlertSent] = useState(false);
  const [recentScans, setRecentScans] = useState<Array<{ name: string; time: string; table: string; tier: string }>>([
    { name: 'Marcus Sterling', time: '18:14', table: 'Table 01 (Patrons)', tier: 'VIP Patron' },
    { name: 'Dr. Evelyn Reed', time: '18:12', table: 'Table 02 (Dignitaries)', tier: 'Executive' },
  ]);

  // Unchecked-in guests pool
  const pendingGuests = guestList.filter((g) => !g.checkedIn);

  const handleSimulateScan = (targetGuest?: GuestRecord) => {
    setIsScanning(true);
    setScanSuccess(false);
    setKitchenAlertSent(false);

    const guestToScan = targetGuest || pendingGuests[0] || guestList[0];

    setTimeout(() => {
      setIsScanning(false);
      if (guestToScan) {
        setScannedGuest(guestToScan);
        setScanSuccess(true);
        if (!guestToScan.checkedIn) {
          toggleGuestCheckIn(guestToScan.id);
        }

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        setRecentScans((prev) => [
          { name: guestToScan.name, time: timeStr, table: guestToScan.table, tier: guestToScan.tier },
          ...prev.slice(0, 4)
        ]);

        if (guestToScan.diet && guestToScan.diet !== 'Standard Executive') {
          setKitchenAlertSent(true);
        }
      }
    }, 700);
  };

  const handleRapidRush = () => {
    // Check in next 3 guests in sequence
    const toCheckIn = pendingGuests.slice(0, 3);
    if (toCheckIn.length === 0) return;

    toCheckIn.forEach((g, idx) => {
      setTimeout(() => {
        handleSimulateScan(g);
      }, idx * 800);
    });
  };

  return (
    <div className="space-y-6">
      {/* Turnstile Ingress Formula & Live Door Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#181310] border border-[#2E241E]">
        <div className="space-y-1">
          <div className="text-xs text-stone-400">Door Turnstiles Online</div>
          <div className="text-2xl font-bold text-stone-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            {turnstileGates} Active Lanes
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">100% Ingress Redundancy</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-stone-400">Scan & Validation Speed</div>
          <div className="text-2xl font-bold text-stone-100 font-mono">{secondsPerGuest}s / guest</div>
          <div className="text-[11px] text-stone-400">Optic laser reader cycle</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-stone-400">Throughput Capacity</div>
          <div className="text-2xl font-bold text-[#FF7A3D] font-mono">{throughputPerMinute} guests / min</div>
          <div className="text-[11px] text-stone-400">Total ingress band</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-stone-400">Estimated Door Wait</div>
          <div className="text-2xl font-bold text-stone-100 font-mono">{queueWaitTime} min</div>
          <div className="text-[11px] text-stone-400">Peak rush clearance index</div>
        </div>
      </div>

      {/* Main Scanner Viewfinder & Live Scan Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Viewfinder Box (Col Span 2) */}
        <div className="lg:col-span-2 bg-[#120E0C] border border-[#2E241E] rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-between min-h-[460px] shadow-2xl">
          {/* Top Camera Controls */}
          <div className="w-full flex items-center justify-between z-10 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider">
                LANE 1 OPTICAL SCANNER ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-stone-400">
              <Camera className="w-3.5 h-3.5" />
              <span>4K High-Speed Barcode C-MOS Sensor</span>
            </div>
          </div>

          {/* Central Animated Viewfinder Frame */}
          <div className="relative my-8 w-64 h-64 sm:w-72 sm:h-72 border-2 border-dashed border-[#D96B27]/50 rounded-2xl flex flex-col items-center justify-center p-4 bg-black/40">
            {/* Viewfinder Target Reticles */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#D96B27]" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#D96B27]" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#D96B27]" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#D96B27]" />

            {/* Scanning Laser Line (Animates during scan) */}
            {isScanning && (
              <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-[#FF7A3D] to-transparent shadow-[0_0_12px_#FF7A3D] animate-[bounce_1s_infinite]" />
            )}

            {/* Inner QR Visual or Success State */}
            {scanSuccess && scannedGuest ? (
              <div className="flex flex-col items-center text-center space-y-2 animate-in zoom-in duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-900/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                  VALIDATED • ACCESS GRANTED
                </div>
                <div className="text-base font-bold text-stone-100">{scannedGuest.name}</div>
                <div className="text-xs text-[#FF7A3D] font-mono">{scannedGuest.table}</div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-3 text-stone-400">
                <QrCode className="w-20 h-20 text-stone-600 animate-pulse" />
                <span className="text-xs font-mono">Present Digital Pass or QR Badge</span>
              </div>
            )}
          </div>

          {/* Action Trigger Buttons */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 z-10 pt-4 border-t border-[#241B16]">
            <div className="flex items-center gap-2">
              <button
                disabled={isScanning || pendingGuests.length === 0}
                onClick={() => handleSimulateScan()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D96B27] to-[#FF7A3D] text-white text-xs font-bold shadow-lg shadow-[#D96B27]/30 hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>{isScanning ? 'Decoding Pass...' : 'Simulate Scan Next Guest'}</span>
              </button>

              <button
                disabled={isScanning || pendingGuests.length === 0}
                onClick={handleRapidRush}
                className="px-3 py-2.5 rounded-xl bg-[#221A15] hover:bg-[#2C211B] border border-[#3A2D24] text-stone-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Simulate 3-Guest Ingress Rush</span>
              </button>
            </div>

            <div className="text-right text-xs text-stone-400 font-mono">
              Pending at Door: <strong className="text-stone-200">{pendingGuests.length}</strong> / {guestList.length}
            </div>
          </div>
        </div>

        {/* Scan Result Details & Alert Feed (Col Span 1) */}
        <div className="space-y-4">
          {/* Active Guest Clearance Card */}
          <div className="p-5 rounded-2xl bg-[#181310] border border-[#2E241E] space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E241E]">
              <h4 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#D96B27]" />
                Live Ingress Card
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-semibold">
                Turnstile Gate 1
              </span>
            </div>

            {scannedGuest ? (
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">Guest Name</span>
                  <div className="text-lg font-bold text-stone-100">{scannedGuest.name}</div>
                  <div className="text-xs text-stone-400">{scannedGuest.phone}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-[#140F0D] border border-[#281F1A]">
                    <span className="text-stone-400 text-[10px] block">Tier Level</span>
                    <span className="font-semibold text-[#FF7A3D]">{scannedGuest.tier}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#140F0D] border border-[#281F1A]">
                    <span className="text-stone-400 text-[10px] block">Seating</span>
                    <span className="font-semibold text-stone-200">{scannedGuest.table}</span>
                  </div>
                </div>

                {/* VIP Arrival Alert */}
                {scannedGuest.tier === 'VIP Patron' && (
                  <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-600/40 text-xs text-amber-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      VIP Red Carpet Protocol
                    </div>
                    <div className="text-[11px] text-amber-300/80">
                      Page VIP Hostess for direct champagne escort to {scannedGuest.table}.
                    </div>
                  </div>
                )}

                {/* Kitchen Dietary Alert Dispatch */}
                {kitchenAlertSent && (
                  <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-600/40 text-xs text-cyan-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-cyan-400" />
                      Kitchen Dietary Notification Dispatched
                    </div>
                    <div className="text-[11px] text-cyan-300/80">
                      Alert sent to Executive Chef: "{scannedGuest.diet}" cover active at {scannedGuest.table}.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-stone-500">
                Trigger a scan from the optical viewfinder to inspect live access clearance.
              </div>
            )}
          </div>

          {/* Recent Door Check-In Activity Feed */}
          <div className="p-5 rounded-2xl bg-[#181310] border border-[#2E241E] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-300">
              <span>Recent Ingress Cleared</span>
              <span className="text-[11px] text-stone-500 font-mono">Live Log</span>
            </div>

            <div className="space-y-2">
              {recentScans.map((scan, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#140F0D] border border-[#281F1A] text-xs"
                >
                  <div>
                    <div className="font-semibold text-stone-200">{scan.name}</div>
                    <div className="text-[10px] text-stone-400">{scan.tier} • {scan.table}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">{scan.time}</span>
                    <span className="block text-[9px] text-stone-500">Lane 1</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
