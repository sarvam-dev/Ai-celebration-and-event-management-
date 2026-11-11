import React, { useState, useMemo } from 'react';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Umbrella, 
  Sparkles, 
  Flame, 
  DollarSign, 
  Radio,
  ArrowRight,
  Compass
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';

export const WeatherContingencyWidget: React.FC = () => {
  const { eventData, addExpense } = useEvent();
  const city = eventData.venueCity || 'Chicago';

  const [isPlanBActive, setIsPlanBActive] = useState<boolean>(false);
  const [contingencyApplied, setContingencyApplied] = useState<boolean>(false);

  // Dynamic City Weather Data
  const weather = useMemo(() => {
    const clean = city.toLowerCase();
    if (clean.includes('miami')) {
      return { temp: '82°F', condition: 'Tropical Breeze & Clear', rainRisk: 15, wind: '8 mph', sunset: '17:38', humidity: '64%' };
    }
    if (clean.includes('los angeles') || clean.includes('la')) {
      return { temp: '74°F', condition: 'Sunny & Golden', rainRisk: 5, wind: '6 mph', sunset: '17:02', humidity: '42%' };
    }
    if (clean.includes('new york') || clean.includes('ny')) {
      return { temp: '62°F', condition: 'Crisp & Partly Cloudy', rainRisk: 25, wind: '11 mph', sunset: '16:48', humidity: '55%' };
    }
    if (clean.includes('london')) {
      return { temp: '54°F', condition: 'Overcast & Misty', rainRisk: 45, wind: '14 mph', sunset: '16:22', humidity: '78%' };
    }
    if (clean.includes('paris')) {
      return { temp: '58°F', condition: 'Gentle Autumn Air', rainRisk: 30, wind: '9 mph', sunset: '17:15', humidity: '68%' };
    }
    // Default / Chicago
    return { temp: '66°F', condition: 'Lakeside Clear & Mild', rainRisk: 20, wind: '12 mph', sunset: '16:40', humidity: '50%' };
  }, [city]);

  const effectiveRainRisk = isPlanBActive ? 75 : weather.rainRisk;

  // Apply Plan B Contingency to Budget
  const handleApplyPlanBToBudget = () => {
    if (contingencyApplied) return;
    addExpense({ name: 'Plan B Marquee Tent & Ballast Structure', category: 'Venue', amount: 4200, status: 'Paid' });
    addExpense({ name: 'Plan B Patio Gas Heaters & HVAC Units', category: 'Decor', amount: 1500, status: 'Paid' });
    setContingencyApplied(true);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#181310] border border-[#2E241E] shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2E241E]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#38BDF8]" />
            <h3 className="text-base font-bold text-stone-100">
              Live Weather Radar & Outdoor Contingency Plan B
            </h3>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
              isPlanBActive 
                ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' 
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
            }`}>
              {isPlanBActive ? 'PLAN B ADVISORY TRIGGERED' : 'PLAN A: FAIR WEATHER'}
            </span>
          </div>
          <p className="text-xs text-stone-400">
            Real-time microclimate intelligence for <strong>{city}</strong> • Sunset Golden Hour at <strong>{weather.sunset}</strong>
          </p>
        </div>

        {/* Plan B Simulation Toggle */}
        <div className="flex items-center gap-2 bg-[#120E0C] p-1 rounded-xl border border-[#2E241E]">
          <button
            onClick={() => setIsPlanBActive(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              !isPlanBActive ? 'bg-emerald-700 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Plan A (Fair)
          </button>
          <button
            onClick={() => setIsPlanBActive(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              isPlanBActive ? 'bg-rose-700 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Plan B (Storm Advisory)
          </button>
        </div>
      </div>

      {/* Weather Telemetry Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#140F0D] border border-[#281F1A] space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span>Ambient Temp</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-stone-100">{weather.temp}</div>
          <div className="text-[11px] text-stone-400 truncate">{weather.condition}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#140F0D] border border-[#281F1A] space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span>Rain Probability</span>
            <CloudRain className={`w-4 h-4 ${effectiveRainRisk > 40 ? 'text-rose-400' : 'text-cyan-400'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono ${effectiveRainRisk > 40 ? 'text-rose-400' : 'text-stone-100'}`}>
            {effectiveRainRisk}%
          </div>
          <div className="text-[11px] text-stone-400 font-mono">Barometric sensor</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#140F0D] border border-[#281F1A] space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span>Wind Velocity</span>
            <Wind className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-100 font-mono">{weather.wind}</div>
          <div className="text-[11px] text-stone-400">Tent ballast safe (&lt;25mph)</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#140F0D] border border-[#281F1A] space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span>Golden Hour Sunset</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-[#FF7A3D] font-mono">{weather.sunset}</div>
          <div className="text-[11px] text-stone-400">Prime photo window</div>
        </div>
      </div>

      {/* Plan B Contingency Action Panel (When triggered) */}
      {isPlanBActive ? (
        <div className="p-5 rounded-xl bg-gradient-to-r from-rose-950/40 via-[#1C120F] to-[#140F0D] border border-rose-800/50 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Inclement Weather Contingency Protocol Active
              </h4>
              <p className="text-xs text-rose-300/80">
                Precipitation threshold exceeded. The system has calculated automatic adjustments for guest comfort and safety.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold uppercase">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#140F0D]/80 border border-rose-900/40 space-y-1">
              <div className="font-semibold text-stone-200 flex items-center gap-1.5">
                <Umbrella className="w-3.5 h-3.5 text-cyan-400" />
                Marquee Tent & Ballasts
              </div>
              <div className="text-stone-400 text-[11px]">
                Deploy 40ft x 60ft clear-span canopy over lawn. Adds <strong>$4,200</strong>.
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#140F0D]/80 border border-rose-900/40 space-y-1">
              <div className="font-semibold text-stone-200 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Patio Heaters & Blowers
              </div>
              <div className="text-stone-400 text-[11px]">
                8 commercial mushroom heaters for ingress corridor. Adds <strong>$1,500</strong>.
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#140F0D]/80 border border-rose-900/40 space-y-1">
              <div className="font-semibold text-stone-200 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#38BDF8]" />
                Run of Show Floor Shift
              </div>
              <div className="text-stone-400 text-[11px]">
                Cocktail hour transferred from Garden Terrace to Covered Pavilion.
              </div>
            </div>
          </div>

          {/* Budget Injection Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-rose-300/90 font-mono">
              Total Plan B Mitigation Cost: <strong>$5,700</strong> (covered by Reserve Contingency)
            </div>

            <button
              onClick={handleApplyPlanBToBudget}
              disabled={contingencyApplied}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                contingencyApplied
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 cursor-default'
                  : 'bg-gradient-to-r from-rose-700 to-[#D96B27] text-white hover:brightness-110 shadow-lg shadow-rose-900/40'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{contingencyApplied ? 'Plan B Injected into Smart Budget' : 'Lock & Sync Plan B with Smart Budget'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#140F0D] border border-[#281F1A] flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Optimal atmospheric conditions. No severe weather mitigations required for outdoor spaces.</span>
          </div>
          <span className="text-[11px] font-mono text-stone-500">Plan A Active</span>
        </div>
      )}
    </div>
  );
};
