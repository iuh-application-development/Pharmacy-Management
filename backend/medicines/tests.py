from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from medicines.models import Medicine, Catalog, Unit, Origin, Supplier
from authentication.models import Role, Employee
import json
from datetime import date

class MedicineModelTests(TestCase):
    def setUp(self):
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

    def test_medicine_creation(self):
        medicine = Medicine.objects.get(medicineID="MED001")
        self.assertEqual(medicine.medicineName, "Paracetamol")
        self.assertEqual(medicine.ingredients, "Paracetamol 500mg")
        self.assertEqual(medicine.unit, self.unit)
        self.assertEqual(medicine.catalog, self.catalog)
        self.assertEqual(medicine.origin, self.origin)
        self.assertEqual(medicine.stockQuantity, 100)
        self.assertEqual(medicine.importPrice, 5.00)
        self.assertEqual(medicine.unitPrice, 10.00)
        self.assertEqual(medicine.expiryDate, date(2026, 12, 31))

    def test_medicine_string_representation(self):
        medicine = Medicine.objects.get(medicineID="MED001")
        self.assertEqual(str(medicine), "Paracetamol")

class SupplierModelTests(TestCase):
    def setUp(self):
        self.supplier = Supplier.objects.create(
            supplierID="SUP001",
            supplierName="Pharma Corp",
            phoneNumber="0123456789",
            address="123 Hanoi St"
        )

    def test_supplier_creation(self):
        supplier = Supplier.objects.get(supplierID="SUP001")
        self.assertEqual(supplier.supplierName, "Pharma Corp")
        self.assertEqual(supplier.phoneNumber, "0123456789")
        self.assertEqual(supplier.address, "123 Hanoi St")

    def test_supplier_string_representation(self):
        supplier = Supplier.objects.get(supplierID="SUP001")
        self.assertEqual(str(supplier), "Pharma Corp")

class MedicineAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.catalog = Catalog.objects.create(catalogID="CAT002", catalogName="Antibiotics")
        self.unit = Unit.objects.create(unitID="UNIT002", unitName="Capsule")
        self.origin = Origin.objects.create(originID="ORIG002", originName="USA")
        self.role, _ = Role.objects.get_or_create(roleName="Nhân viên bán hàng")
        self.employee = Employee.objects.create(
            employeeID="EMP001",
            fullName="Test Employee",
            phoneNumber="0123456789",
            gender="Male",
            yearOfBirth=1990,
            hireDate=date(2023, 1, 1)
        )
        self.user = get_user_model().objects.create_user(
            username="testuser",
            password="testpass",
            role=self.role,
            employee=self.employee,
            is_active=True,
            is_staff=True
        )
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

    def test_get_medicines_list(self):
        response = self.client.get(reverse('medicine-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 9)  # 9 từ fixture

    def test_create_medicine(self):
        data = {
            "medicineID": "MED999",  # ID duy nhất
            "medicineName": "Aspirin",
            "ingredients": "Aspirin 100mg",
            "unit": self.unit.unitID,
            "catalog": self.catalog.catalogID,
            "origin": self.origin.originID,
            "stockQuantity": 200,
            "importPrice": 6.00,
            "unitPrice": 12.00,
            "expiryDate": "2026-12-31"
        }
        response = self.client.post(
            reverse('medicine-list'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Medicine.objects.count(), 10)  # 9 + 1 mới
        medicine = Medicine.objects.get(medicineID="MED999")
        self.assertEqual(medicine.medicineName, "Aspirin")

class SupplierAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.role, _ = Role.objects.get_or_create(roleName="Nhân viên quản lý sản phẩm")
        self.employee = Employee.objects.create(
            employeeID="EMP002",
            fullName="Test Manager",
            phoneNumber="0987654321",
            gender="Female",
            yearOfBirth=1985,
            hireDate=date(2022, 1, 1)
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

    def test_get_suppliers_list(self):
        response = self.client.get(reverse('supplier-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 6)  # 6 từ fixture

    def test_create_supplier(self):
        data = {
            "supplierID": "SUP999",  # ID duy nhất
            "supplierName": "HealthCorp",
            "phoneNumber": "0912345678",
            "address": "789 Danang St"
        }
        response = self.client.post(
            reverse('supplier-list'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Supplier.objects.count(), 7)  # 6 + 1 mới
        supplier = Supplier.objects.get(supplierID="SUP999")
        self.assertEqual(supplier.supplierName, "HealthCorp")