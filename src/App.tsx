import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
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
import PurchaseOrder from './pages/PurchaseOrder';
import DataBank from './pages/DataBank';
import MaterialPurchaseOrder from './pages/MaterialPurchaseOrder';
import MaterialPurchaseOrderLines from './pages/MaterialPurchaseOrderLines';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                  <div className="flex h-screen bg-gray-50">
                    <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Header setSidebarOpen={setSidebarOpen} />
                      <main className="flex-1 overflow-x-hidden overflow-y-auto">
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
                        </Routes>
                      </main>
                    </div>
                  </div>
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