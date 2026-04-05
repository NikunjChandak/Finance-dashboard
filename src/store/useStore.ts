import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Transaction } from '../types';

const generateMockTransactions = (): Transaction[] => {
  const categories: Record<'income' | 'expense', string[]> = {
    income: ['Salary', 'Freelance', 'Investments'],
    expense: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare'],
  };

  const transactions: Transaction[] = [];
  const now = new Date();
  
  // Generate some realistic-looking data over the past 3 months
  for (let i = 0; i < 40; i++) {
    const isIncome = Math.random() > 0.7; // 30% income
    const type = isIncome ? 'income' : 'expense';
    const categoryList = categories[type];
    const category = categoryList[Math.floor(Math.random() * categoryList.length)];
    
    // Amount between 10 and 2000
    let amount = Math.floor(Math.random() * 500) + 10;
    if (category === 'Salary') amount = 5000;
    if (category === 'Housing') amount = 1500;
    
    // Mix of older and very recent dates for trend filters
    let date = new Date(now.getTime() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000);
    if (i === 0) date = new Date(now.getTime() - 1000 * 30); // 30 sec ago
    if (i === 1) date = new Date(now.getTime() - 1000 * 60 * 5); // 5 min ago
    if (i === 2) date = new Date(now.getTime() - 1000 * 60 * 30); // 30 min ago
    if (i === 3) date = new Date(now.getTime() - 1000 * 60 * 60 * 2); // 2 hours ago
    if (i === 4) date = new Date(now.getTime() - 1000 * 60 * 60 * 12); // 12 hours ago
    

    transactions.push({
      id: `trx_${Math.random().toString(36).substr(2, 9)}`,
      date: date.toISOString(),
      amount,
      category,
      type,
      description: `${category} transaction`,
    });
  }
  
  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: generateMockTransactions(),
      role: 'Viewer',
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      
      addTransaction: (transactionData) => 
        set((state) => ({
          transactions: [
            { ...transactionData, id: `trx_${Math.random().toString(36).substr(2, 9)}` },
            ...state.transactions,
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        })),
        
      editTransaction: (id, updatedT) =>
        set((state) => ({
          transactions: state.transactions.map((t) => 
            t.id === id ? { ...t, ...updatedT } : t
          ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        })),
        
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id)
        })),
        
      setRole: (role) => set({ role }),
      
      toggleDarkMode: () => set((state) => {
        const newMode = !state.isDarkMode;
        if (newMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return { isDarkMode: newMode };
      }),
    }),
    {
      name: 'finance-dashboard-storage',
      // Ensure dark mode class is applied on rehydration
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  )
);
