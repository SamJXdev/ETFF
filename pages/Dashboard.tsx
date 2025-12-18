import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Expense, Budget } from "../types";
import { GlassCard, GlassButton } from "../components/GlassUI";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
} from "recharts";
import { format, startOfMonth, getMonth, getYear } from "date-fns";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Plus,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentDate = new Date();
  const currentMonth = getMonth(currentDate) + 1; // Backend expects 1-12
  const currentYear = getYear(currentDate);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesData, budgetData] = await Promise.all([
          api.expense.getByMonth(currentMonth, currentYear),
          api.budget.get(currentMonth, currentYear),
        ]);
        setExpenses(expensesData || []);
        setBudget(budgetData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentMonth, currentYear]);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetLimit = budget?.limit || 0;
  const remaining = budgetLimit - totalSpent;
  const progress = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;

  // Chart Data Preparation
  const categoryData = expenses.reduce((acc: any, curr) => {
    const existing = acc.find((x: any) => x.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  // Sort expenses by date for daily activity
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const dailyData = sortedExpenses.reduce((acc: any[], curr) => {
    const dateStr = format(new Date(curr.date), "dd MMM");
    const existing = acc.find((x) => x.date === dateStr);
    if (existing) existing.amount += curr.amount;
    else acc.push({ date: dateStr, amount: curr.amount });
    return acc;
  }, []);

  const COLORS = [
    "#7B61FF",
    "#00E5FF",
    "#FF7BDA",
    "#FFD700",
    "#FF6B6B",
    "#4ECDC4",
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-white/20 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-gray-300 text-sm mb-1">{label}</p>
          <p className="text-white font-bold text-lg">
            ₹{payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading)
    return (
      <div className="flex h-full items-center justify-center text-neon-blue animate-pulse">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Overview</h1>
          <p className="text-gray-400">
            Here's what's happening with your money this month.
          </p>
        </div>
        <GlassButton
          onClick={() => navigate("/expenses")}
          className="flex items-center gap-2"
        >
          <Plus size={18} /> Manage Expenses
        </GlassButton>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={100} />
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-neon-blue/20 text-neon-blue">
              <TrendingDown size={24} />
            </div>
            <span className="text-gray-400 font-medium">Total Spent</span>
          </div>
          <div className="text-4xl font-bold text-white mb-1">
            ₹{totalSpent.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">
            in {format(currentDate, "MMMM yyyy")}
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target size={100} />
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-neon-purple/20 text-neon-purple">
              <Target size={24} />
            </div>
            <span className="text-gray-400 font-medium">Monthly Budget</span>
          </div>
          <div className="text-4xl font-bold text-white mb-1">
            ₹{budgetLimit > 0 ? `${budgetLimit.toFixed(2)}` : "Not Set"}
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                progress > 100
                  ? "bg-red-500"
                  : "bg-gradient-to-r from-neon-purple to-neon-blue"
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={100} />
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-neon-pink/20 text-neon-pink">
              <Wallet size={24} />
            </div>
            <span className="text-gray-400 font-medium">Remaining</span>
          </div>
          <div
            className={`text-4xl font-bold mb-1 ${
              remaining < 0 ? "text-red-400" : "text-white"
            }`}
          >
            ₹{remaining.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">Available to spend</div>
        </GlassCard>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="min-h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">Spending Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(value)
                  }
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#00E5FF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="min-h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">
            Category Breakdown
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="rgba(0,0,0,0)"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500">No expense data yet</div>
            )}
          </div>
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-[-20px]">
            {categoryData.slice(0, 5).map((entry: any, index: number) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent Transactions List Snippet */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          <GlassButton
            variant="secondary"
            onClick={() => navigate("/expenses")}
            className="px-4 py-2 text-sm"
          >
            View All
          </GlassButton>
        </div>
        <div className="space-y-4">
          {sortedExpenses.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No transactions found.
            </p>
          )}
          {sortedExpenses
            .slice(-5)
            .reverse()
            .map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/10">
                    <span className="text-lg">
                      {expense.category === "Food"
                        ? "🍔"
                        : expense.category === "Transport"
                        ? "🚗"
                        : expense.category === "Entertainment"
                        ? "🎬"
                        : "💸"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{expense.title}</p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(expense.date), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">
                    -₹{expense.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-neon-blue">{expense.category}</p>
                </div>
              </div>
            ))}
        </div>
      </GlassCard>
    </div>
  );
};
