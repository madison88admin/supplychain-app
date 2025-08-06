import React, { memo } from 'react';
import TechPackVersionTab from './tabs/TechPackVersionTab';
import CostingsTab from './tabs/CostingsTab';
import SampleLineTab from './tabs/SampleLineTab';
import LineItemTab from './tabs/LineItemTab';
import DataTable from './DataTable';
import { TableColumn } from '../types/productManager';
import { 
  lineItemsData, 
  billOfMaterialsData, 
  productsData, 
  productColorsData, 
  productColorSizesData, 
  productImagesData, 
  productOptionImagesData, 
  productDetailsData
} from '../data/productManagerData';

interface TabContentProps {
  activeTab: string;
  selectedRowId?: string | null;
  onRowClick?: (row: any) => void;
}

const TabContent: React.FC<TabContentProps> = memo(({
  activeTab,
  selectedRowId,
  onRowClick
}) => {
  // Line Items columns
  const lineItemsColumns: TableColumn[] = [
    { key: 'lineItem', label: 'LINE ITEM' },
    { key: 'description', label: 'DESCRIPTION' },
    { key: 'quantity', label: 'QUANTITY' },
    { key: 'unitPrice', label: 'UNIT PRICE' },
    { key: 'total', label: 'TOTAL' }
  ];

  // Bill of Materials columns
  const billOfMaterialsColumns: TableColumn[] = [
    { key: 'material', label: 'MATERIAL' },
    { key: 'specification', label: 'SPECIFICATION' },
    { key: 'consumption', label: 'CONSUMPTION' },
    { key: 'wastagePercentage', label: 'WASTAGE %' },
    { key: 'supplier', label: 'SUPPLIER' }
  ];

  // Products columns
  const productsColumns: TableColumn[] = [
    { key: 'productId', label: 'PRODUCT ID' },
    { key: 'name', label: 'NAME' },
    { key: 'category', label: 'CATEGORY' },
    { key: 'status', label: 'STATUS' }
  ];

  // Product Colors columns
  const productColorsColumns: TableColumn[] = [
    { key: 'colorCode', label: 'COLOR CODE' },
    { key: 'colorName', label: 'COLOR NAME' },
    { key: 'hexCode', label: 'HEX CODE' },
    { key: 'available', label: 'AVAILABLE' }
  ];

  // Product Color Sizes columns
  const productColorSizesColumns: TableColumn[] = [
    { key: 'size', label: 'SIZE' },
    { key: 'chestCm', label: 'CHEST (CM)' },
    { key: 'lengthCm', label: 'LENGTH (CM)' },
    { key: 'stock', label: 'STOCK' }
  ];

  // Product Images columns
  const productImagesColumns: TableColumn[] = [
    { key: 'imageType', label: 'IMAGE TYPE' },
    { key: 'filename', label: 'FILENAME' },
    { key: 'size', label: 'SIZE' },
    { key: 'uploaded', label: 'UPLOADED' }
  ];

  // Product Option Images columns
  const productOptionImagesColumns: TableColumn[] = [
    { key: 'option', label: 'OPTION' },
    { key: 'color', label: 'COLOR' },
    { key: 'image', label: 'IMAGE' },
    { key: 'status', label: 'STATUS' }
  ];

  // Product Details columns
  const productDetailsColumns: TableColumn[] = [
    { key: 'property', label: 'PROPERTY' },
    { key: 'value', label: 'VALUE' },
    { key: 'unit', label: 'UNIT' },
    { key: 'notes', label: 'NOTES' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Tech Pack Version':
        return (
          <TechPackVersionTab
            selectedRowId={selectedRowId}
            onRowClick={onRowClick}
          />
        );

      case 'Costings':
        return (
          <CostingsTab
            selectedRowId={selectedRowId}
            onRowClick={onRowClick}
          />
        );

      case 'Sample Lines':
        return (
          <SampleLineTab
            selectedRowId={selectedRowId}
            onRowClick={onRowClick}
          />
        );

      case 'Lines':
        return (
          <LineItemTab
            selectedRowId={selectedRowId}
            onRowClick={onRowClick}
          />
        );

      case 'Bill Of Materials':
        return (
          <DataTable
            columns={billOfMaterialsColumns}
            data={billOfMaterialsData}
            selectedRowId={selectedRowId}
            onRowClick={onRowClick}
          />
        );

      case 'Products':
        return (
          <DataTable
            columns={productsColumns}
            data={productsData}
            selectedRowId={selectedRowId}
            onRowClick={onRowClick}
          />
        );

      case 'Product Colors':
        return (
          <DataTable
            columns={productColorsColumns}
            data={productColorsData}
            selectedRowId={selectedRowId}
            onRowClick={onRowClick}
          />
        );

      case 'Product Color Sizes':
        return (
          <DataTable
            columns={productColorSizesColumns}
            data={productColorSizesData}
            selectedRowId={selectedRowId}
            onRowClick={onRowClick}
          />
        );

      case 'Images':
        return (
          <DataTable
            columns={productImagesColumns}
            data={productImagesData}
            selectedRowId={selectedRowId}
            onRowClick={onRowClick}
          />
        );

      case 'Option Images':
        return (
          <DataTable
            columns={productOptionImagesColumns}
            data={productOptionImagesData}
            selectedRowId={selectedRowId}
            onRowClick={onRowClick}
          />
        );

      case 'Details':
        return (
          <DataTable
            columns={productDetailsColumns}
            data={productDetailsData}
            selectedRowId={selectedRowId}
            onRowClick={onRowClick}
          />
        );

      default:
        return (
          <div className="flex items-center justify-center p-8 text-gray-500">
            <span>Select a tab to view content</span>
          </div>
        );
    }
  };

  return (
    <div className="p-4">
      {renderTabContent()}
    </div>
  );
});

TabContent.displayName = 'TabContent';

export default TabContent; 