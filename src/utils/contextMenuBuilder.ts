import React from 'react';
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
  ChevronDown,
  ChevronUp,
  FileText,
  FileSpreadsheet,
  File
} from 'lucide-react';
import { ContextMenuItem } from '../components/ContextMenu';
import { ContextMenuContext } from '../hooks/useContextMenu';

export interface TableContext {
  data: any[];
  selectedRows: any[];
  columns: any[];
  onEditRow?: (row: any) => void;
  onDeleteRow?: (row: any) => void;
  onDuplicateRow?: (row: any) => void;
  onViewDetails?: (row: any) => void;
  onAddNote?: (row: any) => void;
  onExport?: (format: string, rows?: any[]) => void;
  onAssignUser?: (rows: any[]) => void;
  onChangeStatus?: (rows: any[], status: string) => void;
  onBulkUpdate?: (rows: any[], field: string, value: any) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onHideColumn?: (column: string) => void;
  onShowColumn?: (column: string) => void;
  onFilterByColumn?: (column: string, value: any) => void;
  onGroupByColumn?: (column: string) => void;
  onResizeColumn?: (column: string, width: number) => void;
  onRefresh?: () => void;
  onTogglePagination?: () => void;
  onCustomizeColumns?: () => void;
  onSaveView?: () => void;
  isRowLocked?: (row: any) => boolean;
  canEdit?: (row: any) => boolean;
  canDelete?: (row: any) => boolean;
}

export const buildContextMenu = (
  context: ContextMenuContext,
  tableContext: TableContext
): ContextMenuItem[] => {
  const { target, data, selectedRows, columnKey } = context;
  const { selectedRows: tableSelectedRows } = tableContext;

  switch (target) {
    case 'row':
      return buildRowContextMenu(data, tableContext);
    
    case 'column':
      return buildColumnContextMenu(columnKey!, tableContext);
    
    case 'table':
      return buildTableContextMenu(tableContext);
    
    case 'cell':
      return buildCellContextMenu(data, tableContext);
    
    default:
      return [];
  }
};

const buildRowContextMenu = (row: any, tableContext: TableContext): ContextMenuItem[] => {
  const { 
    onEditRow, 
    onDeleteRow, 
    onDuplicateRow, 
    onViewDetails, 
    onAddNote,
    isRowLocked,
    canEdit,
    canDelete
  } = tableContext;

  const isLocked = isRowLocked ? isRowLocked(row) : false;
  const editable = canEdit ? canEdit(row) : true;
  const deletable = canDelete ? canDelete(row) : true;

  return [
    {
      id: 'edit-row',
      label: 'Edit Row',
      icon: React.createElement(Edit, { className: "w-4 h-4" }),
      shortcut: 'Ctrl+E',
      disabled: !editable || isLocked,
      action: () => onEditRow?.(row)
    },
    {
      id: 'view-details',
      label: 'View Details',
      icon: React.createElement(Eye, { className: "w-4 h-4" }),
      shortcut: 'Ctrl+D',
      action: () => onViewDetails?.(row)
    },
    {
      id: 'duplicate-row',
      label: 'Duplicate Row',
      icon: React.createElement(Copy, { className: "w-4 h-4" }),
      shortcut: 'Ctrl+Shift+D',
      disabled: !editable,
      action: () => onDuplicateRow?.(row)
    },
    {
      id: 'add-note',
      label: 'Add Note / Comment',
      icon: React.createElement(MessageSquare, { className: "w-4 h-4" }),
      shortcut: 'Ctrl+N',
      action: () => onAddNote?.(row)
    },
    { id: 'divider-1', divider: true },
    {
      id: 'delete-row',
      label: 'Delete Row',
      icon: React.createElement(Trash2, { className: "w-4 h-4" }),
      shortcut: 'Del',
      disabled: !deletable || isLocked,
      action: () => onDeleteRow?.(row)
    }
  ];
};

const buildColumnContextMenu = (columnKey: string, tableContext: TableContext): ContextMenuItem[] => {
  const { 
    onSort, 
    onHideColumn, 
    onFilterByColumn, 
    onGroupByColumn, 
    onResizeColumn 
  } = tableContext;

  return [
    {
      id: 'sort-asc',
      label: 'Sort Ascending',
      icon: React.createElement(ChevronUp, { className: "w-4 h-4" }),
      shortcut: 'Ctrl+Shift+↑',
      action: () => onSort?.(columnKey, 'asc')
    },
    {
      id: 'sort-desc',
      label: 'Sort Descending',
      icon: React.createElement(ChevronDown, { className: "w-4 h-4" }),
      shortcut: 'Ctrl+Shift+↓',
      action: () => onSort?.(columnKey, 'desc')
    },
    { id: 'divider-1', divider: true },
    {
      id: 'filter-by-column',
      label: 'Filter by This Column',
      icon: React.createElement(Filter, { className: "w-4 h-4" }),
      shortcut: 'Ctrl+F',
      action: () => onFilterByColumn?.(columnKey, '')
    },
    {
      id: 'group-by-column',
      label: 'Group by This Column',
      icon: React.createElement(Group, { className: "w-4 h-4" }),
      shortcut: 'Ctrl+G',
      action: () => onGroupByColumn?.(columnKey)
    },
    { id: 'divider-2', divider: true },
    {
      id: 'hide-column',
      label: 'Hide Column',
      icon: React.createElement(EyeOff, { className: "w-4 h-4" }),
      shortcut: 'Ctrl+H',
      action: () => onHideColumn?.(columnKey)
    },
    {
      id: 'resize-column',
      label: 'Resize Column',
      icon: React.createElement(Move, { className: "w-4 h-4" }),
      action: () => onResizeColumn?.(columnKey, 150) // Default width
    }
  ];
};

