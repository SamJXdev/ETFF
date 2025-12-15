import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  LogOut,
  Menu,
  PieChart,
  CalendarSearch,
  LucideMenu,
  Crown,
} from "lucide-react";
import { api } from "../services/api";

const NavItem = ({ to, icon: Icon, label, active, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
      ${
        active
          ? "bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 text-white border-l-4 border-neon-blue shadow-[0_0_20px_rgba(123,97,255,0.2)]"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
  >
    <Icon
      size={20}
      className={`${
        active ? "text-neon-blue" : "group-hover:text-neon-pink"
      } transition-colors`}
    />
    <span className="font-medium">{label}</span>
  </Link>
);

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    api.auth.logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/expenses", icon: Wallet, label: "Transactions" },
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Abstract Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue rounded-full blur-[120px] opacity-20 pointer-events-none" />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 glass-panel border-r border-white/10 z-50 transition-transform duration-300 ease-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center shadow-lg shadow-neon-purple/30">
              <Crown className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Budget<span className="text-neon-blue text-3xl ">OS</span>
            </h1>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.path}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-200 hover:bg-red-500/10 transition-all duration-300 mt-auto group"
          >
            <LogOut size={20} className="group-hover:text-red-400" />
            <span className="font-medium" variant="danger">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 glass-panel border-b border-white/10 flex items-center justify-between px-6 z-30 shrink-0">
          <div className="font-bold text-lg">Expense Tracker</div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 text-white"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};
