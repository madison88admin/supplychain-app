import React, { useState } from 'react';
import ReportBar from '../components/ReportBar';
import { useSidebar } from '../contexts/SidebarContext';

const ProductManager: React.FC = () => {
  const [leftActiveTab, setLeftActiveTab] = useState('Tech Pack Version');
  const [rightActiveTab, setRightActiveTab] = useState('Products');
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>(['Spring/Summer 2024']);
  const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
  const [selectedProductFilter, setSelectedProductFilter] = useState('Default');
  const [isProductFilterDropdownOpen, setIsProductFilterDropdownOpen] = useState(false);
  const [showSlideUpContainer, setShowSlideUpContainer] = useState(false);
  const [activeContent, setActiveContent] = useState('activities');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  
  // Sidebar context
  const { sidebarCollapsed } = useSidebar();
  return (
    <div className="p-6">
      <div className="mb-8 flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-900">Product Manager</h1>
        
        {/* Season Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {selectedSeasons.length === 0 
                ? 'All Seasons' 
                : selectedSeasons.length === 1 
                  ? selectedSeasons[0] 
                  : `${selectedSeasons.length} Seasons`
              }
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isSeasonDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isSeasonDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Filter by Season</h3>
                  <button
                    onClick={() => {
                      setSelectedSeasons([]);
                      setIsSeasonDropdownOpen(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="py-1 max-h-48 overflow-y-auto">
                {[
                  'Spring/Summer 2024',
                  'Fall/Winter 2024',
                  'Spring/Summer 2025',
                  'Fall/Winter 2025',
                  'Holiday 2024',
                  'Resort 2025'
                ].map((season) => (
                  <label
                    key={season}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSeasons.includes(season)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSeasons([...selectedSeasons, season]);
                        } else {
                          setSelectedSeasons(selectedSeasons.filter(s => s !== season));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">{season}</span>
                  </label>
                ))}
              </div>
              <div className="p-3 border-t border-gray-200">
                <button
                  onClick={() => setIsSeasonDropdownOpen(false)}
                  className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProductFilterDropdownOpen(!isProductFilterDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{selectedProductFilter}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isProductFilterDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isProductFilterDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="py-1">
                {['Default', 'Library'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedProductFilter(option);
                      setIsProductFilterDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      selectedProductFilter === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
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
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VERSION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APPROVED BY</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">v1.0</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">John Smith</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">v1.1</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-20</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">-</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">v1.2</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-01-25</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-blue-100 text-blue-800">
                          In Review
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Sarah Johnson</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">v2.0</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">2024-02-01</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Draft
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">-</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {leftActiveTab === 'Costings' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMPONENT</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MATERIAL COST</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LABOR COST</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL COST</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MARGIN %</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Fabric</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$8.50</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">$8.50</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">25%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Thread</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$0.75</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">$0.75</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">20%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Buttons</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$1.25</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">$1.25</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">30%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">Assembly</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$0.00</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">$3.50</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">$3.50</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">15%</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-blue-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900">TOTAL</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900">$10.50</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900">$3.50</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900">$14.00</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900">22%</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {leftActiveTab === 'Sample Lines' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SAMPLE TYPE</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLOR</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DUE DATE</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Proto Sample</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">M</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Navy Blue</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-01-10</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Fit Sample</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">S, M, L</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Black</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          In Progress
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-01-25</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Salesman Sample</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">M</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">White, Red</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-02-05</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Pre-Production</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">XS, S, M, L, XL</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">All Colors</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Not Started
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-02-15</td>
                    </tr>
                  </tbody>
                </table>
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
              {['Products', 'Product Colors', 'Product Color Sizes', 'Images', 'Option Images', 'Details'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRightActiveTab(tab)}
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
          <div className="p-4">
            <div className="overflow-x-auto">
              {rightActiveTab === 'Products' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRODUCT ID</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CATEGORY</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">P001</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Cotton T-Shirt</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Apparel</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">P002</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Denim Jeans</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Apparel</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">P003</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Leather Bag</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">Accessories</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {rightActiveTab === 'Product Colors' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLOR CODE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLOR NAME</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HEX CODE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AVAILABLE</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">BLK</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Black</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#000000</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">NAV</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Navy Blue</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#000080</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">WHT</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">White</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#FFFFFF</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          No
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {rightActiveTab === 'Product Color Sizes' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHEST (CM)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LENGTH (CM)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STOCK</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">XS</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">86</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">58</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">25</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">S</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">91</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">60</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">45</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">M</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">96</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">62</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">67</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">L</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">101</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">64</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">52</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">XL</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">106</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">66</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">38</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {rightActiveTab === 'Images' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMAGE TYPE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FILENAME</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UPLOADED</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Main</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">tshirt_main.jpg</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2.4 MB</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-01-15</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Detail</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">tshirt_detail.png</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1.8 MB</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-01-16</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Back</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">tshirt_back.jpg</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2.1 MB</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2024-01-17</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {rightActiveTab === 'Option Images' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OPTION</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COLOR</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMAGE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Option 1</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Black</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">black_tshirt.jpg</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Uploaded
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Option 2</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Navy</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">navy_tshirt.jpg</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Uploaded
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Option 3</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">White</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">-</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {rightActiveTab === 'Details' && (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROPERTY</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VALUE</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UNIT</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOTES</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Weight</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">180</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">GSM</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Fabric weight</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Material</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">100% Cotton</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">-</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Main fabric</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Care</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Machine wash</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">-</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">30°C</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Origin</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Bangladesh</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">-</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Manufacturing</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
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
  );
};

export default ProductManager;