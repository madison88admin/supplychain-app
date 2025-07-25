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
  Database,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import darkLogo from '../images/darklogo.png';
import logoNoBg from '../images/logo no bg.png';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const { user } = useUser();
  // Set collapsed to true by default so sidebar is collapsed until hovered
  const [collapsed, setCollapsed] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);

  // Define menu item types
  type MenuItem = {
    icon: any;
    label: string;
    path: string;
  };
  type ParentMenuItem = {
    label: string;
    icon: any;
    children: MenuItem[];
  };
  type SidebarItem = MenuItem | ParentMenuItem;

  const menuItems: MenuItem[] = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'My Tasks', path: '/my-tasks' },
    { icon: ShoppingCart, label: 'Purchase Order', path: '/purchase-order' },
    { icon: ShoppingCart, label: 'Purchase Order Lines', path: '/purchase-orders' },
    { icon: Package, label: 'Material Purchase Order', path: '/material-purchase-order' },
    { icon: Package, label: 'Material Purchase Order Lines', path: '/material-purchase-order-lines' },
    { icon: Package, label: 'Product Manager', path: '/product-manager' },
    { icon: FileText, label: 'Techpacks', path: '/techpacks' },
    { icon: Clipboard, label: 'Sample Requests', path: '/sample-requests' },
    { icon: Layers, label: 'Material Manager', path: '/material-manager' },
    { icon: Truck, label: 'Supplier Loading', path: '/supplier-loading' },
    { icon: BarChart3, label: 'Pivot Reports', path: '/pivot-reports' },
    { icon: FolderOpen, label: 'Documents', path: '/documents' },
  ];

  // Admin-only menu items
  const adminMenuItems: ParentMenuItem[] = [
    {
      label: 'Administration',
      icon: Users,
      children: [
        { icon: Users, label: 'User Administration', path: '/user-administration' },
        { icon: Database, label: 'Data Bank', path: '/data-bank' },
      ],
    },
  ];

  // Combine regular menu items with admin items if user is admin
  const allMenuItems: SidebarItem[] = [
    ...menuItems,
    ...(user?.role === 'Admin' ? adminMenuItems : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  function hasChildren(item: SidebarItem): item is ParentMenuItem {
    return (item as ParentMenuItem).children !== undefined;
  }

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
        className={`fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'w-16' : 'w-64'}
          lg:translate-x-0 lg:static lg:inset-0`}
        onMouseEnter={() => { if (collapsed) setCollapsed(false); }}
        onMouseLeave={() => { if (!collapsed) setCollapsed(true); }}
      >
        {/* Logo at the top */}
        <div className={`flex items-center justify-center py-4 border-b border-gray-200`}> 
          <img
            src={collapsed ? logoNoBg : darkLogo}
            alt={collapsed ? 'Logo' : 'Dark Logo'}
            className={collapsed ? 'h-8 w-8' : 'h-10 w-auto transition-all duration-300 ease-in-out'}
            style={{ transition: 'all 0.3s' }}
          />
        </div>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        {/* Sidebar click to expand when collapsed */}
        {/* The rest of the sidebar is wrapped in a div with onClick handler when collapsed */}
        <div
          className="flex-1 flex flex-col"
        >
        <nav className="mt-5 px-2 space-y-1">
          {allMenuItems.map((item) => (
            hasChildren(item) ? (
              user?.role === 'Admin' && (
                <div key={item.label}>
                  <button
                    className={`group flex items-center w-full px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${collapsed ? 'justify-center' : ''}`}
                    onClick={() => setAdminOpen((open) => !open)}
                    aria-expanded={adminOpen}
                  >
                    <item.icon className={`h-5 w-5 ${collapsed ? '' : 'text-gray-700'}`} />
                    {!collapsed && <span className="ml-3 flex-1 text-left">{item.label}</span>}
                    {!collapsed && (adminOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />)}
                  </button>
                  {!collapsed && adminOpen && (
                    <div className="ml-8 space-y-1">
                      {item.children.map((sub: any) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={() => setOpen(false)}
                          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                            ${isActive(sub.path)
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                          <sub.icon className={`h-5 w-5 ${isActive(sub.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                          <span className="ml-3">{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            ) : (
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
            )
          ))}
        </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;