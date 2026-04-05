import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { format, parseISO } from 'date-fns';
import { Search, Plus, Filter, Edit2, Trash2 } from 'lucide-react';
import type { Transaction } from '../types';

export const Transactions: React.FC = () => {
  const { transactions, role, addTransaction, deleteTransaction, editTransaction } = useStore();
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    type: 'expense',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      return matchSearch && matchType;
    });
  }, [transactions, searchTerm, filterType]);

  const handleOpenModal = (t?: Transaction) => {
    if (t) {
      setFormData({
        amount: String(t.amount),
        category: t.category,
        type: t.type,
        description: t.description,
        date: t.date.split('T')[0]
      });
      setEditingId(t.id);
    } else {
      setFormData({ amount: '', category: '', type: 'expense', description: '', date: new Date().toISOString().split('T')[0] });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      amount: Number(formData.amount),
      category: formData.category,
      type: formData.type as 'income' | 'expense',
      description: formData.description,
      date: new Date(formData.date).toISOString()
    };
    
    if (editingId) {
      editTransaction(editingId, data);
    } else {
      addTransaction(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Transactions</h1>
        {role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Add Transaction
          </button>
        )}
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text" 
              className="input pl-10" 
              placeholder="Search description or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-secondary" />
            <select 
              className="input w-auto"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                {role === 'Admin' && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr key={t.id}>
                    <td>{format(parseISO(t.date), 'MMM dd, yyyy')}</td>
                    <td className="font-medium">{t.description}</td>
                    <td><span className="text-secondary">{t.category}</span></td>
                    <td>
                      <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                      </span>
                    </td>
                    <td className={`font-semibold ${t.type === 'income' ? 'text-success' : ''}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </td>
                    {role === 'Admin' && (
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button className="btn-icon" onClick={() => handleOpenModal(t)} title="Edit"><Edit2 size={16} /></button>
                          <button className="btn-icon text-danger hover:bg-danger hover:text-white" onClick={() => deleteTransaction(t.id)} title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'Admin' ? 6 : 5} className="text-center py-8 text-secondary">
                    No transactions found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center">
              <h2>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label>Type</label>
                  <select className="input" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label>Date</label>
                  <input type="date" required className="input" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label>Amount</label>
                <input type="number" required min="0" step="0.01" className="input" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1">
                <label>Category</label>
                <input type="text" required className="input" placeholder="e.g., Groceries" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1">
                <label>Description</label>
                <input type="text" required className="input" placeholder="Brief description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
