import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  MessageSquare, 
  Download, 
  User, 
  Filter, 
  EyeOff, 
  Group, 
  Move, 
  RefreshCw, 
  Settings, 
  Save, 
  Undo, 
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  FileText,
  FileSpreadsheet,
  File,
  ChevronRight
} from 'lucide-react';

export interface ContextMenuItem {
  id: string;
  label?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  divider?: boolean;
  submenu?: ContextMenuItem[];
  action?: () => void;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  x: number;
  y: number;
  onClose: () => void;
  className?: string;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ 
  items, 
  x, 
  y, 
  onClose, 
  className = '' 
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleItemClick = useCallback((item: ContextMenuItem) => {
    if (!item.disabled && !item.submenu && item.action) {
      item.action();
      onClose();
    }
  }, [onClose]);

  const handleSubmenuHover = useCallback((item: ContextMenuItem, event: React.MouseEvent) => {
    if (item.submenu) {
      const rect = event.currentTarget.getBoundingClientRect();
      setSubmenuPosition({
        x: rect.right + 5,
        y: rect.top
      });
      setActiveSubmenu(item.id);
    }
  }, []);

  const handleSubmenuLeave = useCallback(() => {
    setActiveSubmenu(null);
  }, []);

  // Adjust position to keep menu in viewport
  const adjustedPosition = useCallback(() => {
    const menuWidth = 250;
    const menuHeight = items.length * 40;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    if (x + menuWidth > viewportWidth) {
      adjustedX = x - menuWidth;
    }

    if (y + menuHeight > viewportHeight) {
      adjustedY = y - menuHeight;
    }

    return { x: adjustedX, y: adjustedY };
  }, [x, y, items.length]);

  const position = adjustedPosition();

  const renderMenuItem = (item: ContextMenuItem, index: number) => {
    if (item.divider) {
      return (
        <div key={`divider-${index}`} className="border-t border-gray-200 my-1" />
      );
    }

    return (
      <div
        key={item.id}
        className={`relative group`}
        onMouseEnter={(e) => handleSubmenuHover(item, e)}
        onMouseLeave={handleSubmenuLeave}
      >
        <button
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
          className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ${
            item.disabled ? 'text-gray-400' : 'text-gray-700 hover:text-blue-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            {item.icon && (
              <span className="flex-shrink-0 w-4 h-4">
                {item.icon}
              </span>
            )}
            <span className="truncate">{item.label}</span>
          </div>
          <div className="flex items-center space-x-2">
            {item.shortcut && (
              <span className="text-xs text-gray-400 font-mono">
                {item.shortcut}
              </span>
            )}
            {item.submenu && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </button>

        {/* Submenu */}
        {item.submenu && activeSubmenu === item.id && (
          <div
            className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[200px]"
            style={{
              left: submenuPosition.x,
              top: submenuPosition.y
            }}
          >
            {item.submenu.map((subItem, subIndex) => (
              <button
                key={subItem.id}
                onClick={() => handleItemClick(subItem)}
                disabled={subItem.disabled}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ${
                  subItem.disabled ? 'text-gray-400' : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {subItem.icon && (
                    <span className="flex-shrink-0 w-4 h-4">
                      {subItem.icon}
                    </span>
                  )}
                  <span className="truncate">{subItem.label}</span>
                </div>
                {subItem.shortcut && (
                  <span className="text-xs text-gray-400 font-mono">
                    {subItem.shortcut}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[250px] ${className}`}
      style={{
        left: position.x,
        top: position.y
      }}
      role="menu"
      aria-label="Context menu"
    >
      {items.map(renderMenuItem)}
    </div>
  );
};

export default ContextMenu; 