import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';
import Employees from './pages/Employees/Employees';
import EmployeeStats from './pages/EmployeeStats/EmployeeStats';
import Medicines from './pages/Medicines/Medicines';
import Suppliers from './pages/Suppliers/Suppliers';
import Accounts from './pages/Accounts/Accounts';
import Orders from './pages/Orders/Orders';
import EmployeeOrders from './pages/EmployeeOrders/EmployeeOrders';
import EmployeeMedicines from './pages/EmployeeMedicines/EmployeeMedicines';
import ProductManagement from './pages/ProductManagement/ProductManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employeeStats" element={<EmployeeStats />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/employee/orders" element={<EmployeeOrders />} />
        <Route path="/employee/medicines" element={<EmployeeMedicines />} />
        <Route path="/product-management" element={<ProductManagement />} />
      </Routes>
    </Router>
  );
}

export default App;