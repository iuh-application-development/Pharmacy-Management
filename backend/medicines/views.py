from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Medicine, Supplier
from sales.models import Payment, PaymentDetail
from .serializers import MedicineSerializer, SupplierSerializer, PaymentSerializer, PaymentDetailSerializer
from authentication.permissions import IsProductManager
from django.db.models import Sum
from authentication.permissions import IsSales, IsProductManager

# Lập hóa đơn phiếu thu
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated, IsProductManager]

# Tìm kiếm, quản lý thuốc
class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    permission_classes = [IsAuthenticated, IsSales | IsProductManager]

# Tìm kiếm, quản lý nhà cung cấp
class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated, IsProductManager]

# Tìm kiếm, quản lý phiếu thu
class PaymentDetailViewSet(viewsets.ModelViewSet):
    queryset = PaymentDetail.objects.all()
    serializer_class = PaymentDetailSerializer
    permission_classes = [IsAuthenticated, IsProductManager]

# Xem thống kê phiếu thu
class PaymentStatisticViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsProductManager]

    def list(self, request):
        try:
            payment_count = Payment.objects.count()
            total_payment = PaymentDetail.objects.aggregate(total=Sum('unitPrice'))['total']
            return Response({"payment_count": payment_count, "total_payment": total_payment}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)