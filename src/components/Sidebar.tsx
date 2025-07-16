import React from 'react';
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
  X
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'My Tasks', path: '/my-tasks' },
    { icon: Package, label: 'Product Manager', path: '/product-manager' },
    { icon: FileText, label: 'Techpacks', path: '/techpacks' },
    { icon: Clipboard, label: 'Sample Requests', path: '/sample-requests' },
    { icon: ShoppingCart, label: 'Purchase Orders', path: '/purchase-orders' },
    { icon: Layers, label: 'Material Manager', path: '/material-manager' },
    { icon: Truck, label: 'Supplier Loading', path: '/supplier-loading' },
    { icon: BarChart3, label: 'Pivot Reports', path: '/pivot-reports' },
    { icon: FolderOpen, label: 'Documents', path: '/documents' },
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
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        
        <nav className="mt-5 px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;