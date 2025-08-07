import React, { memo } from 'react';
import { TableColumn } from '../../types/productManager';
import { billOfMaterialsData } from '../../data/productManagerData';

function toTitleCase(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

interface BOMTabProps {
  selectedRowId?: string | null;
  onRowClick?: (row: any) => void;
}

const BOMTab: React.FC<BOMTabProps> = memo(({ selectedRowId, onRowClick }) => {
    const columns: TableColumn[] = [
        { key: 'productName', label: 'Product Name' },
        { key: 'billOfMaterialCategory', label: 'Bill Of Material Category' },
        { key: 'material', label: 'Material' },
        { key: 'comment', label: 'Comment' },
        { key: 'customText1', label: 'Custom Text 1' },
        { key: 'customText2', label: 'Custom Text 2' },
        { key: 'customText3', label: 'Custom Text 3' },
        { key: 'customText4', label: 'Custom Text 4' },
        { key: 'type', label: 'Type' },
        { key: 'sizeSet', label: 'Size Set' },
        { key: 'productStatus', label: 'Product Status' },
        { key: 'materialStatus', label: 'Material Status' },
        { key: 'template', label: 'Template' },
        { key: 'season', label: 'Season' },
        { key: 'customer', label: 'Customer' },
        { key: 'collection', label: 'Collection' },
        { key: 'divisionName', label: 'Division Name' },
        { key: 'group', label: 'Group' },
        { key: 'phase', label: 'Phase' },
        { key: 'billOfMaterialStatus', label: 'Bill Of Material Status' },
        { key: 'versionNumber', label: 'Version Number' },
        { key: 'versionComment', label: 'Version Comment' },
        { key: 'materialUsage', label: 'Material Usage' },
        { key: 'materialSize', label: 'Material Size' },
        { key: 'materialDescription', label: 'Material Description' },
        { key: 'materialSeason', label: 'Material Season' },
        { key: 'noteCount', label: 'Note Count' },
        { key: 'latestNote', label: 'Latest Note' },
        { key: 'mainMaterial', label: 'Main Material' },
        { key: 'categorySequence', label: 'Category Sequence' },
        { key: 'composition', label: 'Composition' },
        { key: 'buyerStyleName', label: 'Buyer Style Name' },
        { key: 'supplierRef', label: 'Supplier Ref.' },
        { key: 'buyerStyleNumber', label: 'Buyer Style Number' },
        { key: 'billOfMaterialLineRef', label: 'Bill of Material Line Ref.' },
        { key: 'defaultMaterialColorColor', label: 'Default Material Color Color' },
        { key: 'techPackReceivedTargetDate', label: 'Target Date', parent: 'Tech Pack Received' },
        { key: 'techPackReceivedCompletedDate', label: 'Completed Date', parent: 'Tech Pack Received' },
        { key: 'labDipRequestTargetDate', label: 'Target Date', parent: 'Lab Dip Request' },
        { key: 'labDipRequestCompletedDate', label: 'Completed Date', parent: 'Lab Dip Request' },
        { key: 'labDipApprovedTargetDate', label: 'Target Date', parent: 'Lab Dip Approved' },
        { key: 'labDipApprovedCompletedDate', label: 'Completed Date', parent: 'Lab Dip Approved' },
        { key: 'testingRequestTargetDate', label: 'Target Date', parent: 'Testing Request' },
        { key: 'testingRequestCompletedDate', label: 'Completed Date', parent: 'Testing Request' },
        { key: 'testingApprovedTargetDate', label: 'Target Date', parent: 'Testing Approved' },
        { key: 'testingApprovedCompletedDate', label: 'Completed Date', parent: 'Testing Approved' },
        { key: 'linkToColTargetDate', label: 'Target Date', parent: 'Link To Col' },
        { key: 'linkToColCompletedDate', label: 'Completed Date', parent: 'Link To Col' }
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
            {billOfMaterialsData.map((row, rowIndex) => (
              <tr
                key={row.Order || rowIndex}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedRowId === row.Order ? 'bg-blue-50' : ''
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

BOMTab.displayName = 'BOMTab';

export default BOMTab;
