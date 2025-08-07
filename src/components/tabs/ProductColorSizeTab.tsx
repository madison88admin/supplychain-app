import React, { memo } from 'react';
import { TableColumn } from '../../types/productManager';
import { productColorSizesData } from '../../data/productManagerData';

function toTitleCase(str: string) {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  }

interface ProductsColorTabSizeProps {
  selectedRowId?: string | null;
  onRowClick?: (row: any) => void;
}

const ProductsColorTabSize: React.FC<ProductsColorTabSizeProps> = memo(({ selectedRowId, onRowClick }) => {
    const columns: TableColumn[] = [
        { key: 'product', label: 'Product' },
  { key: 'productDescription', label: 'Product Description' },
  { key: 'name', label: 'Name' },
  { key: 'size', label: 'Size' },
  { key: 'productType', label: 'Product Type' },
  { key: 'ratio', label: 'Ratio' },
  { key: 'color', label: 'Color' },
  { key: 'customer', label: 'Customer' },
  { key: 'customerParent', label: 'Customer Parent' },
  { key: 'department', label: 'Department' },
  { key: 'sizeSet', label: 'Size Set' },
  { key: 'closedDate', label: 'Closed Date' },
  { key: 'active', label: 'Active' },
  { key: 'collection', label: 'Collection' },
  { key: 'division', label: 'Division' },
  { key: 'group', label: 'Group' },
  { key: 'season', label: 'Season' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'colorDescription', label: 'Color Description' },
  { key: 'colorFamily', label: 'Color Family' },
  { key: 'colorStandard', label: 'Color Standard' },
  { key: 'colorExternalRef', label: 'Color External Ref.' },
  { key: 'colorExternalRef2', label: 'Color External Ref 2.' },
  { key: 'upc', label: 'UPC' },
  { key: 'ean', label: 'EAN' }
      ];

      return (
        <div className="relative w-full overflow-x-auto border border-gray-200 rounded">
          <div className="max-w-[800px]">
            <table className="table-auto border-collapse text-xs w-max">
              <thead>
                <tr className="bg-gray-100">
                  {(() => {
                    const groupMap: { [parent: string]: TableColumn[] } = {};
                    const standaloneCols: TableColumn[] = [];
    
                    columns.forEach((col) => {
                      if (col.parent) {
                        if (!groupMap[col.parent]) groupMap[col.parent] = [];
                        groupMap[col.parent].push(col);
                      } else if (!columns.find(c => c.parent === col.key)) {
                        standaloneCols.push(col);
                      }
                    });
    
                    const standaloneHeaders = standaloneCols.map((col, index) => (
                      <th
                        key={col.key}
                        rowSpan={2}
                        className={`px-4 py-2 text-left border border-gray-300 font-medium whitespace-nowrap ${
                          index === 0 ? 'sticky left-0 bg-white z-10' : ''
                        }`}
                      >
                        {col.label}
                      </th>
                    ));
    
                    const groupHeaders = Object.keys(groupMap).map((groupKey) => {
                      const colSpan = groupMap[groupKey].length;
    
                      return (
                        <th
                          key={groupKey}
                          colSpan={colSpan}
                          className="px-4 py-2 text-center border border-gray-300 font-medium bg-gray-200 whitespace-nowrap"
                        >
                          {toTitleCase(groupKey)}
                        </th>
                      );
                    });
    
                    return [...standaloneHeaders, ...groupHeaders];
                  })()}
                </tr>
    
                <tr className="bg-gray-100">
                  {(() => {
                    const groupMap: { [parent: string]: TableColumn[] } = {};
                    columns.forEach((col) => {
                      if (col.parent) {
                        if (!groupMap[col.parent]) groupMap[col.parent] = [];
                        groupMap[col.parent].push(col);
                      }
                    });
    
                    return Object.values(groupMap).flat().map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-2 text-left border border-gray-300 font-medium whitespace-nowrap"
                      >
                        {col.label}
                      </th>
                    ));
                  })()}
                </tr>
              </thead>
              <tbody>
                {productColorSizesData.map((row, rowIndex) => (
                  <tr
                    key={row.season || rowIndex}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedRowId === row.season ? 'bg-blue-50' : ''
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
        </div>
      );
    });

ProductsColorTabSize.displayName = 'ProductsColorTabSize';

export default ProductsColorTabSize; 