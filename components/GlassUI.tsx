import React from "react";

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className = "" }: GlassCardProps) => (
  <div className={`glass-panel rounded-3xl p-6 ${className}`}>{children}</div>
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export const GlassButton = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: GlassButtonProps) => {
  const baseStyles =
    "px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-[0_0_15px_rgba(123,97,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] border border-white/20",
    secondary:
      "bg-white/10 text-white hover:bg-white/20 border border-white/10",
    danger:
      "bg-red-500/20 text-red-200 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const GlassInput = ({ label, className = "", ...props }: InputProps) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label className="text-sm font-medium text-gray-300 ml-1">{label}</label>
    )}
    <input
      className={`glass-input px-4 py-3 rounded-xl w-full transition-all duration-300 placeholder-gray-500 ${className}`}
      {...props}
    />
  </div>
);

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
}

export const GlassSelect = ({
  label,
  options,
  className = "",
  ...props
}: SelectProps) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label className="text-sm font-medium text-gray-300 ml-1">{label}</label>
    )}
    <div className="relative">
      <select
        className={`glass-input px-4 py-3 rounded-xl w-full appearance-none cursor-pointer transition-all duration-300 ${className}`}
        {...props}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-900 text-white">
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        ▼
      </div>
    </div>
  </div>
);
