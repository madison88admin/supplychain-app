import React, { useState } from 'react';
import { Plus, Search, ChevronDown, ChevronRight, Edit, Trash2, Copy, Lock } from 'lucide-react';
import AddProductModal from '../components/modals/AddProductModal';
import AddTechpackModal from '../components/modals/AddTechpackModal';
import AddFibreModal from '../components/modals/AddFibreModal';
import ReportingModal from '../components/modals/ReportingModal';
import { useData } from '../contexts/DataContext';
import { useUser } from '../contexts/UserContext';
import { Product } from '../contexts/DataContext';

// Dynamic seasons based on actual product data
const getDynamicSeasons = (products: any[]) => {
  // Get unique seasons from products
  const uniqueSeasons = [...new Set(products.map(product => product.season))].filter(season => season && season.trim() !== '');  // Create season objects
  const dynamicSeasons = uniqueSeasons.map(season => ({
    id: season,
    name: season
  }));
  
  // Add special options
  return  [{ id: 'All', name: 'All Seasons' },
    ...dynamicSeasons,
    { id: 'None', name: 'No Season' }
  ];
};

const techPackTabs = [
  'Tech Pack Version',
  'Costings',
  'Sample Lines',
  'Lines',
  'Bill Of Materials',
];

const detailTabs = [
  'Products',
  'Product Colors',
  'Product Color Sizes',
  'Images',
  'Option Images',
  'Details',
];

const techpackDetailTabs = [
  'Tech Pack Version',
  'Bill of Materials',
  'Size Specification',
  'Fit Log',
  'Fibre Composition',
  'Care Instructions',
  'Labels',
];

// Helper to safely get techpack field value by key
const getTechpackFieldValue = (tp: any, key: string) => {
  // Only allow known keys
  if (key in tp) return tp[key];
  return '';
};

// Helper for fibre composition group (mocked)
const getFibreCompositions = (tp: any) => {
  if (!tp.fibreCompositions) return [];
  return tp.fibreCompositions;
};

// Helper to format date to MM/DD/YYYY HH:MM:SS format
const formatDateTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  // Convert to Philippine timezone (Asia/Manila)
  const philippineDate = new Date(date.toLocaleString("en-US", {timeZone: "Asia/Manila"}));
  
  const month = String(philippineDate.getMonth() + 1).padStart(2, '0');
  const day = String(philippineDate.getDate()).padStart(2, '0');
  const year = philippineDate.getFullYear();
  
  // Convert to 12our format with AM/PM
  let hours = philippineDate.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  const minutes = String(philippineDate.getMinutes()).padStart(2, '0');
  const seconds = String(philippineDate.getSeconds()).padStart(2, '0');
  
  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
};

