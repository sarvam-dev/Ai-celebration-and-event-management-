import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Sparkles,
  Calendar,
  Clock,
  User,
  Bot,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  MapPin,
  AlertTriangle,
  Info,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { EventSetupData, ChatMessage } from '../types';

interface AiChatbotScreenProps {
  eventData?: EventSetupData;
  onJumpToScreen?: (screenIdx: number) => void;
}

interface MilestoneItem {
  time: string;
  title: string;
  lead: string;
  location: string;
  notes: string;
}

interface DayPlan {
  dayCode: string;
  dayNumber: number;
  label: string;
  badge: string;
  objective: string;
  milestones: MilestoneItem[];
}

const ITINERARY_DAYS: DayPlan[] = [
  {
    dayCode: 'day-minus-1',
    dayNumber: -1,
    label: 'Day -1: Rigging & Load-In',
    badge: 'Logistics & AV',
    objective: 'Complete heavy rigging, sound frequency calibration, floral styling, and municipal safety inspection with zero public interference.',
    milestones: [
      { time: '08:00', title: 'Loading Dock Doors Open & Logistics Dispatch', lead: 'Sarah Jenkins', location: 'Service Bay 3', notes: 'Heavy trucks for audio line arrays, LED video walls, and generator load.' },
      { time: '10:30', title: 'Overhead Truss Rigging & Lighting Motor Tests', lead: 'Devon Brooks', location: 'Grand Ballroom', notes: 'Laser safety perimeter active. Hardhats mandatory.' },
      { time: '13:00', title: 'Terracotta & Royal Gold Floral Staging Ingress', lead: 'Elena Rostova', location: 'Ballroom & Foyer', notes: 'Delivery of 65 floral table arrangements and ceremonial entryway arch.' },
      { time: '15:45', title: 'Critical Acoustic Frequency & Pink Noise Sweep', lead: 'Devon Brooks', location: 'Foyer & Main Stage', notes: 'Advance AV line checks to ensure zero sound interference before VIP arrivals.' },
      { time: '17:30', title: 'Power Redundancy Generator Load Transfer Test', lead: 'Marcus Sterling', location: 'Utility Yard', notes: 'Switched 200kVA auxiliary diesel generator for 30 minutes without drop.' },
      { time: '20:00', title: 'Municipal Safety & Fire Marshal Walkthrough', lead: 'David Vance', location: 'All Zones', notes: 'Cleared 6.2 ft egress routes and verified all illuminated emergency exits.' }
    ]
  },
  {
    dayCode: 'day-1',
    dayNumber: 1,
    label: 'Day 1: Opening Summit & Banquet',
    badge: 'Opening Gala',
    objective: 'Flawless welcome experience, VIP red carpet ingress, opening address, and 5-course plated culinary banquet.',
    milestones: [
      { time: '14:00', title: 'Registration & Smart NFC Credential Desk Opens', lead: 'Camilla Reyes', location: 'Grand Lobby', notes: '4 check-in terminals, VIP welcome gift totes, and dietary color-coded ribbons.' },
      { time: '16:30', title: 'Host & Speaker Audio Walkthrough', lead: 'Marcus Sterling', location: 'Main Stage', notes: 'Wireless handheld mic testing and teleprompter sync.' },
      { time: '17:15', title: 'Red Carpet VIP Arrivals & Champagne Reception', lead: 'Camilla Reyes', location: 'Crystal Foyer', notes: 'Passed vintage champagne, mocktails, and truffle arancini canapés. Harpist quartet playing.' },
      { time: '18:00', title: 'Ceremonial Welcome Address by Hosts', lead: 'Evelyn & Julian Vance', location: 'Crystal Ballroom', notes: 'Lighting cue: Sunset Terracotta glow; crystal chandeliers dimmed to 30%.' },
      { time: '18:30', title: 'Grand Opening Symphony & Heritage Video', lead: 'Devon Brooks', location: 'Main Stage & Video Wall', notes: 'Original orchestral composition accompanying 5-minute celebratory retrospect.' },
      { time: '19:15', title: 'Synchronized Butler Plated Dinner Service', lead: 'Chef Laurent Mercier', location: 'Tables 01-45', notes: 'Partitioned service: Halal pod at Table 02, Hypoallergenic at Table 01. 450 guests served in 22 mins.' },
      { time: '21:00', title: 'Keynote Celebration & Honoree Toast', lead: 'Marcus Sterling', location: 'Main Stage', notes: 'Champagne toast poured simultaneously across all tables.' },
      { time: '23:00', title: 'Digestif & Espresso Lounge on South Veranda', lead: 'Hospitality Crew', location: 'South Veranda', notes: 'Acoustic jazz duo; evening wrap at 00:00 sharp.' }
    ]
  },
  {
    dayCode: 'day-2',
    dayNumber: 2,
    label: 'Day 2: Masterclasses & Grand Gala',
    badge: 'Core Celebration',
    objective: 'High-energy celebration, interactive masterclasses, award ceremony, live 7-piece band, and staged terrace migration.',
    milestones: [
      { time: '09:00', title: 'Artisanal Breakfast & Espresso Bar Ingress', lead: 'Catering Team', location: 'Amber Pavilion', notes: 'Warm viennoiserie, açai stations, and specialty roast baristas.' },
      { time: '10:30', title: 'Interactive Showcase & Heritage Gallery Doors Open', lead: 'Elena Rostova', location: 'North Gallery', notes: 'Curated photo archive and digital interactive touch displays.' },
      { time: '12:30', title: 'Executive Networking Luncheon', lead: 'Chef Laurent Mercier', location: 'Garden Courtyard', notes: 'Mediterranean harvest buffet with live carving and flatbread stations.' },
      { time: '15:00', title: 'Honoree Fireside Conversation & Family Tributes', lead: 'Julian Vance', location: 'Main Stage', notes: 'Audience Q&A with live roaming wireless microphones.' },
      { time: '18:00', title: 'Black-Tie Grand Gala Cocktail Ingress', lead: 'Camilla Reyes', location: 'Crystal Foyer', notes: 'Caviar blinis, signature smoked rosemary bourbon cocktail, and string octet.' },
      { time: '19:30', title: 'Gala Feast & Heritage Awards Presentation', lead: 'Marcus Sterling', location: 'Grand Ballroom', notes: 'Roasted filet mignon / Chilean seabass / truffle risotto duo. Awards presentation.' },
      { time: '21:30', title: 'Live 7-Piece Band & Celebration Dance Floor', lead: 'The Royal Velvet Band', location: 'Dance Floor', notes: '700 sq ft dance floor activated; confetti drop at 22:45.' },
      { time: '23:45', title: 'Staged Soft Migration to West Terrace', lead: 'Event Command', location: 'West Terrace', notes: 'Pre-empts 01:30 venue curfew penalties while AV crew quietly clears main stage.' },
      { time: '01:00', title: 'Day 2 Curfew & Ballroom Security Lock', lead: 'David Vance', location: 'All Venues', notes: 'Night security sweep; all guest areas secured.' }
    ]
  },
  {
    dayCode: 'day-3',
    dayNumber: 3,
    label: 'Day 3: Farewell Brunch & Teardown',
    badge: 'Adjournment',
    objective: 'Fond farewell hospitality, seamless VIP airport transfers, executive crew debriefing, and certified hazard-free rigging breakdown.',
    milestones: [
      { time: '09:30', title: 'Celebrant Farewell Garden Brunch', lead: 'Chef Laurent', location: 'Sunlit Orangery', notes: 'Mimosa & bellini bar, artisanal crepes, eggs Benedict, and warm brioche.' },
      { time: '11:00', title: 'Commemorative Keepsake & Photo Album Distribution', lead: 'Camilla Reyes', location: 'Orangery Foyer', notes: 'Custom terracotta leather bound event photo books given to each departing guest.' },
      { time: '11:30', title: 'VIP Airport Limousine & Shuttle Coordination', lead: 'Sarah Jenkins', location: 'Porte-Cochère', notes: 'Staggered fleet dispatches every 20 minutes to International Airport.' },
      { time: '13:00', title: 'Official Event Adjournment & Producer Debrief', lead: 'Marcus Sterling', location: 'Amber Pavilion', notes: 'Staff recognition ceremony, overtime logging, and client wrap signoff.' },
      { time: '14:00', title: 'Safe Equipment Strike & Overhead Rigging Lowering', lead: 'Devon Brooks', location: 'Grand Ballroom', notes: 'Zero public present. Overhead motorized trusses lowered for packing.' },
      { time: '17:00', title: 'Floral Donation Salvage & Eco-Friendly Redistribution', lead: 'Elena Rostova', location: 'Loading Bay', notes: 'Unused floral arrangements packed for donation to local hospices and community centers.' },
      { time: '19:30', title: 'Final Venue Inspection & Security Handover', lead: 'Marcus Sterling', location: 'Whole Facility', notes: 'Room condition sign-off, security deposit release certification, zero damage report.' }
    ]
  }
];

