import React, { useState, useMemo, useCallback } from 'react';
import VirtualizedList from './VirtualizedList';
import ContextMenu from './ContextMenu';
import { useContextMenu } from '../hooks/useContextMenu';
import { buildContextMenu, TableContext } from '../utils/contextMenuBuilder';

interface Column<T> {
  key: string;
  header: string;
  width?: number;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

interface OptimizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  height?: number;
  rowHeight?: number;
  sortable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
  emptyMessage?: string;
  tableContext?: Partial<TableContext>;
  enableContextMenu?: boolean;
}

function OptimizedTable<T extends Record<string, any>>({
  data,
  columns,
  height = 400,
  rowHeight = 48,
  sortable = true,
  onSort,
  sortKey,
  sortDirection,
  className = '',
  emptyMessage = 'No data available',
  tableContext = {},
  enableContextMenu = true
}: OptimizedTableProps<T>) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const { isOpen, context, menuItems, openMenu, closeMenu } = useContextMenu();

  // Context menu handlers
  const handleRowContextMenu = useCallback((event: React.MouseEvent, row: T, index: number) => {
    if (!enableContextMenu) return;
    
    const context = {
      target: 'row' as const,
      data: row,
      selectedRows: selectedRows,
      position: { x: event.clientX, y: event.clientY }
    };
    
    const items = buildContextMenu(context, {
      data,
      selectedRows,
      columns,
      ...tableContext
    });
    
    openMenu(event, context, items);
  }, [enableContextMenu, selectedRows, data, columns, tableContext, openMenu]);

  const handleColumnContextMenu = useCallback((event: React.MouseEvent, columnKey: string) => {
    if (!enableContextMenu) return;
    
    const context = {
      target: 'column' as const,
      columnKey,
      selectedRows: selectedRows,
      position: { x: event.clientX, y: event.clientY }
    };
    
    const items = buildContextMenu(context, {
      data,
      selectedRows,
      columns,
      ...tableContext
    });
    
    openMenu(event, context, items);
  }, [enableContextMenu, selectedRows, data, columns, tableContext, openMenu]);

  const handleTableContextMenu = useCallback((event: React.MouseEvent) => {
    if (!enableContextMenu) return;
    
    const context = {
      target: 'table' as const,
      selectedRows: selectedRows,
      position: { x: event.clientX, y: event.clientY }
    };
    
    const items = buildContextMenu(context, {
      data,
      selectedRows,
      columns,
      ...tableContext
    });
    
    openMenu(event, context, items);
  }, [enableContextMenu, selectedRows, data, columns, tableContext, openMenu]);

  // Memoized sorted data
  const sortedData = useMemo(() => {
    if (!sortable || !sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortable, sortKey, sortDirection]);

  // Memoized header row
  const headerRow = useMemo(() => (
    <div className="flex bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm">
      {columns.map((column) => (
        <div
          key={column.key}
          className="px-4 py-3 flex items-center"
          style={{ width: column.width || 'auto', flex: column.width ? 'none' : 1 }}
          onContextMenu={(e) => handleColumnContextMenu(e, column.key)}
        >
          <span className="truncate">{column.header}</span>
          {sortable && column.sortable && onSort && (
            <button
              onClick={() => onSort(column.key, sortDirection === 'asc' ? 'desc' : 'asc')}
              className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {sortKey === column.key ? (
                <span className="text-blue-600">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              ) : (
                <span className="text-gray-400">↕</span>
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  ), [columns, sortable, sortKey, sortDirection, onSort, handleColumnContextMenu]);

  // Memoized row renderer
  const renderRow = useCallback((row: T, index: number) => (
    <div
      className={`flex border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
        hoveredRow === index ? 'bg-blue-50' : ''
      }`}
      onMouseEnter={() => setHoveredRow(index)}
      onMouseLeave={() => setHoveredRow(null)}
      onContextMenu={(e) => handleRowContextMenu(e, row, index)}
    >
      {columns.map((column) => (
        <div
          key={column.key}
          className="px-4 py-3 flex items-center"
          style={{ width: column.width || 'auto', flex: column.width ? 'none' : 1 }}
        >
          {column.render ? (
            column.render(row[column.key], row, index)
          ) : (
            <span className="truncate text-sm text-gray-900">
              {row[column.key]}
            </span>
          )}
        </div>
      ))}
    </div>
  ), [columns, hoveredRow, handleRowContextMenu]);

  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        {headerRow}
        <div className="flex items-center justify-center py-12 text-gray-500">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {headerRow}
      <div onContextMenu={handleTableContextMenu}>
        <VirtualizedList
          items={sortedData}
          height={height}
          itemHeight={rowHeight}
          renderItem={renderRow}
          overscan={10}
        />
      </div>
      
      {/* Context Menu */}
      {isOpen && context && (
        <ContextMenu
          items={menuItems}
          x={context.position.x}
          y={context.position.y}
          onClose={closeMenu}
        />
      )}
    </div>
  );
}

export default React.memo(OptimizedTable); 