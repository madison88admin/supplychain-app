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
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Left Column - Tech Pack Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b" style={{ borderColor: '#3D75A3' }}>
            <div className="flex">
              {['Tech Pack Version', 'Costings', 'Sample Lines', 'Lines', 'Bill Of Materials'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLeftActiveTab(tab)}
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
          
          {/* Tab Content */}
          <div className="p-4">
            <div className="overflow-x-auto">
              {leftActiveTab === 'Tech Pack Version' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VERSION NUMBER</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMMENT</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BILL OF MATERIAL VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE SPECIFICATION VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CARE INSTRUCTIONS VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIBRE COMPOSITION VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LABEL VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CURRENT VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED BY</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Cotton T-Shirt</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">v1.0</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Initial version</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">BOM-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">SIZE-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">CARE-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIBRE-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">LABEL-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIT-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Yes</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Cotton T-Shirt</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">v1.1</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Updated sizing</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">BOM-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">SIZE-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">CARE-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIBRE-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">LABEL-001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIT-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">No</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Sarah Johnson</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-20</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Cotton T-Shirt</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">v1.2</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Material update</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">BOM-003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">SIZE-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">CARE-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIBRE-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">LABEL-002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIT-003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">No</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Mike Wilson</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-25</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Cotton T-Shirt</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">v2.0</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Major revision</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">BOM-004</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">SIZE-003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">CARE-003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIBRE-003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">LABEL-003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">FIT-004</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">No</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Lisa Chen</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-02-01</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {leftActiveTab === 'Costings' && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                  <thead className="bg-gray-50">
                    <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING REFERENCE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT NAME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT CUSTOMER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MINIMUM ORDER QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER QUANTITY INCREMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER LEAD TIME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE ORDER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO. OF COLORS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE PRICE TOTAL</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING PRICE TOTAL</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST RECALCULATED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER LOCATION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER COUNTRY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEFAULT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADD NEW COLORS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APPROVED DATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER STYLE NAME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER REF.</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER STYLE NUMBER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED BY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST EDITED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST EDITED BY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LANDED SUBTOTAL</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELL INC COMM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER SURCHARGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER SURCHARGE PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MARGIN</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LANDED SUBTOTAL COST</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPECIAL SUR</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">COST-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Cotton T-Shirt</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">ABC Textiles</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fashion Retail Co</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$8.50</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12.75</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">1000</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">500</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">100</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">30 days</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Standard</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">PO-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SR-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">3</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$8,500.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12,750.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Shanghai</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">China</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Yes</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Yes</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-20</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Active</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 30</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">30 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 60</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">60 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">TS-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SUP-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">BSN-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Initial costing</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-10</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Sarah Johnson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$9,200.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$13,800.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$700.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">7.6%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">35.2%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$8,500.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">COST-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Denim Jeans</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">XYZ Denim</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Blue Jeans Inc</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$15.25</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$22.88</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">800</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">400</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">50</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">45 days</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Premium</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">PO-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SR-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12,200.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$18,304.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-18</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Dhaka</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Bangladesh</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">No</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">No</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-25</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Pending</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">In Development</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 45</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">45 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 90</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">90 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">EUR</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">DJ-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SUP-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">BSN-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Premium denim</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Mike Wilson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-12</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-18</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Lisa Chen</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$13,500.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$20,250.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$1,300.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">10.7%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">33.3%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12,200.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">COST-003</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Wool Sweater</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Wool Masters</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Winter Wear Ltd</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$22.75</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$34.13</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">600</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">300</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">75</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">60 days</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Luxury</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">PO-003</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SR-003</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">4</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$13,650.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$20,478.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-22</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Milan</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Italy</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Yes</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Yes</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-28</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Active</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 60</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">60 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 120</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">120 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">EUR</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">WS-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SUP-003</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">BSN-003</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Premium wool</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">David Brown</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-22</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Emma Davis</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$15,200.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$22,800.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$1,550.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">11.4%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">33.3%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$13,650.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              )}

              {leftActiveTab === 'Sample Lines' && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST LINE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT COMMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG NAME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLLECTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DIVISION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GROUP</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRANSPORT METHOD</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVER TO</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EX-FACTORY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMMENTS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLOSED DATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LINE PURCHASE PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LINE SELLING PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOTE COUNT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LATEST NOTE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER QUANTITY INCREMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER LEAD TIME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER REF.</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STANDARD MINUTE VALUE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TEMPLATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REQUEST DATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MINIMUM ORDER QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUB TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT BUYER STYLE NAME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT BUYER STYLE NUMBER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE PURCHASE PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE PURCHASE PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER PURCHASE PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER PURCHASE PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE SELLING PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE SELLING PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER SELLING PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER SELLING PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCTION DEVELOPMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHINA - QC</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MLA - PURCHASING</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 5</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 6</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 7</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 8</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEASON</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEPARTMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER PARENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RECIPIENT PRODUCT SUPPLIER-FACTORY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FG PO NUMBER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RECEIVED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BALANCE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OVER RECEIVED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT TECH PACK VERSION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAIN MATERIAL</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAIN MATERIAL DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVERY CONTACT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 1</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 2</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 3</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 4</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED BY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST EDITED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST EDITED BY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLOR</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">M88 AWB</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MLO AWB</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SHIPMENT ID</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUICKBOOKS INVOICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER INVOICE #</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIERS INV. PAYMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISCOUNT PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELL INC COMM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER SURCHARGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER SURCHARGE PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MOQ</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISCOUNT COST</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPECIAL SUR</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FACTORY SURCHARGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FACTORY SURCHARGE PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>CUSTOMER PROTO APPROVAL</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>TOP SAMPLE EX-M88</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>TOP SAMPLE EX-FACTORY</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>TOP SAMPLE REQUEST</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>PPS SAMPLE EX-M88</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>PPS SAMPLE EX-FACTORY</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>PPS SAMPLE REQUEST</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>TEST REPORT RECEIVED</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>TEST SAMPLE EX-FACTORY</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>TESTING SAMPLE REQUEST</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>PROTO SAMPLE REQUEST</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>PROTO SAMPLE EX-FACTORY</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>PROTO SAMPLE EX-M88</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>CUSTOMER PPS APPROVAL</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>CUSTOMER TOP APPROVAL</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>
                          <div className="flex items-center justify-between">
                            <span>SAMPLE DELIVERY DATE</span>
                            <div className="w-4 h-4 border border-gray-400 rounded bg-gray-100 flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                            </div>
                          </div>
                        </th>
                      </tr>
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST LINE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT COMMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIT LOG NAME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLLECTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DIVISION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GROUP</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRANSPORT METHOD</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVER TO</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EX-FACTORY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMMENTS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLOSED DATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LINE PURCHASE PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LINE SELLING PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOTE COUNT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LATEST NOTE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER QUANTITY INCREMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER LEAD TIME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER REF.</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STANDARD MINUTE VALUE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TEMPLATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REQUEST DATE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE REQUEST STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MINIMUM ORDER QUANTITY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUB TYPE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT BUYER STYLE NAME</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT BUYER STYLE NUMBER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING PURCHASE CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING SELLING CURRENCY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COSTING STATUS</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE PURCHASE PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE PURCHASE PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER PURCHASE PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER PURCHASE PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE SELLING PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE SELLING PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER SELLING PAYMENT TERM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT SUPPLIER SELLING PAYMENT TERM DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PURCHASE PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELLING PRICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCTION DEVELOPMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHINA - QC</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MLA - PURCHASING</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 5</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 6</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 7</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY USER 8</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEASON</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEPARTMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER PARENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RECIPIENT PRODUCT SUPPLIER-FACTORY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FG PO NUMBER</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RECEIVED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BALANCE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OVER RECEIVED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT TECH PACK VERSION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAIN MATERIAL</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAIN MATERIAL DESCRIPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVERY CONTACT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 1</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 2</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 3</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR KEY WORKING GROUP 4</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED BY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST EDITED</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST EDITED BY</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLOR</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">M88 AWB</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MLO AWB</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SHIPMENT ID</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUICKBOOKS INVOICE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER INVOICE #</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIERS INV. PAYMENT</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISCOUNT PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SELL INC COMM</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER SURCHARGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUYER SURCHARGE PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MOQ</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISCOUNT COST</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPECIAL SUR</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FACTORY SURCHARGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FACTORY SURCHARGE PERCENTAGE</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300">
                          <div className="flex items-center justify-between">
                            <span>TARGET DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center justify-between">
                            <span>COMPLETED DATE</span>
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">SR-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Cotton T-Shirt</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SRL-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">5</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Good fit</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Initial</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">FL-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fashion Retail Co</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Spring 2024</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Casual</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Tops</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Air Freight</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">HQ Office</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Completed</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Sample approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">1000</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-20</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$8.50</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12.75</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">3</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fit approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">100</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">30 days</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SUP-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">15.5</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Standard</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-10</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">ABC Textiles</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">500</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Basic cotton t-shirt</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Apparel</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Tops</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Active</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">TS-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">BSN-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">COST-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Approved</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 30</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">30 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 30</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">30 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 30</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">30 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 60</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">60 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 60</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">60 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$8.50</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12.75</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Sarah Johnson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Mike Wilson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Lisa Chen</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Emma Davis</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">David Brown</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Spring 2024</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Design</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fashion Retail Co</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">ABC Factory</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">PO-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">5</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">0</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">0</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">M</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">v1.0</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Cotton</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">100% Cotton</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team A</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team B</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team C</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team D</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-10</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Sarah Johnson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Navy Blue</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">AWB-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">MLO-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SHIP-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">QB-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">INV-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$8,500.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">5%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12,750.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$700.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">7.6%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">500</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$425.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">0%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-02-01</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-25</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-medium text-gray-900">SR-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Denim Jeans</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SRL-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">3</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Needs adjustment</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Pending</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Revision</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">FL-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Blue Jeans Inc</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fall 2024</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Denim</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Bottoms</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Sea Freight</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Warehouse</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">In Progress</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-02-01</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fit issues found</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">800</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">-</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$15.25</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$22.88</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fit revision needed</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">50</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">45 days</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SUP-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">22.0</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Premium</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-18</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Pending</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">EUR</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">XYZ Denim</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">EUR</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">400</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Premium denim jeans</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Apparel</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Bottoms</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">In Development</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">DJ-001</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">BSN-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">COST-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">USD</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">EUR</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Pending</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 45</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">45 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 45</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">45 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 45</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">45 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 90</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">90 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Net 90</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">90 days net</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$15.25</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$22.88</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Mike Wilson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Lisa Chen</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Emma Davis</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">David Brown</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Sarah Johnson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Fall 2024</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Production</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Blue Jeans Inc</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">XYZ Factory</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">PO-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">3</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">0</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">0</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">32</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">v1.1</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Denim</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">100% Cotton Denim</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Mike Wilson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team A</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team B</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team C</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Team D</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Mike Wilson</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-18</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-25</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Lisa Chen</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">Indigo</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">AWB-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">MLO-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">SHIP-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">QB-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">INV-002</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$12,200.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">8%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$18,304.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$1,300.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">10.7%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">400</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$976.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">0%</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">2024-03-01</td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {leftActiveTab === 'Lines' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LINE ITEM</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DESCRIPTION</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUANTITY</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UNIT PRICE</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">001</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Cotton T-Shirt - Navy Blue</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">500</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$14.00</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">$7,000.00</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">002</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Cotton T-Shirt - Black</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">300</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$14.00</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">$4,200.00</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">003</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Cotton T-Shirt - White</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">200</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$14.00</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">$2,800.00</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">004</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Cotton T-Shirt - Red</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">150</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$14.00</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">$2,100.00</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-blue-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900" colSpan={4}>TOTAL</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">$16,100.00</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {leftActiveTab === 'Bill Of Materials' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MATERIAL</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPECIFICATION</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONSUMPTION</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WASTAGE %</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUPPLIER</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Main Fabric</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">100% Cotton, 180 GSM</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1.2 m</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">5%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Textile Corp</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Thread</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Polyester, 40/2</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">150 m</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Thread Co</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Buttons</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Plastic, 15mm</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">3 pcs</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Button World</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Label</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Woven, 100% Cotton</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1 pc</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">0.5%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Label Pro</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Hang Tag</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Cardboard, 80 GSM</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1 pc</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Tag Solutions</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

              {/* Vertical Divider */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 transform -translate-x-1/2"></div>
              
              {/* Right Column - Product Details Tabs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Tab Navigation */}
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
                
                {/* Tab Content */}
                <TabContent
                  activeTab={rightActiveTab}
                  selectedRowId={selectedRowIndex?.toString()}
                  onRowClick={handleRowClick}
                />
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