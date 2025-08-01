// Product Manager Types

export interface TreeItem {
  id: string;
  label: string;
  type: 'category' | 'subcategory';
  expanded?: boolean;
  children?: TreeItem[];
}

export interface ProductFilterSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export interface TabContentProps {
  data?: any[];
  loading?: boolean;
  error?: string | null;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableRow {
  id: string | number;
  [key: string]: any;
}

export interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  loading?: boolean;
  error?: string | null;
  onRowClick?: (row: TableRow) => void;
  selectedRowId?: string | number | null;
}

// Tech Pack Version Types
export interface TechPackVersion {
  id: string;
  product: string;
  versionNumber: string;
  comment: string;
  billOfMaterialVersion: string;
  sizeSpecificationVersion: string;
  careInstructionsVersion: string;
  fibreCompositionVersion: string;
  labelVersion: string;
  fitLog: string;
  currentVersion: boolean;
  createdBy: string;
  created: string;
}

// Costing Types
export interface Costing {
  id: string;
  costingReference: string;
  productName: string;
  supplier: string;
  productCustomer: string;
  purchasePrice: number;
  sellingPrice: number;
  costingQuantity: number;
  minimumOrderQuantity: number;
  orderQuantityIncrement: number;
  orderLeadTime: string;
  costingType: string;
  purchaseOrder: string;
  sampleRequest: string;
  numberOfColors: number;
  purchasePriceTotal: number;
  sellingPriceTotal: number;
  lastRecalculated: string;
  supplierLocation: string;
  supplierCountry: string;
  isDefault: boolean;
  addNewColors: boolean;
  approvedDate: string;
  costingStatus: string;
  productStatus: string;
  purchasePaymentTerm: string;
  purchasePaymentTermDescription: string;
  sellingPaymentTerm: string;
  sellingPaymentTermDescription: string;
  purchaseCurrency: string;
  sellingCurrency: string;
  buyerStyleName: string;
  supplierRef: string;
  buyerStyleNumber: string;
  comment: string;
  createdBy: string;
  created: string;
  lastEdited: string;
  lastEditedBy: string;
  landedSubtotal: number;
  sellIncComm: number;
  buyerSurcharge: number;
  buyerSurchargePercentage: number;
  margin: number;
  landedSubtotalCost: number;
  specialSur: number;
}

