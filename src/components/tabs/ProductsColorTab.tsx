import React, { memo } from 'react';
import { TableColumn } from '../../types/productManager';
import { productColorsData } from '../../data/productManagerData';

function toTitleCase(str: string) {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  }

interface ProductsColorTabProps {
  selectedRowId?: string | null;
  onRowClick?: (row: any) => void;
}

const ProductsColorTab: React.FC<ProductsColorTabProps> = memo(({ selectedRowId, onRowClick }) => {
    const columns: TableColumn[] = [
        { key: 'season', label: 'Season' },
        { key: 'product', label: 'Product' },
        { key: 'productDescription', label: 'Product Description' },
        { key: 'supplier', label: 'Supplier' },
        { key: 'buyerStyleName', label: 'Buyer Style Name' },
        { key: 'supplierRef', label: 'Supplier Ref.' },
        { key: 'buyerStyleNumber', label: 'Buyer Style Number' },
        { key: 'active', label: 'Active' },
        { key: 'status', label: 'Status' },
        { key: 'productType', label: 'Product Type' },
        { key: 'productSubType', label: 'Product Sub Type' },
        { key: 'collection', label: 'Collection' },
        { key: 'division', label: 'Division' },
        { key: 'group', label: 'Group' },
        { key: 'template', label: 'Template' },
        { key: 'productColorKeyDate', label: 'Product Color Key Date' },
        { key: 'closedDate', label: 'Closed Date' },
        { key: 'color', label: 'Color' },
        { key: 'colorDescription', label: 'Color Description' },
        { key: 'colorFamily', label: 'Color Family' },
        { key: 'colorStandard', label: 'Color Standard' },
        { key: 'colorExternalRef', label: 'Color External Ref.' },
        { key: 'colorExternalRef2', label: 'Color External Ref 2.' },
        { key: 'department', label: 'Department' },
        { key: 'customer', label: 'Customer' },
        { key: 'customerParent', label: 'Customer Parent' },
        { key: 'approvedToSMS', label: 'Approved to SMS' },
        { key: 'approvedToBulk', label: 'Approved to Bulk' },
        { key: 'inDevelopment', label: 'In development' },
        { key: 'buyerSeason', label: 'Buyer Season' },
        { key: 'lookbook', label: 'Lookbook' },
        { key: 'finishedGoodTestingStatus', label: 'Finished Good Testing Status' },
        { key: 'sampleSentDate', label: 'Sample Sent Date' },
        { key: 'buyerComments', label: 'Buyer Comments' },
        { key: 'factoryComments', label: 'Factory Comments' },
        { key: 'colourwayApprovalTargetDate', label: 'Target Date', parent: 'Colourway Approval' },
        { key: 'colourwayApprovalCompletedDate', label: 'Completed Date', parent: 'Colourway Approval' },
        { key: 'productLinkTargetDate', label: 'Target Date', parent: 'Product Link' },
        { key: 'productLinkCompletedDate', label: 'Completed Date', parent: 'Product Link' }
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
                {productColorsData.map((row, rowIndex) => (
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

ProductsColorTab.displayName = 'ProductsColorTab';

export default ProductsColorTab; 