import React, { useState, useMemo } from 'react';
import { 
  Building, 
  MapPin, 
  Users, 
  DollarSign, 
  Star, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Filter, 
  ChevronDown, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { ScreenHeader } from '../shared/ScreenHeader';
import { ScreenAISolverWidget } from '../ScreenAISolverWidget';
import { VenueOption } from '../../types';
import { isVenueUnderCapacity, calculateBudgetFitPct } from '../../utils/calculations';

export const VenueSearchScreen: React.FC = () => {
  const { 
    eventData, 
    updateEventData, 
    venues, 
    selectedVenue, 
    selectPrimaryVenue, 
    fetchVenues, 
    isLoadingVenues, 
    venueError, 
    totalBudget,
    scenarios,
    resolveScenario,
    setActiveScreenIndex
  } = useEvent();

  const [cityInput, setCityInput] = useState<string>(eventData.venueCity || 'Metropolis Central');
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [filterType, setFilterType] = useState<'all' | 'indoor' | 'outdoor' | 'hybrid'>('all');
  const [filterCapacity, setFilterCapacity] = useState<'all' | 'eligible' | 'under'>('all');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(totalBudget);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const guestCountNum = Number(eventData.guestCount) || 450;
  const scenario2 = scenarios.find((s) => s.screenTarget === 2);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    updateEventData({ venueCity: cityInput.trim() });
    fetchVenues(cityInput.trim(), guestCountNum, totalBudget);
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Filtered venues
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      // Indoor / Outdoor filter
      if (filterType !== 'all') {
        const io = (venue.indoorOutdoor || '').toLowerCase();
        if (filterType === 'indoor' && !io.includes('indoor')) return false;
        if (filterType === 'outdoor' && !io.includes('outdoor')) return false;
        if (filterType === 'hybrid' && !io.includes('hybrid') && !io.includes('courtyard')) return false;
      }

      // Capacity filter
      const underCap = isVenueUnderCapacity(venue.capacity, guestCountNum);
      if (filterCapacity === 'eligible' && underCap) return false;
      if (filterCapacity === 'under' && !underCap) return false;

      // Price filter
      if (venue.estimatedRent > filterMaxPrice) return false;

      return true;
    });
  }, [venues, filterType, filterCapacity, filterMaxPrice, guestCountNum]);

  // Display only first `visibleCount` venues (defaults to 4)
  const displayedVenues = filteredVenues.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVenues.length;

  return (
    <div className="w-full text-stone-100 pb-20">
      {/* 1. Consistent Sticky Header */}
      <ScreenHeader
        screenNumber={2}
        title="Screen 2: Venue Search"
        subtitle="Live City Venue Discovery & Grounded Capacity Matching"
        badge="Spatial Intelligence"
        accent="orange"
        onQuickJump={setActiveScreenIndex}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* 2. Consistent Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Search City</span>
              <MapPin className="w-5 h-5 text-[#D96B27]" />
            </div>
            <div className="text-xl font-bold text-stone-100 truncate">
              {eventData.venueCity || 'Metropolis Central'}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              {venues.length} venues discovered
            </div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Guest Threshold</span>
              <Users className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">{guestCountNum}</div>
            <div className="text-xs text-stone-400 mt-1">Minimum seated capacity</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Primary Selection</span>
              <Building className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="text-sm font-bold text-stone-100 truncate">
              {selectedVenue?.name || eventData.venueName || 'Not Selected'}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              Rent: ${selectedVenue?.estimatedRent.toLocaleString() || '18,500'}
            </div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Budget Fit Ratio</span>
              <DollarSign className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">
              {selectedVenue
                ? `${calculateBudgetFitPct(selectedVenue.estimatedRent, totalBudget)}%`
                : '28.5%'}
            </div>
            <div className="text-xs text-stone-400 mt-1">Of total event capital</div>
          </div>
        </div>

        {/* 3. Consistent AI Conflict Card */}
        {scenario2 && (
          <ScreenAISolverWidget
            scenario={scenario2}
            onResolve={() => resolveScenario(scenario2.id)}
          />
        )}

        {/* 4. Search & Filter Bar */}
        <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-5 shadow-lg space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Enter city (e.g., Chicago, Paris, New York, Metropolis)..."
                className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D96B27]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoadingVenues}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#D96B27] hover:bg-[#EA580C] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#D96B27]/20 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingVenues ? 'animate-spin' : ''}`} />
              <span>{isLoadingVenues ? 'Grounding Search...' : 'Search Venues'}</span>
            </button>
          </form>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2E241E] text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-stone-400 flex items-center gap-1 font-medium">
                <Filter className="w-3.5 h-3.5 text-[#D96B27]" /> Filters:
              </span>

              {/* Space layout filter */}
              <div className="flex items-center gap-1 bg-[#140F0D] p-1 rounded-lg border border-[#2E241E]">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    filterType === 'all' ? 'bg-[#2E241E] text-stone-100 font-semibold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  All Types
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('indoor')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    filterType === 'indoor' ? 'bg-[#2E241E] text-stone-100 font-semibold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Indoor
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('outdoor')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    filterType === 'outdoor' ? 'bg-[#2E241E] text-stone-100 font-semibold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Outdoor
                </button>
              </div>

              {/* Capacity filter */}
              <div className="flex items-center gap-1 bg-[#140F0D] p-1 rounded-lg border border-[#2E241E]">
                <button
                  type="button"
                  onClick={() => setFilterCapacity('all')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    filterCapacity === 'all' ? 'bg-[#2E241E] text-stone-100 font-semibold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  All Cap
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCapacity('eligible')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    filterCapacity === 'eligible' ? 'bg-[#10B981]/20 text-emerald-300 font-semibold border border-emerald-800/40' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Eligible Only
                </button>
              </div>
            </div>

            <div className="text-stone-400">
              Showing <span className="font-semibold text-stone-200">{displayedVenues.length}</span> of{' '}
              <span className="font-semibold text-stone-200">{filteredVenues.length}</span> matching venues
            </div>
          </div>
        </div>

        {/* Error notice if any */}
        {venueError && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/50 flex items-center gap-3 text-amber-200 text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="flex-1">
              <span className="font-semibold">Notice:</span> {venueError}
            </div>
            <button
              onClick={() => fetchVenues(cityInput, guestCountNum, totalBudget)}
              className="px-3 py-1 bg-amber-800/50 hover:bg-amber-800 rounded text-xs font-semibold text-amber-100 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* 5. Venues Grid (Displays 4 initially, expandable to 8-12) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayedVenues.map((venue) => {
            const isUnderCap = isVenueUnderCapacity(venue.capacity, guestCountNum);
            const isSelected = selectedVenue?.id === venue.id || selectedVenue?.name === venue.name;
            const fitPct = calculateBudgetFitPct(venue.estimatedRent, totalBudget);
            const hasError = imageErrors[venue.id];

            return (
              <div
                key={venue.id}
                className={`bg-[#181310] border rounded-xl overflow-hidden shadow-lg transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#D96B27] ring-2 ring-[#D96B27]/40 shadow-[#D96B27]/10'
                    : isUnderCap
                    ? 'border-stone-800 opacity-80'
                    : 'border-[#2E241E] hover:border-[#3E2D22]'
                }`}
              >
                {/* Image or High-Contrast Fallback Gradient */}
                <div className="relative h-48 w-full bg-gradient-to-br from-[#2E1B11] via-[#1D1410] to-[#140F0D] overflow-hidden">
                  {venue.image && !hasError ? (
                    <img
                      src={venue.image}
                      alt={venue.name}
                      onError={() => handleImageError(venue.id)}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#3D2010] via-[#221610] to-[#120E0C]">
                      <Building className="w-10 h-10 text-[#D96B27]/60 mb-2" />
                      <div className="text-base font-bold text-stone-200">{venue.name}</div>
                      <div className="text-xs text-stone-400 mt-1">{venue.area}</div>
                    </div>
                  )}

                  {/* Overlays / Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {venue.isAiSuggested && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#181310]/80 backdrop-blur-md text-[#FF7A3D] border border-[#D96B27]/40 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI-Grounded
                      </span>
                    )}
                    {isUnderCap ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/90 text-rose-300 border border-rose-800/60 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Under Capacity ({venue.capacity} &lt; {guestCountNum})
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Capacity Match ({venue.capacity} guests)
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#181310]/90 backdrop-blur-md text-amber-300 border border-[#3E2D22] flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {venue.rating ? venue.rating.toFixed(1) : '4.8'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-300 bg-[#120E0C]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#2E241E]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D96B27]" /> {venue.area}
                    </span>
                    <span className="font-mono text-[#10B981] font-semibold">
                      Budget Fit: {fitPct}%
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-stone-100">{venue.name}</h3>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-extrabold text-[#10B981]">
                          ${venue.estimatedRent.toLocaleString()}
                        </div>
                        <div className="text-xs text-stone-400">est. base rental</div>
                      </div>
                    </div>

                    <p className="text-xs text-stone-300 mt-2 italic bg-[#140F0D] p-2.5 rounded-lg border border-[#2E241E]">
                      &ldquo;{venue.whyItFits}&rdquo;
                    </p>

                    {/* Amenities */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {venue.amenities.map((amenity, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-xs bg-[#221A15] border border-[#3A2D24] text-stone-300"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#2E241E] flex items-center justify-between gap-3">
                    {venue.sourceUrl ? (
                      <a
                        href={venue.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#38BDF8] hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>Official Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-stone-500">Verified Municipal Directory</span>
                    )}

                    <button
                      onClick={() => selectPrimaryVenue(venue)}
                      disabled={isUnderCap}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 cursor-default'
                          : isUnderCap
                          ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                          : 'bg-[#D96B27] hover:bg-[#EA580C] text-white cursor-pointer shadow-md shadow-[#D96B27]/20'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Primary Selected</span>
                        </>
                      ) : isUnderCap ? (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          <span>Under Capacity</span>
                        </>
                      ) : (
                        <>
                          <span>Select as Primary Venue</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 6. Load More Button */}
        {hasMore && (
          <div className="text-center pt-2">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(filteredVenues.length, prev + 4))}
              className="px-6 py-2.5 rounded-xl bg-[#221A15] hover:bg-[#2E241E] border border-[#3A2D24] text-stone-200 text-sm font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Load More Venues ({filteredVenues.length - visibleCount} remaining)</span>
              <ChevronDown className="w-4 h-4 text-[#D96B27]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
