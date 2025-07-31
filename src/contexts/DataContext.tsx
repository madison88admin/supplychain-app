import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface Product {
  id: string;
  styleNumber: string;
  styleName: string;
  customer: string;
  season: string;
  status: 'Active' | 'Development' | 'Sampling' | 'Production' | 'Discontinued';
  quantity: number;
  price: number;
  landedCost: number;
  leadTime: string;
  lastUpdated: string;
  approved: boolean;
  image?: string;
  createdBy: string;
  createdDate: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignedBy: string;
  assignedTo: string;
  category: string;
  estimatedTime: string;
  createdDate: string;
  completedDate?: string;
}

export interface FibreGroup {
  groupName: string;
  fibres: Array<{ fibre: string; percentage: number }>;
}

export interface Techpack {
  id: string;
  name: string;
  styleNumber: string;
  version: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Revision Required';
  category: string;
  createdBy: string;
  lastUpdated: string;
  dueDate: string;
  customer: string;
  completionRate: number;
  comments?: string | number;
  attachments: number;
  priority: 'High' | 'Medium' | 'Low';
  fibreCompositions?: FibreGroup[];
  versionHistory?: Array<{ version: string; status: string; lastUpdated: string; editedBy?: string }>;
}

export interface SampleRequest {
  id: string;
  requestNumber: string;
  styleName: string;
  styleNumber: string;
  customer: string;
  requestedBy: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending Review' | 'Approved' | 'In Production' | 'Revision Required' | 'Completed';
  requestDate: string;
  dueDate: string;
  sampleType: string;
  quantity: number;
  comments: string;
  supplier: string;
  estimatedCost: number;
  actualCost?: number;
  completionRate: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  customer: string;
  styleNumber: string;
  styleName: string;
  colorway: string;
  quantity: number;
  sizes: string;
  unitPrice: number;
  totalValue: number;
  status: 'Draft' | 'Approved' | 'Confirmed' | 'In Production' | 'Shipped' | 'Delivered';
  exFactoryDate: string;
  destination: string;
  version: string;
  supplier: string;
  createdDate: string;
  lastUpdated: string;
  bulkApprovalStatus: 'Not Required' | 'Pending' | 'Approved';
  progress: number;
}

export interface MaterialOrder {
  id: string;
  mpoNumber: string;
  materialItem: string;
  color: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  supplier: string;
  status: 'Ordered' | 'Processing' | 'Confirmed' | 'In Transit' | 'Received';
  orderDate: string;
  shipDate: string;
  receiveDate: string;
  awb?: string;
  invoiceNumber?: string;
  invoiceStatus: 'Not Issued' | 'Pending' | 'Paid';
  relatedPO: string;
  leadTime: number;
  materialType: string;
}

export interface Shipment {
  id: string;
  shipmentId: string;
  customer: string;
  supplier: string;
  poNumber: string;
  quantity: number;
  status: 'Preparing' | 'Booked' | 'In Transit' | 'Customs Clearance' | 'Delivered';
  shipmentBooking: string;
  vesselETD: string;
  customerDeliveryDate: string;
  deliveryTo: string;
  supplierInvoice?: string;
  invoiceAmount?: number;
  shippingMethod: 'Sea Freight' | 'Air Freight' | 'Road Transport';
  trackingNumber?: string;
  progress: number;
  estimatedArrival: string;
}

interface DataContextType {
  // Data
  products: Product[];
  tasks: Task[];
  techpacks: Techpack[];
  sampleRequests: SampleRequest[];
  purchaseOrders: PurchaseOrder[];
  materialOrders: MaterialOrder[];
  shipments: Shipment[];
  
