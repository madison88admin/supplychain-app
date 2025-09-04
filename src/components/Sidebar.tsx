import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  CheckSquare,
  Package,
  FileText,
  Clipboard,
  ShoppingCart,
  Layers,
  Truck,
  BarChart3,
  FolderOpen,
  Users,
  X,
  Database,
  History,
  FileBarChart,
  ExternalLink
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import './Sidebar.css';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen, collapsed: externalCollapsed, setCollapsed: setExternalCollapsed }) => {
  const location = useLocation();
  const { user } = useUser();
  



  // Use external collapsed state if provided, otherwise default to false
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : false;
  const setCollapsed = setExternalCollapsed || (() => {});
  


  // Define menu item types
  type MenuItem = {
    icon: any;
    label: string;
    path: string;
    external?: boolean;
  };
  type MenuSection = {
    title: string;
    items: MenuItem[];
  };

  const menuSections: MenuSection[] = [
    {
      title: 'Overview',
      items: [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: BarChart3, label: 'Pivot Reports', path: '/pivot-reports' },
      ]
    },
    {
      title: 'Tasks & Workflow',
      items: [
        { icon: CheckSquare, label: 'My Tasks', path: '/my-tasks' },
        { icon: Clipboard, label: 'Sample Requests', path: '/sample-requests' },
        { icon: FileText, label: 'Techpacks', path: '/techpacks' },
        { icon: FolderOpen, label: 'Documents', path: '/documents' },
        { icon: FileBarChart, label: 'Reports', path: '/reports' },
      ]
    },
    {
      title: 'Purchasing',
      items: [
        { icon: ExternalLink, label: 'Purchase Order Instructions', path: 'https://poinstructions.netlify.app/', external: true },
        { icon: ShoppingCart, label: 'Purchase Order', path: '/purchase-order' },
        { icon: ShoppingCart, label: 'Purchase Order Lines', path: '/purchase-orders' },
        { icon: Package, label: 'Material Purchase Order', path: '/material-purchase-order' },
        { icon: Package, label: 'Material Purchase Order Lines', path: '/material-purchase-order-lines' },
      ]
    },
    {
      title: 'Product Management',
      items: [
        { icon: Package, label: 'Product Manager', path: '/product-manager' },
        { icon: Layers, label: 'Material Manager', path: '/material-manager' },
      ]
    },
    {
      title: 'Supplier Management',
      items: [
        { icon: Truck, label: 'Supplier Loading', path: '/supplier-loading' },
      ]
    },
    {
      title: 'History',
      items: [
        { icon: History, label: 'Activity Logs', path: '/activity-logs' },
      ]
    },
    {
      title: 'Data & Admin',
      items: [
        { icon: Database, label: 'Data Bank', path: '/data-bank' },
        { icon: Users, label: 'User Management', path: '/user-administration' },
      ]
    },
    {
      title: 'External Links',
      items: [
        { icon: ExternalLink, label: 'Purchase Order Instructions', path: 'https://poinstructions.netlify.app/', external: true },
        { icon: ExternalLink, label: 'Factory Account Allocation', path: 'https://m88accountallocation.netlify.app/', external: true }
      ]
    }
  ];

  // Filter admin items based on user role
  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      // Show all items except admin-specific ones
      if (item.path === '/user-administration' || item.path === '/data-bank') {
        return user?.role === 'Admin';
      }
      return true;
    })
  })).filter(section => section.items.length > 0);

  const isActive = (path: string) => location.pathname === path;

  // Handle mouse enter/leave for desktop collapse
  const handleMouseEnter = () => {
    if (collapsed && window.innerWidth >= 1024) {
      setCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (!collapsed && window.innerWidth >= 1024) {
      setCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="sidebar--overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
              <div
          className={`sidebar--wrapper ${collapsed ? 'collapsed' : ''} ${open ? 'open' : 'closed'}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
        {/* Menu header */}
        <div className="sidebar--header">
          <div className={`sidebar--logo ${collapsed ? 'collapsed' : 'expanded'}`}>
            <span className="text-lg font-bold text-white tracking-wide uppercase" style={{
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              letterSpacing: '0.1em'
            }}>
              Menu
            </span>
          </div>
        </div>

        {/* Mobile header */}
        <div className="sidebar--mobile-header">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="sidebar--close-btn"
          >
            <X className="h-6 w-6" />
          </button>
        </div>



        {/* Navigation */}
        <nav className="sidebar--nav">
          <ul className="sidebar--list">
            {filteredSections.map((section) => (
              <React.Fragment key={section.title}>
                {/* Section Header */}
                {!collapsed && (
                  <li className="sidebar__item">
                    <div style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6c757d',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '1px solid #e9ecef',
                      marginBottom: '8px',
                      transition: 'opacity 0.3s ease-in-out'
                    }}>
                      {section.title}
                    </div>
                  </li>
                )}
                {/* Section Items */}
                {section.items.map((item) => (
                  <li key={item.path} className="sidebar__item">
                    {item.external ? (
                      <a
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className={`sidebar__item--link ${collapsed ? 'collapsed' : ''}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setOpen(false);
                          }
                        }}
                        tabIndex={0}
                        role="menuitem"
                        aria-label={`Open ${item.label} in new tab`}
                      >
                        <item.icon className="sidebar__item--icon" />
                        <span className={`sidebar__item--label ${collapsed ? 'collapsed' : ''}`}>
                          {item.label}
                        </span>
                      </a>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className={`sidebar__item--link ${isActive(item.path) ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setOpen(false);
                          }
                        }}
                        tabIndex={0}
                        role="menuitem"
                        aria-label={`Navigate to ${item.label}`}
                      >
                        <item.icon className="sidebar__item--icon" />
                        <span className={`sidebar__item--label ${collapsed ? 'collapsed' : ''}`}>
                          {item.label}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;