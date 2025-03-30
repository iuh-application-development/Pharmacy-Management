import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
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
  Select,
  SearchInput,
  Toolbar,
} from './EmployeeStatsStyles';

const EmployeeStats = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
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
      const totalOrders = orderData.length;
      const totalRevenue = orderData.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      const completedOrders = orderData.filter(order => order.status === 'completed').length;
      const pendingOrders = orderData.filter(order => order.status === 'pending').length;

      setStats({
        totalOrders,
        totalRevenue,
        completedOrders,
        pendingOrders,
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
      order.customerName.toLowerCase().includes(keyword) ||
      order.orderID.toLowerCase().includes(keyword)
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
  }, []);

  return (
    <Container>
      <Sidebar />
      <Content>
        <h1>Quản Lý Đơn Hàng</h1>
        <StatsGrid>
          <StatCard>
            <StatTitle>Tổng số đơn hàng</StatTitle>
            <StatValue>{stats.totalOrders}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Doanh thu</StatTitle>
            <StatValue>{stats.totalRevenue.toLocaleString()} VND</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Đơn hoàn thành</StatTitle>
            <StatValue>{stats.completedOrders}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Đơn chờ xử lý</StatTitle>
            <StatValue>{stats.pendingOrders}</StatValue>
          </StatCard>
        </StatsGrid>

        <Toolbar>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Đóng' : 'Thêm đơn hàng'}
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
            <Button type="submit">Thêm mới</Button>
          </Form>
        )}

        <Table>
          <thead>
            <tr>
              <TableHeader>STT</TableHeader>
              <TableHeader>Mã đơn hàng</TableHeader>
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

export default EmployeeStats; 