from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


class Role(models.Model):
    roleID = models.AutoField(primary_key=True)
    roleName = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.roleName
    

class Employee(models.Model):
    employeeID = models.AutoField(primary_key=True)
    fullName = models.CharField(max_length=255)
    phoneNumber = models.CharField(max_length=15, unique=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    yearOfBirth = models.PositiveIntegerField()
    hireDate = models.DateField()

    def __str__(self):
        return self.fullName
    

class Customer(models.Model):
    customerID = models.AutoField(primary_key=True)
    fullName = models.CharField(max_length=100)
    phoneNumber = models.CharField(max_length=15, unique=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    joinDate = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.fullName
    

class Account(AbstractBaseUser, PermissionsMixin):
    accountID = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255)
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
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

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username