const buildTableContextMenu = (tableContext: TableContext): ContextMenuItem[] => {
  const { 
    selectedRows, 
    onExport, 
    onAssignUser, 
    onChangeStatus, 
    onBulkUpdate,
    onRefresh,
    onTogglePagination,
    onCustomizeColumns,
    onSaveView
  } = tableContext;

  const hasSelection = selectedRows && selectedRows.length > 0;

  const menuItems: ContextMenuItem[] = [
    {
      id: 'refresh-table',
      label: 'Refresh Table',
      icon: React.createElement(RefreshCw, { className: "w-4 h-4" }),
      shortcut: 'F5',
      action: () => onRefresh?.()
    },
    { id: 'divider-1', divider: true }
  ];

  if (hasSelection) {
    menuItems.push(
      {
        id: 'export-selected',
        label: 'Export Selected',
        icon: React.createElement(Download, { className: "w-4 h-4" }),
        submenu: [
          {
            id: 'export-csv',
            label: 'Export as CSV',
            icon: React.createElement(FileText, { className: "w-4 h-4" }),
            action: () => onExport?.('csv', selectedRows)
          },
          {
            id: 'export-excel',
            label: 'Export as Excel',
            icon: React.createElement(FileSpreadsheet, { className: "w-4 h-4" }),
            action: () => onExport?.('excel', selectedRows)
          },
          {
            id: 'export-pdf',
            label: 'Export as PDF',
            icon: React.createElement(File, { className: "w-4 h-4" }),
            action: () => onExport?.('pdf', selectedRows)
          }
        ],
        action: () => {}
      },
      {
        id: 'assign-user',
        label: 'Assign to User/Manager',
        icon: React.createElement(User, { className: "w-4 h-4" }),
        action: () => onAssignUser?.(selectedRows)
      },
      {
        id: 'change-status',
        label: 'Change Status',
        icon: React.createElement(Move, { className: "w-4 h-4" }),
        action: () => onChangeStatus?.(selectedRows, 'pending')
      },
      {
        id: 'bulk-update',
        label: 'Bulk Update Fields',
        icon: React.createElement(Settings, { className: "w-4 h-4" }),
        action: () => onBulkUpdate?.(selectedRows, 'status', 'updated')
      },
      { id: 'divider-2', divider: true }
    );
  }

  menuItems.push(
    {
      id: 'export-table',
      label: 'Export Table',
      icon: React.createElement(Download, { className: "w-4 h-4" }),
      submenu: [
        {
          id: 'export-all-csv',
          label: 'Export All as CSV',
          icon: React.createElement(FileText, { className: "w-4 h-4" }),
          action: () => onExport?.('csv')
        },
        {
          id: 'export-all-excel',
          label: 'Export All as Excel',
          icon: React.createElement(FileSpreadsheet, { className: "w-4 h-4" }),
          action: () => onExport?.('excel')
        },
        {
          id: 'export-all-pdf',
          label: 'Export All as PDF',
          icon: React.createElement(File, { className: "w-4 h-4" }),
          action: () => onExport?.('pdf')
        }
      ],
      action: () => {}
    },
    {
      id: 'toggle-pagination',
      label: 'Toggle Pagination / Show All',
      icon: React.createElement(Settings, { className: "w-4 h-4" }),
      action: () => onTogglePagination?.()
    },
    {
      id: 'customize-columns',
      label: 'Customize Columns',
      icon: React.createElement(Settings, { className: "w-4 h-4" }),
      action: () => onCustomizeColumns?.()
    },
    {
      id: 'save-view',
      label: 'Save Current View',
      icon: React.createElement(Save, { className: "w-4 h-4" }),
      shortcut: 'Ctrl+S',
      action: () => onSaveView?.()
    }
  );

  return menuItems;
};

const buildCellContextMenu = (cellData: any, tableContext: TableContext): ContextMenuItem[] => {
  return [
    {
      id: 'copy-cell',
      label: 'Copy Cell Value',
      icon: React.createElement(Copy, { className: "w-4 h-4" }),
      shortcut: 'Ctrl+C',
      action: () => {
        navigator.clipboard.writeText(cellData?.value || cellData);
      }
    },
    {
      id: 'edit-cell',
      label: 'Edit Cell',
      icon: React.createElement(Edit, { className: "w-4 h-4" }),
      shortcut: 'F2',
      action: () => {
        // Trigger cell editing
        console.log('Edit cell:', cellData);
      }
    }
  ];
}; 