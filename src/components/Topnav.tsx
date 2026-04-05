import React, { useState } from 'react';
import { Moon, Sun, Shield, Lock, User, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Topnav: React.FC = () => {
  const { role, setRole, isDarkMode, toggleDarkMode } = useStore();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="top-nav">
      <div className="flex items-center gap-4">
        <h3 className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Welcome back, User!</h3>
        <div className="admin-indicator">
          <Shield size={16} /> ADMIN MODE
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        
        {/* Role Switcher Pill */}
        <div className="role-switcher">
          <button 
            onClick={() => setRole('Viewer')}
            className={`role-btn ${role === 'Viewer' ? 'viewer-active' : ''}`}
          >
            <Lock size={16} /> Viewer
          </button>
          <button 
            onClick={() => setRole('Admin')}
            className={`role-btn ${role === 'Admin' ? 'admin-active' : ''}`}
          >
            <Shield size={16} /> Admin
          </button>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="btn-icon"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center justify-center font-bold text-white shadow-sm hover:shadow-lg transition-all hover:scale-105"
            style={{ 
              width: '42px', height: '42px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--primary-color), #8b5cf6)', 
              cursor: 'pointer',
              border: '2px solid var(--bg-card)'
            }}
          >
            NC
          </div>

          {profileOpen && (
            <div 
              className="absolute right-0 mt-3 w-64 rounded-xl shadow-2xl z-50 overflow-hidden" 
              style={{ 
                backgroundColor: 'var(--bg-card)', 
                border: '1px solid var(--border-color)', 
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(139, 92, 246, 0.1))', borderBottom: '1px solid var(--border-color)' }}>
                <p className="font-bold text-[1.05rem]" style={{ color: 'var(--text-primary)' }}>Nikunj Chandak</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>nikunj@dashboard.app</p>
              </div>
              <div className="py-2 px-2">
                <button 
                  onClick={() => setProfileOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5" 
                  style={{ color: 'var(--text-primary)' }}
                >
                  <User size={18} className="text-secondary" /> 
                  <span className="font-medium">My Profile</span>
                </button>
                <button 
                  onClick={() => setProfileOpen(false)}
                  className="w-full text-left px-3 py-2 mt-1 rounded-lg text-sm text-danger flex items-center gap-3 transition-colors hover:bg-danger/10"
                >
                  <LogOut size={18} /> 
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
