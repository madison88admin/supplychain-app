import { 
  TechPackVersion, 
  Costing, 
  SampleLine, 
  LineItem, 
  BillOfMaterial, 
  Product, 
  ProductColor, 
  ProductColorSize, 
  ProductImage, 
  ProductOptionImage, 
  ProductDetail 
} from '../types/productManager';

// Tech Pack Version Data
export const techPackVersionData: TechPackVersion[] = [
  {
    id: '1',
    product: 'Cotton T-Shirt',
    versionNumber: 'v1.0',
    comment: 'Initial version',
    billOfMaterialVersion: 'BOM-001',
    sizeSpecificationVersion: 'SIZE-001',
    careInstructionsVersion: 'CARE-001',
    fibreCompositionVersion: 'FIBRE-001',
    labelVersion: 'LABEL-001',
    fitLog: 'FIT-001',
    currentVersion: true,
    createdBy: 'John Smith',
    created: '2024-01-15'
  },
  {
    id: '2',
    product: 'Cotton T-Shirt',
    versionNumber: 'v1.1',
    comment: 'Updated sizing',
    billOfMaterialVersion: 'BOM-002',
    sizeSpecificationVersion: 'SIZE-002',
    careInstructionsVersion: 'CARE-001',
    fibreCompositionVersion: 'FIBRE-001',
    labelVersion: 'LABEL-001',
    fitLog: 'FIT-002',
    currentVersion: false,
    createdBy: 'Sarah Johnson',
    created: '2024-01-20'
  },
  {
    id: '3',
    product: 'Cotton T-Shirt',
    versionNumber: 'v1.2',
    comment: 'Material update',
    billOfMaterialVersion: 'BOM-003',
    sizeSpecificationVersion: 'SIZE-002',
    careInstructionsVersion: 'CARE-002',
    fibreCompositionVersion: 'FIBRE-002',
    labelVersion: 'LABEL-002',
    fitLog: 'FIT-003',
    currentVersion: false,
    createdBy: 'Mike Wilson',
    created: '2024-01-25'
  },
  {
    id: '4',
    product: 'Cotton T-Shirt',
    versionNumber: 'v2.0',
    comment: 'Major revision',
    billOfMaterialVersion: 'BOM-004',
    sizeSpecificationVersion: 'SIZE-003',
    careInstructionsVersion: 'CARE-003',
    fibreCompositionVersion: 'FIBRE-003',
    labelVersion: 'LABEL-003',
    fitLog: 'FIT-004',
    currentVersion: false,
    createdBy: 'Lisa Chen',
    created: '2024-02-01'
  }
];

