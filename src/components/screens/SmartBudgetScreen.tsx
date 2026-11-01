import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  Scale, 
  ArrowRight,
  Layers,
  Coins
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';
import { ScreenHeader } from '../shared/ScreenHeader';
import { ScreenAISolverWidget } from '../ScreenAISolverWidget';
import { ExpenseRecord } from '../../types';
import { validateCategoryAllocation } from '../../utils/calculations';

export const SmartBudgetScreen: React.FC = () => {
  const { 
    eventData, 
    totalBudget, 
    expenses, 
    categoryAllocations, 
    totalSpent, 
    remainingReserve, 
    costPerGuest, 
    addExpense, 
    removeExpense, 
    rebalanceBudget, 
    isRebalanced, 
    scenarios, 
    resolveScenario, 
    setActiveScreenIndex 
  } = useEvent();

  const [newExpName, setNewExpName] = useState('');
  const [newExpCategory, setNewExpCategory] = useState('AV & Production');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpStatus, setNewExpStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const scenario4 = scenarios.find((s) => s.screenTarget === 4);
  const isAllocation100 = validateCategoryAllocation(categoryAllocations);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newExpAmount);

    if (isNaN(amountNum) || amountNum < 0) {
      setErrorNotice('Invalid amount: Negative expenses or non-numeric values are prohibited.');
      return;
    }
    if (!newExpName.trim()) {
      setErrorNotice('Expense name cannot be empty.');
      return;
    }

    setErrorNotice(null);
    addExpense({
      name: newExpName.trim(),
      category: newExpCategory,
      amount: Math.max(0, amountNum),
      status: newExpStatus,
    });

    setNewExpName('');
    setNewExpAmount('');
  };

  return (
    <div className="w-full text-stone-100 pb-20">
      {/* 1. Consistent Sticky Header */}
      <ScreenHeader
        screenNumber={4}
        title="Screen 4: Smart Budget"
        subtitle="Intelligent Budget Allocation & Non-Destructive Rebalancing"
        badge="Financial Ledger"
        accent="orange"
        onQuickJump={setActiveScreenIndex}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* 2. Consistent Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Total Authorized</span>
              <DollarSign className="w-5 h-5 text-[#D96B27]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">
              ${totalBudget.toLocaleString()}
            </div>
            <div className="text-xs text-stone-400 mt-1">Master event ceiling</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Committed Spent</span>
              <TrendingUp className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">
              ${totalSpent.toLocaleString()}
            </div>
            <div className="text-xs text-stone-400 mt-1">Paid + Pending commitments</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Contingency Reserve</span>
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="text-2xl font-bold text-[#10B981]">
              ${remainingReserve.toLocaleString()}
            </div>
            <div className="text-xs text-stone-400 mt-1">Matches AI ledger buffer</div>
          </div>

          <div className="bg-[#181310] border border-[#2E241E] p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-sm font-medium">Per Guest Est.</span>
              <Coins className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="text-2xl font-bold text-stone-100">
              ${costPerGuest}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              Based on {eventData.guestCount || 450} guests
            </div>
          </div>
        </div>

        {/* 3. Consistent AI Conflict Card */}
        {scenario4 && (
          <ScreenAISolverWidget
            scenario={scenario4}
            onResolve={() => resolveScenario(scenario4.id)}
          />
        )}

        {/* 4. Automated Category Allocation (Strictly 100%) */}
        <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-5 sm:p-6 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-[#D96B27]" />
                  <span>Category Subdivision & Capital Elasticity</span>
                </h2>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                  Total = 100%
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Intelligently divides total budget across core operational verticals.
              </p>
            </div>

            <button
              onClick={rebalanceBudget}
              disabled={isRebalanced}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isRebalanced
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 cursor-default'
                  : 'bg-[#D96B27] hover:bg-[#EA580C] text-white cursor-pointer shadow-md shadow-[#D96B27]/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRebalanced ? 'AI Reallocation Active (100%)' : 'Execute Non-Destructive AI Rebalance'}</span>
            </button>
          </div>

          {/* Allocation Bar */}
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-[#140F0D] border border-[#2E241E]">
            {categoryAllocations.map((cat) => (
              <div
                key={cat.id}
                style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                title={`${cat.name}: ${cat.pct}% ($${Math.round((totalBudget * cat.pct) / 100).toLocaleString()})`}
                className="h-full transition-all duration-500 hover:opacity-90 cursor-help"
              />
            ))}
          </div>

          {/* Allocation Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {categoryAllocations.map((cat) => {
              const allocatedDollar = Math.round((totalBudget * cat.pct) / 100);
              return (
                <div
                  key={cat.id}
                  className="p-3 rounded-lg bg-[#140F0D] border border-[#2E241E] flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-xs font-medium text-stone-300 truncate">
                      {cat.name}
                    </span>
                  </div>
                  <div>
                    <div className="text-base font-bold text-stone-100">
                      ${allocatedDollar.toLocaleString()}
                    </div>
                    <div className="text-xs text-stone-400 font-mono">{cat.pct}% of budget</div>
                  </div>
                </div>
              );
            })}
          </div>

          {isRebalanced && (
            <div className="p-3 rounded-lg bg-[#221711] border border-[#D96B27]/40 text-xs text-stone-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D96B27] shrink-0" />
              <span>
                <strong>AI Reallocation Applied:</strong> Reallocated 2% ($1,300) from Decor & Floral into Safety Contingency Buffer. Total capital remains strictly at ${totalBudget.toLocaleString()} (100.0%).
              </span>
            </div>
          )}
        </div>

        {/* 5. Expense Logger & Committed Ledger */}
        <div className="bg-[#181310] border border-[#2E241E] rounded-xl p-5 sm:p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#D96B27]" />
              <span>Active Committed Line Items</span>
            </h2>
            <span className="text-xs text-stone-400">
              Total Committed: <strong className="text-stone-200">${totalSpent.toLocaleString()}</strong>
            </span>
          </div>

          {/* Error Notice */}
          {errorNotice && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/50 text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Add Expense Form (Enforcing min=0) */}
          <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
            <input
              type="text"
              value={newExpName}
              onChange={(e) => setNewExpName(e.target.value)}
              placeholder="Expense description (e.g. Stage Pyro, Lighting)..."
              className="sm:col-span-2 bg-[#140F0D] border border-[#2E241E] rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D96B27]"
            />

            <select
              value={newExpCategory}
              onChange={(e) => setNewExpCategory(e.target.value)}
              className="bg-[#140F0D] border border-[#2E241E] rounded-lg px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-[#D96B27]"
            >
              <option value="Venue">Venue & Facilities</option>
              <option value="Catering & Bar">Catering & Bar</option>
              <option value="AV & Production">AV & Production</option>
              <option value="Decor & Floral">Decor & Floral</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Safety & Buffer">Safety & Buffer</option>
            </select>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs">$</span>
              <input
                type="number"
                min="0"
                step="50"
                value={newExpAmount}
                onChange={(e) => setNewExpAmount(e.target.value)}
                placeholder="Amount (≥ 0)"
                className="w-full bg-[#140F0D] border border-[#2E241E] rounded-lg pl-7 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#D96B27]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#D96B27] hover:bg-[#EA580C] text-white font-semibold text-xs rounded-lg px-4 py-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#D96B27]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Log Expense</span>
            </button>
          </form>

          {/* Expenses Table */}
          <div className="space-y-2 pt-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="p-3 rounded-lg bg-[#140F0D] border border-[#2E241E] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      expense.status === 'Paid' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
                    }`}
                  />
                  <div>
                    <div className="font-semibold text-stone-100">{expense.name}</div>
                    <div className="text-stone-400">{expense.category}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-medium ${
                      expense.status === 'Paid'
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40'
                        : 'bg-amber-950/70 text-amber-300 border border-amber-800/40'
                    }`}
                  >
                    {expense.status}
                  </span>
                  <span className="font-mono font-bold text-sm text-stone-100">
                    ${expense.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="p-1 text-stone-500 hover:text-rose-400 transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
