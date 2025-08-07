import React, { memo } from 'react';
import { TableColumn } from '../../types/productManager';
import { productsData } from '../../data/productManagerData';

function toTitleCase(str: string) {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  }

interface ProductsTabProps {
  selectedRowId?: string | null;
  onRowClick?: (row: any) => void;
}

const ProductsTab: React.FC<ProductsTabProps> = memo(({ selectedRowId, onRowClick }) => {
    const columns: TableColumn[] = [
        { key: 'm88Ref', label: 'M88 Ref' },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status' },
        { key: 'sizeSet', label: 'Size Set' },
        { key: 'commodityCode', label: 'Commodity Code' },
        { key: 'comments', label: 'Comments' },
        { key: 'closedDate', label: 'Closed Date' },
        { key: 'template', label: 'Template' },
        { key: 'receiveTechPack', label: 'Receive Tech Pack' },
        { key: 'costingReference', label: 'Costing Reference' },
        { key: 'purchasePrice', label: 'Purchase Price' },
        { key: 'sellingPrice', label: 'Selling Price' },
        { key: 'costingPurchaseCurrency', label: 'Costing Purchase Currency' },
        { key: 'costingSellingCurrency', label: 'Costing Selling Currency' },
        { key: 'supplier', label: 'Supplier' },
        { key: 'costingType', label: 'Costing Type' },
        { key: 'costingStatus', label: 'Costing Status' },
        { key: 'location', label: 'Location' },
        { key: 'countryOfOrigin', label: 'Country of Origin' },
        { key: 'standardMinuteValue', label: 'Standard Minute Value' },
        { key: 'minimumSellingPrice', label: 'Minimum Selling Price' },
        { key: 'maximumSellingPrice', label: 'Maximum Selling Price' },
        { key: 'minimumPurchasePrice', label: 'Minimum Purchase Price' },
        { key: 'maximumPurchasePrice', label: 'Maximum Purchase Price' },
        { key: 'productColorCountPerProduct', label: 'Product Color Count Per Product' },
        { key: 'productType', label: 'Product Type' },
        { key: 'productSubType', label: 'Product Sub Type' },
        { key: 'collection', label: 'Collection' },
        { key: 'division', label: 'Division' },
        { key: 'group', label: 'Group' },
        { key: 'season', label: 'Season' },
        { key: 'productDevelopment', label: 'Product Development' },
        { key: 'production', label: 'Production' },
        { key: 'techDesign', label: 'Tech Design' },
        { key: 'chinaQc', label: 'China - QC' },
        { key: 'productKeyUser5', label: 'Product Key User 5' },
        { key: 'productKeyUser6', label: 'Product Key User 6' },
        { key: 'productKeyUser7', label: 'Product Key User 7' },
        { key: 'productKeyUser8', label: 'Product Key User 8' },
        { key: 'originalProductName', label: 'Original Product Name' },
        { key: 'originalProductSeason', label: 'Original Product Season' },
        { key: 'noteCount', label: 'Note Count' },
        { key: 'latestNote', label: 'Latest Note' },
        { key: 'buyerStyleName', label: 'Buyer Style Name' },
        { key: 'supplierRef', label: 'Supplier Ref.' },
        { key: 'buyerStyleNumber', label: 'Buyer Style Number' },
        { key: 'purchasePaymentTerm', label: 'Purchase Payment Term' },
        { key: 'purchasePaymentTermDescription', label: 'Purchase Payment Term Description' },
        { key: 'sellingPaymentTerm', label: 'Selling Payment Term' },
        { key: 'sellingPaymentTermDescription', label: 'Selling Payment Term Description' },
        { key: 'mainMaterial', label: 'Main Material' },
        { key: 'mainMaterialDescription', label: 'Main Material Description' },
        { key: 'mainMaterialStatus', label: 'Main Material Status' },
        { key: 'composition', label: 'Composition' },
        { key: 'blockProduct', label: 'Block Product' },
        { key: 'productKeyWorkingGroup1', label: 'Product Key Working Group 1' },
        { key: 'productKeyWorkingGroup2', label: 'Product Key Working Group 2' },
        { key: 'productKeyWorkingGroup3', label: 'Product Key Working Group 3' },
        { key: 'productKeyWorkingGroup4', label: 'Product Key Working Group 4' },
        { key: 'palette', label: 'Palette' },
        { key: 'createdBy', label: 'Created By' },
        { key: 'created', label: 'Created' },
        { key: 'lastEdited', label: 'Last Edited' },
        { key: 'lastEditedBy', label: 'Last Edited By' },
        { key: 'color', label: 'Color' },
        { key: 'customer', label: 'Customer' },
        { key: 'department', label: 'Department' },
        { key: 'customerParent', label: 'Customer Parent' },
        { key: 'buyerSeason', label: 'Buyer Season' },
        { key: 'lookbook', label: 'Lookbook' },
        { key: 'finishedGoodTestingStatus', label: 'Finished Good Testing Status' },
        { key: 'sampleSentDate', label: 'Sample Sent Date' },
        { key: 'buyerComments', label: 'Buyer Comments' },
        { key: 'factoryComments', label: 'Factory Comments' },
        { key: 'receiveTechpackTargetDate', label: 'Target Date', parent: 'Receive Techpack' },
        { key: 'receiveTechpackCompletedDate', label: 'Completed Date', parent: 'Receive Techpack' },
        { key: 'protoApprovalTargetDate', label: 'Target Date', parent: 'Proto Approval' },
        { key: 'protoApprovalCompletedDate', label: 'Completed Date', parent: 'Proto Approval' },
        { key: 'colorApprovalTargetDate', label: 'Target Date', parent: 'Color Approval' },
        { key: 'colorApprovalCompletedDate', label: 'Completed Date', parent: 'Color Approval' },
        { key: 'costApprovalTargetDate', label: 'Target Date', parent: 'Cost Approval' },
        { key: 'costApprovalCompletedDate', label: 'Completed Date', parent: 'Cost Approval' },
        { key: 'linkToProdTargetDate', label: 'Target Date', parent: 'Link To Prod' },
        { key: 'linkToProdCompletedDate', label: 'Completed Date', parent: 'Link To Prod' },
        { key: 'apTestTargetDate', label: 'Target Date', parent: 'AP Test' },
        { key: 'apTestCompletedDate', label: 'Completed Date', parent: 'AP Test' }
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
                {productsData.map((row, rowIndex) => (
                  <tr
                    key={row.m88Ref || rowIndex}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedRowId === row.m88Ref ? 'bg-blue-50' : ''
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

ProductsTab.displayName = 'ProductsTab';

export default ProductsTab; 