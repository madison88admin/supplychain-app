import React, { memo } from 'react';
import DataTable from '../DataTable';
import { TableColumn } from '../../types/productManager';
import { techPackVersionData } from '../../data/productManagerData';

interface TechPackVersionTabProps {
  selectedRowId?: string | null;
  onRowClick?: (row: any) => void;
}

const TechPackVersionTab: React.FC<TechPackVersionTabProps> = memo(({
  selectedRowId,
  onRowClick
}) => {
  const columns: TableColumn[] = [
    { key: 'product', label: 'PRODUCT' },
    { key: 'versionNumber', label: 'VERSION NUMBER' },
    { key: 'comment', label: 'COMMENT' },
    { key: 'billOfMaterialVersion', label: 'BILL OF MATERIAL VERSION' },
    { key: 'sizeSpecificationVersion', label: 'SIZE SPECIFICATION VERSION' },
    { key: 'careInstructionsVersion', label: 'CARE INSTRUCTIONS VERSION' },
    { key: 'fibreCompositionVersion', label: 'FIBRE COMPOSITION VERSION' },
    { key: 'labelVersion', label: 'LABEL VERSION' },
    { key: 'fitLog', label: 'FIT LOG' },
    { key: 'currentVersion', label: 'CURRENT VERSION' },
    { key: 'createdBy', label: 'CREATED BY' },
    { key: 'created', label: 'CREATED' }
  ];

  return (
    <DataTable
      columns={columns}
      data={techPackVersionData}
      selectedRowId={selectedRowId}
      onRowClick={onRowClick}
    />
  );
});

TechPackVersionTab.displayName = 'TechPackVersionTab';

export default TechPackVersionTab; 