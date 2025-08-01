import React, { useState, useCallback, useMemo } from 'react';
import ReportBar from '../components/ReportBar';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import TabContent from '../components/TabContent';
import { useSidebar } from '../contexts/SidebarContext';

// You may want to define MATERIAL_LEFT_TABS and MATERIAL_RIGHT_TABS for materials
const MATERIAL_LEFT_TABS = ['Material Supplier Profiles', 'Lines', 'Where Used'];
const MATERIAL_RIGHT_TABS = ['Materials', 'Material Colors', 'Material Sizes', 'Images', 'Option Images', 'Details'];

const MaterialManager: React.FC = () => {
  const [leftActiveTab, setLeftActiveTab] = useState('Material Supplier Profiles');
  const [rightActiveTab, setRightActiveTab] = useState('Materials');
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>(['Spring/Summer 2024']);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [selectedProductFilter, setSelectedProductFilter] = useState('Default');
  const [isProductFilterDropdownOpen, setIsProductFilterDropdownOpen] = useState(false);
  const [showSlideUpContainer, setShowSlideUpContainer] = useState(false);
  const [activeContent, setActiveContent] = useState('activities');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [filterSidebarCollapsed, setFilterSidebarCollapsed] = useState(false);

  const { sidebarCollapsed } = useSidebar();

  const handleLeftTabChange = useCallback((tab: string) => {
    setLeftActiveTab(tab);
  }, []);

  const handleRightTabChange = useCallback((tab: string) => {
    setRightActiveTab(tab);
  }, []);

  const handleRowClick = useCallback((row: any) => {
    setSelectedRowIndex(row.id);
  }, []);

  const leftTabs = useMemo(() => MATERIAL_LEFT_TABS, []);
  const rightTabs = useMemo(() => MATERIAL_RIGHT_TABS, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex">
        <ProductFilterSidebar 
          collapsed={filterSidebarCollapsed}
          setCollapsed={setFilterSidebarCollapsed}
        />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${filterSidebarCollapsed ? 'ml-0' : 'ml-0'}`}>
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Material Manager</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b" style={{ borderColor: '#3D75A3' }}>
                  <div className="flex">
                    {leftTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => handleLeftTabChange(tab)}
                        className={`px-4 py-3 font-medium text-xs ${
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
                <TabContent
                  activeTab={leftActiveTab}
                  selectedRowId={selectedRowIndex?.toString()}
                  onRowClick={handleRowClick}
                />
              </div>
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2"></div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b" style={{ borderColor: '#3D75A3' }}>
                  <div className="flex">
                    {rightTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => handleRightTabChange(tab)}
                        className={`px-4 py-3 font-medium text-xs ${
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
                <TabContent
                  activeTab={rightActiveTab}
                  selectedRowId={selectedRowIndex?.toString()}
                  onRowClick={handleRowClick}
                />
              </div>
            </div>
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
                'Order References': selectedRowIndex !== null ? `Material-${selectedRowIndex + 1}` : 'Material-001',
                'Status': selectedRowIndex !== null ? (selectedRowIndex % 2 === 0 ? 'Active' : 'Pending') : 'Active',
                'Production': 'In Progress',
                'Purchase Order Status': 'Issued',
                'Template': 'Standard Material Template',
                'Default PO Line Template': 'Material Line Template',
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

export default MaterialManager;