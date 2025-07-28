import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Breadcrumb from './components/Breadcrumb';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './contexts/UserContext';
import { DataProvider } from './contexts/DataContext';

// Lazy load all other pages for better performance
const TestQuickWins = lazy(() => import('./components/TestQuickWins'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ContextMenuDemo = lazy(() => import('./pages/ContextMenuDemo'));
const MyTasks = lazy(() => import('./pages/MyTasks'));
const ProductManager = lazy(() => import('./pages/ProductManager'));
const Techpacks = lazy(() => import('./pages/Techpacks'));
const SampleRequests = lazy(() => import('./pages/SampleRequests'));
const PurchaseOrders = lazy(() => import('./pages/PurchaseOrders'));
const MaterialManager = lazy(() => import('./pages/MaterialManager'));
const SupplierLoading = lazy(() => import('./pages/SupplierLoading'));
const PivotReports = lazy(() => import('./pages/PivotReports'));
const Documents = lazy(() => import('./pages/Documents'));
const UserAdministration = lazy(() => import('./pages/UserAdministration'));
const PurchaseOrder = lazy(() => import('./pages/PurchaseOrder'));
const DataBank = lazy(() => import('./pages/DataBank'));
const MaterialPurchaseOrder = lazy(() => import('./pages/MaterialPurchaseOrder'));
const MaterialPurchaseOrderLines = lazy(() => import('./pages/MaterialPurchaseOrderLines'));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <UserProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
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
                          <Suspense fallback={
                            <div className="flex items-center justify-center h-full">
                              <LoadingSpinner size="lg" />
                            </div>
                          }>
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
                                                          <Route path="/test-quick-wins" element={<TestQuickWins />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/context-menu-demo" element={<ContextMenuDemo />} />
                            </Routes>
                          </Suspense>
                        </main>
                      </div>
                    </div>
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </DataProvider>
    </UserProvider>
  );
}

export default App;