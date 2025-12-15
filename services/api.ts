import { LoginResponse, User, Expense, Budget, CreateExpenseDto, SetBudgetDto } from '../types';

// NOTE: Update this URL to match your running .NET backend URL
const API_BASE_URL = 'https://etb-orau.onrender.com/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  try {
    return await response.json();
  } catch {
    return null; // Handle void responses
  }
};

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<LoginResponse> => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },
    register: async (name: string, email: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      return handleResponse(res);
    },
    logout: () => {
      localStorage.removeItem('token');
    }
  },
  expense: {
    getAll: async (): Promise<Expense[]> => {
      const res = await fetch(`${API_BASE_URL}/expense`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getByMonth: async (month: number, year: number): Promise<Expense[]> => {
      const res = await fetch(`${API_BASE_URL}/expense/Month/${month}/${year}`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (expense: CreateExpenseDto): Promise<Expense> => {
      const res = await fetch(`${API_BASE_URL}/expense`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(expense),
      });
      return handleResponse(res);
    },
    delete: async (id: number) => {
      const res = await fetch(`${API_BASE_URL}/expense/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getCategoryTotals: async (category: string) => {
       const res = await fetch(`${API_BASE_URL}/expense/category/${category}/total`, {
        headers: getHeaders(),
      });
      return handleResponse(res);
    }
  },
  budget: {
    get: async (month: number, year: number): Promise<Budget | null> => {
      const res = await fetch(`${API_BASE_URL}/budget/Month/${month}/${year}`, {
        headers: getHeaders(),
      });
      if (!res.ok) return null;
      try {
        const data = await res.json();
        if (data && typeof data.id === 'number') return data;
        return null;
      } catch {
        return null;
      }
    },
    set: async (budget: SetBudgetDto): Promise<Budget> => {
      const res = await fetch(`${API_BASE_URL}/budget`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(budget),
      });
      return handleResponse(res);
    }
  }
};