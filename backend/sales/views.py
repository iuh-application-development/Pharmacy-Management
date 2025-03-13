from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from authentication.permissions import IsSales
from .models import Invoice, InvoiceDetail, Order, OrderDetail
from authentication.models import Customer
from .serializers import InvoiceSerializer, InvoiceDetailSerializer, OrderSerializer, OrderDetailSerializer, CustomerSerializer
from django.db.models import Sum, Count


# Lập hóa đơn bán hàng
class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated, IsSales] # Chỉ cho phép người dùng đã đăng nhập và là nhân viên bán hàng được truy cập

# Tìm kiếm, quản lý hóa đơn
class InvoiceDetailViewSet(viewsets.ModelViewSet):
    queryset = InvoiceDetail.objects.all()
    serializer_class = InvoiceDetailSerializer
    permission_classes = [IsAuthenticated, IsSales]

# Tìm kiếm, quản lý đơn đặt hàng
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsSales]

# Tìm kiếm, quản lý chi tiết đơn đặt hàng
class OrderDetailViewSet(viewsets.ModelViewSet):
    queryset = OrderDetail.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [IsAuthenticated, IsSales]

# Tìm kiếm, quản lý khách hàng
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated, IsSales]

# Thống kê số lượng khách hàng
class CustomerStatisticViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsSales]

    def list(self, request):
        try:
            stats = Customer.objects.annotate(total_orders=Count('invoice'))
            data = [{'customer': c.name, 'total_orders': c.total_orders} for c in stats]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InvoiceStatisticViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsSales]

    def list(self, request):
        try:
            invoice_count = Invoice.objects.count()
            total_revenue = InvoiceDetail.objects.aggregate(total=Sum('unitPrice'))['total']
            return Response({"invoice_count": invoice_count, "total_revenue": total_revenue}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)