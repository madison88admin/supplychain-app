import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Menu, Bell, User, Settings, LogOut, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Purchase Order Approved',
      message: 'PO-2024-001 has been approved by management',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Material XYZ is running low on stock',
      time: '15 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'New Supplier Added',
      message: 'Supplier ABC has been added to the system',
      time: '1 hour ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Sample Request Completed',
      message: 'Sample request SR-2024-005 has been completed',
      time: '2 hours ago',
      read: true
    },
    {
      id: 5,
      type: 'warning',
      title: 'Delivery Delayed',
      message: 'Delivery for PO-2024-002 has been delayed',
      time: '3 hours ago',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen]);

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
      <header className="px-4 py-3 relative overflow-hidden" style={{ 
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
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setNotificationsOpen(!notificationsOpen);
                }
              }}
              className="relative p-2 text-white hover:text-blue-200 hover:bg-white/20 rounded-lg transition-all duration-200 ease-in-out"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className={`h-6 w-6 transition-transform duration-200 ease-in-out ${
                notificationsOpen ? 'scale-110' : 'scale-100'
              }`} />
              {unreadCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse"
                  style={{
                    animation: 'bounceIn 0.6s ease-out, pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}
                >
                  <span className="text-white text-xs font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && createPortal(
              <div className={`fixed right-4 top-20 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999999] transition-all duration-200 ease-in-out transform opacity-100 scale-100 translate-y-0`}>
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200">
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification, index) => {
                      const getIcon = () => {
                        switch (notification.type) {
                          case 'success':
                            return <CheckCircle className="h-4 w-4 text-green-500" />;
                          case 'warning':
                            return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
                          case 'error':
                            return <AlertTriangle className="h-4 w-4 text-red-500" />;
                          default:
                            return <Info className="h-4 w-4 text-blue-500" />;
                        }
                      };

                      const getTypeColor = () => {
                        switch (notification.type) {
                          case 'success':
                            return 'border-l-green-500';
                          case 'warning':
                            return 'border-l-yellow-500';
                          case 'error':
                            return 'border-l-red-500';
                          default:
                            return 'border-l-blue-500';
                        }
                      };

                      return (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 transition-all duration-200 ease-in-out ${getTypeColor()} ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animation: 'slideInFromTop 0.3s ease-out forwards'
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getIcon()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">{notification.time}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-1 transition-colors duration-200">
                      View all notifications
                    </button>
                  </div>
                )}
              </div>,
              document.body
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-white/80">{user?.role}</p>
            </div>
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/20 transition-colors">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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