import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Expense, CreateExpenseDto, CATEGORIES, Budget } from "../types";
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassSelect,
} from "../components/GlassUI";
import {
  Plus,
  Trash2,
  X,
  Filter,
  Calendar as CalendarIcon,
  Edit2,
} from "lucide-react";
import { format, getMonth, getYear } from "date-fns";

export const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState("");

  // Filter states
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(getMonth(currentDate) + 1);
  const [selectedYear, setSelectedYear] = useState(getYear(currentDate));

  // Form State
  const [formData, setFormData] = useState<CreateExpenseDto>({
    title: "",
    amount: 0,
    category: "",
    date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await api.expense.getByMonth(selectedMonth, selectedYear);
      setExpenses(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedMonth, selectedYear]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.expense.create(formData);
      setIsModalOpen(false);
      setFormData({
        title: "",
        amount: 0,
        category: "",
        date: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      });
      fetchExpenses();
    } catch (error) {
      alert("Failed to create expense");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.expense.delete(id);
        setExpenses(expenses.filter((e) => e.id !== id));
      } catch (error) {
        console.error("Delete failed");
      }
    }
  };

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.budget.set({
        month: selectedMonth,
        year: selectedYear,
        limit: parseFloat(budgetLimit),
      });
      setIsBudgetModalOpen(false);
      alert("Budget updated successfully");
    } catch (error) {
      alert("Failed to set budget");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Transactions</h1>

        <div className="flex gap-3">
          <GlassButton
            variant="secondary"
            onClick={() => setIsBudgetModalOpen(true)}
          >
            Set Budget
          </GlassButton>
          <GlassButton
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} /> New Expense
          </GlassButton>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="flex flex-wrap items-center gap-4 py-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Filter size={18} />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-blue"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1} className="bg-slate-900">
              {format(new Date(2024, i, 1), "MMMM")}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-blue"
        >
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y} className="bg-slate-900">
              {y}
            </option>
          ))}
        </select>
      </GlassCard>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400 animate-pulse">
            Loading transactions...
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No transactions found for this period.
          </div>
        ) : (
          expenses.map((expense) => (
            <GlassCard
              key={expense.id}
              className="py-4 px-6 hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-xl shadow-inner">
                  {expense.category.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">
                    {expense.title}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <CalendarIcon size={12} />{" "}
                      {format(new Date(expense.date), "dd MMM yyyy")}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-neon-blue">
                      {expense.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    -${expense.amount.toFixed(2)}
                  </div>
                  {expense.notes && (
                    <div className="text-xs text-gray-500 max-w-[150px] truncate">
                      {expense.notes}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          />
          <GlassCard className="w-full max-w-lg relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">
              Add New Expense
            </h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <GlassInput
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <GlassInput
                  label="Amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  required
                />
                <GlassInput
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <GlassSelect
                label="Category"
                options={CATEGORIES}
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
              <GlassInput
                label="Notes (Optional)"
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
              <div className="pt-4 flex gap-3">
                <GlassButton
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </GlassButton>
                <GlassButton type="submit" className="flex-1">
                  Save Transaction
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => setIsBudgetModalOpen(false)}
          />
          <GlassCard className="w-full max-w-md relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setIsBudgetModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">
              Set Monthly Budget
            </h2>
            <form onSubmit={handleSetBudget} className="space-y-6">
              <div className="p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-sm text-center">
                Setting budget for{" "}
                <strong>
                  {format(
                    new Date(selectedYear, selectedMonth - 1),
                    "MMMM yyyy"
                  )}
                </strong>
              </div>
              <GlassInput
                label="Budget Limit ($)"
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                required
                placeholder="e.g. 2500"
              />
              <GlassButton type="submit" className="w-full">
                Update Budget
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
