import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { format, subMonths } from 'date-fns';

export const Insights: React.FC = () => {
  const { transactions } = useStore();

  const insights = useMemo(() => {
    // Basic Insight generation
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');

    // 1. Highest Spending Category
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    let maxCategory = { name: 'None', amount: 0 };
    Object.entries(categoryTotals).forEach(([name, amount]) => {
      if (amount > maxCategory.amount) maxCategory = { name, amount };
    });

    // 2. Month over Month (MoM) comparison
    const now = new Date();
    const currentMonthStr = format(now, 'yyyy-MM');
    const lastMonthStr = format(subMonths(now, 1), 'yyyy-MM');

    let currentMonthSpend = 0;
    let lastMonthSpend = 0;

    expenses.forEach(t => {
      const monthStr = t.date.substring(0, 7);
      if (monthStr === currentMonthStr) currentMonthSpend += t.amount;
      if (monthStr === lastMonthStr) lastMonthSpend += t.amount;
    });

    const momDiff = currentMonthSpend - lastMonthSpend;
    const momPercentage = lastMonthSpend > 0 ? (momDiff / lastMonthSpend) * 100 : 0;

    // 3. Savings Rate
    const totalIncome = income.reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return { maxCategory, currentMonthSpend, lastMonthSpend, momDiff, momPercentage, savingsRate };
  }, [transactions]);

  return (
    <div>
      <h1 className="mb-6">Financial Insights</h1>

      <div className="flex flex-col gap-4">
        
        {/* Highest Spend Category */}
        <div className="card flex items-start gap-4">
          <div className="p-3 bg-warning-bg rounded-full text-warning-color">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3>Highest Spending Area</h3>
            <p className="mt-1">
              Your highest spending category overall is <strong className="text-primary">{insights.maxCategory.name}</strong>, 
              amounting to <strong>${insights.maxCategory.amount.toLocaleString()}</strong>.
            </p>
          </div>
        </div>

        {/* Month over Month Spending */}
        <div className="card flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3>Monthly Spending Comparison</h3>
            <p className="mt-1">
              You have spent <strong>${insights.currentMonthSpend.toLocaleString()}</strong> this month, compared to 
              {' '}<strong>${insights.lastMonthSpend.toLocaleString()}</strong> last month.
              {insights.momDiff > 0 ? (
                 <span className="text-danger ml-1">
                   That's an increase of {insights.momPercentage.toFixed(1)}%.
                 </span>
              ) : (
                <span className="text-success ml-1">
                   That's a decrease of {Math.abs(insights.momPercentage).toFixed(1)}%. Great job saving!
                 </span>
              )}
            </p>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="card flex items-start gap-4">
          <div className="p-3 bg-success-bg rounded-full text-success">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3>Savings Rate</h3>
            <p className="mt-1">
              Overall, you are keeping <strong>{insights.savingsRate.toFixed(1)}%</strong> of your income as savings. 
              {insights.savingsRate > 20 ? ' Excellent financial health!' : ' Consider increasing your savings cushion.'}
            </p>
          </div>
        </div>

        {/* General Suggestion */}
        <div className="card flex items-start gap-4" style={{ backgroundColor: 'var(--bg-sidebar)', color: 'white', borderColor: 'transparent' }}>
          <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Lightbulb size={24} />
          </div>
          <div>
            <h3 style={{ color: 'white' }}>Observation</h3>
            <p className="mt-1" style={{ color: '#cbd5e1' }}>
              Your transactions are currently simulated on the frontend and persisted via localStorage. Changing filtering rules or switching between Admin and Viewer modes showcases robust state management using Zustand!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
