import React, { useState, useCallback, useMemo } from 'react';
import ReportBar from '../components/ReportBar';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import TabContent from '../components/TabContent';
import { useSidebar } from '../contexts/SidebarContext';
import { LEFT_TABS, RIGHT_TABS } from '../types/productManager';

const ProductManager: React.FC = () => {
  // State management
  const [leftActiveTab, setLeftActiveTab] = useState('Tech Pack Version');
  const [rightActiveTab, setRightActiveTab] = useState('Products');
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>(['Spring/Summer 2024']);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [selectedProductFilter, setSelectedProductFilter] = useState('Default');
  const [isProductFilterDropdownOpen, setIsProductFilterDropdownOpen] = useState(false);
  const [showSlideUpContainer, setShowSlideUpContainer] = useState(false);
  const [activeContent, setActiveContent] = useState('activities');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  
  // Product Filter Sidebar state
  const [filterSidebarCollapsed, setFilterSidebarCollapsed] = useState(false);
  
  // Sidebar context
  const { sidebarCollapsed } = useSidebar();

  // Memoized event handlers
  const handleLeftTabChange = useCallback((tab: string) => {
    setLeftActiveTab(tab);
  }, []);

  const handleRightTabChange = useCallback((tab: string) => {
    setRightActiveTab(tab);
  }, []);

  const handleRowClick = useCallback((row: any) => {
    setSelectedRowIndex(row.id);
  }, []);

  // Memoized tab arrays
  const leftTabs = useMemo(() => LEFT_TABS, []);
  const rightTabs = useMemo(() => RIGHT_TABS, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content with Product Filter Sidebar */}
      <div className="flex-1 flex">
        {/* Product Filter Sidebar - positioned inside the page content */}
        <ProductFilterSidebar 
          collapsed={filterSidebarCollapsed}
          setCollapsed={setFilterSidebarCollapsed}
        />
        
        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${filterSidebarCollapsed ? 'ml-0' : 'ml-0'}`}>
          <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Product Manager</h1>
      </div>
      
             {/* Vertical Layout - Top to Bottom */}
       <div className="flex flex-col gap-6">
                 {/* Top Section - Tech Pack Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full" style={{ maxHeight: '400px' }}>
          {/* Tab Navigation */}
          <div className="border-b" style={{ borderColor: '#3D75A3' }}>
            <div className="overflow-x-auto">
              <div className="flex min-w-max">
                {leftTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleLeftTabChange(tab)}
                    className={`px-4 py-3 font-medium text-xs flex-shrink-0 ${
                      leftActiveTab === tab
                        ? 'bg-gray-100 text-gray-900 border-t-2 border-l-2 shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                    style={leftActiveTab === tab ? { borderColor: '#3D75A3' } : {}}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="overflow-auto" style={{ maxHeight: '300px' }}>
            <TabContent
              activeTab={leftActiveTab}
              selectedRowId={selectedRowIndex?.toString()}
              onRowClick={handleRowClick}
            />
          </div>
        </div>

         {/* Horizontal Divider */}
         <div className="w-full h-px bg-gray-300"></div>
         
                 {/* Bottom Section - Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full" style={{ maxHeight: '400px' }}>
          {/* Tab Navigation */}
          <div className="border-b" style={{ borderColor: '#3D75A3' }}>
            <div className="overflow-x-auto">
              <div className="flex min-w-max">
                {rightTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleRightTabChange(tab)}
                    className={`px-4 py-3 font-medium text-xs flex-shrink-0 ${
                      rightActiveTab === tab
                        ? 'bg-gray-100 text-gray-900 border-t-2 border-l-2 shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                    style={rightActiveTab === tab ? { borderColor: '#3D75A3' } : {}}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="overflow-auto" style={{ maxHeight: '300px' }}>
            <TabContent
              activeTab={rightActiveTab}
              selectedRowId={selectedRowIndex?.toString()}
              onRowClick={handleRowClick}
            />
          </div>
        </div>
       </div>

      {/* ReportBar Component */}
      <ReportBar
        showSlideUpContainer={showSlideUpContainer}
        setShowSlideUpContainer={setShowSlideUpContainer}
        activeContent={activeContent}
        setActiveContent={setActiveContent}
        sidebarCollapsed={sidebarCollapsed}
        pageData={{
          'Created': '2024-01-15',
          'Last Edited': '2024-01-20',
          'PO Issue Date': '2024-01-25',
          'Order References': selectedRowIndex !== null ? `Product-${selectedRowIndex + 1}` : 'Product-001',
          'Status': selectedRowIndex !== null ? (selectedRowIndex % 2 === 0 ? 'Active' : 'Pending') : 'Active',
          'Production': 'In Progress',
          'Purchase Order Status': 'Issued',
          'Template': 'Standard Product Template',
          'Default PO Line Template': 'Product Line Template',
          'Customer': 'ABC Corp',
          'Supplier': 'XYZ Textiles',
          'Purchase Currency': 'USD',
          'Selling Currency': 'EUR',
          'Total Qty': '1000',
          'Total Cost': '$10,000',
          'Total Value': '$12,000'
        }}
      />
          </div>
        </div>
          </div>
        </div>
  );
};


export default ProductManager;