// Add a modal for showing linked techpacks
const LinkedTechpacksModal = ({ isOpen, onClose, techpacks }: { isOpen: boolean; onClose: () => void; techpacks: any[] }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Linked Techpacks</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">✕</button>
        </div>
        <table className="w-full text-sm border border-blue-200 rounded mb-2">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-2 py-1 text-left">Techpack Name</th>
              <th className="px-2 py-1 text-left">Version</th>
              <th className="px-2 py-1 text-left">Status</th>
              <th className="px-2 py-1 text-left">Customer</th>
            </tr>
          </thead>
          <tbody>
            {techpacks.length === 0 ? (
              <tr><td colSpan={4} className="text-gray-400 text-center py-2">No linked techpacks.</td></tr>
            ) : (
              techpacks.map(tp => (
                <tr key={tp.id} className="border-b border-blue-100">
                  <td className="px-2 py-1">{tp.name || tp.styleNumber}</td>
                  <td className="px-2 py-1">{tp.version}</td>
                  <td className="px-2 py-1">{tp.status}</td>
                  <td className="px-2 py-1">{tp.customer}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

// Inline Edit Modal (reuse AddProductModal style, but prefill data)
const EditProductModal = ({ isOpen, onClose, product, onSave }: { isOpen: boolean; onClose: () => void; product: Product; onSave: (data: Product) => void }) => {
  const [formData, setFormData] = useState(product || {});
  React.useEffect(() => { setFormData(product || {}); }, [product]);
  if (!isOpen || !product) return null;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Style Number *</label><input type="text" name="styleNumber" value={formData.styleNumber || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Style Name *</label><input type="text" name="styleName" value={formData.styleName || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label><input type="text" name="customer" value={formData.customer || ''} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Season</label><input type="text" name="season" value={formData.season || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select name="status" value={formData.status || 'Development'} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"><option value="Development">Development</option><option value="Sampling">Sampling</option><option value="Active">Active</option><option value="Production">Production</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label><input type="number" name="quantity" value={formData.quantity || 0} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label><input type="number" name="price" value={formData.price || 0} onChange={handleChange} min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Landed Cost ($)</label><input type="number" name="landedCost" value={formData.landedCost || 0} onChange={handleChange} min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Lead Time</label><input type="text" name="leadTime" value={formData.leadTime || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
            <div className="md:col-span-2"><label className="flex items-center space-x-2"><input type="checkbox" name="approved" checked={formData.approved || false} onChange={handleChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><span className="text-sm font-medium text-gray-700">Approved</span></label></div>
          </div>
          <div className="flex items-center justify-end space-x-3"><button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"><span>Update Product</span></button></div>
        </form>
      </div>
    </div>
  );
};

// Reusable confirmation modal
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Confirm</button>
        </div>
      </div>
    </div>
  );
};

// Modal state types

type EditModalState = { open: boolean; product: Product | null };
type ConfirmModalState = { open: boolean; action: 'delete' | 'duplicate' | null; product: Product | null };

// Rename ProductManager to PurchaseOrders
const PurchaseOrders: React.FC = () => {
  const { products, techpacks, updateTechpack, updateProduct, deleteProduct, addProduct } = useData();
  const { user } = useUser();
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [searchQuery, setSearchQuery] = useState(''); // main search
  const [sidebarSearch, setSidebarSearch] = useState(''); // sidebar search
  const [productIdFilter, setProductIdFilter] = useState(''); // product ID filter
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTechPackTab, setActiveTechPackTab] = useState(techPackTabs[0]);
  const [activeDetailTab, setActiveDetailTab] = useState(detailTabs[0]);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [expandedTechpackTab, setExpandedTechpackTab] = useState<string>(techpackDetailTabs[0]);
  const [editingCell, setEditingCell] = useState<{techpackId: string, field: string, fibreIdx?: number} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [showAddTechpackModal, setShowAddTechpackModal] = useState(false);
  const [techpackModalProduct, setTechpackModalProduct] = useState<any | null>(null);
  const [editingVersionTechpackId, setEditingVersionTechpackId] = useState<string | null>(null);
  const [versionEditValues, setVersionEditValues] = useState<{ version: string; status: string; lastUpdated: string; comments?: string } | null>(null);
  const [showAddFibreModal, setShowAddFibreModal] = useState<{ open: boolean, techpackId: string | null }>({ open: false, techpackId: null });
  const [showReportingModal, setShowReportingModal] = useState(false);
  const [linkedTechpacksModal, setLinkedTechpacksModal] = useState({ open: false, techpacks: [] });
  const [editModal, setEditModal] = useState<EditModalState>({ open: false, product: null });
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ open: false, action: null, product: null });
  const [expandedSeason, setExpandedSeason] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  // Get dynamic seasons from products
  const dynamicSeasons = getDynamicSeasons(products);

  // Filter products by season and all search inputs
  const filteredProducts = products.filter(product => {
    let matchesSeason;
    if (selectedSeason === 'All') {
      matchesSeason = true;
    } else if (selectedSeason === 'None') {
      matchesSeason = !product.season || product.season.trim() === '';
    } else {
      matchesSeason = product.season === selectedSeason;
    }
    
    const matchesMainSearch =
      product.styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.styleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSidebarSearch =
      product.styleName.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      product.styleNumber.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      product.customer.toLowerCase().includes(sidebarSearch.toLowerCase());
    
    const matchesProductId = !productIdFilter || 
      product.styleNumber.toLowerCase().includes(productIdFilter.toLowerCase());
    
    const matchesCustomer = selectedCustomer ? product.customer === selectedCustomer : true;

    // All filters must match
    return matchesSeason && matchesCustomer && matchesMainSearch && matchesSidebarSearch && matchesProductId;
  });

  // Helper: get techpacks for a product
  const getTechpacksForProduct = (product: any) =>
    techpacks.filter(tp => tp.styleNumber === product.styleNumber);

  // Handle cell edit (support fibre composition group)
  // Check if user can edit techpacks based on role
  const canEditTechpacks = () => {
    if (!user) return false;
    return user.role === 'Admin' || user.role === 'QA';
  };

  const handleCellEdit = (techpackId: string, field: string, value: string, fibreIdx?: number) => {
    // Check permissions before allowing edit
    if (!canEditTechpacks()) {
      alert('You do not have permission to edit techpacks. Only Admin and QA users can edit techpack details.');
      return;
    }
    if (typeof fibreIdx === 'number') {
      // Edit fibre composition group
      const tp = techpacks.find(tp => tp.id === techpackId);
      if (!tp) return;
      const fibreCompositions = getFibreCompositions(tp).slice();
      fibreCompositions[fibreIdx] = { ...fibreCompositions[fibreIdx], [field]: value };
      updateTechpack(techpackId, { fibreCompositions });
    } else {
      const tp = techpacks.find(tp => tp.id === techpackId);
      if (!tp) return;
      if (['version', 'status'].includes(field)) {
        // Save previous version/status to versionHistory
        const prevVersion = tp.version;
        const prevStatus = tp.status;
        const prevLastUpdated = tp.lastUpdated;
        const newHistory = Array.isArray(tp.versionHistory) ? [...tp.versionHistory] : [];
        newHistory.unshift({ version: prevVersion, status: prevStatus, lastUpdated: prevLastUpdated });
        updateTechpack(techpackId, { [field]: value, lastUpdated: new Date().toISOString().split('T')[0], versionHistory: newHistory });
      } else {
        updateTechpack(techpackId, { [field]: value });
      }
    }
    setEditingCell(null);
    setEditValue('');
  };

  // Add/remove fibre composition row
  const handleAddFibreRow = (techpackId: string) => {
    setShowAddFibreModal({ open: true, techpackId });
  };
  const handleRemoveFibreRow = (techpackId: string, idx: number) => {
    const tp = techpacks.find(tp => tp.id === techpackId);
    if (!tp) return;
    const fibreCompositions = getFibreCompositions(tp).slice();
    fibreCompositions.splice(idx, 1);
    updateTechpack(techpackId, { fibreCompositions });
  };

  // Add a handler for when the modal submits
  const handleAddFibre = (fibreData: { fibreName: string; percentage: string; notes: string }) => {
    if (!showAddFibreModal.techpackId) return;
    const tp = techpacks.find(tp => tp.id === showAddFibreModal.techpackId);
    if (!tp) return;
    const fibreCompositions = getFibreCompositions(tp).slice();
    fibreCompositions.push(fibreData);
    updateTechpack(tp.id, { fibreCompositions });
  };

  // Mock fields for each tab (for demo, map to existing techpack fields)
  const getFieldsForTab = (tab: string) => {
    switch (tab) {
      case 'Tech Pack Version':
        return [
          { key: 'version', label: 'Version' },
          { key: 'status', label: 'Status' },
        ];
      case 'Bill of Materials':
        return [
          { key: 'category', label: 'Category' },
          { key: 'dueDate', label: 'Due Date' },
        ];
      case 'Size Specification':
        return [
          { key: 'completionRate', label: 'Completion (%)' },
        ];
      case 'Fit Log':
        return [
          { key: 'comments', label: 'Comments' },
        ];
      case 'Fibre Composition':
        return [
          { key: 'priority', label: 'Priority' },
        ];
      case 'Care Instructions':
        return [
          { key: 'createdBy', label: 'Created By' },
        ];
      case 'Labels':
        return [
          { key: 'name', label: 'Name' },
        ];
      default:
        return [];
    }
  };

  // Add a handler for generating reports
  const handleGenerateReport = (reportType: string, exportFormat: string, filters: any) => {
    console.log('Generating report:', { reportType, exportFormat, filters });
    alert(`Generating ${reportType} report as ${exportFormat}...\n\nFilters: ${JSON.stringify(filters, null, 2)}`);
  };

  // Replace the FIBRE_TYPES array with the provided list
  const FIBRE_TYPES = [
    '(Faux fur) polyester',
    'Acetate',
    'Acrylic',
    'Alpaca',
    'Angora',
    'Cashmere',
    'Contains Non- Texttile Parts of Animal Origin',
    'Cotton',
    'Elastane',
    'Elasterell-P',
    'Elastodiene',
    'Exclusive of Decoration',
    'Exclusive of Elastic',
    'Exclusiv of Ornamentation',
    'Exclusive of Trim',
    'Exclusive of Trimming',
    'Faux Fur',
    'Faux Suede Patch',
    'Finished Piece Washed ( for Testing only)',
    'Imitation Suede',
    'Lambswool',
    'Leather',
    'Lurex',
    'Lycra',
    'Lyocell',
    'Merino Wool',
    'Metallic',
    'Metallic fibre',
    'Metaliised Fibre',
    'Modacrylic',
    'Nylon',
    'Olefin',
    'Organic cotton',
    'Other Fiber',
    'Other Fibers',
    'Paper',
    'Pig Suede',
    'Polyamide',
    'Polyamide',
    'Polyester',
    'Polyester (Recycled)',
    'Polyester Recycled',
    'Polypropylene',
    'Polyurethane Foam',
    'Rayon',
    'Recycled',
    'Recycled Nylon',
    'Recycled Other Fibers',
    'Recycled Polyester',
    'Recycled Wool',
    'Recycled Wool/ Reprocessed Wool',
    'Recycled/Reclaimed Wool',
    'Rubber',
    'Rubber/Elastodiene',
    'Silk',
    'Spandex',
    'Straw',
    'True Hemp',
    'Viscose',
    'Wool- Merino',
    'Wool (Merino)',
    'Wool Merino',
    'Yak',
    'Yarn & Finished Piece Washed (for Testing only)',
    'Yarn Washed ( for Testing only)',
    'Excluding Trims',
    'Exclusive of Decoration and Elastic',
    'Recycled Acrylic'
  ];

  return (
    <div className="flex h-[calc(100vh-2rem)] p-4 gap-4">
      {/* Sidebar */}
      <aside className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Season Tree</h2>
        {/* Sidebar Product Search */}
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search product..."
            value={sidebarSearch}
            onChange={e => setSidebarSearch(e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <ul className="space-y-2">
          {dynamicSeasons.filter(season => season.id !== 'All' && season.id !== 'None').map(season => {
            // Get unique customers for this season
            const customers = Array.from(new Set(products.filter(p => p.season === season.id).map(p => p.customer)));
            return (
              <li key={season.id}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${selectedSeason === season.id ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => {
                    setSelectedSeason(season.id);
                    setExpandedSeason(expandedSeason === season.id ? null : season.id);
                    setSelectedCustomer(null);
                  }}
                >
                  <span>{season.name}</span>
                  {expandedSeason === season.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {expandedSeason === season.id && customers.length > 0 && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {customers.map(customer => (
                      <li key={customer}>
                        <button
                          className={`w-full text-left px-3 py-1 rounded-lg transition-colors text-sm ${selectedCustomer === customer ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
                          onClick={() => {
                            setSelectedSeason(season.id);
                            setSelectedCustomer(customer);
                          }}
                        >
                          {customer}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        {/* All Seasons and No Season options */}
        <div className="mt-4 space-y-1">
          <button
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedSeason === 'All' ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => {
              setSelectedSeason('All');
              setSelectedCustomer(null);
              setExpandedSeason(null);
            }}
          >
            All Seasons
          </button>
          <button
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedSeason === 'None' ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={() => {
              setSelectedSeason('None');
              setSelectedCustomer(null);
              setExpandedSeason(null);
            }}
          >
            No Season
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-5 w-5" /> Add New Product
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Plus className="h-5 w-5" /> Raise Sample Request
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Plus className="h-5 w-5" /> Create New Version
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2">
            Set as Current Version
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2">
            Audit
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            onClick={() => setShowReportingModal(true)}
          >
            Reporting
          </button>
        </div>

        {/* Role-based Permission Info */}
        {!canEditTechpacks() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Techpack Editing Restricted
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  As a {user?.role} user, you can view techpack details but cannot edit them. Only Admin and QA users can modify techpack information.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tech Pack Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="flex gap-2">
            {techPackTabs.map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors ${activeTechPackTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
                onClick={() => setActiveTechPackTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          {/* Product ID Filter */}
          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-700 mr-2">Product ID:</label>
            <input
              type="text"
              placeholder="Filter by product ID..."
              value={productIdFilter}
              onChange={e => setProductIdFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
            />
          </div>
          
          {/* Main Search */}
          <div className="flex items-center flex-1">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th></th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Season</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Quantity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Created By</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Created Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Edited Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map(product => {
                  const expanded = expandedProductId === product.id;
                  const techpacksForProduct = techpacks.filter(tp => tp.styleNumber === product.styleNumber);
                  return (
                    <React.Fragment key={product.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-2 align-top">
                          <button
                            onClick={() => setExpandedProductId(expanded ? null : product.id)}
                            className="focus:outline-none"
                            aria-label={expanded ? 'Collapse' : 'Expand'}
                          >
                            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.styleName} className="w-10 h-10 rounded object-cover" />
                            <div>
                              <div className="font-medium text-gray-900">{product.styleName}</div>
                              <div className="text-xs text-gray-500">{product.styleNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{product.customer}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{product.season}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{product.status}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{product.quantity}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">${product.price}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{product.createdBy}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{formatDateTime(product.createdDate)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{formatDateTime(product.lastUpdated)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          <button 
                            onClick={() => setEditModal({ open: true, product })} 
                            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mr-1"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setConfirmModal({ open: true, action: 'delete', product })} 
                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700 mr-1"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setConfirmModal({ open: true, action: 'duplicate', product })} 
                            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                            title="Duplicate Product"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr>
                          <td colSpan={11} className="bg-blue-50 px-6 py-4">
                            <div>
                              <div className="font-semibold text-blue-700 mb-2">Techpacks for this product</div>
                              {/* Techpack Tabs */}
                              <div className="mb-2">
                                <nav className="flex gap-2">
                                  {techpackDetailTabs.map(tab => (
                                    <button
                                      key={tab}
                                      className={`px-3 py-1 rounded-t font-medium transition-colors ${expandedTechpackTab === tab ? 'bg-white border-x border-t border-blue-400 text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
                                      onClick={() => setExpandedTechpackTab(tab)}
                                    >
                                      {tab}
                                    </button>
                                  ))}
                                </nav>
                              </div>
                              {/* Techpack Editable Table(s) */}
                              {techpacksForProduct.length === 0 ? (
                                <div className="text-gray-500 flex flex-col items-center gap-2">
                                  No techpacks found for this product.
                                  <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-2"
                                    onClick={() => {
                                      setTechpackModalProduct(product);
                                      setShowAddTechpackModal(true);
                                    }}
                                  >
                                    Add Techpack
                                  </button>
                                </div>
                              ) : expandedTechpackTab === 'Fibre Composition' ? (
                                <div className="flex flex-col gap-6">
                                  {/* Version Control Table */}
                                  <div>
                                    <div className="font-semibold text-blue-700 mb-1">Version Control</div>
                                    {techpacksForProduct.map(tp => (
                                      <React.Fragment key={tp.id}>
                                        <table className="w-full text-sm border border-blue-200 rounded mb-2">
                                          <thead className="bg-blue-100">
                                            <tr>
                                              <th className="px-2 py-1 text-left">Version</th>
                                              <th className="px-2 py-1 text-left">Status</th>
                                              <th className="px-2 py-1 text-left">Last Updated</th>
                                              <th className="px-2 py-1 text-left">Comments</th>
                                              <th className="px-2 py-1 text-left">Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr className="border-b border-blue-100">
                                              {editingVersionTechpackId === tp.id ? (
                                                <>
                                                  <td className="px-2 py-1">
                                                    <input
                                                      type="text"
                                                      value={(() => {
                                                        // Find the highest version in history and current
                                                        const allVersions = [tp.version, ...(tp.versionHistory ? tp.versionHistory.map(vh => vh.version) : [])];
                                                        // Only consider numeric versions
                                                        const numericVersions = allVersions.map(v => parseInt(v, 10)).filter(v => !isNaN(v));
                                                        const nextVersion = numericVersions.length > 0 ? Math.max(...numericVersions) + 1 : 1;
                                                        return nextVersion.toString();
                                                      })()}
                                                      readOnly
                                                      className="px-1 py-0.5 border border-blue-300 rounded text-sm w-full bg-gray-100 cursor-not-allowed"
                                                    />
                                                  </td>
                                                  <td className="px-2 py-1">
                                                    <input
                                                      type="text"
                                                      value={versionEditValues?.status ?? tp.status}
                                                      onChange={e => setVersionEditValues(v => {
                                                        const base = v || { version: tp.version, status: tp.status, lastUpdated: tp.lastUpdated, comments: typeof tp.comments === 'string' ? tp.comments : '' };
                                                        return { ...base, status: e.target.value, comments: typeof base.comments === 'string' ? base.comments : '' };
                                                      })}
                                                      className="px-1 py-0.5 border border-blue-300 rounded text-sm w-full"
                                                    />
                                                  </td>
                                                  <td className="px-2 py-1">
                                                    <input
                                                      type="text"
                                                      value={versionEditValues?.lastUpdated ?? tp.lastUpdated}
                                                      onChange={e => setVersionEditValues(v => {
                                                        const base = v || { version: tp.version, status: tp.status, lastUpdated: tp.lastUpdated, comments: typeof tp.comments === 'string' ? tp.comments : '' };
                                                        return { ...base, lastUpdated: e.target.value, comments: typeof base.comments === 'string' ? base.comments : '' };
                                                      })}
                                                      className="px-1 py-0.5 border border-blue-300 rounded text-sm w-full"
                                                    />
                                                  </td>
                                                  <td className="px-2 py-1">
                                                    <textarea
                                                      value={versionEditValues?.comments ?? (tp.comments || '')}
                                                      onChange={e => setVersionEditValues(v => {
                                                        const base = v || { version: tp.version, status: tp.status, lastUpdated: tp.lastUpdated, comments: typeof tp.comments === 'string' ? tp.comments : '' };
                                                        return { ...base, comments: e.target.value, lastUpdated: typeof base.lastUpdated === 'string' ? base.lastUpdated : '' };
                                                      })}
                                                      className="px-1 py-0.5 border border-blue-300 rounded text-sm w-full"
                                                      rows={2}
                                                      placeholder="Add comments..."
                                                    />
                                                  </td>
                                                  <td className="px-2 py-1">
                                                    <button
                                                      className={`text-xs px-2 py-1 border rounded ${canEditTechpacks() ? 'text-green-600 hover:text-green-800 border-green-200' : 'text-gray-400 border-gray-200 cursor-not-allowed'}`}
                                                      onClick={() => {
                                                        if (!canEditTechpacks()) {
                                                          alert('You do not have permission to edit techpacks. Only Admin and QA users can edit techpack details.');
                                                          return;
                                                        }
                                                        if (versionEditValues) {
                                                          // Save previous version to history before updating
                                                          const prevVersion = tp.version;
                                                          const prevStatus = tp.status;
                                                          const prevLastUpdated = tp.lastUpdated;
                                                          const newHistory = Array.isArray(tp.versionHistory) ? [...tp.versionHistory] : [];
                                                          newHistory.unshift({ version: prevVersion, status: prevStatus, lastUpdated: prevLastUpdated });
                                                          // Auto-increment version
                                                          const allVersions = [tp.version, ...(tp.versionHistory ? tp.versionHistory.map(vh => vh.version) : [])];
                                                          const numericVersions = allVersions.map(v => parseInt(v, 10)).filter(v => !isNaN(v));
                                                          const nextVersion = numericVersions.length > 0 ? Math.max(...numericVersions) + 1 : 1;
                                                          // Ensure status is valid and cast to Techpack status type
                                                          const allowedStatuses = ['Draft', 'In Review', 'Approved', 'Revision Required'] as const;
                                                          const safeStatus = allowedStatuses.includes(versionEditValues.status as any)
                                                            ? (versionEditValues.status as typeof allowedStatuses[number])
                                                            : 'Draft';
                                                          // Ensure comments is a string or undefined
                                                          const safeComments =
                                                            typeof versionEditValues.comments === 'string'
                                                              ? versionEditValues.comments
                                                              : versionEditValues.comments != null
                                                                ? String(versionEditValues.comments)
                                                                : undefined;
                                                          updateTechpack(tp.id, {
                                                            ...versionEditValues,
                                                            version: nextVersion.toString(),
                                                            status: safeStatus,
                                                            comments: safeComments,
                                                            lastUpdated: new Date().toISOString(),
                                                            versionHistory: newHistory
                                                          });
                                                        }
                                                        setEditingVersionTechpackId(null);
                                                        setVersionEditValues(null);
                                                      }}
                                                      disabled={!canEditTechpacks()}
                                                    >
                                                      Save {!canEditTechpacks() && <Lock className="h-3 w-3 inline ml-1" />}
                                                    </button>
                                                    <button
                                                      className={`text-xs px-2 py-1 border rounded ${canEditTechpacks() ? 'text-gray-600 hover:text-gray-800 border-gray-200' : 'text-gray-400 border-gray-200 cursor-not-allowed'}`}
                                                      onClick={() => {
                                                        if (!canEditTechpacks()) {
                                                          alert('You do not have permission to edit techpacks. Only Admin and QA users can edit techpack details.');
                                                          return;
                                                        }
                                                        setEditingVersionTechpackId(null);
                                                        setVersionEditValues(null);
                                                      }}
                                                      disabled={!canEditTechpacks()}
                                                    >
                                                      Cancel {!canEditTechpacks() && <Lock className="h-3 w-3 inline ml-1" />}
                                                    </button>
                                                  </td>
                                                </>
                                              ) : (
                                                <>
                                                  <td className="px-2 py-1">{tp.version}</td>
                                                  <td className="px-2 py-1">{tp.status}</td>
                                                  <td className="px-2 py-1">{tp.lastUpdated}</td>
                                                  <td className="px-2 py-1">
                                                    <span className="text-xs text-gray-600">
                                                      {tp.comments || 'No comments'}
                                                    </span>
                                                  </td>
                                                  <td className="px-2 py-1">
                                                    <button
                                                      className={`text-xs px-2 py-1 border rounded ${canEditTechpacks() ? 'text-blue-600 hover:text-blue-800 border-blue-200' : 'text-gray-400 border-gray-200 cursor-not-allowed'}`}
                                                      onClick={() => {
                                                        if (!canEditTechpacks()) {
                                                          alert('You do not have permission to edit techpacks. Only Admin and QA users can edit techpack details.');
                                                          return;
                                                        }
                                                        setEditingVersionTechpackId(tp.id);
                                                        const allowedStatuses = ['Draft', 'In Review', 'Approved', 'Revision Required'] as const;
                                                        const safeStatus = allowedStatuses.includes(tp.status as any)
                                                          ? (tp.status as typeof allowedStatuses[number])
                                                          : 'Draft';
                                                        setVersionEditValues({
                                                          version: tp.version,
                                                          status: safeStatus,
                                                          lastUpdated: tp.lastUpdated,
                                                          comments: typeof tp.comments === 'string' ? tp.comments : (tp.comments !== undefined && tp.comments !== null ? String(tp.comments) : undefined)
                                                        });
                                                      }}
                                                      disabled={!canEditTechpacks()}
                                                    >
                                                      Edit {!canEditTechpacks() && <Lock className="h-3 w-3 inline ml-1" />}
                                                    </button>
                                                  </td>
                                                </>
                                              )}
                                            </tr>
                                          </tbody>
                                        </table>
                                        {/* Version History Table */}
                                        {tp.versionHistory && tp.versionHistory.length > 0 && (
                                          <div className="mb-2">
                                            <div className="font-semibold text-gray-700 mb-1">Version History</div>
                                            <table className="w-full text-xs border border-gray-200 rounded">
                                              <thead className="bg-gray-100">
                                                <tr>
                                                  <th className="px-2 py-1 text-left">Version</th>
                                                  <th className="px-2 py-1 text-left">Status</th>
                                                  <th className="px-2 py-1 text-left">Last Updated</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {tp.versionHistory.map((vh, idx) => (
                                                  <tr key={idx} className="border-b border-gray-100">
                                                    <td className="px-2 py-1">{vh.version}</td>
                                                    <td className="px-2 py-1">{vh.status}</td>
                                                    <td className="px-2 py-1">{vh.lastUpdated}</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                  {/* Fibre Composition Group Table */}
                                  <div>
                                    <div className="font-semibold text-blue-700 mb-1">Fibre Composition Group</div>
                                    {techpacksForProduct.map(tp => (
                                      <div key={tp.id} className="mb-4">
                                        {(tp.fibreCompositions || []).map((group, groupIdx) => (
                                          <div key={groupIdx} className="mb-4 border rounded p-2 bg-gray-50">
                                            <div className="flex items-center justify-between mb-2">
                                              <input
                                                type="text"
                                                value={group.groupName}
                                                onChange={e => {
                                                  const newGroups = (tp.fibreCompositions || []).slice();
                                                  newGroups[groupIdx].groupName = e.target.value;
                                                  updateTechpack(tp.id, { fibreCompositions: newGroups });
                                                }}
                                                className="font-semibold px-2 py-1 border border-gray-300 rounded text-lg bg-white"
                                                disabled={!canEditTechpacks()}
                                              />
                                              <button
                                                className="text-xs px-2 py-1 border rounded text-red-500 border-red-200 hover:text-red-700 ml-2"
                                                onClick={() => {
                                                  // Remove group
                                                  const newGroups = (tp.fibreCompositions || []).slice();
                                                  newGroups.splice(groupIdx, 1);
                                                  updateTechpack(tp.id, { fibreCompositions: newGroups });
                                                }}
                                                disabled={!canEditTechpacks()}
                                              >
                                                Remove Group
                                              </button>
                                            </div>
                                            <table className="w-full text-xs border border-gray-200 rounded mb-1">
                                              <thead className="bg-blue-100">
                                                <tr>
                                                  <th className="px-2 py-1 text-left">Fibre</th>
                                                  <th className="px-2 py-1 text-left">%</th>
                                                  <th className="px-2 py-1 text-left">Actions</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {group.fibres.map((fibre, fibreIdx) => (
                                                  <tr key={fibreIdx} className="border-b border-blue-100">
                                                    <td className="px-2 py-1">
                                                      <select
                                                        value={fibre.fibre}
                                                        onChange={e => {
                                                          const newGroups = (tp.fibreCompositions || []).slice();
                                                          newGroups[groupIdx].fibres[fibreIdx].fibre = e.target.value;
                                                          updateTechpack(tp.id, { fibreCompositions: newGroups });
                                                        }}
                                                        className="px-1 py-0.5 border border-blue-300 rounded text-sm w-full"
                                                        disabled={!canEditTechpacks()}
                                                      >
                                                        {FIBRE_TYPES.map(type => (
                                                          <option key={type} value={type}>{type}</option>
                                                        ))}
                                                      </select>
                                                    </td>
                                                    <td className="px-2 py-1">
                                                      <input
                                                        type="number"
                                                        value={fibre.percentage}
                                                        min="0"
                                                        max="100"
                                                        step="0.1"
                                                        onChange={e => {
                                                          const newGroups = (tp.fibreCompositions || []).slice();
                                                          newGroups[groupIdx].fibres[fibreIdx].percentage = parseFloat(e.target.value) || 0;
                                                          updateTechpack(tp.id, { fibreCompositions: newGroups });
                                                        }}
                                                        className="px-1 py-0.5 border border-blue-300 rounded text-sm w-full"
                                                        disabled={!canEditTechpacks()}
                                                      />
                                                    </td>
                                                    <td className="px-2 py-1">
                                                      <button
                                                        className="text-xs px-2 py-1 border rounded text-red-500 border-red-200 hover:text-red-700"
                                                        onClick={() => {
                                                          const newGroups = (tp.fibreCompositions || []).slice();
                                                          newGroups[groupIdx].fibres.splice(fibreIdx, 1);
                                                          updateTechpack(tp.id, { fibreCompositions: newGroups });
                                                        }}
                                                        disabled={!canEditTechpacks()}
                                                      >
                                                        Remove
                                                      </button>
                                                    </td>
                                                  </tr>
                                                ))}
                                                <tr>
                                                  <td className="px-2 py-1 font-bold">Total</td>
                                                  <td className="px-2 py-1 font-bold">
                                                    {group.fibres.reduce((sum, f) => sum + (parseFloat(f.percentage) || 0), 0)}
                                                  </td>
                                                  <td></td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <button
                                              className="text-xs px-2 py-1 border rounded text-blue-600 border-blue-200 hover:text-blue-800"
                                              onClick={() => {
                                                const newGroups = (tp.fibreCompositions || []).slice();
                                                newGroups[groupIdx].fibres.push({ fibre: FIBRE_TYPES[0], percentage: 0 });
                                                updateTechpack(tp.id, { fibreCompositions: newGroups });
                                              }}
                                              disabled={!canEditTechpacks()}
                                            >
                                              Add Fibre
                                            </button>
                                          </div>
                                        ))}
                                        <button
                                          className="text-xs px-2 py-1 border rounded text-green-600 border-green-200 hover:text-green-800"
                                          onClick={() => {
                                            const newGroups = (tp.fibreCompositions || []).slice();
                                            newGroups.push({ groupName: 'Shell', fibres: [{ fibre: FIBRE_TYPES[0], percentage: 0 }] });
                                            updateTechpack(tp.id, { fibreCompositions: newGroups });
                                          }}
                                          disabled={!canEditTechpacks()}
                                        >
                                          Add Group
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <table className="w-full text-sm border border-blue-200 rounded">
                                  <thead className="bg-blue-100">
                                    <tr>
                                      {getFieldsForTab(expandedTechpackTab).map(field => (
                                        <th key={field.key} className="px-2 py-1 text-left">{field.label}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {techpacksForProduct.map(tp => (
                                      <tr key={tp.id} className="border-b border-blue-100">
                                        {getFieldsForTab(expandedTechpackTab).map(field => (
                                          <td key={field.key} className="px-2 py-1">
                                            {editingCell && editingCell.techpackId === tp.id && editingCell.field === field.key ? (
                                              <input
                                                type="text"
                                                value={editValue}
                                                autoFocus
                                                onChange={e => setEditValue(e.target.value)}
                                                onBlur={() => handleCellEdit(tp.id, field.key, editValue)}
                                                onKeyDown={e => {
                                                  if (e.key === 'Enter') handleCellEdit(tp.id, field.key, editValue);
                                                  if (e.key === 'Escape') setEditingCell(null);
                                                }}
                                                className="px-1 py-0.5 border border-blue-300 rounded text-sm w-full"
                                              />
                                            ) : (
                                              <span
                                                className={`${canEditTechpacks() ? 'cursor-pointer hover:underline' : 'cursor-not-allowed text-gray-500'}`}
                                                onClick={() => {
                                                  if (!canEditTechpacks()) {
                                                    alert('You do not have permission to edit techpacks. Only Admin and QA users can edit techpack details.');
                                                    return;
                                                  }
                                                  setEditingCell({ techpackId: tp.id, field: field.key });
                                                  setEditValue(getTechpackFieldValue(tp, field.key)?.toString() ?? '');
                                                }}
                                              >
                                                {getTechpackFieldValue(tp, field.key)?.toString() ?? ''}
                                                {!canEditTechpacks() && <Lock className="h-3 w-3 inline ml-1 text-gray-400" />}
                                              </span>
                                            )}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Detail Tabs */}
          <div className="border-t border-gray-200 bg-gray-50">
            <nav className="flex gap-2 px-4 pt-2">
              {detailTabs.map(tab => (
                <button
                  key={tab}
                  className={`px-3 py-2 font-medium rounded-t transition-colors ${activeDetailTab === tab ? 'bg-white border-x border-t border-gray-200 text-blue-700' : 'text-gray-600 hover:text-blue-600'}`}
                  onClick={() => setActiveDetailTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </nav>
            <div className="p-4">
              {/* Placeholder for detail tab content */}
              <div className="text-gray-500">{activeDetailTab} content goes here.</div>
            </div>
          </div>
        </div>
        <AddProductModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
        <AddTechpackModal
          isOpen={showAddTechpackModal}
          onClose={() => setShowAddTechpackModal(false)}
          initialStyleNumber={techpackModalProduct?.styleNumber}
          initialCustomer={techpackModalProduct?.customer}
        />
        <AddFibreModal
          isOpen={showAddFibreModal.open}
          onClose={() => setShowAddFibreModal({ open: false, techpackId: null })}
          onAdd={fibreData => {
            handleAddFibre(fibreData);
            setShowAddFibreModal({ open: false, techpackId: null });
          }}
        />
        <ReportingModal
          isOpen={showReportingModal}
          onClose={() => setShowReportingModal(false)}
          onGenerateReport={handleGenerateReport}
        />
        <LinkedTechpacksModal
          isOpen={linkedTechpacksModal.open}
          onClose={() => setLinkedTechpacksModal({ open: false, techpacks: [] })}
          techpacks={linkedTechpacksModal.techpacks}
        />
        {/* Only render EditProductModal if editModal.product is not null */}
        {editModal.product && (
          <EditProductModal
            isOpen={editModal.open}
            onClose={() => setEditModal({ open: false, product: null })}
            product={editModal.product}
            onSave={updated => {
              if (editModal.product && editModal.product.id) {
                updateProduct(editModal.product.id, updated);
              }
            }}
          />
        )}
        <ConfirmModal
          isOpen={confirmModal.open}
          onClose={() => setConfirmModal({ open: false, action: null, product: null })}
          onConfirm={() => {
            if (!confirmModal.product || !confirmModal.product.id) return;
            if (confirmModal.action === 'delete') {
              deleteProduct(confirmModal.product.id);
            } else if (confirmModal.action === 'duplicate') {
              // Only destructure if confirmModal.product is a Product
              const { id, ...rest } = confirmModal.product;
              // rest is Product without id
              addProduct({ ...(rest as Omit<Product, 'id' | 'createdDate' | 'lastUpdated'>), styleNumber: rest.styleNumber + '_COPY' });
            }
          }}
          title={confirmModal.action === 'delete' ? 'Delete Product' : 'Duplicate Product'}
          message={confirmModal.action === 'delete' ? 'Are you sure you want to delete this product?' : 'Are you sure you want to duplicate this product?'}
        />
      </main>
    </div>
  );
};

export default PurchaseOrders;