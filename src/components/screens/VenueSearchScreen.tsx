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
  Sparkles,
  Globe,
  Palette,
  UtensilsCrossed,
  Briefcase,
  Tag,
  Check,
  Phone,
  ShieldCheck,
  Compass,
  MapPinOff
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { ScreenHeader } from '../shared/ScreenHeader';
import { VenueOption, DecorOption, CateringOption, VendorOption, ServiceTab } from '../../types';
import { isVenueUnderCapacity, calculateBudgetFitPct } from '../../utils/calculations';

const POPULAR_VERIFIED_CITIES = [
  'Jaipur', 'Udaipur', 'Jodhpur', 'Delhi', 'Mumbai', 'Bengaluru',
  'Kolkata', 'Hyderabad', 'Goa', 'Pune', 'Chandigarh', 'Ahmedabad'
];

export const VenueSearchScreen: React.FC = () => {
  const { 
    eventData, 
    updateEventData, 
    venues, 
    selectedVenue, 
    selectPrimaryVenue, 
    fetchVenues, 
    isLoadingVenues, 
    totalBudget,
    setActiveScreenIndex,
    activeServiceTab,
    setActiveServiceTab,
    decorations,
    caterers,
    serviceVendors,
    selectedDecor,
    selectedCatering,
    selectedVendor,
    isLoadingServices,
    fetchServices,
    selectPrimaryDecor,
    selectPrimaryCatering,
    selectPrimaryVendor
  } = useEvent();

  const [cityInput, setCityInput] = useState<string>(eventData.venueCity || 'Jaipur');
  const [eventTypeInput, setEventTypeInput] = useState<string>(eventData.eventType || 'Wedding');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [filterType, setFilterType] = useState<'all' | 'indoor' | 'outdoor' | 'hybrid'>('all');
  const [filterCapacity, setFilterCapacity] = useState<'all' | 'eligible' | 'under'>('all');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(totalBudget);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const guestCountNum = Number(eventData.guestCount) || 450;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCity = cityInput.trim();
    if (!cleanCity) return;
    
    updateEventData({ 
      venueCity: cleanCity,
      eventType: eventTypeInput.trim()
    });

    if (activeServiceTab === 'venues') {
      fetchVenues(cleanCity, guestCountNum, totalBudget);
    } else {
      fetchServices(activeServiceTab, cleanCity, eventTypeInput.trim(), guestCountNum, totalBudget);
    }
  };

  const handleQuickCitySelect = (cityName: string) => {
    setCityInput(cityName);
    updateEventData({ venueCity: cityName });
    if (activeServiceTab === 'venues') {
      fetchVenues(cityName, guestCountNum, totalBudget);
    } else {
      fetchServices(activeServiceTab, cityName, eventTypeInput.trim(), guestCountNum, totalBudget);
    }
  };

  const handleTabChange = (tab: ServiceTab) => {
    setActiveServiceTab(tab);
    setVisibleCount(6);
    const cleanCity = cityInput.trim();
    if (tab === 'venues') {
      if (venues.length === 0) fetchVenues(cleanCity, guestCountNum, totalBudget);
    } else if (tab === 'decoration') {
      if (decorations.length === 0) fetchServices('decoration', cleanCity, eventTypeInput.trim(), guestCountNum, totalBudget);
    } else if (tab === 'catering') {
      if (caterers.length === 0) fetchServices('catering', cleanCity, eventTypeInput.trim(), guestCountNum, totalBudget);
    } else if (tab === 'vendors') {
      if (serviceVendors.length === 0) fetchServices('vendors', cleanCity, eventTypeInput.trim(), guestCountNum, totalBudget);
    }
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Filtered venues
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      if (filterType !== 'all') {
        const io = (venue.indoorOutdoor || '').toLowerCase();
        if (filterType === 'indoor' && !io.includes('indoor') && !io.includes('ballroom')) return false;
        if (filterType === 'outdoor' && !io.includes('outdoor')) return false;
        if (filterType === 'hybrid' && !io.includes('hybrid')) return false;
      }
      const underCap = isVenueUnderCapacity(venue.capacity, guestCountNum);
      if (filterCapacity === 'eligible' && underCap) return false;
      if (filterCapacity === 'under' && !underCap) return false;
      if (venue.estimatedRent > filterMaxPrice) return false;
      return true;
    });
  }, [venues, filterType, filterCapacity, filterMaxPrice, guestCountNum]);

  const displayedVenues = filteredVenues.slice(0, visibleCount);
  const displayedDecor = decorations.slice(0, visibleCount);
  const displayedCatering = caterers.slice(0, visibleCount);
  const displayedVendors = serviceVendors.slice(0, visibleCount);

  const isCurrentLoading = activeServiceTab === 'venues' ? isLoadingVenues : isLoadingServices;

  const quickEventTypes = ['Wedding', 'Corporate Gala', 'Birthday & Anniversary', 'Charity Auction', 'Summit & Plenary'];

  return (
    <div className="w-full text-stone-100 pb-20">
      {/* 1. Header */}
      <ScreenHeader
        screenNumber={2}
        title="Screen 2: Venue, Decor & Vendor Intelligence"
        subtitle="Location-Based Discovery with Genuine Local Business Data & Ratings"
        badge="Spatial & Sourcing Engine"
        accent="orange"
        onQuickJump={setActiveScreenIndex}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Service Category Switcher Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-1.5 bg-[#181310] border border-[#2E241E] rounded-xl shadow-lg">
          <button
            type="button"
            onClick={() => handleTabChange('venues')}
            className={`py-3 px-4 rounded-lg flex items-center justify-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeServiceTab === 'venues'
                ? 'bg-[#D96B27] text-white shadow-md shadow-[#D96B27]/30 ring-1 ring-[#FF7A3D]/50'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#221A15]'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>1. Venue Spaces ({venues.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('decoration')}
            className={`py-3 px-4 rounded-lg flex items-center justify-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeServiceTab === 'decoration'
                ? 'bg-[#D96B27] text-white shadow-md shadow-[#D96B27]/30 ring-1 ring-[#FF7A3D]/50'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#221A15]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>2. Decor & Floral ({decorations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('catering')}
            className={`py-3 px-4 rounded-lg flex items-center justify-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeServiceTab === 'catering'
                ? 'bg-[#D96B27] text-white shadow-md shadow-[#D96B27]/30 ring-1 ring-[#FF7A3D]/50'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#221A15]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>3. Catering ({caterers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('vendors')}
            className={`py-3 px-4 rounded-lg flex items-center justify-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeServiceTab === 'vendors'
                ? 'bg-[#D96B27] text-white shadow-md shadow-[#D96B27]/30 ring-1 ring-[#FF7A3D]/50'
                : 'text-stone-400 hover:text-stone-200 hover:bg-[#221A15]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>4. Production Vendors ({serviceVendors.length})</span>
          </button>
        </div>

        {/* Search & Location Bar */}
        <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-5 shadow-lg space-y-4">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="relative md:col-span-5">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D96B27]" />
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="Enter any city worldwide for Google Maps discovery (e.g. Jaipur, Kolkata, Goa, London, Dubai)..."
                  className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D96B27]"
                />
              </div>

              <div className="relative md:col-span-4">
                <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={eventTypeInput}
                  onChange={(e) => setEventTypeInput(e.target.value)}
                  placeholder="Event type (e.g. Wedding, Gala, Summit)..."
                  className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D96B27]"
                />
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={isCurrentLoading}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#D96B27] hover:bg-[#EA580C] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#D96B27]/20 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isCurrentLoading ? 'animate-spin' : ''}`} />
                  <span>{isCurrentLoading ? 'Searching Local Market...' : `Discover in ${cityInput || 'City'}`}</span>
                </button>
              </div>
            </div>

            {/* Quick City Switcher Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[11px] font-medium mr-1 text-stone-400 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#D96B27]" /> Verified Cities:
              </span>
              {POPULAR_VERIFIED_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleQuickCitySelect(c)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    cityInput.toLowerCase() === c.toLowerCase()
                      ? 'bg-[#D96B27] text-white font-bold shadow-sm ring-1 ring-[#FF7A3D]'
                      : 'bg-[#140F0D] text-stone-300 hover:text-white hover:bg-[#221A15] border border-[#281F1A]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Quick Event Type Selector Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-stone-400 border-t border-[#251D18]">
              <span className="text-[11px] font-medium mr-1 text-stone-500">Event Themes:</span>
              {quickEventTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setEventTypeInput(t);
                    updateEventData({ eventType: t });
                  }}
                  className={`px-2.5 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                    eventTypeInput.toLowerCase() === t.toLowerCase()
                      ? 'bg-[#2E241E] text-[#FF7A3D] font-bold border border-[#D96B27]/50'
                      : 'bg-[#140F0D] text-stone-400 hover:text-stone-200 border border-[#241B16]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </form>

          {/* Location-Based Business Discovery Status Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg bg-[#140F0D] border border-[#281F1A] text-xs">
            <div className="flex items-center gap-2 text-stone-200">
              <Globe className="w-4 h-4 text-[#38BDF8] shrink-0" />
              <span>
                Location-Based Market Discovery: Showing authentic businesses for <strong>{eventTypeInput}</strong> in <strong>{cityInput}</strong>.
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-300 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              100% Genuine Local Market Data
            </span>
          </div>

          {/* Filters Row (Active for Venues) */}
          {activeServiceTab === 'venues' && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2E241E] text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-stone-400 flex items-center gap-1 font-medium">
                  <Filter className="w-3.5 h-3.5 text-[#D96B27]" /> Venue Filters:
                </span>

                <div className="flex items-center gap-1 bg-[#140F0D] p-1 rounded-lg border border-[#2E241E]">
                  {(['all', 'indoor', 'outdoor', 'hybrid'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFilterType(t)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors capitalize ${
                        filterType === t ? 'bg-[#2E241E] text-stone-100 font-semibold' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-[#140F0D] p-1 rounded-lg border border-[#2E241E]">
                  {(['all', 'eligible', 'under'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFilterCapacity(c)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors capitalize ${
                        filterCapacity === c ? 'bg-[#2E241E] text-stone-100 font-semibold' : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {c === 'all' ? 'All Sizes' : c === 'eligible' ? `≥ ${guestCountNum} Guests` : 'Boutique'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-stone-400">
                <span className="font-semibold text-stone-200">{filteredVenues.length}</span> verified venues found in {cityInput}
              </div>
            </div>
          )}
        </div>

        {/* 5. Results Grid or Loading or Empty State */}

        {/* LOADING SKELETON */}
        {isCurrentLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-xl bg-[#181310] border border-[#2E241E] p-5 flex flex-col justify-between">
                <div className="h-44 bg-[#251D18] rounded-lg" />
                <div className="space-y-3 pt-4">
                  <div className="h-5 bg-[#251D18] rounded w-3/4" />
                  <div className="h-3 bg-[#201814] rounded w-1/2" />
                  <div className="h-16 bg-[#1D1612] rounded" />
                </div>
                <div className="h-9 bg-[#251D18] rounded mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* TAB 1: VENUES */}
        {!isCurrentLoading && activeServiceTab === 'venues' && (
          <div className="space-y-4">
            {displayedVenues.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#181310] border border-[#2E241E] text-center space-y-4 shadow-xl">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-950/40 text-amber-400 border border-amber-800/40">
                  <MapPinOff className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">No Verified Venues Found in "{cityInput}"</h3>
                <p className="text-xs text-stone-300 max-w-xl mx-auto leading-relaxed">
                  UTSAVAM AI enforces strict zero-hallucination standards: we never generate synthetic businesses or display venues from another city as local recommendations.
                </p>
                <div className="pt-2">
                  <span className="text-xs text-stone-400 block mb-2 font-medium">Explore genuine event venues in supported verified hubs:</span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {POPULAR_VERIFIED_CITIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleQuickCitySelect(c)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#221A15] hover:bg-[#D96B27] text-stone-200 hover:text-white border border-[#3A2D24] transition-all cursor-pointer"
                      >
                        Explore {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
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

                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-800/60 flex items-center gap-1 shadow-sm">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Place
                          </span>
                          {isUnderCap ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/90 text-rose-300 border border-rose-800/60 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Under Capacity ({venue.capacity} &lt; {guestCountNum})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/90 text-blue-300 border border-blue-800/60 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-blue-400" /> Capacity Match ({venue.capacity} seated)
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#181310]/90 backdrop-blur-md text-amber-300 border border-[#3E2D22] flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {venue.rating ? venue.rating.toFixed(2) : '4.95'}
                            {venue.reviewCount && <span className="text-[10px] text-stone-400">({venue.reviewCount.toLocaleString()})</span>}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-300 bg-[#120E0C]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#2E241E]">
                          <span className="flex items-center gap-1 truncate max-w-[65%]">
                            <MapPin className="w-3.5 h-3.5 text-[#D96B27] shrink-0" /> {venue.locality || venue.area}
                          </span>
                          {venue.distanceKm !== undefined && (
                            <span className="text-[11px] font-mono text-cyan-300 font-semibold">
                              {venue.distanceKm} km from center
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-stone-100">{venue.name}</h3>
                                {isSelected && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D96B27] text-white">
                                    SELECTED PRIMARY
                                  </span>
                                )}
                              </div>
                              {venue.businessCategory && (
                                <div className="text-[11px] font-medium text-[#FF7A3D] mt-0.5">
                                  {venue.businessCategory}
                                </div>
                              )}
                              {venue.address && (
                                <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                                  <span className="truncate">{venue.address}</span>
                                </div>
                              )}
                              <div className="text-xs text-stone-400 mt-1.5 flex items-center gap-3">
                                <span>Max Capacity: <strong className="text-stone-200">{venue.capacity} seated</strong></span>
                                <span>•</span>
                                <span>Est. Rental: <strong className="text-stone-200">${venue.estimatedRent.toLocaleString()}</strong></span>
                                <span>•</span>
                                <span className="capitalize">{venue.indoorOutdoor || 'ballroom'}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-stone-300 mt-3 leading-relaxed bg-[#140F0D] p-3 rounded-lg border border-[#251D18]">
                            {venue.whyItFits}
                          </p>

                          <div className="mt-3">
                            <div className="text-[11px] font-medium text-stone-400 mb-1.5">Key Infrastructure & Amenities:</div>
                            <div className="flex flex-wrap gap-1.5">
                              {venue.amenities.map((amenity, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-[#1D1713] text-stone-300 text-[11px] border border-[#2E241E]"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#251D18] flex items-center justify-between gap-3 text-xs">
                          <div className="flex flex-wrap items-center gap-2.5">
                            {venue.phone && (
                              <a
                                href={`tel:${venue.phone}`}
                                className="text-stone-300 hover:text-white flex items-center gap-1 font-mono transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                                <span>{venue.phone}</span>
                              </a>
                            )}
                            <a
                              href={venue.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + ' ' + (venue.city || cityInput))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold transition-colors bg-[#221A15] hover:bg-[#2E241E] px-2.5 py-1 rounded-md border border-[#3E2D22] text-[11px]"
                              title="View place on Google Maps"
                            >
                              <MapPin className="w-3.5 h-3.5 text-[#D96B27]" />
                              <span>Google Maps</span>
                              <ExternalLink className="w-3 h-3 text-stone-400" />
                            </a>
                            {venue.sourceUrl && (
                              <a
                                href={venue.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#38BDF8] hover:text-[#7DD3FC] flex items-center gap-1 font-medium transition-colors"
                              >
                                <span>Website</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={isUnderCap}
                            onClick={() => selectPrimaryVenue(venue)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : isUnderCap
                                ? 'bg-[#221A15] text-stone-500 cursor-not-allowed border border-[#2E241E]'
                                : 'bg-[#221A15] hover:bg-[#D96B27] text-stone-200 hover:text-white border border-[#3A2D24]'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Selected Venue</span>
                              </>
                            ) : isUnderCap ? (
                              <>
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Under Capacity</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Select As Primary</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {visibleCount < filteredVenues.length && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  className="px-6 py-2.5 rounded-lg bg-[#221A15] hover:bg-[#2E241E] border border-[#3A2D24] text-xs font-semibold text-stone-200 transition-colors cursor-pointer"
                >
                  Load More Venues ({filteredVenues.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DECORATION & FLORAL STYLING */}
        {!isCurrentLoading && activeServiceTab === 'decoration' && (
          <div className="space-y-4">
            {displayedDecor.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#181310] border border-[#2E241E] text-center space-y-4 shadow-xl">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-950/40 text-amber-400 border border-amber-800/40">
                  <MapPinOff className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">No Verified Decorators Found in "{cityInput}"</h3>
                <p className="text-xs text-stone-300 max-w-xl mx-auto leading-relaxed">
                  UTSAVAM AI enforces strict zero-hallucination standards: we never generate synthetic businesses or substitute decorators from outside "{cityInput}".
                </p>
                <div className="pt-2">
                  <span className="text-xs text-stone-400 block mb-2 font-medium">Explore genuine decorators in verified hubs:</span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {POPULAR_VERIFIED_CITIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleQuickCitySelect(c)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#221A15] hover:bg-[#D96B27] text-stone-200 hover:text-white border border-[#3A2D24] transition-all cursor-pointer"
                      >
                        Explore {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayedDecor.map((decor) => {
                  const isSelected = selectedDecor?.id === decor.id || selectedDecor?.name === decor.name;

                  return (
                    <div
                      key={decor.id}
                      className={`bg-[#181310] border rounded-xl overflow-hidden shadow-lg transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#D96B27] ring-2 ring-[#D96B27]/40 shadow-[#D96B27]/10'
                          : 'border-[#2E241E] hover:border-[#3E2D22]'
                      }`}
                    >
                      <div className="relative h-44 w-full bg-gradient-to-br from-[#2E1B11] via-[#1D1410] to-[#140F0D] overflow-hidden">
                        {decor.image ? (
                          <img
                            src={decor.image}
                            alt={decor.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                            <Palette className="w-10 h-10 text-[#D96B27]/60 mb-2" />
                            <div className="text-base font-bold text-stone-200">{decor.name}</div>
                          </div>
                        )}

                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950/90 text-purple-300 border border-purple-800/60 flex items-center gap-1 shadow-sm">
                            <Palette className="w-3 h-3 text-purple-400" /> {decor.style}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#181310]/90 backdrop-blur-md text-amber-300 border border-[#3E2D22] flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {decor.rating.toFixed(2)}
                            {decor.reviewCount && <span className="text-[10px] text-stone-400">({decor.reviewCount.toLocaleString()})</span>}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-300 bg-[#120E0C]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#2E241E]">
                          <span className="font-semibold text-stone-200 truncate max-w-[60%]">{decor.specialty}</span>
                          <span className="font-mono text-[#D96B27] font-bold">{decor.priceRange}</span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-base font-bold text-stone-100">{decor.name}</h3>
                              {decor.address && (
                                <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                                  <span className="truncate">{decor.address}</span>
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-mono text-[#10B981] font-bold whitespace-nowrap">
                              ${decor.estimatedCost.toLocaleString()}
                            </span>
                          </div>

                          <p className="text-xs text-stone-300 mt-2.5 leading-relaxed bg-[#140F0D] p-3 rounded-lg border border-[#251D18]">
                            {decor.whyItFits}
                          </p>

                          <div className="mt-3">
                            <div className="text-[11px] font-medium text-stone-400 mb-1.5">Styling Package Deliverables:</div>
                            <div className="flex flex-wrap gap-1.5">
                              {decor.features.map((feat, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-[#1D1713] text-stone-300 text-[11px] border border-[#2E241E]"
                                >
                                  {feat}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#251D18] flex items-center justify-between gap-3 text-xs">
                          <div className="flex flex-wrap items-center gap-2.5">
                            {decor.phone && (
                              <a
                                href={`tel:${decor.phone}`}
                                className="text-stone-300 hover:text-white flex items-center gap-1 font-mono transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                                <span>{decor.phone}</span>
                              </a>
                            )}
                            <a
                              href={decor.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(decor.name + ' ' + (decor.city || cityInput))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold transition-colors bg-[#221A15] hover:bg-[#2E241E] px-2.5 py-1 rounded-md border border-[#3E2D22] text-[11px]"
                              title="View decorator on Google Maps"
                            >
                              <MapPin className="w-3.5 h-3.5 text-[#D96B27]" />
                              <span>Google Maps</span>
                              <ExternalLink className="w-3 h-3 text-stone-400" />
                            </a>
                            {decor.sourceUrl && (
                              <a
                                href={decor.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#38BDF8] hover:text-[#7DD3FC] flex items-center gap-1 font-medium transition-colors"
                              >
                                <span>Portfolio</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => selectPrimaryDecor(decor)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#221A15] hover:bg-[#D96B27] text-stone-200 hover:text-white border border-[#3A2D24]'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Assigned Decor</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Select Decorator</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BANQUET CATERING */}
        {!isCurrentLoading && activeServiceTab === 'catering' && (
          <div className="space-y-4">
            {displayedCatering.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#181310] border border-[#2E241E] text-center space-y-4 shadow-xl">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-950/40 text-amber-400 border border-amber-800/40">
                  <MapPinOff className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">No Verified Caterers Found in "{cityInput}"</h3>
                <p className="text-xs text-stone-300 max-w-xl mx-auto leading-relaxed">
                  UTSAVAM AI enforces strict zero-hallucination standards: we never generate synthetic businesses or substitute caterers from outside "{cityInput}".
                </p>
                <div className="pt-2">
                  <span className="text-xs text-stone-400 block mb-2 font-medium">Explore genuine caterers in verified hubs:</span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {POPULAR_VERIFIED_CITIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleQuickCitySelect(c)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#221A15] hover:bg-[#D96B27] text-stone-200 hover:text-white border border-[#3A2D24] transition-all cursor-pointer"
                      >
                        Explore {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayedCatering.map((cater) => {
                  const isSelected = selectedCatering?.id === cater.id || selectedCatering?.name === cater.name;

                  return (
                    <div
                      key={cater.id}
                      className={`bg-[#181310] border rounded-xl overflow-hidden shadow-lg transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#D96B27] ring-2 ring-[#D96B27]/40 shadow-[#D96B27]/10'
                          : 'border-[#2E241E] hover:border-[#3E2D22]'
                      }`}
                    >
                      <div className="relative h-44 w-full bg-gradient-to-br from-[#2E1B11] via-[#1D1410] to-[#140F0D] overflow-hidden">
                        {cater.image ? (
                          <img
                            src={cater.image}
                            alt={cater.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                            <UtensilsCrossed className="w-10 h-10 text-[#D96B27]/60 mb-2" />
                            <div className="text-base font-bold text-stone-200">{cater.name}</div>
                          </div>
                        )}

                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-800/60 flex items-center gap-1 shadow-sm">
                            <UtensilsCrossed className="w-3 h-3 text-emerald-400" /> {cater.cuisine}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#181310]/90 backdrop-blur-md text-amber-300 border border-[#3E2D22] flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {cater.rating.toFixed(2)}
                            {cater.reviewCount && <span className="text-[10px] text-stone-400">({cater.reviewCount.toLocaleString()})</span>}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-300 bg-[#120E0C]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#2E241E]">
                          <span className="font-semibold text-stone-200 truncate max-w-[60%]">{cater.serviceStyle}</span>
                          <span className="font-mono text-[#10B981] font-bold">${cater.pricePerGuest}/guest</span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div>
                            <h3 className="text-base font-bold text-stone-100">{cater.name}</h3>
                            {cater.address && (
                              <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                                <span className="truncate">{cater.address}</span>
                              </div>
                            )}
                            <div className="text-xs text-stone-400 mt-1">
                              Estimated Banquet Total ({guestCountNum} guests): <strong className="text-stone-200 font-mono">${(cater.pricePerGuest * guestCountNum).toLocaleString()}</strong>
                            </div>
                          </div>

                          {/* Dietary certifications */}
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {cater.dietaryStrengths.map((diet, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/50"
                              >
                                ✓ {diet}
                              </span>
                            ))}
                          </div>

                          {/* Sample Menu */}
                          <div className="mt-3 bg-[#140F0D] p-3 rounded-lg border border-[#251D18] space-y-1">
                            <div className="text-[11px] font-bold text-[#FF7A3D] uppercase tracking-wide">Sample Banquet Menu:</div>
                            <ul className="text-xs text-stone-300 space-y-0.5">
                              {cater.sampleMenu.map((course, idx) => (
                                <li key={idx} className="truncate">• {course}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#251D18] flex items-center justify-between gap-3 text-xs">
                          <div className="flex flex-wrap items-center gap-2.5">
                            {cater.phone && (
                              <a
                                href={`tel:${cater.phone}`}
                                className="text-stone-300 hover:text-white flex items-center gap-1 font-mono transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                                <span>{cater.phone}</span>
                              </a>
                            )}
                            <a
                              href={cater.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cater.name + ' ' + (cater.city || cityInput))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold transition-colors bg-[#221A15] hover:bg-[#2E241E] px-2.5 py-1 rounded-md border border-[#3E2D22] text-[11px]"
                              title="View caterer on Google Maps"
                            >
                              <MapPin className="w-3.5 h-3.5 text-[#D96B27]" />
                              <span>Google Maps</span>
                              <ExternalLink className="w-3 h-3 text-stone-400" />
                            </a>
                            {cater.sourceUrl && (
                              <a
                                href={cater.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#38BDF8] hover:text-[#7DD3FC] flex items-center gap-1 font-medium transition-colors"
                              >
                                <span>Menu & Tastings</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => selectPrimaryCatering(cater)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#221A15] hover:bg-[#D96B27] text-stone-200 hover:text-white border border-[#3A2D24]'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Assigned Caterer</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Select Caterer</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: VENDORS & PRODUCTION OPS */}
        {!isCurrentLoading && activeServiceTab === 'vendors' && (
          <div className="space-y-4">
            {displayedVendors.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#181310] border border-[#2E241E] text-center space-y-4 shadow-xl">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-950/40 text-amber-400 border border-amber-800/40">
                  <MapPinOff className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">No Verified Vendors Found in "{cityInput}"</h3>
                <p className="text-xs text-stone-300 max-w-xl mx-auto leading-relaxed">
                  UTSAVAM AI enforces strict zero-hallucination standards: we never generate synthetic businesses or substitute vendors from outside "{cityInput}".
                </p>
                <div className="pt-2">
                  <span className="text-xs text-stone-400 block mb-2 font-medium">Explore genuine production vendors in verified hubs:</span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {POPULAR_VERIFIED_CITIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleQuickCitySelect(c)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#221A15] hover:bg-[#D96B27] text-stone-200 hover:text-white border border-[#3A2D24] transition-all cursor-pointer"
                      >
                        Explore {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayedVendors.map((vendor) => {
                  const isSelected = selectedVendor?.id === vendor.id || selectedVendor?.name === vendor.name;

                  return (
                    <div
                      key={vendor.id}
                      className={`bg-[#181310] border rounded-xl overflow-hidden shadow-lg transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#D96B27] ring-2 ring-[#D96B27]/40 shadow-[#D96B27]/10'
                          : 'border-[#2E241E] hover:border-[#3E2D22]'
                      }`}
                    >
                      <div className="relative h-44 w-full bg-gradient-to-br from-[#2E1B11] via-[#1D1410] to-[#140F0D] overflow-hidden">
                        {vendor.image ? (
                          <img
                            src={vendor.image}
                            alt={vendor.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                            <Briefcase className="w-10 h-10 text-[#D96B27]/60 mb-2" />
                            <div className="text-base font-bold text-stone-200">{vendor.name}</div>
                          </div>
                        )}

                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/90 text-cyan-300 border border-cyan-800/60 flex items-center gap-1 shadow-sm">
                            <Briefcase className="w-3 h-3 text-cyan-400" /> {vendor.vendorType}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#181310]/90 backdrop-blur-md text-amber-300 border border-[#3E2D22] flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {vendor.rating.toFixed(2)}
                            {vendor.reviewCount && <span className="text-[10px] text-stone-400">({vendor.reviewCount.toLocaleString()})</span>}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-300 bg-[#120E0C]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#2E241E]">
                          <span className="font-semibold text-stone-200">{vendor.rate}</span>
                          <span className="font-mono text-[#D96B27] font-bold">${vendor.estimatedCost.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-base font-bold text-stone-100">{vendor.name}</h3>
                              {vendor.address && (
                                <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                                  <span className="truncate">{vendor.address}</span>
                                </div>
                              )}
                              <div className="text-xs text-stone-400 mt-1">
                                Crew Deployment: <strong className="text-stone-200">{vendor.crewSize}</strong>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-stone-300 mt-2.5 leading-relaxed bg-[#140F0D] p-3 rounded-lg border border-[#251D18]">
                            {vendor.whyItFits}
                          </p>

                          <div className="mt-3">
                            <div className="text-[11px] font-medium text-stone-400 mb-1.5">Equipment & Technical Highlights:</div>
                            <div className="flex flex-wrap gap-1.5">
                              {vendor.equipmentHighlights.map((eq, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-[#1D1713] text-stone-300 text-[11px] border border-[#2E241E]"
                                >
                                  {eq}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#251D18] flex items-center justify-between gap-3 text-xs">
                          <div className="flex flex-wrap items-center gap-2.5">
                            {vendor.phone && (
                              <a
                                href={`tel:${vendor.phone}`}
                                className="text-stone-300 hover:text-white flex items-center gap-1 font-mono transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                                <span>{vendor.phone}</span>
                              </a>
                            )}
                            <a
                              href={vendor.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.name + ' ' + (vendor.city || cityInput))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold transition-colors bg-[#221A15] hover:bg-[#2E241E] px-2.5 py-1 rounded-md border border-[#3E2D22] text-[11px]"
                              title="View vendor on Google Maps"
                            >
                              <MapPin className="w-3.5 h-3.5 text-[#D96B27]" />
                              <span>Google Maps</span>
                              <ExternalLink className="w-3 h-3 text-stone-400" />
                            </a>
                            {vendor.sourceUrl && (
                              <a
                                href={vendor.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#38BDF8] hover:text-[#7DD3FC] flex items-center gap-1 font-medium transition-colors"
                              >
                                <span>Profile</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => selectPrimaryVendor(vendor)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#221A15] hover:bg-[#D96B27] text-stone-200 hover:text-white border border-[#3A2D24]'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Assigned Vendor</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Select Partner</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
