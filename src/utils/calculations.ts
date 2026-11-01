/**
 * Pure calculation and validation utility functions for Event Studio.
 * Every mathematical formula in the application originates here.
 */

export interface ExpenseItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  status: 'Paid' | 'Pending';
}

export interface GuestItem {
  id: string;
  name: string;
  rsvp: 'Attending' | 'Pending' | 'Declined';
  tier: string;
  table: string;
  diet: string;
  checkedIn: boolean;
  phone: string;
}

export interface StaffItem {
  id: string;
  name: string;
  role: string;
  dept: string;
  shift: string;
  status: 'On Duty' | 'On Break' | 'Scheduled';
  channel: string;
  phone: string;
}

export interface VenueItem {
  id: string;
  name: string;
  area: string;
  capacity: number;
  estimatedRent: number;
  rating: number;
  amenities: string[];
  whyItFits: string;
  indoorOutdoor?: string;
  sourceUrl?: string;
  image?: string;
  isAiSuggested?: boolean;
}

/**
 * Total Committed = sum of all Paid and Pending expenses.
 * Negative expenses are strictly filtered or prohibited.
 */
export function calculateTotalSpent(expenses: ExpenseItem[]): number {
  return expenses
    .filter((e) => e.status === 'Paid' || e.status === 'Pending')
    .reduce((sum, e) => sum + Math.max(0, e.amount || 0), 0);
}

/**
 * Remaining Reserve = Total Budget - sum of all Paid and Pending expenses.
 * Never drops below 0.
 */
export function calculateRemainingReserve(totalBudget: number, expenses: ExpenseItem[]): number {
  const spent = calculateTotalSpent(expenses);
  return Math.max(0, totalBudget - spent);
}

/**
 * Estimated cost per guest.
 */
export function calculateCostPerGuest(totalBudget: number, guestCount: number): number {
  const count = Math.max(1, guestCount);
  return Math.round(totalBudget / count);
}

/**
 * Turnstile Queue Wait Time:
 * Wait Time (minutes) = (guests × secondsPerGuest) ÷ (gates × 60)
 */
export function calculateQueueWaitTime(
  guests: number,
  secondsPerGuest: number = 8,
  gates: number = 1
): number {
  const safeGates = Math.max(1, gates);
  const safeGuests = Math.max(0, guests);
  return Math.round((safeGuests * secondsPerGuest) / (safeGates * 60));
}

/**
 * Throughput (guests per minute)
 */
export function calculateThroughputPerMinute(secondsPerGuest: number = 8, gates: number = 1): number {
  const safeGates = Math.max(1, gates);
  return Math.round((safeGates * 60) / Math.max(1, secondsPerGuest));
}

/**
 * Confirmation percentage = (attending ÷ total invited) × 100
 */
export function calculateConfirmationPct(attending: number, totalInvited: number): string {
  if (!totalInvited || totalInvited <= 0) return '0.0';
  const pct = (attending / totalInvited) * 100;
  return pct.toFixed(1);
}

/**
 * Parse shift string like "12:00 - 00:00" to calculate total shift duration in hours.
 */
export function getShiftHours(shiftStr: string): number {
  const match = shiftStr.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!match) return 8;
  const start = parseInt(match[1], 10);
  let end = parseInt(match[3], 10);
  if (end <= start) end += 24;
  return end - start;
}

/**
 * Determine if a staff member is at risk of fatigue:
 * Scheduled for 12+ continuous hours without an active break or deputy handover.
 */
export function isStaffFatigued(staff: StaffItem): boolean {
  const hours = getShiftHours(staff.shift);
  const hasHandover = 
    staff.shift.toLowerCase().includes('handover') || 
    staff.shift.toLowerCase().includes('deputy') ||
    staff.shift.toLowerCase().includes('break');
  return hours >= 12 && !hasHandover && staff.status !== 'On Break';
}

/**
 * Shift Health Score:
 * Derived from the roster. Drops by 14 points per fatigued staff member.
 * Must NEVER show 100% while a fatigue warning is active.
 */
export function calculateShiftHealth(staff: StaffItem[]): {
  score: number;
  fatiguedCount: number;
  fatiguedNames: string[];
} {
  const fatigued = staff.filter(isStaffFatigued);
  const fatiguedCount = fatigued.length;
  const fatiguedNames = fatigued.map((s) => s.name);

  if (fatiguedCount === 0) {
    return { score: 100, fatiguedCount: 0, fatiguedNames: [] };
  }

  // Never 100% when fatigue is active; calibrated between 45% and 82%
  const score = Math.max(45, Math.min(82, 85 - fatiguedCount * 14));
  return { score, fatiguedCount, fatiguedNames };
}

/**
 * Capacity validation:
 * Flags if venue capacity is strictly less than required guest count.
 */
export function isVenueUnderCapacity(venueCapacity: number, requiredGuests: number): boolean {
  return venueCapacity < requiredGuests;
}

/**
 * Budget Fit Ratio:
 * (venue rent ÷ total event budget) × 100
 */
export function calculateBudgetFitPct(rent: number, totalBudget: number): string {
  if (!totalBudget || totalBudget <= 0) return '0.0';
  const pct = (rent / totalBudget) * 100;
  return pct.toFixed(1);
}

/**
 * Validates budget category allocation:
 * Asserts that the sum of all percentages equals exactly 100%.
 */
export function validateCategoryAllocation(categories: { pct: number }[]): boolean {
  const sum = categories.reduce((total, c) => total + c.pct, 0);
  return Math.abs(sum - 100) < 0.001;
}
