import React, { memo } from 'react';
import { TableColumn, TableRow, TableProps } from '../types/productManager';

const DataTable: React.FC<TableProps> = memo(({
  columns,
  data,
  loading = false,
  error = null,
  onRowClick,
  selectedRowId
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        <span>Error: {error}</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <span>No data available</span>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                                className={`px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.width ? `w-${column.width}` : ''
                } ${column.align ? `text-${column.align}` : 'text-left'}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr
              key={row.id}
              className={`hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                selectedRowId === row.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={`${row.id}-${column.key}`}
                                  className={`px-2 py-2 whitespace-nowrap text-xs text-gray-900 ${
                  column.align ? `text-${column.align}` : 'text-left'
                }`}
                >
                  {renderCellValue(row[column.key], column.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

// Helper function to render different types of cell values
const renderCellValue = (value: any, key: string) => {
  if (value === null || value === undefined) {
    return '-';
  }

  // Handle boolean values
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  // Handle currency values
  if (typeof value === 'number' && key.toLowerCase().includes('price')) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  // Handle percentage values
  if (typeof value === 'number' && key.toLowerCase().includes('percentage')) {
    return `${value}%`;
  }

  // Handle status values with badges
  if (typeof value === 'string' && key.toLowerCase().includes('status')) {
    const statusColors = {
      'active': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-blue-100 text-blue-800',
      'approved': 'bg-green-100 text-green-800',
      'in progress': 'bg-yellow-100 text-yellow-800',
      'default': 'bg-gray-100 text-gray-800'
    };

    const colorClass = statusColors[value.toLowerCase()] || statusColors.default;
    
    return (
      <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full ${colorClass}`}>
        {value}
      </span>
    );
  }

  // Handle available/boolean-like strings
  if (typeof value === 'string' && (value.toLowerCase() === 'yes' || value.toLowerCase() === 'no')) {
    const colorClass = value.toLowerCase() === 'yes' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
        {value}
      </span>
    );
  }

  // Default case - return as string
  return String(value);
};

DataTable.displayName = 'DataTable';

export default DataTable; 