// Costing Data
export const costingData: Costing[] = [
  {
    id: '1',
    costingReference: 'COST-001',
    productName: 'Cotton T-Shirt',
    supplier: 'ABC Textiles',
    productCustomer: 'Fashion Retail Co',
    purchasePrice: 8.50,
    sellingPrice: 12.75,
    costingQuantity: 1000,
    minimumOrderQuantity: 500,
    orderQuantityIncrement: 100,
    orderLeadTime: '30 days',
    costingType: 'Standard',
    purchaseOrder: 'PO-001',
    sampleRequest: 'SR-001',
    numberOfColors: 3,
    purchasePriceTotal: 8500.00,
    sellingPriceTotal: 12750.00,
    lastRecalculated: '2024-01-15',
    supplierLocation: 'Shanghai',
    supplierCountry: 'China',
    isDefault: true,
    addNewColors: true,
    approvedDate: '2024-01-20',
    costingStatus: 'Approved',
    productStatus: 'Active',
    purchasePaymentTerm: 'Net 30',
    purchasePaymentTermDescription: '30 days net',
    sellingPaymentTerm: 'Net 60',
    sellingPaymentTermDescription: '60 days net',
    purchaseCurrency: 'USD',
    sellingCurrency: 'USD',
    buyerStyleName: 'TS-001',
    supplierRef: 'SUP-001',
    buyerStyleNumber: 'BSN-001',
    comment: 'Initial costing',
    createdBy: 'John Smith',
    created: '2024-01-10',
    lastEdited: '2024-01-15',
    lastEditedBy: 'Sarah Johnson',
    landedSubtotal: 9200.00,
    sellIncComm: 13800.00,
    buyerSurcharge: 700.00,
    buyerSurchargePercentage: 7.6,
    margin: 35.2,
    landedSubtotalCost: 8500.00,
    specialSur: 0.00
  },
  {
    id: '2',
    costingReference: 'COST-002',
    productName: 'Denim Jeans',
    supplier: 'XYZ Denim',
    productCustomer: 'Blue Jeans Inc',
    purchasePrice: 15.25,
    sellingPrice: 22.88,
    costingQuantity: 800,
    minimumOrderQuantity: 400,
    orderQuantityIncrement: 50,
    orderLeadTime: '45 days',
    costingType: 'Premium',
    purchaseOrder: 'PO-002',
    sampleRequest: 'SR-002',
    numberOfColors: 2,
    purchasePriceTotal: 12200.00,
    sellingPriceTotal: 18304.00,
    lastRecalculated: '2024-01-18',
    supplierLocation: 'Dhaka',
    supplierCountry: 'Bangladesh',
    isDefault: false,
    addNewColors: false,
    approvedDate: '2024-01-25',
    costingStatus: 'Pending',
    productStatus: 'In Development',
    purchasePaymentTerm: 'Net 45',
    purchasePaymentTermDescription: '45 days net',
    sellingPaymentTerm: 'Net 90',
    sellingPaymentTermDescription: '90 days net',
    purchaseCurrency: 'USD',
    sellingCurrency: 'EUR',
    buyerStyleName: 'DJ-001',
    supplierRef: 'SUP-002',
    buyerStyleNumber: 'BSN-002',
    comment: 'Premium denim',
    createdBy: 'Mike Wilson',
    created: '2024-01-12',
    lastEdited: '2024-01-18',
    lastEditedBy: 'Lisa Chen',
    landedSubtotal: 13500.00,
    sellIncComm: 20250.00,
    buyerSurcharge: 1300.00,
    buyerSurchargePercentage: 10.7,
    margin: 33.3,
    landedSubtotalCost: 12200.00,
    specialSur: 0.00
  }
];

// Line Items Data
export const lineItemsData: LineItem[] = [
  {
    id: '1',
    lineItem: '001',
    description: 'Cotton T-Shirt - Navy Blue',
    quantity: 500,
    unitPrice: 14.00,
    total: 7000.00
  },
  {
    id: '2',
    lineItem: '002',
    description: 'Cotton T-Shirt - Black',
    quantity: 300,
    unitPrice: 14.00,
    total: 4200.00
  },
  {
    id: '3',
    lineItem: '003',
    description: 'Cotton T-Shirt - White',
    quantity: 200,
    unitPrice: 14.00,
    total: 2800.00
  },
  {
    id: '4',
    lineItem: '004',
    description: 'Cotton T-Shirt - Red',
    quantity: 150,
    unitPrice: 14.00,
    total: 2100.00
  }
];

// Bill of Materials Data
export const billOfMaterialsData: BillOfMaterial[] = [
  {
    id: '1',
    material: 'Main Fabric',
    specification: '100% Cotton, 180 GSM',
    consumption: '1.2 m',
    wastagePercentage: 5,
    supplier: 'Textile Corp'
  },
  {
    id: '2',
    material: 'Thread',
    specification: 'Polyester, 40/2',
    consumption: '150 m',
    wastagePercentage: 2,
    supplier: 'Thread Co'
  },
  {
    id: '3',
    material: 'Buttons',
    specification: 'Plastic, 15mm',
    consumption: '3 pcs',
    wastagePercentage: 1,
    supplier: 'Button World'
  },
  {
    id: '4',
    material: 'Label',
    specification: 'Woven, 100% Cotton',
    consumption: '1 pc',
    wastagePercentage: 0.5,
    supplier: 'Label Pro'
  },
  {
    id: '5',
    material: 'Hang Tag',
    specification: 'Cardboard, 80 GSM',
    consumption: '1 pc',
    wastagePercentage: 1,
    supplier: 'Tag Solutions'
  }
];

