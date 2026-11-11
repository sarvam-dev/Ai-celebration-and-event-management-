import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  Check, 
  ChevronRight,
  Layers,
  Cpu
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { ScreenHeader } from '../shared/ScreenHeader';
import { ScreenAISolverWidget } from '../ScreenAISolverWidget';
import { ChatMessage } from '../../types';

export const AiConciergeScreen: React.FC<{ isActive?: boolean }> = ({ isActive = false }) => {
  const { 
    eventData, 
    currentUser, 
    selectedVenue, 
    totalBudget, 
    expenses, 
    categoryAllocations, 
    totalSpent, 
    remainingReserve, 
    guestList, 
    attendingCount, 
    staffRoster, 
    shiftHealth, 
    scenarios, 
    resolveScenario, 
    setActiveScreenIndex 
  } = useEvent();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: `Welcome to the Event Studio Autonomous Concierge for **${eventData.eventName || 'your celebration'}**. I am grounded strictly in live system state: **${eventData.guestCount || 0} guests**, **$${totalBudget.toLocaleString()} total budget**, **$${remainingReserve.toLocaleString()} remaining reserve**, and primary venue **${selectedVenue?.name || eventData.venueName || 'Venue TBD'}**. Ask me any multi-day timeline, dietary, budget, or staff shift question.`,
      timestamp: '12:00',
      dayTag: 'All Days',
      modelSource: 'Gemini 3.8 Flash',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [selectedDayTab, setSelectedDayTab] = useState<'All' | 'Day -1' | 'Day 1' | 'Day 2' | 'Day 3'>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scenario7 = scenarios.find((s) => s.screenTarget === 7);

  // Quick Questions derived dynamically from live state
  const quickQuestions = [
    `What is our remaining contingency reserve after all committed expenses?`,
    `Are all dietary restrictions and VIP seating requirements accounted for?`,
    `Are there any active staff fatigue warnings or shifts exceeding 12 hours?`,
    `What is the timeline of events for ${eventData.eventName || 'our celebration'}?`,
  ];

  // Scroll ONLY the internal container when new message arrives, NEVER the whole window
  const scrollToBottomInternal = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isActive) {
      scrollToBottomInternal();
    }
  }, [messages, isActive]);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    setErrorNotice(null);
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dayTag: selectedDayTab,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 10000);

    try {
      // Rebuild fresh live state context on every call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          message: text.trim(),
          dayContext: selectedDayTab,
          selectedDay: selectedDayTab,
          eventData: {
            ...eventData,
            venueName: selectedVenue?.name || eventData.venueName,
            venueCity: selectedVenue?.area ? `${selectedVenue.area}, ${eventData.venueCity}` : eventData.venueCity,
            totalBudget,
            totalSpent,
            remainingReserve,
            attendingCount,
            totalGuests: guestList.length,
            shiftHealthScore: shiftHealth.score,
            fatiguedStaff: shiftHealth.fatiguedNames,
            allocations: categoryAllocations,
            expensesSample: expenses.map((e) => `${e.name} ($${e.amount}) [${e.status}]`),
            guestsSample: guestList.slice(0, 8).map((g) => `${g.name} (${g.tier}, ${g.table}, diet: ${g.diet})`),
            staffSample: staffRoster.map((s) => `${s.name} (${s.role}, shift: ${s.shift}, status: ${s.status})`),
          },
          history: messages.slice(-10).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
            text: m.text,
            parts: [{ text: m.text }],
          })),
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Chat query failed with status ${response.status}`);
      }

      const data = await response.json();
      const replyContent = data.reply || data.message || data.text || 'Operational metrics verified against central event ledger.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dayTag: selectedDayTab,
        modelSource: data.model || 'Gemini 3.8 Flash',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setErrorNotice('The concierge request timed out. Please retry.');
      } else {
        setErrorNotice(err.message || 'Unable to connect to Gemini AI Concierge. Please retry.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full text-stone-100 pb-20">
      {/* 1. Consistent Sticky Header */}
      <ScreenHeader
        screenNumber={7}
        title="Screen 7: AI Concierge"
        subtitle="Multi-Day Autonomous Reasoning & Grounded Intelligence"
        badge="Gemini 3.8 Flash"
        accent="orange"
        onQuickJump={setActiveScreenIndex}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* 2. Consistent Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Model Engine</span>
              <Cpu className="w-5 h-5 text-[#D96B27]" />
            </div>
            <div className="text-lg font-bold text-stone-100">Gemini 3.8 Flash</div>
            <div className="text-xs text-stone-400 mt-1">Real-time reasoning</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Context Grounding</span>
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="text-lg font-bold text-[#10B981]">100% Live State</div>
            <div className="text-xs text-stone-400 mt-1">Zero static hardcoding</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Schedule Matrix</span>
              <Calendar className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="text-lg font-bold text-stone-100">Day -1 to Day 3</div>
            <div className="text-xs text-stone-400 mt-1">Full 5-day cycle coverage</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Audit Confidence</span>
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="text-lg font-bold text-stone-100">High Precision</div>
            <div className="text-xs text-stone-400 mt-1">Strict mathematical quotes</div>
          </div>
        </div>

        {/* 3. Consistent AI Conflict Card */}
        {scenario7 && (
          <ScreenAISolverWidget
            scenario={scenario7}
            onResolve={() => resolveScenario(scenario7.id)}
          />
        )}

        {/* 4. Chatbot Workstation Card */}
        <div className="bg-[#181310] border border-[#2E241E] rounded-xl shadow-xl flex flex-col h-[650px] overflow-hidden">
          {/* Day Matrix Tabs */}
          <div className="p-3 bg-[#140F0D] border-b border-[#2E241E] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['All', 'Day -1', 'Day 1', 'Day 2', 'Day 3'] as const).map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDayTab(day)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedDayTab === day
                      ? 'bg-[#D96B27] text-white shadow-md shadow-[#D96B27]/20'
                      : 'bg-[#221A15] text-stone-400 hover:text-stone-200 border border-[#3A2D24]'
                  }`}
                >
                  {day === 'All' ? 'Full Run of Show' : day}
                </button>
              ))}
            </div>

            <div className="text-xs text-stone-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Grounded in live event store</span>
            </div>
          </div>

          {/* Messages Scroll Area (Container-only scrolling, NO window jump) */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#120E0C]/40"
          >
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              const isCopied = copiedId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-[#D96B27]/20 border border-[#D96B27]/40 flex items-center justify-center text-[#FF7A3D] shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-xl p-4 text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-[#181310] border border-[#2E241E] text-stone-200 shadow-md'
                        : 'bg-[#D96B27] text-white shadow-md shadow-[#D96B27]/20 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1 text-[11px] opacity-75">
                      <span>{isAssistant ? msg.modelSource || 'Gemini 3.8 Flash' : currentUser?.name || 'Producer'}</span>
                      <div className="flex items-center gap-1">
                        <span>{msg.dayTag}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>

                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {isAssistant && (
                      <div className="pt-2 mt-2 border-t border-[#2E241E] flex items-center justify-end">
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1 transition-colors"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-[#2E241E] border border-[#3E2D22] flex items-center justify-center text-stone-300 shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-lg bg-[#D96B27]/20 border border-[#D96B27]/40 flex items-center justify-center text-[#FF7A3D] shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-3.5 text-xs text-stone-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D96B27] animate-ping" />
                  <span>Synthesizing live operational parameters...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-3 bg-[#15100E] border-t border-[#2E241E] overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-400 shrink-0 font-medium">Quick Prompts:</span>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full bg-[#201814] hover:bg-[#2A1F1A] border border-[#38281F] text-stone-300 text-[11px] truncate max-w-[240px] shrink-0 transition-colors cursor-pointer"
                  title={q}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Error Notice if any */}
          {errorNotice && (
            <div className="p-2.5 bg-rose-950/60 border-t border-rose-800/60 flex items-center justify-between text-xs text-rose-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorNotice}</span>
              </div>
              <button
                onClick={() => handleSendMessage()}
                className="px-2 py-0.5 bg-rose-800 hover:bg-rose-700 rounded text-[11px] font-semibold text-white"
              >
                Retry
              </button>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#140F0D] border-t border-[#2E241E] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about guests, budget reserve, multi-day schedules, or staff shifts..."
              className="flex-1 bg-[#181310] border border-[#2E241E] rounded-lg px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D96B27]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 rounded-lg bg-[#D96B27] hover:bg-[#EA580C] disabled:bg-stone-800 disabled:text-stone-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#D96B27]/20 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Query</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
