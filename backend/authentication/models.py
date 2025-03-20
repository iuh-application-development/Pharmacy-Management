from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class Role(models.Model):
    ADMIN = 'Admin'
    SALES = 'Sales'
    PRODUCT_MANAGER = 'Product_manager'
    
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Sales', 'Nhân viên bán hàng'),
        ('Product_manager', 'Nhân viên quản lý sản phẩm'),
    ]
    roleID = models.CharField(max_length=50, primary_key=True)
    roleName = models.CharField(max_length=50, choices=ROLE_CHOICES, unique=True)

    def __str__(self):
        return self.roleName
    

class Employee(models.Model):
    employeeID = models.CharField(max_length=50, primary_key=True)  # Change to CharField
    fullName = models.CharField(max_length=255)
    phoneNumber = models.CharField(max_length=15, unique=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    yearOfBirth = models.PositiveIntegerField()
    hireDate = models.DateField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.fullName
    

class Customer(models.Model):
    customerID = models.CharField(max_length=50, primary_key=True)
    fullName = models.CharField(max_length=100)
    phoneNumber = models.CharField(max_length=15, unique=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    joinDate = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.fullName
    
class AccountManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        # Set a default role for superuser
        if 'role' not in extra_fields or extra_fields['role'] is None:
            extra_fields['role'] = Role.objects.get_or_create(roleName=Role.ADMIN)[0]

        return self.create_user(username, password, **extra_fields)

class Account(AbstractBaseUser, PermissionsMixin):
    accountID = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255)
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, null=True, blank=True)  # Cho phép null và blank
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='authentication_accounts',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='authentication_accounts',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    objects = AccountManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username