// Products Data
export const productsData: Product[] = [
  {
    id: '1',
    productId: 'P001',
    name: 'Cotton T-Shirt',
    category: 'Apparel',
    status: 'Active'
  },
  {
    id: '2',
    productId: 'P002',
    name: 'Denim Jeans',
    category: 'Apparel',
    status: 'Pending'
  },
  {
    id: '3',
    productId: 'P003',
    name: 'Leather Bag',
    category: 'Accessories',
    status: 'Active'
  }
];

// Product Colors Data
export const productColorsData: ProductColor[] = [
  {
    id: '1',
    colorCode: 'BLK',
    colorName: 'Black',
    hexCode: '#000000',
    available: true
  },
  {
    id: '2',
    colorCode: 'NAV',
    colorName: 'Navy Blue',
    hexCode: '#000080',
    available: true
  },
  {
    id: '3',
    colorCode: 'WHT',
    colorName: 'White',
    hexCode: '#FFFFFF',
    available: false
  }
];

// Product Color Sizes Data
export const productColorSizesData: ProductColorSize[] = [
  {
    id: '1',
    size: 'XS',
    chestCm: 86,
    lengthCm: 58,
    stock: 25
  },
  {
    id: '2',
    size: 'S',
    chestCm: 91,
    lengthCm: 60,
    stock: 45
  },
  {
    id: '3',
    size: 'M',
    chestCm: 96,
    lengthCm: 62,
    stock: 67
  },
  {
    id: '4',
    size: 'L',
    chestCm: 101,
    lengthCm: 64,
    stock: 52
  },
  {
    id: '5',
    size: 'XL',
    chestCm: 106,
    lengthCm: 66,
    stock: 38
  }
];

// Product Images Data
export const productImagesData: ProductImage[] = [
  {
    id: '1',
    imageType: 'Main',
    filename: 'tshirt_main.jpg',
    size: '2.4 MB',
    uploaded: '2024-01-15'
  },
  {
    id: '2',
    imageType: 'Detail',
    filename: 'tshirt_detail.png',
    size: '1.8 MB',
    uploaded: '2024-01-16'
  },
  {
    id: '3',
    imageType: 'Back',
    filename: 'tshirt_back.jpg',
    size: '2.1 MB',
    uploaded: '2024-01-17'
  }
];

// Product Option Images Data
export const productOptionImagesData: ProductOptionImage[] = [
  {
    id: '1',
    option: 'Option 1',
    color: 'Black',
    image: 'black_tshirt.jpg',
    status: 'Uploaded'
  },
  {
    id: '2',
    option: 'Option 2',
    color: 'Navy',
    image: 'navy_tshirt.jpg',
    status: 'Uploaded'
  },
  {
    id: '3',
    option: 'Option 3',
    color: 'White',
    image: '-',
    status: 'Pending'
  }
];

// Product Details Data
export const productDetailsData: ProductDetail[] = [
  {
    id: '1',
    property: 'Weight',
    value: 180,
    unit: 'GSM',
    notes: 'Fabric weight'
  },
  {
    id: '2',
    property: 'Material',
    value: '100% Cotton',
    unit: '-',
    notes: 'Main fabric'
  },
  {
    id: '3',
    property: 'Care',
    value: 'Machine wash',
    unit: '-',
    notes: '30°C'
  },
  {
    id: '4',
    property: 'Origin',
    value: 'Bangladesh',
    unit: '-',
    notes: 'Manufacturing'
  }
]; 