import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';

interface ReportBarProps {
  showSlideUpContainer: boolean;
  setShowSlideUpContainer: (show: boolean) => void;
  activeContent: string;
  setActiveContent: (content: string) => void;
  sidebarCollapsed?: boolean;
}

const ReportBar: React.FC<ReportBarProps> = ({
  showSlideUpContainer,
  setShowSlideUpContainer,
  activeContent,
  setActiveContent,
  sidebarCollapsed = false
}) => {
  // Simple table components for each button
  const ActivitiesTable = () => (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">Recent Activities</h3>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Date</th>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Action</th>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">User</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">2023-10-26</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Created PO #123</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">John Doe</td>
          </tr>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">2023-10-25</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Approved PO #122</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Jane Smith</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const AuditTable = () => (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">Audit Log</h3>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Timestamp</th>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Event</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">2023-10-26 10:30</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Data Exported</td>
          </tr>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">2023-10-26 09:15</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">User Login</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const NotesTable = () => (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Date</th>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Note</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">2023-10-26</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Follow-up with Supplier X</td>
          </tr>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">2023-10-24</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Discussed new terms</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const ImagesTable = () => (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">Images</h3>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Name</th>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Invoice_123.jpg</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">JPEG</td>
          </tr>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Product_A.png</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">PNG</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const DocumentsTable = () => (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">Documents</h3>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Name</th>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Size</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Contract_2023.pdf</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">1.2 MB</td>
          </tr>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Specs_V2.docx</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">500 KB</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const FrRemotePackagesTable = () => (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">FR Remote Packages</h3>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Package ID</th>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">FR-001-A</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Delivered</td>
          </tr>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">FR-002-B</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">In Transit</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const ReportTable = () => (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">Reports</h3>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Report Name</th>
            <th className="py-1 px-2 border-b text-left text-xs font-medium text-gray-600">Generated By</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Monthly Summary</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">System</td>
          </tr>
          <tr>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Daily Sales</td>
            <td className="py-1 px-2 border-b text-xs text-gray-700">Admin User</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div 
      className="fixed bottom-0 border-t px-4 py-4" 
      style={{ 
        backgroundColor: '#2C5A7A', 
        borderColor: '#1e3f52', 
        zIndex: 40,
        left: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        right: '0px',
        transition: 'all var(--transition-duration) var(--transition-timing)'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button 
            className="px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 rounded-md font-medium" 
            style={{ backgroundColor: 'transparent' }}
            onClick={() => {
              if (activeContent === 'activities' && showSlideUpContainer) {
                setShowSlideUpContainer(false);
              } else {
                setActiveContent('activities');
                setShowSlideUpContainer(true);
              }
            }}
          >
            ACTIVITIES
          </button>
          <button 
            className="px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 rounded-md font-medium" 
            style={{ backgroundColor: 'transparent' }}
            onClick={() => {
              if (activeContent === 'audit' && showSlideUpContainer) {
                setShowSlideUpContainer(false);
              } else {
                setActiveContent('audit');
                setShowSlideUpContainer(true);
              }
            }}
          >
            AUDIT
          </button>
          <button 
            className="px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 rounded-md font-medium" 
            style={{ backgroundColor: 'transparent' }}
            onClick={() => {
              if (activeContent === 'notes' && showSlideUpContainer) {
                setShowSlideUpContainer(false);
              } else {
                setActiveContent('notes');
                setShowSlideUpContainer(true);
              }
            }}
          >
            NOTES
          </button>
          <button 
            className="px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 rounded-md font-medium" 
            style={{ backgroundColor: 'transparent' }}
            onClick={() => {
              if (activeContent === 'images' && showSlideUpContainer) {
                setShowSlideUpContainer(false);
              } else {
                setActiveContent('images');
                setShowSlideUpContainer(true);
              }
            }}
          >
            IMAGES
          </button>
          <button 
            className="px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 rounded-md font-medium" 
            style={{ backgroundColor: 'transparent' }}
            onClick={() => {
              if (activeContent === 'documents' && showSlideUpContainer) {
                setShowSlideUpContainer(false);
              } else {
                setActiveContent('documents');
                setShowSlideUpContainer(true);
              }
            }}
          >
            DOCUMENTS
          </button>
          <button 
            className="px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 rounded-md font-medium" 
            style={{ backgroundColor: 'transparent' }}
            onClick={() => {
              if (activeContent === 'frRemotePackages' && showSlideUpContainer) {
                setShowSlideUpContainer(false);
              } else {
                setActiveContent('frRemotePackages');
                setShowSlideUpContainer(true);
              }
            }}
          >
            FR REMOTE PACKAGES
          </button>
          <button 
            className="px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 rounded-md font-medium flex items-center gap-2" 
            style={{ backgroundColor: 'transparent' }}
            onClick={() => {
              if (activeContent === 'report' && showSlideUpContainer) {
                setShowSlideUpContainer(false);
              } else {
                setActiveContent('report');
                setShowSlideUpContainer(true);
              }
            }}
          >
            REPORT
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Slide-up Container */}
      <div 
        className={`absolute bottom-full left-0 right-0 bg-white border border-gray-200 shadow-lg transition-all duration-500 ease-in-out p-4 z-50 transform ${
          showSlideUpContainer ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ maxHeight: showSlideUpContainer ? '400px' : '0px', overflow: 'hidden' }}
      >
        {activeContent === 'activities' && <ActivitiesTable />}
        {activeContent === 'audit' && <AuditTable />}
        {activeContent === 'notes' && <NotesTable />}
        {activeContent === 'images' && <ImagesTable />}
        {activeContent === 'documents' && <DocumentsTable />}
        {activeContent === 'frRemotePackages' && <FrRemotePackagesTable />}
        {activeContent === 'report' && <ReportTable />}
      </div>
    </div>
  );
};

export default ReportBar; 