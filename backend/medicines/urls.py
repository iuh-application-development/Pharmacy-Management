from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter
from .views import MedicineViewSet, SupplierViewSet, PaymentViewSet, PaymentDetailViewSet, PaymentStatisticViewSet

# Router cho CRUD (có sẵn các phương thức GET, POST, PUT, DELETE)
router = DefaultRouter()
router.register('medicines', MedicineViewSet, basename='medicine')
router.register('suppliers', SupplierViewSet, basename='supplier')
router.register('payments', PaymentViewSet, basename='payment')
router.register('payment-details', PaymentDetailViewSet, basename='payment-detail')

# Router cho các phương thức thống kê (chỉ có phương thức GET)
statistic_router = SimpleRouter()
statistic_router.register('statistics/payments', PaymentStatisticViewSet, basename='payment-statistic')

# urls: /api/medicines/
urlpatterns = [
    path('', include(router.urls)),
    path('', include(statistic_router.urls)),
]