from django.db import models


class Catalog(models.Model):
    catalogID = models.CharField(max_length=50, primary_key=True)
    catalogName = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.catalogName
    

class Unit(models.Model):
    unitID = models.CharField(max_length=50, primary_key=True)
    unitName = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.unitName
    

class Origin(models.Model):
    originID = models.CharField(max_length=50, primary_key=True)
    originName = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.originName
    

class Medicine(models.Model):
    medicineID = models.CharField(max_length=50, primary_key=True)
    medicineName = models.CharField(max_length=255)
    image = models.ImageField(upload_to='medicines/', null=True, blank=True)
    ingredients = models.TextField()
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    catalog = models.ForeignKey(Catalog, on_delete=models.CASCADE)
    origin = models.ForeignKey(Origin, on_delete=models.CASCADE)
    stockQuantity = models.PositiveIntegerField(default=0)
    importPrice = models.DecimalField(max_digits=10, decimal_places=2)
    unitPrice = models.DecimalField(max_digits=10, decimal_places=2)
    expiryDate = models.DateField(null=True, blank=True)
    def __str__(self):
        return self.medicineName
    

class Supplier(models.Model):
    supplierID = models.CharField(max_length=50, primary_key=True)
    supplierName = models.CharField(max_length=255, unique=True)
    phoneNumber = models.CharField(max_length=15, unique=True)
    address = models.TextField()

    def __str__(self):
        return self.supplierName
