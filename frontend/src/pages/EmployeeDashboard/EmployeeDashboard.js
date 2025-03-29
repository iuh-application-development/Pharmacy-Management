import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeSidebar from '../../components/EmployeeSidebar';
import {
  Container,
  Content,
  StatsGrid,
  StatCard,
  StatTitle,
  StatValue,
  Table,
  TableHeader,
  TableCell,
  Button,
  Form,
  Input,
  SearchInput,
  Toolbar,
} from './EmployeeDashboardStyles';

const EmployeeDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [stats, setStats] = useState({
    dailyOrders: 0,
    dailyRevenue: 0,
    monthlyOrders: 0,
    monthlyRevenue: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    phoneNumber: '',
    medicines: [],
    totalAmount: 0,
  });

  // Fetch đơn hàng và tính toán thống kê
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    try {
      const response = await axios.get('http://localhost:8000/api/sales/orders/', { headers });
      const orderData = response.data;
      setOrders(orderData);
      setFilteredOrders(orderData);

      // Tính toán thống kê
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const dailyOrders = orderData.filter(order => new Date(order.orderTime) >= startOfDay).length;
      const monthlyOrders = orderData.filter(order => new Date(order.orderTime) >= startOfMonth).length;

      const dailyRevenue = orderData
        .filter(order => new Date(order.orderTime) >= startOfDay)
        .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);

      const monthlyRevenue = orderData
        .filter(order => new Date(order.orderTime) >= startOfMonth)
        .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);

      setStats({
        dailyOrders,
        dailyRevenue,
        monthlyOrders,
        monthlyRevenue,
      });
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
    }
  };

  // Tìm kiếm đơn hàng
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);
    const filtered = orders.filter((order) =>
      order.customerName?.toLowerCase().includes(keyword) ||
      order.orderID?.toLowerCase().includes(keyword)
    );
    setFilteredOrders(filtered);
  };

  // Thêm đơn hàng mới
  const handleAddOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    try {
      await axios.post('http://localhost:8000/api/sales/orders/', form, { headers });
      setForm({
        customerName: '',
        phoneNumber: '',
        medicines: [],
        totalAmount: 0,
      });
      setShowForm(false);
      fetchOrders();
    } catch (error) {
      console.error('Error adding order:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Cập nhật dữ liệu mỗi 5 phút
    const interval = setInterval(fetchOrders, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <EmployeeSidebar />
      <Content>
        <h1>Dashboard Nhân Viên</h1>
        <StatsGrid>
          <StatCard>
            <StatTitle>Đơn hàng hôm nay</StatTitle>
            <StatValue>{stats.dailyOrders}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Doanh thu hôm nay</StatTitle>
            <StatValue>{stats.dailyRevenue.toLocaleString()} VND</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Đơn hàng tháng này</StatTitle>
            <StatValue>{stats.monthlyOrders}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Doanh thu tháng này</StatTitle>
            <StatValue>{stats.monthlyRevenue.toLocaleString()} VND</StatValue>
          </StatCard>
        </StatsGrid>

        <Toolbar>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Đóng' : 'Thêm đơn hàng mới'}
          </Button>
          <SearchInput
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchKeyword}
            onChange={handleSearch}
          />
        </Toolbar>

        {showForm && (
          <Form onSubmit={handleAddOrder}>
            <Input
              type="text"
              placeholder="Tên khách hàng"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              required
            />
            <Input
              type="tel"
              placeholder="Số điện thoại"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Tổng tiền"
              value={form.totalAmount}
              onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
              required
            />
            <Button type="submit">Tạo đơn hàng</Button>
          </Form>
        )}

        <Table>
          <thead>
            <tr>
              <TableHeader>STT</TableHeader>
              <TableHeader>Mã đơn hàng</TableHeader>
              <TableHeader>Thời gian</TableHeader>
              <TableHeader>Khách hàng</TableHeader>
              <TableHeader>Số điện thoại</TableHeader>
              <TableHeader>Tổng tiền</TableHeader>
              <TableHeader>Trạng thái</TableHeader>
              <TableHeader>Hành động</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.orderID}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{order.orderID}</TableCell>
                <TableCell>{new Date(order.orderTime).toLocaleString()}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.phoneNumber}</TableCell>
                <TableCell>{parseFloat(order.totalAmount).toLocaleString()} VND</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Button>Chi tiết</Button>
                  <Button className="delete">Hủy</Button>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </Content>
    </Container>
  );
};

export default EmployeeDashboard; 