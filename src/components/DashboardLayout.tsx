import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topnav } from './Topnav';
import { useStore } from '../store/useStore';

export const DashboardLayout: React.FC = () => {
  const { role } = useStore();

  return (
    <div className={`dashboard-layout bg-background overflow-hidden h-screen w-screen ${role === 'Admin' ? 'admin-mode' : ''}`}>
      <Sidebar />
      <div className="main-content">
        <Topnav />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
