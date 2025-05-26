from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from sales.models import Order, Invoice, OrderDetail, InvoiceDetail
from authentication.models import Role, Employee, Customer
from medicines.models import Medicine, Catalog, Unit, Origin
import json
from datetime import date, datetime

class OrderModelTests(TestCase):
    def setUp(self):
        self.role, _ = Role.objects.get_or_create(roleName="Nhân viên bán hàng")
        self.employee = Employee.objects.create(
            employeeID="EMP001",
            fullName="Test Employee",
            phoneNumber="0123456789",
            gender="Male",
            yearOfBirth=1990,
            hireDate=date(2023, 1, 1)
        )
        self.customer, _ = Customer.objects.get_or_create(
            customerID="ASDASN131",
            defaults={
                "fullName": "Nguyễn Văn Hùng",
                "phoneNumber": "0906765871",
                "gender": "Nam",
                "joinDate": date(2024, 2, 15)
            }
        )
        self.order = Order.objects.create(
            orderID="ORD001",
            employee=self.employee,
            customer=self.customer,
            totalAmount=100.00
        )

    def test_order_creation(self):
        order = Order.objects.get(orderID="ORD001")
        self.assertEqual(order.employee.employeeID, "EMP001")
        self.assertEqual(order.customer.customerID, "ASDASN131")
        self.assertEqual(order.totalAmount, 100.00)

class InvoiceModelTests(TestCase):
    def setUp(self):
        self.customer, _ = Customer.objects.get_or_create(
            customerID="12ZAS1SX1",
            defaults={
                "fullName": "Nguyễn Thị Lan",
                "phoneNumber": "0931265687",
                "gender": "Nữ",
                "joinDate": date(2024, 2, 15)
            }
        )
        self.invoice = Invoice.objects.create(
            customer=self.customer,
            address="123 Hanoi St",
            paymentMethod="Cash",
            status="Paid"
        )

    def test_invoice_creation(self):
        invoice = Invoice.objects.get(invoiceID=self.invoice.invoiceID)
        self.assertEqual(invoice.customer.customerID, "12ZAS1SX1")
        self.assertEqual(invoice.address, "123 Hanoi St")
        self.assertEqual(invoice.paymentMethod, "Cash")
        self.assertEqual(invoice.status, "Paid")

class OrderAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.role, _ = Role.objects.get_or_create(roleName="Nhân viên bán hàng")
        self.employee = Employee.objects.create(
            employeeID="EMP002",
            fullName="Sales Employee",
            phoneNumber="0932145678",
            gender="Male",
            yearOfBirth=1992,
            hireDate=date(2023, 6, 1)
        )
        self.customer, _ = Customer.objects.get_or_create(
            customerID="SDF3F13DZ",
            defaults={
                "fullName": "Lê Đức Anh",
                "phoneNumber": "0967566712",
                "gender": "Nam",
                "joinDate": date(2024, 2, 15)
            }
        )
        self.catalog = Catalog.objects.create(catalogID="CAT001", catalogName="Pain Relief")
        self.unit = Unit.objects.create(unitID="UNIT001", unitName="Tablet")
        self.origin = Origin.objects.create(originID="ORIG001", originName="Vietnam")
        self.medicine = Medicine.objects.create(
            medicineID="MED001",
            medicineName="Paracetamol",
            ingredients="Paracetamol 500mg",
            unit=self.unit,
            catalog=self.catalog,
            origin=self.origin,
            stockQuantity=100,
            importPrice=5.00,
            unitPrice=10.00,
            expiryDate=date(2026, 12, 31)
        )
        self.user = get_user_model().objects.create_user(
            username="salesuser",
            password="salespass",
            role=self.role,
            employee=self.employee,
            is_active=True,
            is_staff=True
        )
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

    def test_get_orders_list(self):
        response = self.client.get(reverse('order-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 19)  # 19 từ fixture

    def test_create_order(self):
        data = {
            "orderID": "ORD999",  # ID duy nhất
            "employee": self.employee.employeeID,
            "customer": self.customer.customerID,
            "totalAmount": 75.00
        }
        response = self.client.post(
            reverse('order-list'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 20)  # 19 + 1 mới
        order = Order.objects.get(orderID="ORD999")
        self.assertEqual(order.totalAmount, 75.00)

class InvoiceAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.role, _ = Role.objects.get_or_create(roleName="Nhân viên bán hàng")  # Khớp với IsSales
        self.employee = Employee.objects.create(
            employeeID="EMP003",
            fullName="Test Manager",
            phoneNumber="0912345678",
            gender="Female",
            yearOfBirth=1985,
            hireDate=date(2022, 1, 1)
        )
        self.customer, _ = Customer.objects.get_or_create(
            customerID="KLM45678X",
            defaults={
                "fullName": "Lê Thị Linh",
                "phoneNumber": "0956789012",
                "gender": "Nữ",
                "joinDate": date(2024, 2, 15)
            }
        )
        self.invoice = Invoice.objects.create(
            customer=self.customer,
            address="456 Saigon St",
            paymentMethod="Card",
            status="Pending"
        )
        self.user = get_user_model().objects.create_user(
            username="manager",
            password="managerpass",
            role=self.role,
            employee=self.employee,
            is_active=True,
            is_staff=True
        )
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        # Debug: Kiểm tra roleName
        print(f"User roleName: {self.user.role.roleName}")

    def test_get_invoices_list(self):
        response = self.client.get(reverse('invoice-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

    def test_create_invoice(self):
        data = {
            "customer": self.customer.customerID,
            "address": "789 Danang St",
            "paymentMethod": "Cash",
            "status": "Paid"
        }
        response = self.client.post(
            reverse('invoice-list'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Invoice.objects.count(), 2)
        invoice = Invoice.objects.latest('invoiceID')
        self.assertEqual(invoice.address, "789 Danang St")