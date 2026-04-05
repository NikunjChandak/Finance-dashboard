export type Role = 'Viewer' | 'Admin';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // ISO string
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export interface AppState {
  transactions: Transaction[];
  role: Role;
  isDarkMode: boolean;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, updatedT: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setRole: (role: Role) => void;
  toggleDarkMode: () => void;
}
