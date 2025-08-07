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
export interface Line {
  order: string;
  product: string;
  poLine: string;
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
  deliveryDate: string; // Use `Date` if parsed
  comments: string;
  sellingQuantity: number;
  closedDate: string; // Use `Date` if parsed
  linePurchasePrice: number;
  lineSellingPrice: number;
  noteCount: number;
  latestNote: string;
  orderQuantityIncrement: number;
  orderLeadTime: number;
  supplierRef: string;
  template: string;
  exFactory: string; // Use `Date` if parsed
  purchaseOrderStatus: string;
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
  standardMinuteValue: number;
  costing: number;
  costingPurchaseCurrency: string;
  costingSellingCurrency: string;
  costingStatus: string;
  supplierPaymentTerm: string;
  supplierPaymentTermDescription: string;
  orderPurchasePaymentTerm: string;
  orderPurchasePaymentTermDescription: string;
  productSupplierPurchasePaymentTerm: string;
  productSupplierPurchasePaymentTermDescription: string;
  orderSellingPaymentTerm: string;
  orderSellingPaymentTermDescription: string;
  productSupplierSellingPaymentTerm: string;
  productSupplierSellingPaymentTermDescription: string;
  purchasePrice: number;
  sellingPrice: number;
  production: string;
  mlaPurchasing: string;
  chinaQC: string;
  mlaPlanning: string;
  mlaShipping: string;
  poKeyUser6: string;
  poKeyUser7: string;
  poKeyUser8: string;
  season: string;
  department: string;
  customerParent: string;
  recipientProductSupplierFactory: string;
  fgPONumber: string;
  received: number;
  balance: number;
  overReceived: number;
  size: string;
  mainMaterial: string;
  mainMaterialDescription: string;
  deliveryContact: string;
  poKeyWorkingGroup1: string;
  poKeyWorkingGroup2: string;
  poKeyWorkingGroup3: string;
  poKeyWorkingGroup4: string;
  createdBy: string;
  created: string; // Use `Date` if parsed
  lastEdited: string; // Use `Date` if parsed
  lastEditedBy: string;
  color: string;
  vesselSchedule: string;
  buyerPONumber: string;
  shipmentId: string;
  factoryInvoiced: number;
  suppliersInvoice: string;
  quickBooksInvoice: string;
  shipmentNoted: string;
  buyInformation: string;
  handlingCharges: number;
  originalForecastQuantity: number;
  startDate: string; // Use `Date` if parsed
  cancelledDate: string; // Use `Date` if parsed
  factoryDatePaid: string; // Use `Date` if parsed
  dateInvoiceRaised: string; // Use `Date` if parsed
  submittedInspectionDate: string; // Use `Date` if parsed
  remarks: string;
  inspectionResult: string;
  reportType: string;
  inspector: string;
  approvalStatus: string;
  shipmentStatus: string;
  qcComment: string;
  delayShipmentCode: string;
  discountPercentage: number;
  sellIncComm: number;
  buyerSurcharge: number;
  buyerSurchargePercentage: number;
  moq: number;
  discountCost: number;
  specialSur: number;
  factorySurcharge: number;
  factorySurchargePercentage: number;
  packingAndLabelInstructionTargetDate: string;
  packingAndLabelInstructionCompletedDate: string;
  inlineInspectionTargetDate: string;
  inlineInspectionCompletedDate: string;
  factoryPackingListTargetDate: string;
  factoryPackingListCompletedDate: string;
  uccLabelTargetDate: string;
  uccLabelCompletedDate: string;
  finalInspectionTargetDate: string;
  finalInspectionCompletedDate: string;
  exFactoryDateTargetDate: string;
  exFactoryDateCompletedDate: string;
  uploadShippingDocsTargetDate: string;
  uploadShippingDocsCompletedDate: string;
  invoiceCustomerTargetDate: string;
  invoiceCustomerCompletedDate: string;
  customerDeliveryDateTargetDate: string;
  customerDeliveryDateCompletedDate: string;
  shipmentBookingTargetDate: string;
  shipmentBookingCompletedDate: string;
  warehouseUccLabelTargetDate: string;
  warehouseUccLabelCompletedDate: string;
  projectedDeliveryDateTargetDate: string;
  projectedDeliveryDateCompletedDate: string;
  bookingTargetDate: string;
  bookingCompletedDate: string;
  orderPlacementTargetDate: string;
  orderPlacementCompletedDate: string;
}