// Sample Line Types
export interface SampleLine {
  id: string;
  sampleRequest: string;
  product: string;
  sampleRequestLine: string;
  quantity: number;
  fitComment: string;
  fitLogStatus: string;
  fitLogType: string;
  fitLogName: string;
  customer: string;
  collection: string;
  division: string;
  group: string;
  transportMethod: string;
  deliverTo: string;
  status: string;
  exFactory: string;
  comments: string;
  sellingQuantity: number;
  closedDate: string;
  linePurchasePrice: number;
  lineSellingPrice: number;
  noteCount: number;
  latestNote: string;
  orderQuantityIncrement: number;
  orderLeadTime: string;
  supplierRef: string;
  standardMinuteValue: number;
  template: string;
  requestDate: string;
  sampleRequestStatus: string;
  supplierPurchaseCurrency: string;
  customerSellingCurrency: string;
  supplier: string;
  purchaseCurrency: string;
  sellingCurrency: string;
  minimumOrderQuantity: number;
  productDescription: string;
  productType: string;
  productSubType: string;
  productStatus: string;
  productBuyerStyleName: string;
  productBuyerStyleNumber: string;
  costing: string;
  costingPurchaseCurrency: string;
  costingSellingCurrency: string;
  costingStatus: string;
  supplierPaymentTerm: string;
  supplierPaymentTermDescription: string;
  samplePurchasePaymentTerm: string;
  samplePurchasePaymentTermDescription: string;
  productSupplierPurchasePaymentTerm: string;
  productSupplierPurchasePaymentTermDescription: string;
  sampleSellingPaymentTerm: string;
  sampleSellingPaymentTermDescription: string;
  productSupplierSellingPaymentTerm: string;
  productSupplierSellingPaymentTermDescription: string;
  purchasePrice: number;
  sellingPrice: number;
  productionDevelopment: string;
  chinaQc: string;
  mlaPurchasing: string;
  production: string;
  srKeyUser5: string;
  srKeyUser6: string;
  srKeyUser7: string;
  srKeyUser8: string;
  season: string;
  department: string;
  customerParent: string;
  recipientProductSupplierFactory: string;
  fgPoNumber: string;
  received: number;
  balance: number;
  overReceived: number;
  size: string;
  productTechPackVersion: string;
  mainMaterial: string;
  mainMaterialDescription: string;
  deliveryContact: string;
  srKeyWorkingGroup1: string;
  srKeyWorkingGroup2: string;
  srKeyWorkingGroup3: string;
  srKeyWorkingGroup4: string;
  createdBy: string;
  created: string;
  lastEdited: string;
  lastEditedBy: string;
  color: string;
  m88Awb: string;
  mloAwb: string;
  shipmentId: string;
  quickbooksInvoice: string;
  supplierInvoice: string;
  suppliersInvPayment: number;
  discountPercentage: number;
  sellIncComm: number;
  buyerSurcharge: number;
  buyerSurchargePercentage: number;
  moq: number;
  discountCost: number;
  specialSur: number;
  factorySurcharge: number;
  factorySurchargePercentage: number;
  customerProtoApprovalTargetDate: string;
  customerProtoApprovalCompletedDate: string;
  topSampleExM88TargetDate: string;
  topSampleExM88CompletedDate: string;
  topSampleExFactoryTargetDate: string;
  topSampleExFactoryCompletedDate: string;
  topSampleRequestTargetDate: string;
  topSampleRequestCompletedDate: string;
  ppsSampleExM88TargetDate: string;
  ppsSampleExM88CompletedDate: string;
  ppsSampleExFactoryTargetDate: string;
  ppsSampleExFactoryCompletedDate: string;
  ppsSampleRequestTargetDate: string;
  ppsSampleRequestCompletedDate: string;
  testReportReceivedTargetDate: string;
  testReportReceivedCompletedDate: string;
  testSampleExFactoryTargetDate: string;
  testSampleExFactoryCompletedDate: string;
  testingSampleRequestTargetDate: string;
  testingSampleRequestCompletedDate: string;
  protoSampleRequestTargetDate: string;
  protoSampleRequestCompletedDate: string;
  protoSampleExFactoryTargetDate: string;
  protoSampleExFactoryCompletedDate: string;
  protoSampleExM88TargetDate: string;
  protoSampleExM88CompletedDate: string;
  customerPpsApprovalTargetDate: string;
  customerPpsApprovalCompletedDate: string;
  customerTopApprovalTargetDate: string;
  customerTopApprovalCompletedDate: string;
  sampleDeliveryDateTargetDate: string;
  sampleDeliveryDateCompletedDate: string;
}

// Line Item Types
export interface LineItem {
  lineItem: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Bill of Materials Types
export interface BillOfMaterial {
  material: string;
  specification: string;
  consumption: string;
  wastagePercentage: number;
  supplier: string;
}

// Product Types
export interface Product {
  id: string;
  productId: string;
  name: string;
  category: string;
  status: string;
}

// Product Color Types
export interface ProductColor {
  id: string;
  colorCode: string;
  colorName: string;
  hexCode: string;
  available: boolean;
}

// Product Color Size Types
export interface ProductColorSize {
  id: string;
  size: string;
  chestCm: number;
  lengthCm: number;
  stock: number;
}

// Product Image Types
export interface ProductImage {
  id: string;
  imageType: string;
  filename: string;
  size: string;
  uploaded: string;
}

// Product Option Image Types
export interface ProductOptionImage {
  id: string;
  option: string;
  color: string;
  image: string;
  status: string;
}

// Product Detail Types
export interface ProductDetail {
  id: string;
  property: string;
  value: string | number;
  unit: string;
  notes: string;
}

// Constants
export const AVAILABLE_SEASONS = [
  'FH:2018',
  'FH:2019', 
  'FH:2020',
  'FH:2021',
  'FH:2022',
  'FH:2023',
  'FH:2024',
  'FH:2025'
] as const;

export const PRODUCT_SEASON_OPTIONS = ['Library', 'Custom', 'Shared', 'Archived'] as const;

export const LEFT_TABS = ['Tech Pack Version', 'Costings', 'Sample Lines', 'Lines', 'Bill Of Materials'] as const;
export const RIGHT_TABS = ['Products', 'Product Colors', 'Product Color Sizes', 'Images', 'Option Images', 'Details'] as const; 