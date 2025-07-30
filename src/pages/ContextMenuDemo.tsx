import React, { useState, useCallback } from 'react';
import OptimizedTable from '../components/OptimizedTable';
import { TableContext } from '../utils/contextMenuBuilder';

interface DemoRow {
  id: string;
  name: string;
  status: string;
  priority: string;
  assignedTo: string;
  dueDate: string;
  progress: number;
  locked?: boolean;
}

const ContextMenuDemo: React.FC = () => {
  const [data, setData] = useState<DemoRow[]>([
    {
      id: '1',
      name: 'Purchase Order PO-2024-001',
      status: 'Approved',
      priority: 'High',
      assignedTo: 'John Smith',
      dueDate: '2024-02-15',
      progress: 75,
      locked: false
    },
    {
      id: '2',
      name: 'Sample Request SR-2024-005',
      status: 'Pending',
      priority: 'Medium',
      assignedTo: 'Jane Doe',
      dueDate: '2024-02-20',
      progress: 30,
      locked: true
    },
    {
      id: '3',
      name: 'Material Order MO-2024-003',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Mike Johnson',
      dueDate: '2024-02-18',
      progress: 60,
      locked: false
    },
    {
      id: '4',
      name: 'Quality Check QC-2024-002',
      status: 'Completed',
      priority: 'Low',
      assignedTo: 'Sarah Wilson',
      dueDate: '2024-02-10',
      progress: 100,
      locked: false
    },
    {
      id: '5',
      name: 'Supplier Contract SC-2024-001',
      status: 'Draft',
      priority: 'Medium',
      assignedTo: 'Tom Brown',
      dueDate: '2024-03-01',
      progress: 15,
      locked: false
    }
  ]);

  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Table context handlers
  const tableContext: Partial<TableContext> = {
    onEditRow: useCallback((row: DemoRow) => {
      console.log(`Editing row: ${row.name}`);
      // In a real app, this would open an edit modal
    }, []),

    onDeleteRow: useCallback((row: DemoRow) => {
      if (confirm(`Are you sure you want to delete "${row.name}"?`)) {
        setData(prev => prev.filter(item => item.id !== row.id));
        console.log(`Deleted: ${row.name}`);
      }
    }, []),

    onDuplicateRow: useCallback((row: DemoRow) => {
      const newRow = {
        ...row,
        id: `${row.id}-copy`,
        name: `${row.name} (Copy)`,
        status: 'Draft'
      };
      setData(prev => [...prev, newRow]);
      console.log(`Duplicated: ${row.name}`);
    }, []),

    onViewDetails: useCallback((row: DemoRow) => {
      console.log(`Viewing details for: ${row.name}`);
      // In a real app, this would open a details modal
    }, []),

    onAddNote: useCallback((row: DemoRow) => {
      const note = prompt(`Add note for "${row.name}":`);
      if (note) {
        console.log(`Note added to: ${row.name}`);
      }
    }, []),

    onExport: useCallback((format: string, rows?: DemoRow[]) => {
      const exportData = rows || data;
      console.log(`Exporting ${exportData.length} rows as ${format.toUpperCase()}`);
      // In a real app, this would trigger file download
    }, [data]),

    onAssignUser: useCallback((rows: DemoRow[]) => {
      const user = prompt(`Assign ${rows.length} items to user:`);
      if (user) {
        setData(prev => prev.map(row => 
          rows.some(r => r.id === row.id) 
            ? { ...row, assignedTo: user }
            : row
        ));
        console.log(`Assigned ${rows.length} items to ${user}`);
      }
    }, []),

    onChangeStatus: useCallback((rows: DemoRow[], status: string) => {
      setData(prev => prev.map(row => 
        rows.some(r => r.id === row.id) 
          ? { ...row, status }
          : row
      ));
      console.log(`Changed status of ${rows.length} items to ${status}`);
    }, []),

    onBulkUpdate: useCallback((rows: DemoRow[], field: string, value: any) => {
      setData(prev => prev.map(row => 
        rows.some(r => r.id === row.id) 
          ? { ...row, [field]: value }
          : row
      ));
      console.log(`Updated ${field} for ${rows.length} items`);
    }, []),

    onSort: useCallback((column: string, direction: 'asc' | 'desc') => {
      setSortKey(column);
      setSortDirection(direction);
      console.log(`Sorted by ${column} (${direction})`);
    }, []),

    onHideColumn: useCallback((column: string) => {
      console.log(`Hidden column: ${column}`);
      // In a real app, this would hide the column
    }, []),

    onFilterByColumn: useCallback((column: string, value: any) => {
      console.log(`Filtering by ${column}: ${value}`);
      // In a real app, this would apply the filter
    }, []),

    onGroupByColumn: useCallback((column: string) => {
      console.log(`Grouped by: ${column}`);
      // In a real app, this would group the data
    }, []),

    onResizeColumn: useCallback((column: string, width: number) => {
      console.log(`Resized column ${column} to ${width}px`);
      // In a real app, this would resize the column
    }, []),

    onRefresh: useCallback(() => {
      console.log('Table refreshed');
      // In a real app, this would reload data
    }, []),

    onTogglePagination: useCallback(() => {
      console.log('Toggled pagination');
      // In a real app, this would toggle pagination
    }, []),

    onCustomizeColumns: useCallback(() => {
      console.log('Opening column customization');
      // In a real app, this would open column settings
    }, []),

    onSaveView: useCallback(() => {
      console.log('View saved');
      // In a real app, this would save the current view
    }, []),

    isRowLocked: useCallback((row: DemoRow) => {
      return row.locked || false;
    }, []),

    canEdit: useCallback((row: DemoRow) => {
      return !row.locked;
    }, []),

    canDelete: useCallback((row: DemoRow) => {
      return !row.locked && row.status !== 'Completed';
    }, [])
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      width: 250,
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      width: 120,
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Completed' ? 'bg-green-100 text-green-800' :
          value === 'In Progress' ? 'bg-blue-100 text-blue-800' :
          value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          value === 'Approved' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      width: 100,
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'High' ? 'bg-red-100 text-red-800' :
          value === 'Medium' ? 'bg-orange-100 text-orange-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      width: 150,
      sortable: true
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      width: 120,
      sortable: true
    },
    {
      key: 'progress',
      header: 'Progress',
      width: 120,
      sortable: true,
      render: (value: number) => (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${value}%` }}
          />
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Context Menu Demo
        </h1>
        <p className="text-gray-600">
          Right-click on rows, columns, or the table area to see context menus in action.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          🎯 Context Menu Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-1">Row Actions:</h4>
            <ul className="space-y-1">
              <li>• Edit Row (Ctrl+E)</li>
              <li>• View Details (Ctrl+D)</li>
              <li>• Duplicate Row (Ctrl+Shift+D)</li>
              <li>• Add Note (Ctrl+N)</li>
              <li>• Delete Row (Del)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-1">Column Actions:</h4>
            <ul className="space-y-1">
              <li>• Sort Ascending/Descending</li>
              <li>• Filter by Column (Ctrl+F)</li>
              <li>• Group by Column (Ctrl+G)</li>
              <li>• Hide Column (Ctrl+H)</li>
              <li>• Resize Column</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-1">Table Actions:</h4>
            <ul className="space-y-1">
              <li>• Refresh Table (F5)</li>
              <li>• Export (CSV, Excel, PDF)</li>
              <li>• Bulk Operations</li>
              <li>• Customize Columns</li>
              <li>• Save View (Ctrl+S)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-1">Smart Features:</h4>
            <ul className="space-y-1">
              <li>• Context-aware menus</li>
              <li>• Keyboard shortcuts</li>
              <li>• Undo functionality</li>
              <li>• Multi-select support</li>
              <li>• Accessibility support</li>
            </ul>
          </div>
        </div>
      </div>

      <OptimizedTable
        data={data}
        columns={columns}
        height={400}
        sortKey={sortKey}
        sortDirection={sortDirection}
        tableContext={tableContext}
        enableContextMenu={true}
        className="shadow-lg"
      />

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          📝 Instructions
        </h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Row Context Menu:</strong> Right-click on any row to edit, delete, duplicate, or add notes.</p>
          <p><strong>Column Context Menu:</strong> Right-click on column headers to sort, filter, or hide columns.</p>
          <p><strong>Table Context Menu:</strong> Right-click in empty table areas to refresh, export, or customize.</p>
          <p><strong>Multi-select:</strong> Hold Ctrl/Cmd to select multiple rows for bulk operations.</p>
          <p><strong>Keyboard Shortcuts:</strong> Use the shortcuts shown in the context menus for quick access.</p>
        </div>
      </div>
    </div>
  );
};

export default ContextMenuDemo; 