export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  token: string;
}

export interface Expense {
  id: number;
  userId: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export interface Budget {
  id: number;
  userId: number;
  month: number;
  year: number;
  limit: number;
}

export interface CreateExpenseDto {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export interface SetBudgetDto {
  month: number;
  year: number;
  limit: number;
}

export const CATEGORIES = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Health',
  'Others'
];