  // Product functions
  addProduct: (product: Omit<Product, 'id' | 'createdDate' | 'lastUpdated'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Task functions
  addTask: (task: Omit<Task, 'id' | 'createdDate'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Techpack functions
  addTechpack: (techpack: Omit<Techpack, 'id' | 'lastUpdated'>) => void;
  updateTechpack: (id: string, updates: Partial<Techpack>) => void;
  deleteTechpack: (id: string) => void;
  
  // Sample Request functions
  addSampleRequest: (request: Omit<SampleRequest, 'id' | 'requestNumber'>) => void;
  updateSampleRequest: (id: string, updates: Partial<SampleRequest>) => void;
  deleteSampleRequest: (id: string) => void;
  
  // Purchase Order functions
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdDate' | 'lastUpdated'>) => void;
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (id: string) => void;
  
  // Material Order functions
  addMaterialOrder: (order: Omit<MaterialOrder, 'id' | 'mpoNumber'>) => void;
  updateMaterialOrder: (id: string, updates: Partial<MaterialOrder>) => void;
  deleteMaterialOrder: (id: string) => void;
  
  // Shipment functions
  addShipment: (shipment: Omit<Shipment, 'id' | 'shipmentId'>) => void;
  updateShipment: (id: string, updates: Partial<Shipment>) => void;
  deleteShipment: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial data
const initialProducts: Product[] = [];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Review Techpack for Summer Collection',
    description: 'Complete technical review and approve measurements for summer dress collection',
    priority: 'High',
    status: 'pending',
    dueDate: '2024-01-15',
    assignedBy: 'Mike Chen',
    assignedTo: 'Sarah Johnson',
    category: 'Techpack Review',
    estimatedTime: '2 hours',
    createdDate: '2024-01-10'
  },
  {
    id: '2',
    title: 'Approve Sample Request - Style #SC001',
    description: 'Review and approve sample request for cotton t-shirt with new print design',
    priority: 'Medium',
    status: 'in-progress',
    dueDate: '2024-01-16',
    assignedBy: 'Sarah Wilson',
    assignedTo: 'Sarah Johnson',
    category: 'Sample Approval',
    estimatedTime: '1 hour',
    createdDate: '2024-01-11'
  }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load data from localStorage or use initial data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('madison88_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('madison88_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [techpacks, setTechpacks] = useState<Techpack[]>(() => {
    const saved = localStorage.getItem('madison88_techpacks');
    return saved ? JSON.parse(saved) : [];
  });

  const [sampleRequests, setSampleRequests] = useState<SampleRequest[]>(() => {
    const saved = localStorage.getItem('madison88_sampleRequests');
    return saved ? JSON.parse(saved) : [];
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('madison88_purchaseOrders');
    return saved ? JSON.parse(saved) : [];
  });

  const [materialOrders, setMaterialOrders] = useState<MaterialOrder[]>(() => {
    const saved = localStorage.getItem('madison88_materialOrders');
    return saved ? JSON.parse(saved) : [];
  });

  const [shipments, setShipments] = useState<Shipment[]>(() => {
    const saved = localStorage.getItem('madison88_shipments');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('madison88_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('madison88_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('madison88_techpacks', JSON.stringify(techpacks));
  }, [techpacks]);

  useEffect(() => {
    localStorage.setItem('madison88_sampleRequests', JSON.stringify(sampleRequests));
  }, [sampleRequests]);

  useEffect(() => {
    localStorage.setItem('madison88_purchaseOrders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('madison88_materialOrders', JSON.stringify(materialOrders));
  }, [materialOrders]);

  useEffect(() => {
    localStorage.setItem('madison88_shipments', JSON.stringify(shipments));
  }, [shipments]);

  // Utility functions
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
  const getCurrentDate = () => new Date().toISOString();

  // Product functions
  const addProduct = (productData: Omit<Product, 'id' | 'createdDate' | 'lastUpdated'>) => {
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdDate: getCurrentDate(),
      lastUpdated: getCurrentDate()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...updates, lastUpdated: getCurrentDate() }
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  // Task functions
  const addTask = (taskData: Omit<Task, 'id' | 'createdDate'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdDate: getCurrentDate()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            ...updates,
            completedDate: updates.status === 'completed' ? getCurrentDate() : task.completedDate
          }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Techpack functions
  const addTechpack = (techpackData: Omit<Techpack, 'id' | 'lastUpdated'>) => {
    const newTechpack: Techpack = {
      ...techpackData,
      id: generateId(),
      lastUpdated: getCurrentDate()
    };
    setTechpacks(prev => [...prev, newTechpack]);
  };

  const updateTechpack = (id: string, updates: Partial<Techpack>) => {
    setTechpacks(prev => prev.map(techpack => 
      techpack.id === id 
        ? { ...techpack, ...updates, lastUpdated: getCurrentDate() }
        : techpack
    ));
  };

  const deleteTechpack = (id: string) => {
    setTechpacks(prev => prev.filter(techpack => techpack.id !== id));
  };

  // Sample Request functions
  const addSampleRequest = (requestData: Omit<SampleRequest, 'id' | 'requestNumber'>) => {
    const requestNumber = `SR-${new Date().getFullYear()}-${String(sampleRequests.length + 1).padStart(3, '0')}`;
    const newRequest: SampleRequest = {
      ...requestData,
      id: generateId(),
      requestNumber
    };
    setSampleRequests(prev => [...prev, newRequest]);
  };

  const updateSampleRequest = (id: string, updates: Partial<SampleRequest>) => {
    setSampleRequests(prev => prev.map(request => 
      request.id === id ? { ...request, ...updates } : request
    ));
  };

  const deleteSampleRequest = (id: string) => {
    setSampleRequests(prev => prev.filter(request => request.id !== id));
  };

  // Purchase Order functions
  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdDate' | 'lastUpdated'>) => {
    const poNumber = `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`;
    const newPO: PurchaseOrder = {
      ...poData,
      id: generateId(),
      poNumber,
      createdDate: getCurrentDate(),
      lastUpdated: getCurrentDate()
    };
    setPurchaseOrders(prev => [...prev, newPO]);
  };

  const updatePurchaseOrder = (id: string, updates: Partial<PurchaseOrder>) => {
    setPurchaseOrders(prev => prev.map(po => 
      po.id === id 
        ? { ...po, ...updates, lastUpdated: getCurrentDate() }
        : po
    ));
  };

  const deletePurchaseOrder = (id: string) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== id));
  };

