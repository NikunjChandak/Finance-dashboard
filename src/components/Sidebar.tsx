import React from 'react';
import { LayoutDashboard, ArrowLeftRight, PieChart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Transactions', icon: <ArrowLeftRight size={20} />, path: '/transactions' },
    { name: 'Insights', icon: <PieChart size={20} />, path: '/insights' },
  ];

  return (
    <aside className="sidebar">
      <div className="flex items-center gap-2" style={{ marginBottom: '2rem', padding: '0 1rem' }}>
        <div className="flex items-center justify-center p-2 rounded" style={{ background: 'var(--primary-color)', color: 'white' }}>
          <ArrowLeftRight size={24} />
        </div>
        <h2>FinDash</h2>
      </div>

      <nav className="flex-col w-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
