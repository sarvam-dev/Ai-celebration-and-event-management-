import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  Share2, 
  Utensils, 
  ShieldCheck,
  User
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { GuestRecord } from '../../types';

interface DigitalInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: GuestRecord | null;
}

export const DigitalInvitationModal: React.FC<DigitalInvitationModalProps> = ({ isOpen, onClose, guest }) => {
  const { eventData, selectedVenue, guestList } = useEvent();
  const [selectedGuestId, setSelectedGuestId] = useState<string>(guest?.id || (guestList[0]?.id || '1'));
  const [copied, setCopied] = useState(false);
  const [simulatedStatus, setSimulatedStatus] = useState<'Attending' | 'Declined' | null>(null);

  if (!isOpen) return null;

  const currentGuest = guestList.find((g) => g.id === selectedGuestId) || guest || guestList[0] || {
    id: 'sample-1',
    name: 'Alexandra Vance, Esq.',
    tier: 'VIP Patron',
    table: 'Table 01 (Patrons)',
    diet: 'Tree Nut & Peanut Allergy',
    rsvp: 'Attending',
    checkedIn: true,
    phone: '+1 (555) 234-8901'
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#16110E] border border-[#2E241E] w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2E241E] bg-[#1A1411]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D96B27]" />
            <h3 className="text-base font-bold text-stone-100">
              VIP Digital Invitation & Passcode Preview
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-[#281F1A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Guest Selector Dropdown */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#120E0C] border border-[#2E241E]">
            <span className="text-xs text-stone-400 font-medium">Previewing Guest:</span>
            <select
              value={currentGuest.id}
              onChange={(e) => {
                setSelectedGuestId(e.target.value);
                setSimulatedStatus(null);
              }}
              className="bg-[#1C1613] border border-[#3A2D24] text-xs text-stone-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#D96B27]"
            >
              {guestList.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.tier} • {g.table})
                </option>
              ))}
            </select>
          </div>

          {/* Luxury Digital Invitation Card */}
          <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#241B16] via-[#1C1512] to-[#120E0C] border-2 border-[#D96B27]/50 shadow-2xl space-y-6 text-center overflow-hidden">
            {/* Elegant Corner Filigree Accents */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#D96B27]/60" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#D96B27]/60" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#D96B27]/60" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#D96B27]/60" />

            {/* Event Host / Top Branding */}
            <div>
              <div className="text-[11px] font-mono tracking-widest text-[#D96B27] uppercase font-bold">
                {eventData.honoreeOrHost || 'The Grand Guild Executive Committee'}
              </div>
              <div className="text-[10px] text-stone-400 tracking-wider uppercase mt-0.5">
                Cordially Requests The Honor Of Your Presence
              </div>
            </div>

            {/* Event Name */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 tracking-tight">
                {eventData.eventName || 'Metropolitan Gala & Honors Banquet'}
              </h2>
              <p className="text-xs text-[#FF7A3D] font-medium mt-1">
                {eventData.eventType} • {eventData.themeStyle || 'Royal Terracotta & Warm Gold'}
              </p>
            </div>

            {/* Guest Personalization Banner */}
            <div className="py-3 px-4 rounded-xl bg-[#140F0D]/90 border border-[#3A2D24] inline-block max-w-full">
              <div className="text-xs text-stone-400 uppercase tracking-wider">Honored Guest</div>
              <div className="text-lg font-bold text-stone-100">{currentGuest.name}</div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2D1F17] text-[#FF7A3D] border border-[#D96B27]/40 font-semibold">
                  {currentGuest.tier} Pass
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  {currentGuest.table}
                </span>
              </div>
            </div>

            {/* Key Event Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-2.5 rounded-lg bg-[#140F0D]/60 border border-[#2A201A] flex flex-col items-center">
                <Calendar className="w-4 h-4 text-[#D96B27] mb-1" />
                <span className="text-stone-400 text-[10px]">Date</span>
                <span className="text-stone-200 font-semibold">{eventData.startDate || 'Saturday, Nov 14'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#140F0D]/60 border border-[#2A201A] flex flex-col items-center">
                <Clock className="w-4 h-4 text-[#D96B27] mb-1" />
                <span className="text-stone-400 text-[10px]">Ingress Time</span>
                <span className="text-stone-200 font-semibold">{eventData.startTime || '18:00 Reception'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#140F0D]/60 border border-[#2A201A] flex flex-col items-center">
                <MapPin className="w-4 h-4 text-[#D96B27] mb-1" />
                <span className="text-stone-400 text-[10px]">Location</span>
                <span className="text-stone-200 font-semibold truncate max-w-[120px]">
                  {selectedVenue ? selectedVenue.name : (eventData.venueCity || 'Grand Ballroom')}
                </span>
              </div>
            </div>

            {/* Personalized QR Code & Security Passcode */}
            <div className="pt-2 flex flex-col items-center">
              <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-stone-200 flex flex-col items-center">
                {/* Visual SVG QR Code Matrix */}
                <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white" />
                  {/* Outer corner finders */}
                  <rect x="10" y="10" width="24" height="24" fill="#120E0C" />
                  <rect x="14" y="14" width="16" height="16" fill="white" />
                  <rect x="18" y="18" width="8" height="8" fill="#D96B27" />

                  <rect x="66" y="10" width="24" height="24" fill="#120E0C" />
                  <rect x="70" y="14" width="16" height="16" fill="white" />
                  <rect x="74" y="18" width="8" height="8" fill="#D96B27" />

                  <rect x="10" y="66" width="24" height="24" fill="#120E0C" />
                  <rect x="14" y="70" width="16" height="16" fill="white" />
                  <rect x="18" y="74" width="8" height="8" fill="#D96B27" />

                  {/* QR Pattern dots */}
                  <rect x="42" y="12" width="6" height="6" fill="#120E0C" />
                  <rect x="52" y="12" width="6" height="6" fill="#120E0C" />
                  <rect x="42" y="24" width="6" height="6" fill="#120E0C" />
                  <rect x="48" y="32" width="6" height="6" fill="#120E0C" />
                  <rect x="12" y="44" width="6" height="6" fill="#120E0C" />
                  <rect x="24" y="44" width="6" height="6" fill="#120E0C" />
                  <rect x="36" y="44" width="6" height="6" fill="#120E0C" />
                  <rect x="48" y="44" width="6" height="6" fill="#D96B27" />
                  <rect x="60" y="44" width="6" height="6" fill="#120E0C" />
                  <rect x="72" y="44" width="6" height="6" fill="#120E0C" />
                  <rect x="84" y="44" width="6" height="6" fill="#120E0C" />
                  <rect x="42" y="56" width="6" height="6" fill="#120E0C" />
                  <rect x="54" y="56" width="6" height="6" fill="#120E0C" />
                  <rect x="66" y="56" width="6" height="6" fill="#120E0C" />
                  <rect x="42" y="68" width="6" height="6" fill="#120E0C" />
                  <rect x="54" y="68" width="6" height="6" fill="#120E0C" />
                  <rect x="66" y="68" width="6" height="6" fill="#120E0C" />
                  <rect x="78" y="68" width="6" height="6" fill="#120E0C" />
                  <rect x="78" y="80" width="6" height="6" fill="#120E0C" />
                  <rect x="42" y="80" width="6" height="6" fill="#120E0C" />
                </svg>
              </div>

              <span className="text-[11px] font-mono text-stone-400 mt-2">
                TURNSTILE PASSCODE: <strong className="text-stone-200">GUEST-{currentGuest.id}-VIP</strong>
              </span>

              {/* Dietary Note */}
              {currentGuest.diet && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-300 font-medium">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Dietary Registry: {currentGuest.diet}</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Guest RSVP Simulation */}
          <div className="p-4 rounded-xl bg-[#140F0D] border border-[#2E241E] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-300 font-semibold">Simulate Guest RSVP Response:</span>
              <span className="text-[11px] text-stone-400">
                Current DB Status: <strong className="text-stone-200">{simulatedStatus || currentGuest.rsvp}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSimulatedStatus('Attending')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  (simulatedStatus || currentGuest.rsvp) === 'Attending'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-[#1C1613] text-stone-400 hover:text-stone-200 border border-[#2E241E]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Attending
              </button>

              <button
                onClick={() => setSimulatedStatus('Declined')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  (simulatedStatus || currentGuest.rsvp) === 'Declined'
                    ? 'bg-rose-700 text-white font-bold'
                    : 'bg-[#1C1613] text-stone-400 hover:text-stone-200 border border-[#2E241E]'
                }`}
              >
                <X className="w-4 h-4" />
                Decline with Regrets
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2E241E] bg-[#1A1411]">
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-lg bg-[#27170E] hover:bg-[#341F13] border border-[#D96B27]/40 text-[#FF7A3D] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Passcode Link Copied!' : 'Copy Shareable Pass'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#2E241E] hover:bg-[#3A2D24] text-stone-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
