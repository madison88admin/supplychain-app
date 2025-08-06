import React, { memo } from 'react';
import DataTable from '../DataTable';
import { TableColumn } from '../../types/productManager';
import { techPackVersionData } from '../../data/productManagerData';

interface TechPackVersionTabProps {
  selectedRowId?: string | null;
  onRowClick?: (row: any) => void;
}

const TechPackVersionTab: React.FC<TechPackVersionTabProps> = memo(({
  selectedRowId,
  onRowClick
}) => {
  const columns: TableColumn[] = [
    { key: 'product', label: 'PRODUCT' },
    { key: 'versionNumber', label: 'VERSION NUMBER' },
    { key: 'comment', label: 'COMMENT' },
    { key: 'billOfMaterialVersion', label: 'BILL OF MATERIAL VERSION' },
    { key: 'sizeSpecificationVersion', label: 'SIZE SPECIFICATION VERSION' },
    { key: 'careInstructionsVersion', label: 'CARE INSTRUCTIONS VERSION' },
    { key: 'fibreCompositionVersion', label: 'FIBRE COMPOSITION VERSION' },
    { key: 'labelVersion', label: 'LABEL VERSION' },
    { key: 'fitLog', label: 'FIT LOG' },
    { key: 'currentVersion', label: 'CURRENT VERSION' },
    { key: 'createdBy', label: 'CREATED BY' },
    { key: 'created', label: 'CREATED' }
  ];

  return (
      <div className="w-full overflow-x-auto border border-gray-200 rounded">
        <table className="min-w-[2000px] table-auto border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col, index) => (
                <th
                  key={col.key}
                  className={`px-4 py-2 text-left border border-gray-300 whitespace-nowrap font-medium ${
                    index === 0 ? 'sticky left-0 bg-white z-10' : ''
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {techPackVersionData.map((row, rowIndex) => (
              <tr
                key={row.product || rowIndex}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedRowId === row.product ? 'bg-blue-50' : ''
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2 border border-gray-200 whitespace-nowrap ${
                      colIndex === 0 ? 'sticky left-0 bg-white z-0' : ''
                    }`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
});

TechPackVersionTab.displayName = 'TechPackVersionTab';

export default TechPackVersionTab; 