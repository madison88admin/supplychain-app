import React, { memo } from 'react';
import DataTable from '../DataTable';
import { TableColumn } from '../../types/productManager';
import { costingData } from '../../data/productManagerData';

interface CostingsTabProps {
  selectedRowId?: string | null;
  onRowClick?: (row: any) => void;
}

const CostingsTab: React.FC<CostingsTabProps> = memo(({
  selectedRowId,
  onRowClick
}) => {
  const columns: TableColumn[] = [
    { key: 'costingReference', label: 'COSTING REFERENCE' },
    { key: 'productName', label: 'PRODUCT NAME' },
    { key: 'supplier', label: 'SUPPLIER' },
    { key: 'productCustomer', label: 'PRODUCT CUSTOMER' },
    { key: 'purchasePrice', label: 'PURCHASE PRICE' },
    { key: 'sellingPrice', label: 'SELLING PRICE' },
    { key: 'costingQuantity', label: 'COSTING QUANTITY' },
    { key: 'minimumOrderQuantity', label: 'MINIMUM ORDER QUANTITY' },
    { key: 'orderQuantityIncrement', label: 'ORDER QUANTITY INCREMENT' },
    { key: 'orderLeadTime', label: 'ORDER LEAD TIME' },
    { key: 'costingType', label: 'COSTING TYPE' },
    { key: 'purchaseOrder', label: 'PURCHASE ORDER' },
    { key: 'sampleRequest', label: 'SAMPLE REQUEST' },
    { key: 'numberOfColors', label: 'NO. OF COLORS' },
    { key: 'purchasePriceTotal', label: 'PURCHASE PRICE TOTAL' },
    { key: 'sellingPriceTotal', label: 'SELLING PRICE TOTAL' },
    { key: 'lastRecalculated', label: 'LAST RECALCULATED' },
    { key: 'supplierLocation', label: 'SUPPLIER LOCATION' },
    { key: 'supplierCountry', label: 'SUPPLIER COUNTRY' },
    { key: 'isDefault', label: 'DEFAULT' },
    { key: 'addNewColors', label: 'ADD NEW COLORS' },
    { key: 'approvedDate', label: 'APPROVED DATE' },
    { key: 'costingStatus', label: 'COSTING STATUS' },
    { key: 'productStatus', label: 'PRODUCT STATUS' },
    { key: 'purchasePaymentTerm', label: 'PURCHASE PAYMENT TERM' },
    { key: 'purchasePaymentTermDescription', label: 'PURCHASE PAYMENT TERM DESCRIPTION' },
    { key: 'sellingPaymentTerm', label: 'SELLING PAYMENT TERM' },
    { key: 'sellingPaymentTermDescription', label: 'SELLING PAYMENT TERM DESCRIPTION' },
    { key: 'purchaseCurrency', label: 'PURCHASE CURRENCY' },
    { key: 'sellingCurrency', label: 'SELLING CURRENCY' },
    { key: 'buyerStyleName', label: 'BUYER STYLE NAME' },
    { key: 'supplierRef', label: 'SUPPLIER REF.' },
    { key: 'buyerStyleNumber', label: 'BUYER STYLE NUMBER' },
    { key: 'comment', label: 'COMMENT' },
    { key: 'createdBy', label: 'CREATED BY' },
    { key: 'created', label: 'CREATED' },
    { key: 'lastEdited', label: 'LAST EDITED' },
    { key: 'lastEditedBy', label: 'LAST EDITED BY' },
    { key: 'landedSubtotal', label: 'LANDED SUBTOTAL' },
    { key: 'sellIncComm', label: 'SELL INC COMM' },
    { key: 'buyerSurcharge', label: 'BUYER SURCHARGE' },
    { key: 'buyerSurchargePercentage', label: 'BUYER SURCHARGE PERCENTAGE' },
    { key: 'margin', label: 'MARGIN' },
    { key: 'landedSubtotalCost', label: 'LANDED SUBTOTAL COST' },
    { key: 'specialSur', label: 'SPECIAL SUR' }
  ];

  return (
    <DataTable
      columns={columns}
      data={costingData}
      selectedRowId={selectedRowId}
      onRowClick={onRowClick}
    />
  );
});

CostingsTab.displayName = 'CostingsTab';

export default CostingsTab; 