import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
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
import { UserProvider } from './contexts/UserContext';
import { DataProvider } from './contexts/DataContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <UserProvider>
      <DataProvider>
        <Router>
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
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </DataProvider>
    </UserProvider>
  );
}

export default App;