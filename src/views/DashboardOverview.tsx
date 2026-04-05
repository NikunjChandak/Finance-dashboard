import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const DashboardOverview: React.FC = () => {
  const { transactions } = useStore();

  // Calculate summaries
  const { totalIncome, totalExpense } = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === 'income') acc.totalIncome += t.amount;
        else acc.totalExpense += t.amount;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );
  }, [transactions]);

  const balance = totalIncome - totalExpense;

  const [trendPeriod, setTrendPeriod] = useState<'1h' | '1d' | '1w' | 'all'>('all');

  // Transform data for line chart (daily balance trend)
  const lineChartData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let currentBalance = 0;
    const dataMap = new Map<string, number>();

    const now = new Date().getTime();

    sorted.forEach((t) => {
      if (t.type === 'income') currentBalance += t.amount;
      else currentBalance -= t.amount;

      const tTime = new Date(t.date).getTime();
      let include = true;
      if (trendPeriod === '1h' && now - tTime > 60 * 60 * 1000) include = false;
      if (trendPeriod === '1d' && now - tTime > 24 * 60 * 60 * 1000) include = false;
      if (trendPeriod === '1w' && now - tTime > 7 * 24 * 60 * 60 * 1000) include = false;
      
      if (include) {
        let label = format(tTime, 'MMM dd');
        if (trendPeriod === '1h') label = format(tTime, 'HH:mm');
        dataMap.set(label, currentBalance);
      }
    });

    return Array.from(dataMap.entries()).map(([date, balance]) => ({ date, balance }));
  }, [transactions, trendPeriod]);

  // Transform data for pie chart (expenses by category)
  const pieChartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryMap = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div>
      <h1>Dashboard Overview</h1>
      
      {/* Summary Cards */}
      <div className="grid-cards">
        <div className="card">
          <div className="card-header">
            <h3 className="text-secondary">Total Balance</h3>
            <div className="p-2 bg-primary/10 text-primary rounded-full"><Wallet size={20} /></div>
          </div>
          <div className="text-2xl font-bold">${balance.toLocaleString()}</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-secondary">Total Income</h3>
            <div className="p-2 bg-success-bg text-success rounded-full"><TrendingUp size={20} /></div>
          </div>
          <div className="text-2xl font-bold text-success">+${totalIncome.toLocaleString()}</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-secondary">Total Expenses</h3>
            <div className="p-2 bg-danger-bg text-danger rounded-full"><TrendingDown size={20} /></div>
          </div>
          <div className="text-2xl font-bold text-danger">-${totalExpense.toLocaleString()}</div>
        </div>
      </div>

      {/* Visualizations */}
      <div className="grid-main">
        <div className="card flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg">Balance Trend</h2>
            <div className="segmented-control">
              {(['1h', '1d', '1w', 'all'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setTrendPeriod(p)}
                  className={`segmented-btn ${trendPeriod === p ? 'active' : ''}`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={lineChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: 'var(--text-secondary)'}} />
                <YAxis tick={{fontSize: 12, fill: 'var(--text-secondary)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Line type="monotone" dataKey="balance" stroke="var(--primary-color)" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card flex-col">
          <h2 className="mb-4 text-lg">Spending by Category</h2>
          <div style={{ width: '100%', height: 300 }}>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-primary)'}} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-secondary">
                No expenses recorded.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="card mt-6" style={{ marginTop: '1.5rem' }}>
        <h2 className="mb-4 text-lg border-b border-[color:var(--border-color)] pb-3" style={{ borderBottom: '1px solid var(--border-color)'}}>
          Recent Transactions
        </h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((t) => (
                <tr key={t.id}>
                  <td>{format(parseISO(t.date), 'MMM dd, yyyy')}</td>
                  <td className="font-medium">{t.description}</td>
                  <td><span className="badge" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-secondary)', fontWeight: 500 }}>{t.category}</span></td>
                  <td className={`font-semibold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
