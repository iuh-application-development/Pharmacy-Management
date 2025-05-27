import { render, screen } from '@testing-library/react';
import App from './App';

// Mock các component có thể gây crash
jest.mock('./components/Chatbot', () => () => <div>Mocked Chatbot</div>);
jest.mock('./pages/ContactUs', () => () => <div>Mocked Contact Page</div>);
jest.mock('./pages/AboutUs', () => () => <div>Mocked About Us</div>);
jest.mock('./pages/Login', () => () => <div>Mocked Login</div>);
jest.mock('./pages/Dashboard/Dashboard', () => () => <div>Mocked Dashboard</div>);
jest.mock('./pages/Dashboard/SalesDashboard', () => () => <div>Mocked Sales Dashboard</div>);
jest.mock('./pages/Dashboard/ProductManagerDashboard', () => () => <div>Mocked Product Dashboard</div>);
jest.mock('./pages/Employees/Employees', () => () => <div>Mocked Employees</div>);
jest.mock('./pages/Medicines/Medicines', () => () => <div>Mocked Medicines</div>);
jest.mock('./pages/Suppliers/Suppliers', () => () => <div>Mocked Suppliers</div>);
jest.mock('./pages/Accounts/Accounts', () => () => <div>Mocked Accounts</div>);
jest.mock('./pages/Invoices/CreateInvoice', () => () => <div>Mocked Create Invoice</div>);
jest.mock('./pages/Invoices/ListInvoices', () => () => <div>Mocked List Invoice</div>);
jest.mock('./pages/Reports/Reports', () => () => <div>Mocked Reports</div>);
jest.mock('./pages/Payments/CreatePayment', () => () => <div>Mocked Create Payment</div>);
jest.mock('./pages/Payments/ListPayments', () => () => <div>Mocked List Payments</div>);
jest.mock('./pages/Customers/Customers', () => () => <div>Mocked Customers</div>);
jest.mock('./pages/LandingPage', () => () => <div>Mocked Landing</div>);

// ScrollTrigger và thư viện có dùng canvas
jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: jest.fn(),
    refresh: jest.fn(),
    kill: jest.fn(),
  },
}));

// Mocks khác để tránh crash do canvas
const mockCanvas = document.createElement('canvas');

jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    text: jest.fn(),
    addImage: jest.fn(),
    setFontSize: jest.fn(),
    setTextColor: jest.fn(),
    rect: jest.fn(),
    fromHTML: jest.fn(),
    output: jest.fn(),
  }));
});

jest.mock('html2canvas', () => () =>
  Promise.resolve(mockCanvas));

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

// ✅ Cuối cùng: test xem App render không crash
test('renders mocked contact page in App', () => {
  render(<App />);
  expect(screen.getByText(/mocked/i)).toBeInTheDocument();
});
