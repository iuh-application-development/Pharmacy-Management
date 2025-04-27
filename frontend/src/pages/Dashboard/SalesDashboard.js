import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaFileInvoice, FaShoppingCart } from 'react-icons/fa'; // Import icons
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import {
  Container,
  Content,
  StatsGrid,
  StatCard,
  StatTitle,
  StatValue,
  IconWrapper,
  ViewDetail,
  Table,
  TableHeader,
  TableCell,
} from './DashboardStyles';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const SalesDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    cardPayments: 0,
    cashPayments: 0,
    totalProductsSold: 0,
  });
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [potentialCustomers, setPotentialCustomers] = useState([]);

  const fetchStats = async () => {
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    try {
      const [invoiceDetailsRes, invoicesRes, customersRes, medicinesRes] = await Promise.all([
        axios.get('http://localhost:8000/api/sales/invoice-details/', { headers }),
        axios.get('http://localhost:8000/api/sales/invoices/', { headers }),
        axios.get('http://localhost:8000/api/sales/customers/', { headers }),
        axios.get('http://localhost:8000/api/medicines/medicines/', { headers }),
      ]);

      const totalCustomers = customersRes.data.length;
      const totalProductsSold = invoiceDetailsRes.data.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const paidInvoices = invoicesRes.data.filter((invoice) => invoice.status === 'Paid').length;
      const pendingInvoices = invoicesRes.data.filter((invoice) => invoice.status === 'Pending').length;
      const cardPayments = invoicesRes.data.filter((invoice) => invoice.paymentMethod === 'Card').length;
      const cashPayments = invoicesRes.data.filter((invoice) => invoice.paymentMethod === 'Cash').length;
      const recentInvoices = invoicesRes.data.slice(-5).reverse();

      const productSales = invoiceDetailsRes.data.reduce((acc, item) => {
        acc[item.medicine] = (acc[item.medicine] || 0) + item.quantity;
        return acc;
      }, {});

      const medicineMap = medicinesRes.data.reduce((acc, medicine) => {
        acc[medicine.medicineID] = medicine.medicineName;
        return acc;
      }, {});

      const topProducts = Object.entries(productSales)
        .map(([medicineID, quantity]) => ({
          name: medicineMap[medicineID] || `Không xác định (ID: ${medicineID})`,
          quantity,
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      const customerInvoices = invoicesRes.data.reduce((acc, invoice) => {
        acc[invoice.customer] = (acc[invoice.customer] || 0) + 1;
        return acc;
      }, {});

      const potentialCustomers = customersRes.data
        .map((customer) => ({
          customerID: customer.customerID,
          fullName: customer.fullName,
          totalInvoices: customerInvoices[customer.customerID] || 0,
        }))
        .sort((a, b) => b.totalInvoices - a.totalInvoices)
        .slice(0, 5);

      setStats({
        totalCustomers,
        totalInvoices: invoicesRes.data.length,
        paidInvoices,
        pendingInvoices,
        cardPayments,
        cashPayments,
        totalProductsSold,
      });
      setRecentInvoices(recentInvoices);
      setTopSellingProducts(topProducts);
      setPotentialCustomers(potentialCustomers);
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];

  return (
    <Container>
      <Sidebar />
      <Content>
        {/* Phần 1: Thống kê cơ bản */}
        <h1>Sales Dashboard</h1>
        <StatsGrid>
          <StatCard className="info" as={Link} to="/customers">
            <IconWrapper>
              <FaUsers />
            </IconWrapper>
            <StatTitle>Số khách hàng</StatTitle>
            <StatValue>{stats.totalCustomers}</StatValue>
            <ViewDetail>View Customers &raquo;</ViewDetail>
          </StatCard>
          <StatCard className="success" as={Link} to="/invoices/list">
            <IconWrapper>
              <FaFileInvoice />
            </IconWrapper>
            <StatTitle>Số hóa đơn</StatTitle>
            <StatValue>{stats.totalInvoices}</StatValue>
            <ViewDetail>View Invoices &raquo;</ViewDetail>
          </StatCard>
          <StatCard className="warning" as={Link} to="/invoices/list">
            <IconWrapper>
              <FaShoppingCart />
            </IconWrapper>
            <StatTitle>Sản phẩm đã bán</StatTitle>
            <StatValue>{stats.totalProductsSold}</StatValue>
            <ViewDetail>View Invocies &raquo;</ViewDetail>
          </StatCard>
        </StatsGrid>

        {/* Phần 2: Biểu đồ và bảng hóa đơn */}
        <h2>Tỷ lệ thanh toán</h2>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <ResponsiveContainer width="50%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Paid', value: stats.paidInvoices },
                  { name: 'Pending', value: stats.pendingInvoices },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.slice(0, 2).map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="50%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Card', value: stats.cardPayments },
                  { name: 'Cash', value: stats.cashPayments },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.slice(2, 4).map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <h2>5 Hóa đơn gần đây nhất</h2>
        <Table>
          <thead>
            <tr>
              <TableHeader>Mã hóa đơn</TableHeader>
              <TableHeader>Thời gian</TableHeader>
              <TableHeader>Khách hàng</TableHeader>
              <TableHeader>Trạng thái</TableHeader>
              <TableHeader>Phương thức thanh toán</TableHeader>
            </tr>
          </thead>
          <tbody>
            {recentInvoices.map((invoice) => (
              <tr key={invoice.invoiceID}>
                <TableCell>{invoice.invoiceID}</TableCell>
                <TableCell>{new Date(invoice.invoiceTime).toLocaleString()}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Phần 3: Top sản phẩm bán chạy */}
        <h2>Top sản phẩm bán chạy</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topSellingProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#8884d8" name="Số lượng bán" />
          </BarChart>
        </ResponsiveContainer>

        {/* Phần 4: Biểu đồ khách hàng tiềm năng */}
        <h2>Khách hàng tiềm năng</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={potentialCustomers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fullName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalInvoices" fill="#82ca9d" name="Số hóa đơn" />
          </BarChart>
        </ResponsiveContainer>
      </Content>
    </Container>
  );
};

export default SalesDashboard;