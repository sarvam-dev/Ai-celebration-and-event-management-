import React from 'react';
import { MapPin, User, Sparkles, ShieldCheck } from 'lucide-react';
import { SHARED_SCREENS } from '../../constants/screens';

export interface ScreenHeaderProps {
  screenIndex?: number;
  screenNumber?: number;
  title?: string;
  subtitle?: string;
  badge?: string;
  accent?: 'orange' | 'cyan' | string;
  venueName?: string;
  venueCity?: string;
  userName?: string;
  userEmail?: string;
  onQuickJump?: (index: number) => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  screenIndex,
  screenNumber,
  title,
  subtitle,
  badge,
  accent = 'orange',
  venueName = 'The Grand Amber Palace - Crystal Ballroom',
  venueCity = 'Metropolis Central',
  userName = 'Director Quantrom',
  userEmail = 'quantromxx@gmail.com',
  onQuickJump
}) => {
  const index = screenIndex !== undefined ? screenIndex : (screenNumber ? screenNumber - 1 : 0);
  const screenInfo = SHARED_SCREENS[index] || SHARED_SCREENS[0];
  const displayTitle = title || screenInfo.title;
  const displaySubtitle = subtitle || screenInfo.subtitle;
  const displayBadge = badge || screenInfo.badge;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#181310]/95 border border-[#2E241E] shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D96B27] to-[#EA580C] text-white flex items-center justify-center font-black text-xl shadow-lg shadow-[#D96B27]/30 shrink-0">
          {index + 1}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF7A3D] bg-[#D96B27]/15 px-2.5 py-0.5 rounded-full border border-[#D96B27]/30 font-semibold">
              SCREEN {index + 1} OF 7
            </span>
            <span className="text-xs font-mono uppercase text-stone-300 font-semibold">
              {displayBadge}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            {displayTitle}
          </h2>
          <p className="text-sm text-stone-300 mt-0.5">
            {displaySubtitle}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
        <div className="flex items-center gap-2 text-sm text-stone-200 bg-[#120E0C] px-3.5 py-2.5 rounded-2xl border border-[#2A221C]">
          <MapPin className="w-4 h-4 text-[#D96B27] shrink-0" />
          <span className="truncate max-w-[200px] sm:max-w-[260px] font-medium">
            {venueName} {venueCity ? `• ${venueCity}` : ''}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-stone-300 bg-[#120E0C] px-3.5 py-2.5 rounded-2xl border border-[#2A221C]">
          <User className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-white truncate max-w-[150px]">{userName}</span>
        </div>
      </div>
    </div>
  );
};
