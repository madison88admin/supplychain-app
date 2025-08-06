import React, { memo } from 'react';
import DataTable from '../DataTable';
import { TableColumn } from '../../types/productManager';
import { lineItemsData as SampleLineData } from '../../data/productManagerData';

function toTitleCase(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

interface LineItemTabProps {
  selectedRowId?: string | null;
  onRowClick?: (row: any) => void;
}

const LineItemTab: React.FC<LineItemTabProps> = memo(({ selectedRowId, onRowClick }) => {
    const columns: TableColumn[] = [
        { key: 'order', label: 'Order' },
        { key: 'product', label: 'Product' },
        { key: 'poLine', label: 'PO Line' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'fitComment', label: 'Fit Comment', parent: 'Fit Log' },
        { key: 'fitLogStatus', label: 'Fit Log Status', parent: 'Fit Log' },
        { key: 'fitLogType', label: 'Fit Log Type', parent: 'Fit Log' },
        { key: 'fitLogName', label: 'Fit Log Name', parent: 'Fit Log' },
        { key: 'customer', label: 'Customer', parent: 'Customer Info' },
        { key: 'collection', label: 'Collection', parent: 'Customer Info' },
        { key: 'division', label: 'Division', parent: 'Customer Info' },
        { key: 'group', label: 'Group', parent: 'Customer Info' },
        { key: 'transportMethod', label: 'Transport Method', parent: 'Delivery' },
        { key: 'deliverTo', label: 'Deliver To', parent: 'Delivery' },
        { key: 'status', label: 'Status', parent: 'Delivery' },
        { key: 'deliveryDate', label: 'Delivery Date', parent: 'Delivery' },
        { key: 'comments', label: 'Comments' },
        { key: 'sellingQuantity', label: 'Selling Quantity' },
        { key: 'closedDate', label: 'Closed Date' },
        { key: 'linePurchasePrice', label: 'Line Purchase Price', parent: 'Price Info' },
        { key: 'lineSellingPrice', label: 'Line Selling Price', parent: 'Price Info' },
        { key: 'noteCount', label: 'Note Count' },
        { key: 'latestNote', label: 'Latest Note' },
        { key: 'orderQuantityIncrement', label: 'Order Quantity Increment' },
        { key: 'orderLeadTime', label: 'Order Lead Time' },
        { key: 'supplierRef', label: 'Supplier Ref.', parent: 'Supplier Info' },
        { key: 'template', label: 'Template' },
        { key: 'exFactory', label: 'Ex-Factory', parent: 'Delivery' },
        { key: 'purchaseOrderStatus', label: 'Purchase Order Status' },
        { key: 'supplierPurchaseCurrency', label: 'Supplier Purchase Currency' },
        { key: 'customerSellingCurrency', label: 'Customer Selling Currency' },
        { key: 'supplier', label: 'Supplier', parent: 'Supplier Info' },
        { key: 'purchaseCurrency', label: 'Purchase Currency' },
        { key: 'sellingCurrency', label: 'Selling Currency' },
        { key: 'minimumOrderQuantity', label: 'Minimum Order Quantity' },
        { key: 'productDescription', label: 'Product Description', parent: 'Product Info' },
        { key: 'productType', label: 'Product Type', parent: 'Product Info' },
        { key: 'productSubType', label: 'Product Sub Type', parent: 'Product Info' },
        { key: 'productStatus', label: 'Product Status', parent: 'Product Info' },
        { key: 'productBuyerStyleName', label: 'Product Buyer Style Name', parent: 'Product Info' },
        { key: 'productBuyerStyleNumber', label: 'Product Buyer Style Number', parent: 'Product Info' },
        { key: 'standardMinuteValue', label: 'Standard Minute Value', parent: 'Product Info' },
        { key: 'costing', label: 'Costing', parent: 'Costing Info' },
        { key: 'costingPurchaseCurrency', label: 'Costing Purchase Currency', parent: 'Costing Info' },
        { key: 'costingSellingCurrency', label: 'Costing Selling Currency', parent: 'Costing Info' },
        { key: 'costingStatus', label: 'Costing Status', parent: 'Costing Info' },
        { key: 'supplierPaymentTerm', label: 'Supplier Payment Term', parent: 'Supplier Info' },
        { key: 'supplierPaymentTermDescription', label: 'Supplier Payment Term Description', parent: 'Supplier Info' },
        { key: 'orderPurchasePaymentTerm', label: 'Order Purchase Payment Term' },
        { key: 'orderPurchasePaymentTermDescription', label: 'Order Purchase Payment Term Description' },
        { key: 'productSupplierPurchasePaymentTerm', label: 'Product Supplier Purchase Payment Term', parent: 'Supplier Info' },
        { key: 'productSupplierPurchasePaymentTermDescription', label: 'Product Supplier Purchase Payment Term Description', parent: 'Supplier Info' },
        { key: 'orderSellingPaymentTerm', label: 'Order Selling Payment Term' },
        { key: 'orderSellingPaymentTermDescription', label: 'Order Selling Payment Term Description' },
        { key: 'productSupplierSellingPaymentTerm', label: 'Product Supplier Selling Payment Term', parent: 'Supplier Info' },
        { key: 'productSupplierSellingPaymentTermDescription', label: 'Product Supplier Selling Payment Term Description', parent: 'Supplier Info' },
        { key: 'purchasePrice', label: 'Purchase Price', parent: 'Price Info' },
        { key: 'sellingPrice', label: 'Selling Price', parent: 'Price Info' },
        { key: 'production', label: 'Production' },
        { key: 'mlaPurchasing', label: 'MLA - Purchasing' },
        { key: 'chinaQc', label: 'China - QC' },
        { key: 'mlaPlanning', label: 'MLA - Planning' },
        { key: 'mlaShipping', label: 'MLA - Shipping' },
        { key: 'poKeyUser6', label: 'PO Key User 6' },
        { key: 'poKeyUser7', label: 'PO Key User 7' },
        { key: 'poKeyUser8', label: 'PO Key User 8' },
        { key: 'season', label: 'Season' },
        { key: 'department', label: 'Department', parent: 'Product Info' },
        { key: 'customerParent', label: 'Customer Parent', parent: 'Customer Info' },
        { key: 'recipientProductSupplierFactory', label: 'RECIPIENT PRODUCT SUPPLIER-FACTORY' },
        { key: 'fgPoNumber', label: 'FG PO Number' },
        { key: 'received', label: 'Received' },
        { key: 'balance', label: 'Balance' },
        { key: 'overReceived', label: 'Over Received' },
        { key: 'size', label: 'Size', parent: 'Product Info' },
        { key: 'mainMaterial', label: 'Main Material', parent: 'Product Info' },
        { key: 'mainMaterialDescription', label: 'Main Material Description', parent: 'Product Info' },
        { key: 'deliveryContact', label: 'Delivery Contact', parent: 'Delivery' },
        { key: 'poKeyWorkingGroup1', label: 'PO Key Working Group 1' },
        { key: 'poKeyWorkingGroup2', label: 'PO Key Working Group 2' },
        { key: 'poKeyWorkingGroup3', label: 'PO Key Working Group 3' },
        { key: 'poKeyWorkingGroup4', label: 'PO Key Working Group 4' },
        { key: 'createdBy', label: 'Created By' },
        { key: 'created', label: 'Created' },
        { key: 'lastEdited', label: 'Last Edited' },
        { key: 'lastEditedBy', label: 'Last Edited By' },
        { key: 'color', label: 'Color', parent: 'Product Info' },
        { key: 'vesselSchedule', label: 'Vessel Schedule' },
        { key: 'buyerPoNumber', label: 'Buyer PO Number' },
        { key: 'shipmentId', label: 'Shipment ID' },
        { key: 'factoryInvoiced', label: 'Factory Invoiced' },
        { key: 'suppliersInvoice', label: 'Suppliers Invoice' },
        { key: 'quickBooksInvoice', label: 'QuickBooks Invoice' },
        { key: 'shipmentNoted', label: 'Shipment Noted' },
        { key: 'buyInformation', label: 'Buy Information' },
        { key: 'handlingCharges', label: 'Handling Charges', parent: 'Price Info' },
        { key: 'originalForecastQuantity', label: 'Original Forecast Quantity' },
        { key: 'startDate', label: 'Start Date' },
        { key: 'cancelledDate', label: 'Cancelled Date' },
        { key: 'factoryDatePaid', label: 'Factory Date Paid' },
        { key: 'dateInvoiceRaised', label: 'Date Invoice Raised' },
        { key: 'submittedInspectionDate', label: 'Submitted inspection date' },
        { key: 'remarks', label: 'Remarks' },
        { key: 'inspectionResult', label: 'Inspection Result' },
        { key: 'reportType', label: 'Report Type' },
        { key: 'inspector', label: 'Inspector' },
        { key: 'approvalStatus', label: 'Approval Status' },
        { key: 'shipmentStatus', label: 'Shipment Status' },
        { key: 'qcComment', label: 'QC Comment' },
        { key: 'delayShipmentCode', label: 'Delay Shipment Code' },
        { key: 'discountPercentage', label: 'Discount Percentage' },
        { key: 'sellIncComm', label: 'SELL INC COMM' },
        { key: 'buyerSurcharge', label: 'Buyer Surcharge' },
        { key: 'buyerSurchargePercentage', label: 'Buyer Surcharge Percentage' },
        { key: 'moq', label: 'MOQ' },
        { key: 'discountCost', label: 'Discount Cost', parent: 'Price Info' },
        { key: 'specialSur', label: 'Special Sur' },
        { key: 'factorySurcharge', label: 'Factory Surcharge' },
        { key: 'factorySurchargePercentage', label: 'Factory Surcharge Percentage' }
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
            {SampleLineData.map((row, rowIndex) => (
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

LineItemTab.displayName = 'LineItemTab';

export default LineItemTab;
