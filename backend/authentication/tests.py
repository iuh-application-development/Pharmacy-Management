from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from authentication.models import Role, Employee, Customer, Account
import json
from datetime import date

class RoleModelTests(TestCase):
    def setUp(self):
        self.role, _ = Role.objects.get_or_create(roleName="Nhân viên bán hàng")

    def test_role_creation(self):
        role = Role.objects.get(roleName="Nhân viên bán hàng")
        self.assertEqual(role.roleName, "Nhân viên bán hàng")
        self.assertEqual(role.get_roleName_display(), "Nhân viên bán hàng")

class EmployeeModelTests(TestCase):
    def setUp(self):
        self.employee = Employee.objects.create(
            employeeID="EMP001",
            fullName="Test Employee",
            phoneNumber="0123456789",
            gender="Male",
            yearOfBirth=1990,
            hireDate=date(2023, 1, 1),
            is_active=True
        )

    def test_employee_creation(self):
        employee = Employee.objects.get(employeeID="EMP001")
        self.assertEqual(employee.fullName, "Test Employee")
        self.assertEqual(employee.phoneNumber, "0123456789")
        self.assertEqual(employee.is_active, True)

class CustomerModelTests(TestCase):
    def setUp(self):
        self.customer, _ = Customer.objects.get_or_create(
            customerID="ASDASN131",
            defaults={
                "fullName": "Nguyễn Văn Hùng",
                "phoneNumber": "0906765871",
                "gender": "Nam",
                "joinDate": date(2024, 2, 15)
            }
        )

    def test_customer_creation(self):
        customer = Customer.objects.get(customerID="ASDASN131")
        self.assertEqual(customer.fullName, "Nguyễn Văn Hùng")
        self.assertEqual(customer.phoneNumber, "0906765871")
        self.assertEqual(customer.gender, "Nam")

class AccountModelTests(TestCase):
    def setUp(self):
        self.role, _ = Role.objects.get_or_create(roleName="Nhân viên quản lý sản phẩm")
        self.employee = Employee.objects.create(
            employeeID="EMP002",
            fullName="Test Manager",
            phoneNumber="0912345678",
            gender="Female",
            yearOfBirth=1985,
            hireDate=date(2022, 1, 1)
        )
        self.account = get_user_model().objects.create_user(
            username="testmanager",
            password="managerpass",
            role=self.role,
            employee=self.employee,
            is_active=True,
            is_staff=True
        )

    def test_account_creation(self):
        account = get_user_model().objects.get(username="testmanager")
        self.assertEqual(account.role.roleName, "Nhân viên quản lý sản phẩm")
        self.assertEqual(account.employee.employeeID, "EMP002")
        self.assertTrue(account.check_password("managerpass"))

class CustomerAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.role, _ = Role.objects.get_or_create(roleName="Nhân viên bán hàng")
        self.employee = Employee.objects.create(
            employeeID="EMP003",
            fullName="Sales Employee",
            phoneNumber="0932145678",
            gender="Male",
            yearOfBirth=1992,
            hireDate=date(2023, 6, 1)
        )
        self.user = get_user_model().objects.create_user(
            username="salesuser",
            password="salespass",
            role=self.role,
            employee=self.employee,
            is_active=True,
            is_staff=True
        )
        self.customer, _ = Customer.objects.get_or_create(
            customerID="12ZAS1SX1",
            defaults={
                "fullName": "Nguyễn Thị Lan",
                "phoneNumber": "0931265687",
                "gender": "Nữ",
                "joinDate": date(2024, 2, 15)
            }
        )
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

    def test_get_customers_list(self):
        response = self.client.get(reverse('customer-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 10)  # Fixture có 10 khách hàng
        self.assertEqual(response.json()[0]['fullName'], "Nguyễn Văn Hùng")

    def test_create_customer(self):
        data = {
            "customerID": "CUS003",
            "fullName": "John Smith",
            "phoneNumber": "0918765432",
            "gender": "Male"
        }
        response = self.client.post(
            reverse('customer-list'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Customer.objects.count(), 11)
        customer = Customer.objects.get(customerID="CUS003")
        self.assertEqual(customer.fullName, "John Smith")