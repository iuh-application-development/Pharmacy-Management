import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import {
  Container,
  Table,
  TableHeader,
  TableCell,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  unitMap,
} from './InvoicesStyles';

const ListInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all invoices
  const fetchInvoices = async () => {
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    try {
      const response = await axios.get('http://localhost:8000/api/sales/invoices/', { headers });
      setInvoices(response.data);
      setFilteredInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error.response?.data || error.message);
    }
  };

  // Fetch invoice details
  const fetchInvoiceDetails = async (invoiceID) => {
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    try {
      // Fetch invoice details for the specific invoice
      const invoiceDetailsRes = await axios.get(
        `http://localhost:8000/api/sales/invoice-details/?invoice=${invoiceID}`,
        { headers }
      );

      // Filter only details matching the given invoiceID
      const filteredDetails = invoiceDetailsRes.data.filter(
        (detail) => detail.invoice === invoiceID
      );

      // Fetch customer details from the invoice
      const invoiceRes = await axios.get(
        `http://localhost:8000/api/sales/invoices/${invoiceID}/`,
        { headers }
      );
      const customerID = invoiceRes.data.customer;
      const customerRes = await axios.get(
        `http://localhost:8000/api/sales/customers/${customerID}/`,
        { headers }
      );

      // Extract medicine details for the filtered invoice details
      const medicines = await Promise.all(
        filteredDetails.map(async (detail) => {
          const medicineRes = await axios.get(
            `http://localhost:8000/api/medicines/medicines/${detail.medicine}/`,
            { headers }
          );

          return {
            medicineName: medicineRes.data.medicineName,
            unit: medicineRes.data.unit,
            quantity: detail.quantity,
            unitPrice: parseFloat(detail.unitPrice),
          };
        })
      );

      // Calculate total amount
      const totalAmount = medicines.reduce(
        (sum, medicine) => sum + medicine.unitPrice * medicine.quantity,
        0
      );

      // Set the selected invoice details
      setSelectedInvoiceDetails({
        customerName: customerRes.data.fullName,
        details: medicines,
        totalAmount,
      });

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching invoice details:', error.response?.data || error.message);
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);

    const filtered = invoices.filter((invoice) =>
      invoice.invoiceID.toString().toLowerCase().includes(keyword)
    );
    setFilteredInvoices(filtered);
  };

  // Handle invoice deletion
  const handleDeleteInvoice = async (invoiceID) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?');
    if (!confirmDelete) return;

    const token = sessionStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    try {
      await axios.delete(`http://localhost:8000/api/sales/invoices/${invoiceID}/`, { headers });
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <Container>
      <Sidebar />
      <div style={{ flex: 1, padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Danh sách hóa đơn</h2>
          <Input
            type="text"
            placeholder="Tìm kiếm hóa đơn theo mã..."
            value={searchKeyword}
            onChange={handleSearch}
            style={{ width: '300px' }}
          />
        </div>

        <Table>
          <thead>
            <tr>
              <TableHeader>Mã hóa đơn</TableHeader>
              <TableHeader>Khách hàng</TableHeader>
              <TableHeader>Địa chỉ</TableHeader>
              <TableHeader>Phương thức thanh toán</TableHeader>
              <TableHeader>Trạng thái</TableHeader>
              <TableHeader>Hành động</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.invoiceID}>
                <TableCell>{invoice.invoiceID}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{invoice.address}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>
                  <Button onClick={() => fetchInvoiceDetails(invoice.invoiceID)}>Xem chi tiết</Button>
                  <Button onClick={() => handleDeleteInvoice(invoice.invoiceID)}style={{ marginLeft: '0.5rem' }}>Xóa</Button>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {isModalOpen && selectedInvoiceDetails && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>Chi tiết hóa đơn</h3>
            </ModalHeader>
            <ModalBody>
              <p><strong>Khách hàng:</strong> {selectedInvoiceDetails.customerName}</p>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Tên thuốc</TableHeader>
                    <TableHeader>Đơn vị tính</TableHeader>
                    <TableHeader>Số lượng</TableHeader>
                    <TableHeader>Đơn giá</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceDetails.details.map((detail, index) => (
                    <tr key={index}>
                      <TableCell>{detail.medicineName}</TableCell>
                      <TableCell>{unitMap[detail.unit]}</TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>{detail.unitPrice.toLocaleString()} VND</TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                Tổng tiền: {selectedInvoiceDetails.totalAmount.toLocaleString()} VND
              </p>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setIsModalOpen(false)}>Đóng</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default ListInvoices;