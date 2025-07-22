import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'My Tasks', path: '/my-tasks' },
    { icon: ShoppingCart, label: 'Purchase Order', path: '/purchase-order' },
    { icon: ShoppingCart, label: 'Purchase Order Lines', path: '/purchase-orders' },
    { icon: Package, label: 'Product Manager', path: '/product-manager' },
    { icon: FileText, label: 'Techpacks', path: '/techpacks' },
    { icon: Clipboard, label: 'Sample Requests', path: '/sample-requests' },
    { icon: Layers, label: 'Material Manager', path: '/material-manager' },
    { icon: Truck, label: 'Supplier Loading', path: '/supplier-loading' },
    { icon: BarChart3, label: 'Pivot Reports', path: '/pivot-reports' },
    { icon: Database, label: 'Data Bank', path: '/data-bank' },
    { icon: FolderOpen, label: 'Documents', path: '/documents' },
  ];

  // Admin-only menu items
  const adminMenuItems = [
    { icon: Users, label: 'User Administration', path: '/user-administration' },
  ];

  // Combine regular menu items with admin items if user is admin
  const allMenuItems = [
    ...menuItems,
    ...(user?.role === 'Admin' ? adminMenuItems : [])
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'w-16' : 'w-64'}
          lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        {/* Collapse/Expand Button */}
        <div className={`flex items-center justify-${collapsed ? 'center' : 'end'} p-2 border-b border-gray-200`}>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        <nav className="mt-5 px-2 space-y-1">
          {allMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${isActive(item.path)
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                ${collapsed ? 'justify-center' : ''}`}
            >
              <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;