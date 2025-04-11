import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {
  Container,
  Content,
  Toolbar,
  Table,
  TableHeader,
  TableCell,
  Button,
  Form,
  Input,
  SearchInput, // Import thêm SearchInput
} from './SuppliersStyles';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]); // Thêm state cho danh sách đã lọc
  const [searchKeyword, setSearchKeyword] = useState(''); // Thêm state cho từ khóa tìm kiếm
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    supplierName: '',
    phoneNumber: '',
    address: '',
  });
  const [editingSupplierID, setEditingSupplierID] = useState(null);

  const fetchSuppliers = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    try {
      const response = await axios.get('http://localhost:8000/api/medicines/suppliers/', { headers });
      setSuppliers(response.data);
      setFilteredSuppliers(response.data); // Hiển thị tất cả nhà cung cấp ban đầu
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);

    const filtered = suppliers.filter((supplier) =>
      supplier.supplierName.toLowerCase().includes(keyword) ||
      supplier.phoneNumber.includes(keyword) ||
      supplier.address.toLowerCase().includes(keyword)
    );

    setFilteredSuppliers(filtered);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSuppliers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Suppliers');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Suppliers.xlsx');
  };

  const generateSupplierID = () => {
    const prefix = Math.random().toString(36).substring(2, 4).toUpperCase(); // Hai ký tự chữ cái
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // Tạo chuỗi ngẫu nhiên
    return `${prefix}-${randomPart}`;
  };
  
  const handleAddOrUpdateSupplier = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };
  
    try {
      if (editingSupplierID) {
        // Update supplier
        await axios.put(
          `http://localhost:8000/api/medicines/suppliers/${editingSupplierID}/`,
          { ...form, supplierID: editingSupplierID }, // Thêm supplierID vào payload
          { headers }
        );
      } else {
        // Add new supplier
        const newSupplierID = generateSupplierID(); // Tạo supplierID mới
        await axios.post(
          'http://localhost:8000/api/medicines/suppliers/',
          { ...form, supplierID: newSupplierID }, // Thêm supplierID vào payload
          { headers }
        );
      }
      setForm({ supplierName: '', phoneNumber: '', address: '' });
      setShowForm(false);
      setEditingSupplierID(null);
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error.response?.data || error.message);
    }
  };

  const handleEditSupplier = (supplier) => {
    setForm({
      supplierName: supplier.supplierName,
      phoneNumber: supplier.phoneNumber,
      address: supplier.address,
    });
    setShowForm(true);
    setEditingSupplierID(supplier.supplierID);
  };

  const handleDeleteSupplier = async (supplierID) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    try {
      await axios.delete(`http://localhost:8000/api/medicines/suppliers/${supplierID}/`, { headers });
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <Container>
      <Sidebar />
      <Content>
        <Toolbar>
          <div>
            <Button onClick={() => { setShowForm(!showForm); setEditingSupplierID(null); }}>THÊM</Button>
          </div>
          <div>
            <SearchInput
              type="text"
              placeholder="Tìm kiếm nhà cung cấp..."
              value={searchKeyword}
              onChange={handleSearch}
            />
            <Button onClick={handleDownloadExcel}>Tải xuống</Button>

          </div>
        </Toolbar>

        {showForm && (
          <Form onSubmit={handleAddOrUpdateSupplier}>
            <Input
              type="text"
              placeholder="Tên nhà cung cấp"
              value={form.supplierName}
              onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Số điện thoại"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Địa chỉ"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <Button type="submit">{editingSupplierID ? 'Cập nhật' : 'Thêm mới'}</Button>
          </Form>
        )}

        <h2>DANH SÁCH NHÀ CUNG CẤP</h2>
        <Table>
          <thead>
            <tr>
              <TableHeader>STT</TableHeader>
              <TableHeader>Tên nhà cung cấp</TableHeader>
              <TableHeader>Số điện thoại</TableHeader>
              <TableHeader>Địa chỉ</TableHeader>
              <TableHeader>Hành động</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier, index) => (
              <tr key={supplier.supplierID}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{supplier.supplierName}</TableCell>
                <TableCell>{supplier.phoneNumber}</TableCell>
                <TableCell>{supplier.address}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditSupplier(supplier)}>Sửa</Button>
                  <Button onClick={() => handleDeleteSupplier(supplier.supplierID)}>Xóa</Button>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </Content>
    </Container>
  );
};

export default Suppliers;