// Bill of Materials Types
export interface BillOfMaterial {
  productName: string;
  billOfMaterialCategory: string;
  material: string;
  comment: string;
  customText1: string;
  customText2: string;
  customText3: string;
  customText4: string;
  type: string;
  sizeSet: string;
  productStatus: string;
  materialStatus: string;
  template: string;
  season: string;
  customer: string;
  collection: string;
  divisionName: string;
  group: string;
  phase: string;
  billOfMaterialStatus: string;
  versionNumber: number;
  versionComment: string;
  materialUsage: string;
  materialSize: string;
  materialDescription: string;
  materialSeason: string;
  noteCount: number;
  latestNote: string;
  mainMaterial: string;
  categorySequence: string;
  composition: string;
  buyerStyleName: string;
  supplierRef: string;
  buyerStyleNumber: string;
  billOfMaterialLineRef: string;
  defaultMaterialColorColor: string;
  techPackReceivedTargetDate: string;
  techPackReceivedCompletedDate: string;
  labDipRequestTargetDate: string;
  labDipRequestCompletedDate: string;
  labDipApprovedTargetDate: string;
  labDipApprovedCompletedDate: string;
  testingRequestTargetDate: string;
  testingRequestCompletedDate: string;
  testingApprovedTargetDate: string;
  testingApprovedCompletedDate: string;
  linkToColTargetDate: string;
  linkToColCompletedDate: string;
}

// Product Types
export interface ProductMaster {
  m88Ref: string;
  description: string;
  status: string;
  sizeSet: string;
  commodityCode: string;
  comments: string;
  closedDate: string;
  template: string;
  receiveTechPack: string;
  costingReference: string;
  purchasePrice: number;
  sellingPrice: number;
  costingPurchaseCurrency: string;
  costingSellingCurrency: string;
  supplier: string;
  costingType: string;
  costingStatus: string;
  location: string;
  countryOfOrigin: string;
  standardMinuteValue: number;
  minimumSellingPrice: number;
  maximumSellingPrice: number;
  minimumPurchasePrice: number;
  maximumPurchasePrice: number;
  productColorCountPerProduct: number;
  productType: string;
  productSubType: string;
  collection: string;
  division: string;
  group: string;
  season: string;
  productDevelopment: string;
  production: string;
  techDesign: string;
  chinaQc: string;
  productKeyUser5: string;
  productKeyUser6: string;
  productKeyUser7: string;
  productKeyUser8: string;
  originalProductName: string;
  originalProductSeason: string;
  noteCount: number;
  latestNote: string;
  buyerStyleName: string;
  supplierRef: string;
  buyerStyleNumber: string;
  purchasePaymentTerm: string;
  purchasePaymentTermDescription: string;
  sellingPaymentTerm: string;
  sellingPaymentTermDescription: string;
  mainMaterial: string;
  mainMaterialDescription: string;
  mainMaterialStatus: string;
  composition: string;
  blockProduct: string;
  productKeyWorkingGroup1: string;
  productKeyWorkingGroup2: string;
  productKeyWorkingGroup3: string;
  productKeyWorkingGroup4: string;
  palette: string;
  createdBy: string;
  created: string;
  lastEdited: string;
  lastEditedBy: string;
  color: string;
  customer: string;
  department: string;
  customerParent: string;
  buyerSeason: string;
  lookbook: string;
  finishedGoodTestingStatus: string;
  sampleSentDate: string;
  buyerComments: string;
  factoryComments: string;
  receiveTechpackTargetDate: string;         // e.g., '2025-08-01'
  receiveTechpackCompletedDate: string;      // e.g., '2025-08-03'
  protoApprovalTargetDate: string;
  protoApprovalCompletedDate: string;
  colorApprovalTargetDate: string;
  colorApprovalCompletedDate: string;
  costApprovalTargetDate: string;
  costApprovalCompletedDate: string;
  linkToProdTargetDate: string;
  linkToProdCompletedDate: string;
  apTestTargetDate: string;
  apTestCompletedDate: string;
}

// Product Color Types
export interface ProductColor {
  season: string;
  product: string;
  productDescription: string;
  supplier: string;
  buyerStyleName: string;
  supplierRef: string;
  buyerStyleNumber: string;
  active: boolean;
  status: string;
  productType: string;
  productSubType: string;
  collection: string;
  division: string;
  group: string;
  template: string;
  productColorKeyDate: string;
  closedDate: string;
  color: string;
  colorDescription: string;
  colorFamily: string;
  colorStandard: string;
  colorExternalRef: string;
  colorExternalRef2: string;
  department: string;
  customer: string;
  customerParent: string;
  approvedToSMS: boolean;
  approvedToBulk: boolean;
  inDevelopment: boolean;
  buyerSeason: string;
  lookbook: string;
  finishedGoodTestingStatus: string;
  sampleSentDate: string;
  buyerComments: string;
  factoryComments: string;
  colourwayApprovalTargetDate: string;
  colourwayApprovalCompletedDate: string;
  productLinkTargetDate: string;
  productLinkCompletedDate: string;
}

// Product Color Size Types
export interface ProductColorSize {
  product: string;
  productDescription: string;
  name: string;
  size: string;
  productType: string;
  ratio: string;
  color: string;
  customer: string;
  customerParent: string;
  department: string;
  sizeSet: string;
  closedDate: string;
  active: boolean;
  collection: string;
  division: string;
  group: string;
  season: string;
  supplier: string;
  colorDescription: string;
  colorFamily: string;
  colorStandard: string;
  colorExternalRef: string;
  colorExternalRef2: string;
  upc: string;
  ean: string;
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