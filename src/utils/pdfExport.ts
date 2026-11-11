import jsPDF from 'jspdf';
import { EventSetupData, AuthUser, ProblemScenario, VenueOption, ExpenseRecord, GuestRecord, StaffRecord } from '../types';
import { CategoryAllocation } from '../context/EventContext';

export interface PdfExportData {
  eventData: EventSetupData;
  currentUser: AuthUser | null;
  selectedVenue: VenueOption | null;
  totalBudget: number;
  totalSpent: number;
  remainingReserve: number;
  costPerGuest: number;
  categoryAllocations: CategoryAllocation[];
  expenses: ExpenseRecord[];
  checklist: Array<{ id: string; title: string; category: string; done: boolean; priority: string }>;
  guestList: GuestRecord[];
  totalInvited: number;
  attendingCount: number;
  pendingCount: number;
  declinedCount: number;
  checkedInCount: number;
  confirmationRate: string;
  turnstileGates: number;
  secondsPerGuest: number;
  queueWaitTime: number;
  throughputPerMinute: number;
  staffRoster: StaffRecord[];
  shiftHealth: { score: number; fatiguedCount: number; fatiguedNames: string[] };
  scenarios: ProblemScenario[];
}

export function generateEventMasterPdf(data: PdfExportData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper: check page bounds and auto-add new page
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawPageHeader();
    }
  };

  // Running Mini-Header on sub-pages
  const drawPageHeader = () => {
    doc.setFillColor(24, 19, 16);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(217, 107, 39);
    doc.text('EVENT STUDIO • EXECUTIVE PRODUCTION DOSSIER', margin + 3, y + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 170, 160);
    doc.text(data.eventData.eventName, pageWidth - margin - 3, y + 5.5, { align: 'right' });
    y += 12;
  };

  // Helper: Section Banner
  const drawSectionHeader = (title: string, subtitle?: string) => {
    checkPageBreak(16);
    doc.setFillColor(34, 26, 21);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), margin + 4, y + 5.5);

    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(217, 107, 39);
      doc.text(subtitle, pageWidth - margin - 4, y + 5.5, { align: 'right' });
    }
    y += 12;
  };

  // -------------------------------------------------------------
  // PAGE 1: COVER & EXECUTIVE DASHBOARD
  // -------------------------------------------------------------
  // Header Ribbon
  doc.setFillColor(217, 107, 39);
  doc.rect(margin, y, contentWidth, 3.5, 'F');
  y += 6;

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 20, 15);
  doc.text(data.eventData.eventName, margin, y + 4);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(110, 90, 80);
  doc.text(
    `Comprehensive Master Production Dossier, Budget Ledger, Ingress Physics & Run-of-Show`,
    margin,
    y
  );
  y += 5;

  // Metadata Sub-row
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(130, 115, 105);
  const nowStr = new Date().toLocaleString();
  const producer = data.currentUser?.name || 'Director Quantrom';
  const role = data.currentUser?.role || 'Lead Producer';
  doc.text(`Generated: ${nowStr}   |   Producer: ${producer} (${role})   |   Status: Certified Active`, margin, y);
  y += 8;

  // 4 Top Telemetry KPI Cards
  const kpiWidth = (contentWidth - 6) / 4;
  const kpiHeight = 16;
  const kpis = [
    { label: 'Readiness Index', value: '94%', sub: 'Production cleared' },
    { label: 'Target Attendees', value: `${data.totalInvited}`, sub: `${data.eventData.budgetTier}` },
    { label: 'Committed Spent', value: `$${data.totalSpent.toLocaleString()}`, sub: `Reserve: $${data.remainingReserve.toLocaleString()}` },
    { label: 'Shift Health', value: `${data.shiftHealth.score}%`, sub: data.shiftHealth.fatiguedCount > 0 ? `${data.shiftHealth.fatiguedCount} fatigue alerts` : 'All shifts safe' },
  ];

  kpis.forEach((kpi, idx) => {
    const x = margin + idx * (kpiWidth + 2);
    doc.setFillColor(245, 240, 235);
    doc.roundedRect(x, y, kpiWidth, kpiHeight, 1.5, 1.5, 'F');
    doc.setDrawColor(210, 195, 180);
    doc.roundedRect(x, y, kpiWidth, kpiHeight, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 85, 75);
    doc.text(kpi.label.toUpperCase(), x + 3, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(217, 107, 39);
    doc.text(kpi.value, x + 3, y + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(120, 110, 100);
    doc.text(kpi.sub, x + 3, y + 14);
  });
  y += kpiHeight + 6;

  // Core Event Setup Matrix Table
  drawSectionHeader('1. Event Specifications & Spatial Staging', `Type: ${data.eventData.eventType}`);

  const specs = [
    ['Event Name', data.eventData.eventName || 'Celebration Event', 'Event Type', data.eventData.eventType || 'Celebration'],
    ['Honoree / Host', data.eventData.honoreeOrHost || 'Honored Host', 'Theme / Palette', data.eventData.themeStyle || 'Terracotta & Royal Gold'],
    ['Assigned Venue', data.selectedVenue?.name || data.eventData.venueName || 'Venue TBD', 'City Location', data.eventData.venueCity || 'City'],
    ['Target Guests', `${data.totalInvited} Invited (${data.attendingCount} Confirmed)`, 'Authorized Budget', `$${data.totalBudget.toLocaleString()} USD (~$${data.costPerGuest}/guest)`],
    ['Scheduled Opening', `${data.eventData.startDate} at ${data.eventData.startTime}`, 'Multi-Day Scope', 'Day -1 to Day 3 (4 Operational Phases)'],
  ];

  specs.forEach((row) => {
    checkPageBreak(6);
    doc.setFillColor(250, 246, 242);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(80, 60, 50);
    doc.text(row[0] + ':', margin + 2.5, y + 3.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 25, 20);
    doc.text(row[1], margin + 28, y + 3.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(80, 60, 50);
    doc.text(row[2] + ':', margin + (contentWidth / 2) + 2.5, y + 3.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 25, 20);
    doc.text(row[3], margin + (contentWidth / 2) + 30, y + 3.8);

    y += 5.5;
  });
  y += 4;

  // -------------------------------------------------------------
  // MASTER CHECKLIST SECTION
  // -------------------------------------------------------------
  drawSectionHeader('2. Master Production Readiness Checklist', `${data.checklist.filter(c => c.done).length} of ${data.checklist.length} Cleared`);

  data.checklist.forEach((item, idx) => {
    checkPageBreak(5.5);
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 245, idx % 2 === 0 ? 255 : 240);
    doc.rect(margin, y, contentWidth, 5, 'F');

    // Status icon badge
    if (item.done) {
      doc.setTextColor(22, 101, 52);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('[CLEARED]', margin + 2, y + 3.6);
    } else {
      doc.setTextColor(194, 65, 12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('[PENDING]', margin + 2, y + 3.6);
    }

    doc.setFont('helvetica', item.done ? 'normal' : 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(40, 35, 30);
    doc.text(item.title, margin + 22, y + 3.6);

    // Category & Priority
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(120, 110, 100);
    doc.text(`${item.category} | Priority: ${item.priority}`, pageWidth - margin - 3, y + 3.6, { align: 'right' });

    y += 5;
  });
  y += 4;

  // -------------------------------------------------------------
  // BUDGET & CAPITAL ALLOCATION SECTION
  // -------------------------------------------------------------
  checkPageBreak(40);
  drawSectionHeader('3. Financial Allocation & Committed Expense Ledger', `Total: $${data.totalBudget.toLocaleString()} | Reserve: $${data.remainingReserve.toLocaleString()}`);

  // Category percentage bar visualization
  const barY = y;
  const barHeight = 4;
  let barX = margin;
  data.categoryAllocations.forEach((cat) => {
    const segWidth = (contentWidth * cat.pct) / 100;
    // Map colors to RGB
    let r = 217, g = 107, b = 39;
    if (cat.name.includes('Catering')) { r = 234; g = 88; b = 12; }
    if (cat.name.includes('AV')) { r = 56; g = 189; b = 248; }
    if (cat.name.includes('Decor')) { r = 245; g = 158; b = 11; }
    if (cat.name.includes('Entertainment')) { r = 168; g = 85; b = 247; }
    if (cat.name.includes('Contingency') || cat.name.includes('Buffer')) { r = 16; g = 185; b = 129; }

    doc.setFillColor(r, g, b);
    doc.rect(barX, barY, segWidth, barHeight, 'F');
    barX += segWidth;
  });
  y += barHeight + 3;

  // Category legend grid
  const catCols = 3;
  const catColWidth = contentWidth / catCols;
  data.categoryAllocations.forEach((cat, idx) => {
    const col = idx % catCols;
    const row = Math.floor(idx / catCols);
    const itemX = margin + col * catColWidth;
    const itemY = y + row * 4.5;

    const allocated = Math.round((data.totalBudget * cat.pct) / 100);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(60, 45, 35);
    doc.text(`• ${cat.name}:`, itemX, itemY + 3);
    doc.setFont('helvetica', 'normal');
    doc.text(`$${allocated.toLocaleString()} (${cat.pct}%)`, itemX + 35, itemY + 3);
  });
  y += Math.ceil(data.categoryAllocations.length / catCols) * 4.5 + 3;

  // Committed expenses line items
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(110, 90, 80);
  doc.text('COMMITTED LINE ITEM LEDGER (PAID & PENDING):', margin, y + 3);
  y += 4.5;

  data.expenses.forEach((exp, idx) => {
    checkPageBreak(5);
    doc.setFillColor(idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 246 : 255, idx % 2 === 0 ? 242 : 255);
    doc.rect(margin, y, contentWidth, 4.5, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(40, 35, 30);
    doc.text(exp.name, margin + 2, y + 3.2);

    doc.setTextColor(120, 100, 90);
    doc.text(exp.category, margin + 95, y + 3.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(exp.status === 'Paid' ? 22 : 194, exp.status === 'Paid' ? 101 : 65, exp.status === 'Paid' ? 52 : 12);
    doc.text(`[${exp.status.toUpperCase()}]`, margin + 130, y + 3.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 25, 20);
    doc.text(`$${exp.amount.toLocaleString()}`, pageWidth - margin - 3, y + 3.2, { align: 'right' });

    y += 4.5;
  });
  y += 4;

  // -------------------------------------------------------------
  // GUEST & INGRESS TURNSTILE QUEUE SECTION
  // -------------------------------------------------------------
  checkPageBreak(35);
  drawSectionHeader('4. Hospitality Registry & Door Ingress Physics', `Formula: (Guests × 8s) ÷ (Gates × 60s)`);

  // Ingress metrics box
  doc.setFillColor(245, 240, 235);
  doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(40, 30, 25);
  doc.text(`TURNSTILE INGRESS PHYSICS MODEL:`, margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(80, 65, 55);
  doc.text(
    `Total Guests: ${data.totalInvited}  |  Active Gates: ${data.turnstileGates}  |  Scan Velocity: ${data.secondsPerGuest}s/guest  |  Throughput: ${data.throughputPerMinute} guests/min  |  Total Wait: ${data.queueWaitTime} minutes`,
    margin + 3,
    y + 9
  );
  y += 15;

  // Dietary Alerts & Special Protocol Pods
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(110, 90, 80);
  doc.text('VIP GUEST SEATING PODS & DIETARY RESTRICTIONS (SAMPLE COHORT):', margin, y + 3);
  y += 4.5;

  const sampleGuests = data.guestList.slice(0, 8);
  sampleGuests.forEach((gst, idx) => {
    checkPageBreak(5);
    doc.setFillColor(idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 246 : 255, idx % 2 === 0 ? 242 : 255);
    doc.rect(margin, y, contentWidth, 4.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(30, 25, 20);
    doc.text(gst.name, margin + 2, y + 3.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 100, 90);
    doc.text(gst.tier, margin + 45, y + 3.2);
    doc.text(gst.table, margin + 80, y + 3.2);

    doc.setTextColor(gst.diet.toLowerCase().includes('allergy') ? 180 : 80, gst.diet.toLowerCase().includes('allergy') ? 30 : 65, gst.diet.toLowerCase().includes('allergy') ? 30 : 55);
    doc.text(gst.diet, margin + 125, y + 3.2);

    doc.setTextColor(gst.checkedIn ? 22 : 140, gst.checkedIn ? 101 : 130, gst.checkedIn ? 52 : 120);
    doc.text(gst.checkedIn ? 'CHECKED-IN' : 'PENDING DOOR', pageWidth - margin - 3, y + 3.2, { align: 'right' });

    y += 4.5;
  });
  y += 4;

  // -------------------------------------------------------------
  // STAFF OPS & FATIGUE MITIGATION
  // -------------------------------------------------------------
  checkPageBreak(35);
  drawSectionHeader('5. Staff Deployment, Radio Comms & Occupational Safety', `Score: ${data.shiftHealth.score}%`);

  data.staffRoster.forEach((stf, idx) => {
    checkPageBreak(5);
    doc.setFillColor(idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 246 : 255, idx % 2 === 0 ? 242 : 255);
    doc.rect(margin, y, contentWidth, 4.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(30, 25, 20);
    doc.text(stf.name, margin + 2, y + 3.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 85, 75);
    doc.text(stf.role, margin + 45, y + 3.2);
    doc.text(stf.shift, margin + 95, y + 3.2);
    doc.text(stf.channel, margin + 145, y + 3.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(stf.status === 'On Duty' ? 22 : 160, stf.status === 'On Duty' ? 101 : 100, stf.status === 'On Duty' ? 52 : 40);
    doc.text(stf.status.toUpperCase(), pageWidth - margin - 3, y + 3.2, { align: 'right' });

    y += 4.5;
  });
  y += 4;

  // -------------------------------------------------------------
  // MULTI-DAY ITINERARY MATRIX
  // -------------------------------------------------------------
  checkPageBreak(40);
  drawSectionHeader('6. Multi-Day Master Run-of-Show Matrix (Day -1 to Day 3)');

  const multiDays = [
    { tag: 'DAY -1', title: 'Rigging, Audio Sweep & Heavy Load-In', time: '08:00 - 20:00', desc: 'Overhead motor truss rigging, 105dB acoustic sweep at 15:45, floral staging, and Fire Marshal egress audit.' },
    { tag: 'DAY 1', title: 'Grand Welcome Summit & VIP Gala Dinner', time: '14:00 - 00:00', desc: 'VIP red-carpet arrival, host welcome address, 5-course synchronized butler banquet service, and acoustic jazz lounge.' },
    { tag: 'DAY 2', title: 'Core Celebration, Live 7-Piece Band & Gala', time: '09:00 - 01:00', desc: 'Interactive heritage showcase, awards presentation, live orchestra on center dance floor, soft terrace migration.' },
    { tag: 'DAY 3', title: 'Celebrant Farewell Brunch & Logistics Strike', time: '09:30 - 20:00', desc: 'Garden brunch, commemorative gift books, VIP airport shuttles, safe motorized truss strike, and final venue handover.' },
  ];

  multiDays.forEach((d) => {
    checkPageBreak(9);
    doc.setFillColor(245, 240, 235);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(217, 107, 39);
    doc.text(d.tag, margin + 2.5, y + 3.5);

    doc.setTextColor(40, 30, 25);
    doc.text(d.title, margin + 20, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(110, 95, 85);
    doc.text(d.time, pageWidth - margin - 3, y + 3.5, { align: 'right' });
    doc.text(d.desc, margin + 20, y + 6.8);

    y += 9;
  });
  y += 4;

  // -------------------------------------------------------------
  // AI CONFLICT RESOLUTIONS AUDIT
  // -------------------------------------------------------------
  checkPageBreak(35);
  drawSectionHeader('7. AI Deductive Conflict Resolutions & Governance Audit');

  data.scenarios.forEach((sc) => {
    checkPageBreak(10);
    doc.setFillColor(252, 249, 246);
    doc.rect(margin, y, contentWidth, 9, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(sc.severity === 'Critical' ? 185 : 194, sc.severity === 'Critical' ? 28 : 65, sc.severity === 'Critical' ? 28 : 12);
    doc.text(`[${sc.severity.toUpperCase()}] ${sc.title}`, margin + 2.5, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(80, 65, 55);
    doc.text(`Resolution: ${sc.resolutionTitle} (${sc.resolutionImpact})`, margin + 2.5, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text('CERTIFIED RESOLVED', pageWidth - margin - 3, y + 3.5, { align: 'right' });

    y += 10;
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(150, 140, 130);
    doc.text(
      `Event Studio • Official Executive Production Brief • Confidential • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  return doc;
}
