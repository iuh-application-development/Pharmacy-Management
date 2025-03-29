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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '../EmployeeDashboard/EmployeeDashboardStyles';

const ProductManagement = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    unit: '',
    category: '',
    manufacturer: '',
    expiryDate: '',
    prescriptionRequired: false,
  });

  // Fetch danh sách thuốc
  const fetchMedicines = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    try {
      const response = await axios.get('http://localhost:8000/api/medicines/', { headers });
      const medicineData = response.data.results || response.data;
      setMedicines(medicineData);
      setFilteredMedicines(medicineData);
    } catch (error) {
      console.error('Error fetching medicines:', error.response?.data || error.message);
      setError('Không thể tải danh sách thuốc. Vui lòng thử lại sau.');
      setMedicines([]);
      setFilteredMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm thuốc
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);
    const filtered = Array.isArray(medicines) ? medicines.filter((medicine) =>
      medicine.name?.toLowerCase().includes(keyword) ||
      medicine.description?.toLowerCase().includes(keyword) ||
      medicine.category?.toLowerCase().includes(keyword)
    ) : [];
    setFilteredMedicines(filtered);
  };

  // Thêm thuốc mới
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    try {
      await axios.post('http://localhost:8000/api/medicines/', form, { headers });
      setForm({
        name: '',
        description: '',
        price: '',
        quantity: '',
        unit: '',
        category: '',
        manufacturer: '',
        expiryDate: '',
        prescriptionRequired: false,
      });
      setShowModal(false);
      fetchMedicines();
    } catch (error) {
      console.error('Error adding medicine:', error.response?.data || error.message);
      setError('Không thể thêm thuốc mới. Vui lòng thử lại sau.');
    }
  };

  // Cập nhật thuốc
  const handleUpdateMedicine = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    try {
      await axios.put(`http://localhost:8000/api/medicines/${editingMedicine.id}/`, form, { headers });
      setForm({
        name: '',
        description: '',
        price: '',
        quantity: '',
        unit: '',
        category: '',
        manufacturer: '',
        expiryDate: '',
        prescriptionRequired: false,
      });
      setEditingMedicine(null);
      setShowModal(false);
      fetchMedicines();
    } catch (error) {
      console.error('Error updating medicine:', error.response?.data || error.message);
      setError('Không thể cập nhật thuốc. Vui lòng thử lại sau.');
    }
  };

  // Xóa thuốc
  const handleDeleteMedicine = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Token ${token}` };

      try {
        await axios.delete(`http://localhost:8000/api/medicines/${id}/`, { headers });
        fetchMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error.response?.data || error.message);
        setError('Không thể xóa thuốc. Vui lòng thử lại sau.');
      }
    }
  };

  // Mở modal chỉnh sửa
  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setForm({
      name: medicine.name,
      description: medicine.description,
      price: medicine.price,
      quantity: medicine.quantity,
      unit: medicine.unit,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      expiryDate: medicine.expiryDate,
      prescriptionRequired: medicine.prescriptionRequired,
    });
    setShowModal(true);
  };

  // Mở modal thêm mới
  const handleAdd = () => {
    setEditingMedicine(null);
    setForm({
      name: '',
      description: '',
      price: '',
      quantity: '',
      unit: '',
      category: '',
      manufacturer: '',
      expiryDate: '',
      prescriptionRequired: false,
    });
    setShowModal(true);
  };

  useEffect(() => {
    fetchMedicines();
    // Cập nhật dữ liệu mỗi 5 phút
    const interval = setInterval(fetchMedicines, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <EmployeeSidebar />
      <Content>
        <h1>Quản Lý Thuốc</h1>

        <Toolbar>
          <Button onClick={handleAdd}>Thêm thuốc mới</Button>
          <SearchInput
            type="text"
            placeholder="Tìm kiếm thuốc..."
            value={searchKeyword}
            onChange={handleSearch}
          />
        </Toolbar>

        {error && <div style={{ color: 'red', margin: '1rem 0' }}>{error}</div>}

        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <Table>
            <thead>
              <tr>
                <TableHeader>STT</TableHeader>
                <TableHeader>Tên thuốc</TableHeader>
                <TableHeader>Mô tả</TableHeader>
                <TableHeader>Giá</TableHeader>
                <TableHeader>Số lượng</TableHeader>
                <TableHeader>Đơn vị</TableHeader>
                <TableHeader>Danh mục</TableHeader>
                <TableHeader>Nhà sản xuất</TableHeader>
                <TableHeader>Hạn sử dụng</TableHeader>
                <TableHeader>Kê đơn</TableHeader>
                <TableHeader>Hành động</TableHeader>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredMedicines) && filteredMedicines.map((medicine, index) => (
                <tr key={medicine.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{medicine.name}</TableCell>
                  <TableCell>{medicine.description}</TableCell>
                  <TableCell>{parseFloat(medicine.price).toLocaleString()} VND</TableCell>
                  <TableCell>{medicine.quantity}</TableCell>
                  <TableCell>{medicine.unit}</TableCell>
                  <TableCell>{medicine.category}</TableCell>
                  <TableCell>{medicine.manufacturer}</TableCell>
                  <TableCell>{new Date(medicine.expiryDate).toLocaleDateString()}</TableCell>
                  <TableCell>{medicine.prescriptionRequired ? 'Có' : 'Không'}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(medicine)}>Sửa</Button>
                    <Button className="delete" onClick={() => handleDeleteMedicine(medicine.id)}>Xóa</Button>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {showModal && (
          <Modal>
            <ModalContent>
              <ModalHeader>
                {editingMedicine ? 'Chỉnh sửa thông tin thuốc' : 'Thêm thuốc mới'}
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={editingMedicine ? handleUpdateMedicine : handleAddMedicine}>
                  <Input
                    type="text"
                    placeholder="Tên thuốc"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Mô tả"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Giá"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Số lượng"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Đơn vị"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Danh mục"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Nhà sản xuất"
                    value={form.manufacturer}
                    onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                    required
                  />
                  <Input
                    type="date"
                    placeholder="Hạn sử dụng"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    required
                  />
                  <div style={{ margin: '1rem 0' }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={form.prescriptionRequired}
                        onChange={(e) => setForm({ ...form, prescriptionRequired: e.target.checked })}
                      />
                      Yêu cầu kê đơn
                    </label>
                  </div>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button onClick={() => setShowModal(false)}>Hủy</Button>
                <Button onClick={editingMedicine ? handleUpdateMedicine : handleAddMedicine}>
                  {editingMedicine ? 'Cập nhật' : 'Thêm thuốc'}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Content>
    </Container>
  );
};

export default ProductManagement; 