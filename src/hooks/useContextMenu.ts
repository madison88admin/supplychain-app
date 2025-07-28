import { useState, useCallback, useRef } from 'react';
import { ContextMenuItem } from '../components/ContextMenu';

export interface ContextMenuContext {
  target: 'row' | 'column' | 'table' | 'cell';
  data?: any;
  selectedRows?: any[];
  columnKey?: string;
  position: { x: number; y: number };
}

export const useContextMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<ContextMenuContext | null>(null);
  const [menuItems, setMenuItems] = useState<ContextMenuItem[]>([]);
  const lastActionRef = useRef<any>(null);

  const openMenu = useCallback((
    event: React.MouseEvent,
    context: ContextMenuContext,
    items: ContextMenuItem[]
  ) => {
    event.preventDefault();
    event.stopPropagation();
    
    setContext(context);
    setMenuItems(items);
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setContext(null);
    setMenuItems([]);
  }, []);

  const executeAction = useCallback((action: () => void, actionData?: any) => {
    try {
      lastActionRef.current = { action, data: actionData, timestamp: Date.now() };
      action();
    } catch (error) {
      console.error('Context menu action failed:', error);
    }
  }, []);

  const undoLastAction = useCallback(() => {
    if (lastActionRef.current) {
      const { action, data, timestamp } = lastActionRef.current;
      const timeSinceAction = Date.now() - timestamp;
      
      // Only allow undo within 30 seconds
      if (timeSinceAction < 30000) {
        try {
          // This would typically call an undo function
          console.log('Undoing action:', action, data);
          // Implement undo logic here
        } catch (error) {
          console.error('Undo action failed:', error);
        }
      }
    }
  }, []);

  return {
    isOpen,
    context,
    menuItems,
    openMenu,
    closeMenu,
    executeAction,
    undoLastAction,
    canUndo: lastActionRef.current !== null
  };
}; 