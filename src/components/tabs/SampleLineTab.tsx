import React, { memo } from 'react';
import DataTable from '../DataTable';
import { TableColumn } from '../../types/productManager';
import { SampleLineData } from '../../data/productManagerData';

function toTitleCase(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

interface SampleLineTabProps {
  selectedRowId?: string | null;
  onRowClick?: (row: any) => void;
}

const SampleLineTab: React.FC<SampleLineTabProps> = memo(({
  selectedRowId,
  onRowClick
}) => {
  const columns: TableColumn[] = [
    { key: 'sampleRequest', label: 'Sample Request' },
    { key: 'product', label: 'Product' },
    { key: 'sampleRequestLine', label: 'Sample Request Line' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'fitComment', label: 'Fit Comment' },
    { key: 'fitLogStatus', label: 'Fit Log Status' },
    { key: 'fitLogType', label: 'Fit Log Type' },
    { key: 'fitLogName', label: 'Fit Log Name' },
    { key: 'customer', label: 'Customer' },
    { key: 'collection', label: 'Collection' },
    { key: 'division', label: 'Division' },
    { key: 'group', label: 'Group' },
    { key: 'transportMethod', label: 'Transport Method' },
    { key: 'deliverTo', label: 'Deliver To' },
    { key: 'status', label: 'Status' },
    { key: 'exFactory', label: 'Ex Factory' },
    { key: 'comments', label: 'Comments' },
    { key: 'sellingQuantity', label: 'Selling Quantity' },
    { key: 'closedDate', label: 'Closed Date' },
    { key: 'linePurchasePrice', label: 'Line Purchase Price' },
    { key: 'lineSellingPrice', label: 'Line Selling Price' },
    { key: 'noteCount', label: 'Note Count' },
    { key: 'latestNote', label: 'Latest Note' },
    { key: 'orderQuantityIncrement', label: 'Order Quantity Increment' },
    { key: 'orderLeadTime', label: 'Order Lead Time' },
    { key: 'supplierRef', label: 'Supplier Ref' },
    { key: 'standardMinuteValue', label: 'Standard Minute Value' },
    { key: 'template', label: 'Template' },
    { key: 'requestDate', label: 'Request Date' },
    { key: 'sampleRequestStatus', label: 'Sample Request Status' },
    { key: 'supplierPurchaseCurrency', label: 'Supplier Purchase Currency' },
    { key: 'customerSellingCurrency', label: 'Customer Selling Currency' },
    { key: 'sellingCurrency', label: 'Selling Currency' },
    { key: 'minimumOrderQuantity', label: 'Minimum Order Quantity' },
    { key: 'productDescription', label: 'Product Description' },
    { key: 'productType', label: 'Product Type' },
    { key: 'productSubType', label: 'Product Sub Type' },
    { key: 'productStatus', label: 'Product Status' },
    { key: 'productBuyerStyleName', label: 'Product Buyer Style Name' },
    { key: 'productBuyerStyleNumber', label: 'Product Buyer Style Number' },
    { key: 'costing', label: 'Costing' },
    { key: 'costingPurchaseCurrency', label: 'Costing Purchase Currency' },
    { key: 'costingSellingCurrency', label: 'Costing Selling Currency' },
    { key: 'costingStatus', label: 'Costing Status' },
    { key: 'supplierPaymentTerm', label: 'Supplier Payment Term' },
    { key: 'supplierPaymentTermDescription', label: 'Supplier Payment Term Description' },
    { key: 'productSupplierPurchasePaymentTerm', label: 'Product Supplier Purchase Payment Term' },
    { key: 'productSupplierPurchasePaymentTermDescription', label: 'Product Supplier Purchase Payment Term Description' },
    { key: 'sampleSellingPaymentTerm', label: 'Sample Selling Payment Term' },
    { key: 'sampleSellingPaymentTermDescription', label: 'Sample Selling Payment Term Description' },
    { key: 'productSupplierSellingPaymentTerm', label: 'Product Supplier Selling Payment Term' },
    { key: 'productSupplierSellingPaymentTermDescription', label: 'Product Supplier Selling Payment Term Description' },
    { key: 'purchasePrice', label: 'Purchase Price' },
    { key: 'sellingPrice', label: 'Selling Price' },
    { key: 'productionDevelopment', label: 'Production Development' },
    { key: 'chinaQc', label: 'China Qc' },
    { key: 'mlaPurchasing', label: 'Mla Purchasing' },
    { key: 'production', label: 'Production' },
    { key: 'srKeyUser5', label: 'Sr Key User 5' },
    { key: 'srKeyUser6', label: 'Sr Key User 6' },
    { key: 'srKeyUser7', label: 'Sr Key User 7' },
    { key: 'srKeyUser8', label: 'Sr Key User 8' },
    { key: 'season', label: 'Season' },
    { key: 'customerParent', label: 'Customer Parent' },
    { key: 'recipientProductSupplierFactory', label: 'Recipient Product Supplier Factory' },
    { key: 'fgPoNumber', label: 'Fg Po Number' },
    { key: 'received', label: 'Received' },
    { key: 'balance', label: 'Balance' },
    { key: 'overReceived', label: 'Over Received' },
    { key: 'size', label: 'Size' },
    { key: 'productTechPackVersion', label: 'Product Tech Pack Version' },
    { key: 'mainMaterial', label: 'Main Material' },
    { key: 'mainMaterialDescription', label: 'Main Material Description' },
    { key: 'deliveryContact', label: 'Delivery Contact' },
    { key: 'srKeyWorkingGroup1', label: 'Sr Key Working Group 1' },
    { key: 'srKeyWorkingGroup2', label: 'Sr Key Working Group 2' },
    { key: 'srKeyWorkingGroup3', label: 'Sr Key Working Group 3' },
    { key: 'srKeyWorkingGroup4', label: 'Sr Key Working Group 4' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'lastEdited', label: 'Last Edited' },
    { key: 'lastEditedBy', label: 'Last Edited By' },
    { key: 'color', label: 'Color' },
    { key: 'm88Awb', label: 'M88 Awb' },
    { key: 'mloAwb', label: 'Mlo Awb' },
    { key: 'shipmentId', label: 'Shipment Id' },
    { key: 'quickbooksInvoice', label: 'Quickbooks Invoice' },
    { key: 'suppliersInvPayment', label: 'Suppliers Inv Payment' },
    { key: 'discountPercentage', label: 'Discount Percentage' },
    { key: 'sellIncComm', label: 'Sell Inc Comm' },
    { key: 'buyerSurcharge', label: 'Buyer Surcharge' },
    { key: 'buyerSurchargePercentage', label: 'Buyer Surcharge Percentage' },
    { key: 'moq', label: 'Moq' },
    { key: 'discountCost', label: 'Discount Cost' },
    { key: 'specialSur', label: 'Special Sur' },
    { key: 'factorySurcharge', label: 'Factory Surcharge' },
    { key: 'factorySurchargePercentage', label: 'Factory Surcharge Percentage' },
    { key: 'customerProtoApprovalTargetDate', label: 'Target Date', parent: 'customerProtoApproval' },
    { key: 'customerProtoApprovalCompletedDate', label: 'Completed Date', parent: 'customerProtoApproval' },
    { key: 'topSampleExM88TargetDate', label: 'Target Date', parent: 'topSampleExM88' },
    { key: 'topSampleExM88CompletedDate', label: 'Completed Date', parent: 'topSampleExM88' },
    { key: 'topSampleExFactoryTargetDate', label: 'Target Date', parent: 'topSampleExFactory' },
    { key: 'topSampleExFactoryCompletedDate', label: 'Completed Date', parent: 'topSampleExFactory' },
    { key: 'topSampleRequestTargetDate', label: 'Target Date', parent: 'topSampleRequest' },
    { key: 'topSampleRequestCompletedDate', label: 'Completed Date', parent: 'topSampleRequest' },
    { key: 'ppsSampleExM88TargetDate', label: 'Target Date', parent: 'ppsSampleExM88' },
    { key: 'ppsSampleExM88CompletedDate', label: 'Completed Date', parent: 'ppsSampleExM88' },
    { key: 'ppsSampleExFactoryTargetDate', label: 'Target Date', parent: 'ppsSampleExFactory' },
    { key: 'ppsSampleExFactoryCompletedDate', label: 'Completed Date', parent: 'ppsSampleExFactory' },
    { key: 'ppsSampleRequestTargetDate', label: 'Target Date', parent: 'ppsSampleRequest' },
    { key: 'ppsSampleRequestCompletedDate', label: 'Completed Date', parent: 'ppsSampleRequest' },
    { key: 'testReportReceivedTargetDate', label: 'Target Date', parent: 'testReportReceived' },
    { key: 'testReportReceivedCompletedDate', label: 'Completed Date', parent: 'testReportReceived' },
    { key: 'testSampleExFactoryTargetDate', label: 'Target Date', parent: 'testSampleExFactory' },
    { key: 'testSampleExFactoryCompletedDate', label: 'Completed Date', parent: 'testSampleExFactory' },
    { key: 'testingSampleRequestTargetDate', label: 'Target Date', parent: 'testingSampleRequest' },
    { key: 'testingSampleRequestCompletedDate', label: 'Completed Date', parent: 'testingSampleRequest' },
    { key: 'protoSampleRequestTargetDate', label: 'Target Date', parent: 'protoSampleRequest' },
    { key: 'protoSampleRequestCompletedDate', label: 'Completed Date', parent: 'protoSampleRequest' },
    { key: 'protoSampleExFactoryTargetDate', label: 'Target Date', parent: 'protoSampleExFactory' },
    { key: 'protoSampleExFactoryCompletedDate', label: 'Completed Date', parent: 'protoSampleExFactory' },
    { key: 'protoSampleExM88TargetDate', label: 'Target Date', parent: 'protoSampleExM88' },
    { key: 'protoSampleExM88CompletedDate', label: 'Completed Date', parent: 'protoSampleExM88' },
    { key: 'customerPpsApprovalTargetDate', label: 'Target Date', parent: 'customerPpsApproval' },
    { key: 'customerPpsApprovalCompletedDate', label: 'Completed Date', parent: 'customerPpsApproval' },
    { key: 'customerTopApprovalTargetDate', label: 'Target Date', parent: 'customerTopApproval' },
    { key: 'customerTopApprovalCompletedDate', label: 'Completed Date', parent: 'customerTopApproval' },
    { key: 'sampleDeliveryDateTargetDate', label: 'Target Date', parent: 'sampleDeliveryDate' },
    { key: 'sampleDeliveryDateCompletedDate', label: 'Completed Date', parent: 'sampleDeliveryDate' },
  ];

  return (
      <div className="relative w-full overflow-x-auto border border-gray-200 rounded">
        <div className="max-w-[800px]">
          <table className="table-auto border-collapse text-xs w-max">
            <thead>
              {/* First row — group headers and standalone column headers */}
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

                  // First: standalone columns (rowSpan=2)
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

                  // Second: grouped columns (render group headers here, sub-columns in next row)
                  const groupHeaders = Object.keys(groupMap).map((groupKey) => {
                      const group = columns.find(c => c.key === groupKey);
                      const colSpan = groupMap[groupKey].length;

                      return (
                      <th
                          key={groupKey}
                          colSpan={colSpan}
                          className="px-4 py-2 text-center border border-gray-300 font-medium bg-gray-200 whitespace-nowrap"
                      >
                          {group?.label || toTitleCase(groupKey)}
                      </th>
                      );
                  });

                  return [...standaloneHeaders, ...groupHeaders];
                  })()}
              </tr>

              {/* Second row — sub-columns for grouped headers */}
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
              {SampleLineData.map((row, rowIndex) => (
                <tr
                  key={row.sampleRequest || rowIndex}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedRowId === row.sampleRequest ? 'bg-blue-50' : ''
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

SampleLineTab.displayName = 'SampleLineTab';

export default SampleLineTab; 