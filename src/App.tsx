import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Breadcrumb from './components/Breadcrumb';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TestQuickWins from './components/TestQuickWins';
import SearchPage from './pages/SearchPage';
import MyTasks from './pages/MyTasks';
import ProductManager from './pages/ProductManager';
import Techpacks from './pages/Techpacks';
import SampleRequests from './pages/SampleRequests';
import PurchaseOrders from './pages/PurchaseOrders';
import MaterialManager from './pages/MaterialManager';
import SupplierLoading from './pages/SupplierLoading';
import PivotReports from './pages/PivotReports';
import Documents from './pages/Documents';
import UserAdministration from './pages/UserAdministration';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './contexts/UserContext';
import { DataProvider } from './contexts/DataContext';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import PurchaseOrder from './pages/PurchaseOrder';
import DataBank from './pages/DataBank';
import MaterialPurchaseOrder from './pages/MaterialPurchaseOrder';
import MaterialPurchaseOrderLines from './pages/MaterialPurchaseOrderLines';
import ActivityLogs from './pages/ActivityLogs';
import Reports from './pages/Reports';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed, setSidebarCollapsed } = useSidebar();

  return (
    <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <div className="flex h-screen bg-gray-50">
                      <Sidebar 
                        open={sidebarOpen} 
                        setOpen={setSidebarOpen}
                        collapsed={sidebarCollapsed}
                        setCollapsed={setSidebarCollapsed}
                      />
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <Header 
                          setSidebarOpen={setSidebarOpen}
                          sidebarCollapsed={sidebarCollapsed}
                          setSidebarCollapsed={setSidebarCollapsed}
                        />
                        <Breadcrumb />
                        <main id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto">
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/my-tasks" element={<MyTasks />} />
                            <Route path="/product-manager" element={<ProductManager />} />
                            <Route path="/techpacks" element={<Techpacks />} />
                            <Route path="/sample-requests" element={<SampleRequests />} />
                            <Route path="/purchase-orders" element={<PurchaseOrders />} />
                            <Route path="/material-manager" element={<MaterialManager />} />
                            <Route path="/supplier-loading" element={<SupplierLoading />} />
                            <Route path="/pivot-reports" element={<PivotReports />} />
                            <Route path="/documents" element={<Documents />} />
                            <Route path="/user-administration" element={<UserAdministration />} />
                            <Route path="/purchase-order" element={<PurchaseOrder />} />
                            <Route path="/data-bank" element={<DataBank />} />
                            <Route path="/material-purchase-order" element={<MaterialPurchaseOrder />} />
                            <Route path="/material-purchase-order-lines" element={<MaterialPurchaseOrderLines />} />
                            <Route path="/activity-logs" element={<ActivityLogs />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/test-quick-wins" element={<TestQuickWins />} />
                            <Route path="/search" element={<SearchPage />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <DataProvider>
        <SidebarProvider>
          <AppContent />
        </SidebarProvider>
      </DataProvider>
    </UserProvider>
  );
}

export default App;