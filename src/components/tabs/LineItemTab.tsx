import React, { memo } from 'react';
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
        { key: 'fitComment', label: 'Fit Comment', },
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
        { key: 'deliveryDate', label: 'Delivery Date' },
        { key: 'comments', label: 'Comments' },
        { key: 'sellingQuantity', label: 'Selling Quantity' },
        { key: 'closedDate', label: 'Closed Date' },
        { key: 'linePurchasePrice', label: 'Line Purchase Price' },
        { key: 'lineSellingPrice', label: 'Line Selling Price' },
        { key: 'noteCount', label: 'Note Count' },
        { key: 'latestNote', label: 'Latest Note' },
        { key: 'orderQuantityIncrement', label: 'Order Quantity Increment' },
        { key: 'orderLeadTime', label: 'Order Lead Time' },
        { key: 'supplierRef', label: 'Supplier Ref.' },
        { key: 'template', label: 'Template' },
        { key: 'exFactory', label: 'Ex-Factory' },
        { key: 'purchaseOrderStatus', label: 'Purchase Order Status' },
        { key: 'supplierPurchaseCurrency', label: 'Supplier Purchase Currency' },
        { key: 'customerSellingCurrency', label: 'Customer Selling Currency' },
        { key: 'supplier', label: 'Supplier' },
        { key: 'purchaseCurrency', label: 'Purchase Currency' },
        { key: 'sellingCurrency', label: 'Selling Currency' },
        { key: 'minimumOrderQuantity', label: 'Minimum Order Quantity' },
        { key: 'productDescription', label: 'Product Description' },
        { key: 'productType', label: 'Product Type' },
        { key: 'productSubType', label: 'Product Sub Type' },
        { key: 'productStatus', label: 'Product Status' },
        { key: 'productBuyerStyleName', label: 'Product Buyer Style Name' },
        { key: 'productBuyerStyleNumber', label: 'Product Buyer Style Number' },
        { key: 'standardMinuteValue', label: 'Standard Minute Value' },
        { key: 'costing', label: 'Costing' },
        { key: 'costingPurchaseCurrency', label: 'Costing Purchase Currency' },
        { key: 'costingSellingCurrency', label: 'Costing Selling Currency' },
        { key: 'costingStatus', label: 'Costing Status' },
        { key: 'supplierPaymentTerm', label: 'Supplier Payment Term' },
        { key: 'supplierPaymentTermDescription', label: 'Supplier Payment Term Description' },
        { key: 'orderPurchasePaymentTerm', label: 'Order Purchase Payment Term' },
        { key: 'orderPurchasePaymentTermDescription', label: 'Order Purchase Payment Term Description' },
        { key: 'productSupplierPurchasePaymentTerm', label: 'Product Supplier Purchase Payment Term' },
        { key: 'productSupplierPurchasePaymentTermDescription', label: 'Product Supplier Purchase Payment Term Description' },
        { key: 'orderSellingPaymentTerm', label: 'Order Selling Payment Term' },
        { key: 'orderSellingPaymentTermDescription', label: 'Order Selling Payment Term Description' },
        { key: 'productSupplierSellingPaymentTerm', label: 'Product Supplier Selling Payment Term' },
        { key: 'productSupplierSellingPaymentTermDescription', label: 'Product Supplier Selling Payment Term Description' },
        { key: 'purchasePrice', label: 'Purchase Price' },
        { key: 'sellingPrice', label: 'Selling Price' },
        { key: 'production', label: 'Production' },
        { key: 'mlaPurchasing', label: 'MLA - Purchasing' },
        { key: 'chinaQc', label: 'China - QC' },
        { key: 'mlaPlanning', label: 'MLA - Planning' },
        { key: 'mlaShipping', label: 'MLA - Shipping' },
        { key: 'poKeyUser6', label: 'PO Key User 6' },
        { key: 'poKeyUser7', label: 'PO Key User 7' },
        { key: 'poKeyUser8', label: 'PO Key User 8' },
        { key: 'season', label: 'Season' },
        { key: 'department', label: 'Department' },
        { key: 'customerParent', label: 'Customer Parent' },
        { key: 'recipientProductSupplierFactory', label: 'RECIPIENT PRODUCT SUPPLIER-FACTORY' },
        { key: 'fgPoNumber', label: 'FG PO Number' },
        { key: 'received', label: 'Received' },
        { key: 'balance', label: 'Balance' },
        { key: 'overReceived', label: 'Over Received' },
        { key: 'size', label: 'Size' },
        { key: 'mainMaterial', label: 'Main Material' },
        { key: 'mainMaterialDescription', label: 'Main Material Description' },
        { key: 'deliveryContact', label: 'Delivery Contact' },
        { key: 'poKeyWorkingGroup1', label: 'PO Key Working Group 1' },
        { key: 'poKeyWorkingGroup2', label: 'PO Key Working Group 2' },
        { key: 'poKeyWorkingGroup3', label: 'PO Key Working Group 3' },
        { key: 'poKeyWorkingGroup4', label: 'PO Key Working Group 4' },
        { key: 'createdBy', label: 'Created By' },
        { key: 'created', label: 'Created' },
        { key: 'lastEdited', label: 'Last Edited' },
        { key: 'lastEditedBy', label: 'Last Edited By' },
        { key: 'color', label: 'Color' },
        { key: 'vesselSchedule', label: 'Vessel Schedule' },
        { key: 'buyerPoNumber', label: 'Buyer PO Number' },
        { key: 'shipmentId', label: 'Shipment ID' },
        { key: 'factoryInvoiced', label: 'Factory Invoiced' },
        { key: 'suppliersInvoice', label: 'Suppliers Invoice' },
        { key: 'quickBooksInvoice', label: 'QuickBooks Invoice' },
        { key: 'shipmentNoted', label: 'Shipment Noted' },
        { key: 'buyInformation', label: 'Buy Information' },
        { key: 'handlingCharges', label: 'Handling Charges' },
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
        { key: 'discountCost', label: 'Discount Cost' },
        { key: 'specialSur', label: 'Special Sur' },
        { key: 'factorySurcharge', label: 'Factory Surcharge' },
        { key: 'factorySurchargePercentage', label: 'Factory Surcharge Percentage' },
        { key: 'packingAndLabelInstructionTargetDate', label: 'Target Date', parent: 'Packing & Label Instruction' },
        { key: 'packingAndLabelInstructionCompletedDate', label: 'Completed Date', parent: 'Packing & Label Instruction' },
        { key: 'inlineInspectionTargetDate', label: 'Target Date', parent: 'Inline Inspection' },
        { key: 'inlineInspectionCompletedDate', label: 'Completed Date', parent: 'Inline Inspection' },
        { key: 'factoryPackingListTargetDate', label: 'Target Date', parent: 'Factory Packing List' },
        { key: 'factoryPackingListCompletedDate', label: 'Completed Date', parent: 'Factory Packing List' },
        { key: 'uccLabelTargetDate', label: 'Target Date', parent: 'UCC Label' },
        { key: 'uccLabelCompletedDate', label: 'Completed Date', parent: 'UCC Label' },
        { key: 'finalInspectionTargetDate', label: 'Target Date', parent: 'Final Inspection' },
        { key: 'finalInspectionCompletedDate', label: 'Completed Date', parent: 'Final Inspection' },
        { key: 'exFactoryDateTargetDate', label: 'Target Date', parent: 'Ex-Factory Date' },
        { key: 'exFactoryDateCompletedDate', label: 'Completed Date', parent: 'Ex-Factory Date' },
        { key: 'uploadShippingDocsTargetDate', label: 'Target Date', parent: 'Upload Shipping Docs' },
        { key: 'uploadShippingDocsCompletedDate', label: 'Completed Date', parent: 'Upload Shipping Docs' },
        { key: 'invoiceCustomerTargetDate', label: 'Target Date', parent: 'Invoice Customer' },
        { key: 'invoiceCustomerCompletedDate', label: 'Completed Date', parent: 'Invoice Customer' },
        { key: 'customerDeliveryDateTargetDate', label: 'Target Date', parent: 'Customer Delivery Date' },
        { key: 'customerDeliveryDateCompletedDate', label: 'Completed Date', parent: 'Customer Delivery Date' },
        { key: 'shipmentBookingTargetDate', label: 'Target Date', parent: 'Shipment Booking' },
        { key: 'shipmentBookingCompletedDate', label: 'Completed Date', parent: 'Shipment Booking' },
        { key: 'warehouseUccLabelTargetDate', label: 'Target Date', parent: 'Warehouse/UCC Label' },
        { key: 'warehouseUccLabelCompletedDate', label: 'Completed Date', parent: 'Warehouse/UCC Label' },
        { key: 'projectedDeliveryDateTargetDate', label: 'Target Date', parent: 'Projected Delivery Date' },
        { key: 'projectedDeliveryDateCompletedDate', label: 'Completed Date', parent: 'Projected Delivery Date' },
        { key: 'bookingTargetDate', label: 'Target Date', parent: 'Booking' },
        { key: 'bookingCompletedDate', label: 'Completed Date', parent: 'Booking' },
        { key: 'orderPlacementTargetDate', label: 'Target Date', parent: 'Order Placement' },
        { key: 'orderPlacementCompletedDate', label: 'Completed Date', parent: 'Order Placement' }
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
