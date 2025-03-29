import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeSidebar from '../../components/EmployeeSidebar';
import {
  Container,
  Content,
  Table,
  TableHeader,
  TableCell,
  Button,
  Form,
  Input,
  SearchInput,
  Toolbar,
} from '../EmployeeDashboard/EmployeeDashboardStyles';

const EmployeeOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form, setForm] = useState({
    customerName: '',
    phoneNumber: '',
    medicines: [],
    totalAmount: 0,
  });

  // Fetch danh sách đơn hàng
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    try {
      const response = await axios.get('http://localhost:8000/api/sales/orders/', { headers });
      // Kiểm tra response.data có phải là object và có thuộc tính results không
      const orderData = response.data.results || response.data;
      console.log('Order data:', orderData); // Thêm log để debug
      setOrders(orderData);
      setFilteredOrders(orderData);
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm đơn hàng
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);
    const filtered = Array.isArray(orders) ? orders.filter((order) =>
      order.customerName?.toLowerCase().includes(keyword) ||
      order.orderID?.toLowerCase().includes(keyword)
    ) : [];
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
      setError('Không thể thêm đơn hàng mới. Vui lòng thử lại sau.');
    }
  };

  // Cập nhật đơn hàng
  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    try {
      await axios.put(`http://localhost:8000/api/sales/orders/${editingOrder.id}/`, form, { headers });
      setForm({
        customerName: '',
        phoneNumber: '',
        medicines: [],
        totalAmount: 0,
      });
      setEditingOrder(null);
      setShowForm(false);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error.response?.data || error.message);
      setError('Không thể cập nhật đơn hàng. Vui lòng thử lại sau.');
    }
  };

  // Xóa đơn hàng
  const handleDeleteOrder = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Token ${token}` };

      try {
        await axios.delete(`http://localhost:8000/api/sales/orders/${id}/`, { headers });
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error.response?.data || error.message);
        setError('Không thể xóa đơn hàng. Vui lòng thử lại sau.');
      }
    }
  };

  // Mở form chỉnh sửa
  const handleEdit = (order) => {
    setEditingOrder(order);
    setForm({
      customerName: order.customerName,
      phoneNumber: order.phoneNumber,
      medicines: order.medicines,
      totalAmount: order.totalAmount,
    });
    setShowForm(true);
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
        <h1>Quản Lý Đơn Hàng</h1>

        <Toolbar>
          <Button onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingOrder(null);
              setForm({
                customerName: '',
                phoneNumber: '',
                medicines: [],
                totalAmount: 0,
              });
            }
          }}>
            {showForm ? 'Đóng' : 'Thêm đơn hàng mới'}
          </Button>
          <SearchInput
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchKeyword}
            onChange={handleSearch}
          />
        </Toolbar>

        {error && <div style={{ color: 'red', margin: '1rem 0' }}>{error}</div>}

        {showForm && (
          <Form onSubmit={editingOrder ? handleUpdateOrder : handleAddOrder}>
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
            <Button type="submit">{editingOrder ? 'Cập nhật' : 'Thêm đơn hàng'}</Button>
          </Form>
        )}

        {loading ? (
          <div>Đang tải...</div>
        ) : (
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
              {Array.isArray(filteredOrders) && filteredOrders.map((order, index) => (
                <tr key={order.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.orderID}</TableCell>
                  <TableCell>{new Date(order.orderTime).toLocaleString()}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.phoneNumber}</TableCell>
                  <TableCell>{parseFloat(order.totalAmount).toLocaleString()} VND</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(order)}>Sửa</Button>
                    <Button className="delete" onClick={() => handleDeleteOrder(order.id)}>Xóa</Button>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Content>
    </Container>
  );
};

export default EmployeeOrders; 