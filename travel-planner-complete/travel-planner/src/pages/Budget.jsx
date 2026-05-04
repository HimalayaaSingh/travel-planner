import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTravel } from '../context/TravelContext';

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];
const EXPENSE_CATEGORIES = ['Transport', 'Accommodation', 'Food', 'Activities', 'Shopping', 'Other'];

export default function Budget() {
  const { budgetLimit, setBudgetLimit, expenses, totalSpent, remaining, progressPercent, expenseByCategory, addExpense, removeExpense } = useTravel();

  const [item, setItem] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('Transport');

  const isOver = totalSpent > budgetLimit;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!item.trim() || !cost) return;
    addExpense(item, cost, category);
    setItem('');
    setCost('');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Budget Tracker</h1>
        <p className="text-stone-400 mt-1">Track and visualize your travel expenses</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <p className="text-sm text-stone-400 mb-1">Total Budget</p>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-bold">$</span>
            <input
              type="number"
              value={budgetLimit}
              onChange={e => setBudgetLimit(parseFloat(e.target.value) || 0)}
              className="text-2xl font-bold text-stone-800 w-full focus:outline-none border-b-2 border-transparent focus:border-amber-400"
            />
          </div>
          <p className="text-xs text-stone-300 mt-1">Click to edit</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <p className="text-sm text-stone-400 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-stone-800">${totalSpent.toFixed(2)}</p>
          <p className="text-xs text-stone-400 mt-1">{expenses.length} expenses</p>
        </div>
        <div className={`rounded-2xl p-6 shadow-sm border ${isOver ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <p className={`text-sm mb-1 ${isOver ? 'text-red-400' : 'text-emerald-500'}`}>Remaining</p>
          <p className={`text-2xl font-bold ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
            {isOver ? '-' : ''}${Math.abs(remaining).toFixed(2)}
          </p>
          <p className={`text-xs mt-1 ${isOver ? 'text-red-400' : 'text-emerald-400'}`}>
            {isOver ? '⚠️ Over budget!' : '✅ On track'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-8">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-stone-600">Budget used</span>
          <span className={isOver ? 'text-red-500' : 'text-stone-600'}>{progressPercent.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-400' : progressPercent > 75 ? 'bg-amber-400' : 'bg-emerald-400'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-stone-400 mt-1">
          <span>$0</span>
          <span>${budgetLimit}</span>
        </div>
      </div>

      {/* Charts + Add Expense */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <h2 className="font-bold text-stone-800 mb-4">Spending by Category</h2>
          {expenseByCategory.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-stone-300">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {expenseByCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`$${v}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {expenseByCategory.map((item, i) => (
              <span key={item.name} className="flex items-center gap-1 text-xs text-stone-500">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: COLORS[i % COLORS.length] }} />
                {item.name}
              </span>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <h2 className="font-bold text-stone-800 mb-4">Expense Breakdown</h2>
          {expenseByCategory.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-stone-300">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={expenseByCategory} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`$${v}`, 'Amount']} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {expenseByCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Add Expense + List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Expense Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <h2 className="font-bold text-stone-800 mb-4">Add Expense</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              type="text"
              placeholder="Expense name..."
              value={item}
              onChange={e => setItem(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Amount ($)"
                value={cost}
                onChange={e => setCost(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="px-3 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none"
              >
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-stone-800 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-700 transition-colors"
            >
              + Add Expense
            </button>
          </form>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <h2 className="font-bold text-stone-800 mb-4">All Expenses</h2>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {expenses.length === 0 && (
              <p className="text-stone-300 text-sm text-center py-8">No expenses yet</p>
            )}
            {expenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between px-4 py-3 bg-stone-50 rounded-xl border border-stone-100 text-sm">
                <div>
                  <p className="font-medium text-stone-700">{exp.item}</p>
                  <p className="text-xs text-stone-400">{exp.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-stone-800">${exp.cost}</span>
                  <button onClick={() => removeExpense(exp.id)} className="text-stone-300 hover:text-red-400 font-bold text-lg leading-none">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
