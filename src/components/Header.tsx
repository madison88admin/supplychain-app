import React, { useState, useEffect, useRef } from 'react';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import whiteLogo from '../images/whitelogo.png';
import AdvancedSearch from './AdvancedSearch';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed?: boolean;
  setSidebarCollapsed?: (collapsed: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  setSidebarOpen, 
  sidebarCollapsed = false, 
  setSidebarCollapsed 
}) => {
  const { user, logout } = useUser();
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [profileOpen]);

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        window.location.href = '/search';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>
      <header className="px-4 py-3 relative overflow-hidden z-[9999999]" style={{ 
        background: 'linear-gradient(135deg, #2C5A7A 0%, #3D75A3 100%)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5 pointer-events-none"></div>
        <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
    
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center space-x-4 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="Go to dashboard"
            >
              <div className="flex items-center">
                <img
                  src={whiteLogo}
                  alt="Madison 88 Logo"
                  className="h-12 w-auto"
                />
              </div>
              <div className="hidden md:block">
                <p className="text-sm text-white font-medium">Supply Chain Management System</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <AdvancedSearch />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-white/80">{user?.role}</p>
            </div>
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/20 transition-colors"
                onClick={() => setProfileOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={profileOpen}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>
              <div className={`fixed right-4 top-20 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-[999999] transition-all duration-200 ${
                profileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
              }`}
                tabIndex={-1}
              >
                <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </a>
                <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </a>
                <hr className="my-2" />
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </header>
    </>
  );
};

export default Header;