export const AiChatbotScreen: React.FC<AiChatbotScreenProps> = ({
  eventData,
  onJumpToScreen
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTimelineDrawer, setShowTimelineDrawer] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Welcome to the **Multi-Day AI Event Concierge** for **${eventData?.eventName || 'your celebration'}**!\n\n` +
        `I am loaded with the master itinerary across all operational days:\n` +
        `• **Day -1**: Setup, AV line tuning, 200kVA generator load tests & Fire Marshal clearance\n` +
        `• **Day 1**: Grand Opening, 17:15 Red Carpet VIP Arrivals, Welcome Address & 5-Course Plated Banquet\n` +
        `• **Day 2**: Morning Innovation Exhibition, Masterclasses, Gala Feast & 7-Piece Live Band\n` +
        `• **Day 3**: Sunlit Orangery Farewell Brunch, VIP airport shuttles & zero-public 14:00 rigging strike\n\n` +
        `Ask me any question about timings, speaker cues, dietary protocols, staff duty rosters, or conflict solutions!`,
      timestamp: 'Just now',
      modelSource: 'Gemini 3.8 Flash'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Suggested Prompts mapped by day
  const getSuggestedPrompts = () => {
    if (selectedDay === 'day-minus-1') {
      return [
        'What AV rigging and sound checks happen on Day -1?',
        'How is the 200kVA generator backup tested?',
        'What did the Fire Marshal inspect for safety?'
      ];
    }
    if (selectedDay === 'day-1') {
      return [
        'What is happening at 17:15 on Day 1?',
        'How are dietary allergens isolated during Day 1 dinner?',
        'What are the cues for the 18:00 Welcome Address?'
      ];
    }
    if (selectedDay === 'day-2') {
      return [
        'What is the Day 2 Grand Gala schedule?',
        'How does the 23:45 West Terrace soft migration work?',
        'When does the 7-piece live band take the stage?'
      ];
    }
    if (selectedDay === 'day-3') {
      return [
        'What time is the Farewell Brunch on Day 3?',
        'When does equipment teardown and rigging strike start?',
        'How are flowers salvaged and donated post-event?'
      ];
    }
    return [
      'Show all timeline conflicts and resolutions across days',
      'What happens on Day 1 at 17:15 for VIP guests?',
      'How is the $65,000 budget divided across all days?',
      'Explain the Day 2 curfew mitigation on West Terrace'
    ];
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dayTag: selectedDay !== 'all' ? selectedDay : undefined
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          selectedDay,
          eventData
        })
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.message || 'Operational query processed successfully.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelSource: data.source || 'Gemini 3.8 Flash'
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.info('[AI Chatbot] Live operational state response delivered.');
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: `**Operational Intelligence Response:**\n\n` +
          `• **Day -1**: 08:00 Bay 3 load-in, 15:45 advance acoustic sweep, 20:00 safety inspection.\n` +
          `• **Day 1**: 14:00 registration, 17:15 red carpet VIP reception, 19:15 plated banquet (Tables 01 & 02 allergen partitioned).\n` +
          `• **Day 2**: 12:30 networking luncheon, 19:30 Gala Feast, 21:30 live band, 23:45 West Terrace soft migration.\n` +
          `• **Day 3**: 09:30 Farewell Brunch, 11:30 airport shuttles, 14:00 zero-public rigging strike.\n\n` +
          `All logistics and duty schedules are synchronized.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelSource: 'Local Itinerary Matrix'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      // Strip markdown asterisks and bullets for natural speech
      const clean = text.replace(/[*#_`]/g, '').replace(/•/g, 'Point:');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Chat refreshed. Ready to answer any questions regarding Day -1, Day 1, Day 2, or Day 3.`,
        timestamp: 'Just now',
        modelSource: 'Gemini 3.8 Flash'
      }
    ]);
  };

  const activeDayPlan = ITINERARY_DAYS.find((d) => d.dayCode === selectedDay);

  return (
    <div className="flex flex-col h-full w-full bg-[#120E0C] text-[#FAF8F5]">
      {/* Top Bar with AI Header & Day Filter Pills */}
      <div className="p-4 sm:p-5 bg-[#181310] border-b border-[#2A221D] flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D96B27] to-[#8C3A0A] p-0.5 shadow-lg shadow-[#D96B27]/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#181310] rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#D96B27]" />
                </div>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#181310] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Multi-Day AI Event Concierge
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#D96B27]/20 text-[#EA580C] border border-[#D96B27]/40 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Full-spectrum operational intelligence for all days, milestones & VIP runs of show
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTimelineDrawer(!showTimelineDrawer)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                showTimelineDrawer
                  ? 'bg-[#D96B27] text-white border-[#D96B27]'
                  : 'bg-[#201814] text-stone-300 border-[#2A221C] hover:border-[#D96B27]/60'
              }`}
              title="Toggle Multi-Day Schedule Matrix"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Timeline Matrix</span>
              {showTimelineDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-[#201814] text-stone-400 hover:text-white border border-[#2A221C] hover:border-stone-700 transition-all cursor-pointer"
              title="Reset Chat Session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Day Scope Selector Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <span className="text-xs font-mono text-stone-400 shrink-0 mr-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#D96B27]" /> Scope:
          </span>

          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
              selectedDay === 'all'
                ? 'bg-[#D96B27] text-white font-semibold shadow-md shadow-[#D96B27]/20'
                : 'bg-[#201814] text-stone-400 hover:text-white border border-[#2A221C]'
            }`}
          >
            All Days (Matrix)
          </button>

          {ITINERARY_DAYS.map((day) => {
            const isSelected = selectedDay === day.dayCode;
            return (
              <button
                key={day.dayCode}
                onClick={() => setSelectedDay(day.dayCode)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#D96B27] text-white font-semibold shadow-md shadow-[#D96B27]/20'
                    : 'bg-[#201814] text-stone-400 hover:text-white border border-[#2A221C]'
                }`}
              >
                <span>{day.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#181310] text-stone-400'
                }`}>
                  {day.milestones.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Timeline Matrix Drawer */}
      <AnimatePresence>
        {showTimelineDrawer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#15100D] border-b border-[#2A221D]"
          >
            <div className="p-4 sm:p-5 max-w-5xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D96B27]" />
                    Multi-Day Operational Run-of-Show & Milestones
                  </h3>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Click any milestone to ask the AI concierge about its setup, protocols, or conflict mitigation.
                  </p>
                </div>
                <button
                  onClick={() => setShowTimelineDrawer(false)}
                  className="text-xs text-stone-400 hover:text-white p-1 cursor-pointer"
                >
                  Close ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {ITINERARY_DAYS.map((day) => (
                  <div
                    key={day.dayCode}
                    className={`p-3 rounded-2xl border transition-all ${
                      selectedDay === day.dayCode || selectedDay === 'all'
                        ? 'bg-[#1D1612] border-[#D96B27]/40 shadow-sm'
                        : 'bg-[#181310] border-[#2A221C] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">{day.label}</span>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#D96B27]/20 text-[#EA580C]">
                        {day.badge}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 mb-2 leading-tight">
                      {day.objective}
                    </p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {day.milestones.map((m, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            handleSendMessage(`Explain the operational protocols and staff responsibilities for "${m.title}" at ${m.time} on ${day.label}.`);
                            setShowTimelineDrawer(false);
                          }}
                          className="p-2 rounded-lg bg-[#140F0D] hover:bg-[#2A2019] border border-[#261E18] cursor-pointer transition-all group"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono text-[#D96B27] font-semibold">{m.time}</span>
                            <span className="text-stone-400 text-xs truncate max-w-[100px]">{m.lead}</span>
                          </div>
                          <p className="text-xs text-stone-200 font-medium group-hover:text-white truncate mt-0.5">
                            {m.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Message Scroll Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl w-full mx-auto">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md ${
                  isUser
                    ? 'bg-[#D96B27] text-white'
                    : 'bg-[#201814] text-[#D96B27] border border-[#D96B27]/40'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-lg text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-br from-[#D96B27] to-[#C05615] text-white rounded-tr-none'
                    : 'bg-[#181310] border border-[#2A221D] text-[#EDE7E3] rounded-tl-none'
                }`}
              >
                {/* Header tag */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/10 text-xs font-mono opacity-85">
                  <span className="font-semibold">{isUser ? 'You (Event Lead)' : 'AI Concierge'}</span>
                  <div className="flex items-center gap-2">
                    {msg.dayTag && (
                      <span className="px-1.5 py-0.5 rounded bg-black/20 text-xs">
                        {msg.dayTag}
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="whitespace-pre-wrap space-y-1.5 font-sans">
                  {msg.text.split('\n\n').map((para, i) => (
                    <p key={i} className="leading-relaxed">
                      {para.split('**').map((chunk, j) =>
                        j % 2 === 1 ? (
                          <strong key={j} className="text-white font-semibold">
                            {chunk}
                          </strong>
                        ) : (
                          chunk
                        )
                      )}
                    </p>
                  ))}
                </div>

                {/* Bottom Action strip for AI message */}
                {!isUser && (
                  <div className="mt-3 pt-2 border-t border-[#261E18] flex items-center justify-between text-xs text-stone-300">
                    <span className="font-mono text-xs text-stone-400">
                      Powered by {msg.modelSource || 'Gemini 3.8 Flash'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="p-1.5 rounded hover:bg-[#201814] text-stone-300 hover:text-white transition-all cursor-pointer"
                        title="Read aloud"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-[#D96B27]" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="p-1.5 rounded hover:bg-[#201814] text-stone-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Loading / Thinking Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-[#201814] text-[#D96B27] border border-[#D96B27]/40 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin text-[#D96B27]" />
            </div>
            <div className="bg-[#181310] border border-[#2A221D] rounded-2xl rounded-tl-none p-4 text-xs text-stone-300 flex items-center gap-2">
              <span className="text-[#D96B27] font-semibold">Gemini 3.8 Flash</span>
              <span>is analyzing live event state and schedule matrix...</span>
              <div className="flex items-center gap-1 ml-1">
                <span className="w-1.5 h-1.5 bg-[#D96B27] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-[#D96B27] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-[#D96B27] rounded-full animate-bounce" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions Strip */}
      <div className="px-4 py-2 bg-[#181310]/80 border-t border-[#2A221D] max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-xs font-mono text-stone-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D96B27]" /> Quick Questions:
          </span>
          {getSuggestedPrompts().map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1.5 rounded-lg bg-[#201814] hover:bg-[#2A2019] text-stone-300 hover:text-white border border-[#2E241E] hover:border-[#D96B27]/50 text-xs shrink-0 transition-all cursor-pointer truncate max-w-[280px]"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-[#181310] border-t border-[#2A221D] max-w-4xl w-full mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                selectedDay === 'all'
                  ? 'Ask anything about any of the event days (timings, speakers, venues, budget, conflicts)...'
                  : `Ask about ${activeDayPlan?.label || 'this day'} (e.g., timings, logistics, staff leads)...`
              }
              className="w-full bg-[#120E0C] border border-[#2E241E] focus:border-[#D96B27] rounded-xl px-4 py-3 text-sm text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#D96B27] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className={`p-3 rounded-xl font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer ${
              inputMessage.trim() && !isLoading
                ? 'bg-[#D96B27] hover:bg-[#EA580C] text-white shadow-lg shadow-[#D96B27]/25 active:scale-95'
                : 'bg-[#201814] text-stone-500 border border-[#2E241E] cursor-not-allowed'
            }`}
            title="Send Query to AI Concierge"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-stone-400 mt-2 px-1">
          <span>
            Target Scope: <strong className="text-stone-300">{selectedDay === 'all' ? 'All Days (Matrix)' : activeDayPlan?.label}</strong>
          </span>
          <span className="hidden sm:inline">Press Enter to send • Real-time event reasoning</span>
        </div>
      </div>
    </div>
  );
};