  // Material Order functions
  const addMaterialOrder = (orderData: Omit<MaterialOrder, 'id' | 'mpoNumber'>) => {
    const mpoNumber = `MPO-${new Date().getFullYear()}-${String(materialOrders.length + 1).padStart(3, '0')}`;
    const newOrder: MaterialOrder = {
      ...orderData,
      id: generateId(),
      mpoNumber
    };
    setMaterialOrders(prev => [...prev, newOrder]);
  };

  const updateMaterialOrder = (id: string, updates: Partial<MaterialOrder>) => {
    setMaterialOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ));
  };

  const deleteMaterialOrder = (id: string) => {
    setMaterialOrders(prev => prev.filter(order => order.id !== id));
  };

  // Shipment functions
  const addShipment = (shipmentData: Omit<Shipment, 'id' | 'shipmentId'>) => {
    const shipmentId = `SH-${new Date().getFullYear()}-${String(shipments.length + 1).padStart(3, '0')}`;
    const newShipment: Shipment = {
      ...shipmentData,
      id: generateId(),
      shipmentId
    };
    setShipments(prev => [...prev, newShipment]);
  };

  const updateShipment = (id: string, updates: Partial<Shipment>) => {
    setShipments(prev => prev.map(shipment => 
      shipment.id === id ? { ...shipment, ...updates } : shipment
    ));
  };

  const deleteShipment = (id: string) => {
    setShipments(prev => prev.filter(shipment => shipment.id !== id));
  };

  return (
    <DataContext.Provider value={{
      products,
      tasks,
      techpacks,
      sampleRequests,
      purchaseOrders,
      materialOrders,
      shipments,
      addProduct,
      updateProduct,
      deleteProduct,
      addTask,
      updateTask,
      deleteTask,
      addTechpack,
      updateTechpack,
      deleteTechpack,
      addSampleRequest,
      updateSampleRequest,
      deleteSampleRequest,
      addPurchaseOrder,
      updatePurchaseOrder,
      deletePurchaseOrder,
      addMaterialOrder,
      updateMaterialOrder,
      deleteMaterialOrder,
      addShipment,
      updateShipment,
      deleteShipment
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};