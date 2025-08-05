import React, { memo } from 'react';
import DataTable from '../DataTable';
import { TableColumn } from '../../types/productManager';
import { SampleLineData } from '../../data/productManagerData';

interface SampleLineTabProps {
  selectedRowId?: string | null;
  onRowClick?: (row: any) => void;
}

const SampleLineTab: React.FC<SampleLineTabProps> = memo(({
  selectedRowId,
  onRowClick
}) => {
  const columns: TableColumn[] = [
    { key: 'sampleRequest', label: 'Sample Request'},
    { key: 'product', label: 'Product' },
    { key: 'sampleRequestLine', label: 'Sample Request Line' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'fitComment', label: 'Fit Comment' },
    { key: 'fitLogStatus', label: 'Fit Log Status' },
    { key: 'fitLogType', label: 'Fit Log Status' },
    { key: 'fitLogName', label: 'Fit Log Status' },
    { key: 'customer', label: 'Fit Log Status' },
    { key: 'collection', label: 'Fit Log Status' },
    { key: 'division', label: 'Fit Log Status' },
    { key: 'group', label: 'Fit Log Status' },
    { key: 'transportMethod', label: 'Fit Log Status' },
    { key: 'deliverTo', label: 'Fit Log Status' },
    { key: 'status', label: 'Fit Log Status' },
    { key: 'exFactory', label: 'Fit Log Status' },
    { key: 'comments', label: 'Fit Log Status' },
    { key: 'sellingQuantity', label: 'Fit Log Status' },
    { key: 'closedDate', label: 'Fit Log Status' },
    { key: 'linePurchasePrice', label: 'Fit Log Status' },
    { key: 'lineSellingPrice', label: 'Fit Log Status' },
    { key: 'noteCount', label: 'Fit Log Status' },
    { key: 'latestNote', label: 'Fit Log Status' },
    { key: 'orderQuantityIncrement', label: 'Fit Log Status' },
    { key: 'orderLeadTime', label: 'Fit Log Status' },
    { key: 'supplierRef', label: 'Fit Log Status' },
    { key: 'standardMinuteValue', label: 'Fit Log Status' },
    { key: 'template', label: 'Fit Log Status' },
    { key: 'requestDate', label: 'Fit Log Status' },
    { key: 'sampleRequestStatus', label: 'Fit Log Status' },
    { key: 'supplierPurchaseCurrency', label: 'Fit Log Status' },
    { key: 'customerSellingCurrency', label: 'Fit Log Status' },
    { key: 'sellingCurrency', label: 'Fit Log Status' },
    { key: 'minimumOrderQuantity', label: 'Fit Log Status' },
    { key: 'productDescription', label: 'Fit Log Status' },
    { key: 'productType', label: 'Fit Log Status' },
    { key: 'productSubType', label: 'Fit Log Status' },
    { key: 'productStatus', label: 'Fit Log Status' },
    { key: 'productBuyerStyleName', label: 'Fit Log Status' },
    { key: 'productBuyerStyleNumber', label: 'Fit Log Status' },
    { key: 'costing', label: 'Fit Log Status' },
    { key: 'costingPurchaseCurrency', label: 'Fit Log Status' },
    { key: 'costingSellingCurrency', label: 'Fit Log Status' },
    { key: 'costingStatus', label: 'Fit Log Status' },
    { key: 'supplierPaymentTerm', label: 'Fit Log Status' },
    { key: 'supplierPaymentTermDescription', label: 'Fit Log Status' },
    { key: 'productSupplierPurchasePaymentTerm', label: 'Fit Log Status' },
    { key: 'productSupplierPurchasePaymentTermDescription', label: 'Fit Log Status' },
    { key: 'sampleSellingPaymentTerm', label: 'Fit Log Status' },
    { key: 'sampleSellingPaymentTermDescription', label: 'Fit Log Status' },
    { key: 'productSupplierSellingPaymentTerm', label: 'Fit Log Status' },
    { key: 'productSupplierSellingPaymentTermDescription', label: 'Fit Log Status' },
    { key: 'purchasePrice', label: 'Fit Log Status' },
    { key: 'sellingPrice', label: 'Fit Log Status' },
    { key: 'productionDevelopment', label: 'Fit Log Status' },
    { key: 'chinaQc', label: 'Fit Log Status' },
    { key: 'mlaPurchasing', label: 'Fit Log Status' },
    { key: 'production', label: 'Fit Log Status' },
    { key: 'srKeyUser5', label: 'Fit Log Status' },
    { key: 'srKeyUser6', label: 'Fit Log Status' },
    { key: 'srKeyUser7', label: 'Fit Log Status' },
    { key: 'srKeyUser8', label: 'Fit Log Status' },
    { key: 'season', label: 'Fit Log Status' },
    { key: 'customerParent', label: 'Fit Log Status' },
    { key: 'recipientProductSupplierFactory', label: 'Fit Log Status' },
    { key: 'fgPoNumber', label: 'Fit Log Status' },
    { key: 'received', label: 'Fit Log Status' },
    { key: 'balance', label: 'Fit Log Status' },
    { key: 'overReceived', label: 'Fit Log Status' },
    { key: 'size', label: 'Fit Log Status' },
    { key: 'productTechPackVersion', label: 'Fit Log Status' },
    { key: 'mainMaterial', label: 'Fit Log Status' },
    { key: 'mainMaterialDescription', label: 'Fit Log Status' },
    { key: 'deliveryContact', label: 'Fit Log Status' },
    { key: 'srKeyWorkingGroup1', label: 'Fit Log Status' },
    { key: 'srKeyWorkingGroup2', label: 'Fit Log Status' },
    { key: 'srKeyWorkingGroup3', label: 'Fit Log Status' },
    { key: 'srKeyWorkingGroup4', label: 'Fit Log Status' },
    { key: 'createdBy', label: 'Fit Log Status' },
    { key: 'lastEdited', label: 'Fit Log Status' },
    { key: 'lastEditedBy', label: 'Fit Log Status' },
    { key: 'color', label: 'Fit Log Status' },
    { key: 'm88Awb', label: 'Fit Log Status' },
    { key: 'mloAwb', label: 'Fit Log Status' },
    { key: 'shipmentId', label: 'Fit Log Status' },
    { key: 'quickbooksInvoice', label: 'Fit Log Status' },
    { key: 'suppliersInvPayment', label: 'Fit Log Status' },
    { key: 'discountPercentage', label: 'Fit Log Status' },
    { key: 'sellIncComm', label: 'Fit Log Status' },
    { key: 'buyerSurcharge', label: 'Fit Log Status' },
    { key: 'buyerSurchargePercentage', label: 'Fit Log Status' },
    { key: 'moq', label: 'Fit Log Status' },
    { key: 'discountCost', label: 'Fit Log Status' },
    { key: 'specialSur', label: 'Fit Log Status' },
    { key: 'factorySurcharge', label: 'Fit Log Status' },
    { key: 'factorySurchargePercentage', label: 'Fit Log Status' },
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
            {SampleLineData.map((row, rowIndex) => (
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