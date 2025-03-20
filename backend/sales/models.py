from django.db import models


class Order(models.Model):
    orderID = models.CharField(max_length=50, primary_key=True)
    orderTime = models.DateTimeField(auto_now_add=True)
    employee = models.ForeignKey('authentication.Employee', on_delete=models.CASCADE)
    customer = models.ForeignKey('authentication.Customer', on_delete=models.CASCADE)
    totalAmount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Thêm thuộc tính tổng tiền

    def __str__(self):
        return f'Order {self.orderID}'
    

class OrderDetail(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    medicine = models.ForeignKey('medicines.Medicine', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unitPrice = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('order', 'medicine') # Mỗi đơn hàng chỉ có 1 loại thuốc xuất hiện 1 lần


class Invoice(models.Model):
    invoiceID = models.AutoField(primary_key=True)
    invoiceTime = models.DateTimeField(auto_now_add=True)
    customer = models.ForeignKey('authentication.Customer', on_delete=models.CASCADE)
    address = models.TextField()
    paymentMethod = models.CharField(max_length=50, choices=[('Cash', 'Cash'), ('Card', 'Card')])
    status = models.CharField(max_length=50, choices=[('Paid', 'Paid'), ('Pending', 'Pending')])

    def __str__(self):
        return f'Invoice {self.invoiceID}'
    

class InvoiceDetail(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)
    medicine = models.ForeignKey('medicines.Medicine', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unitPrice = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('invoice', 'medicine') # Mỗi hóa đơn chỉ có 1 loại thuốc xuất hiện 1 lần

class Payment(models.Model):
    paymentID = models.CharField(max_length=50, primary_key=True)
    paymentTime = models.DateTimeField(auto_now_add=True)
    employee = models.ForeignKey('authentication.Employee', on_delete=models.CASCADE)
    supplier = models.ForeignKey('medicines.Supplier', on_delete=models.CASCADE)
    totalAmount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Thêm thuộc tính tổng tiền

    def __str__(self):
        return f'Payment {self.paymentID}'    
    

class PaymentDetail(models.Model):
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE)
    medicine = models.ForeignKey('medicines.Medicine', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unitPrice = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('payment', 'medicine') # Mỗi phiếu chi chỉ có 1 loại thuốc xuất hiện 1 lần