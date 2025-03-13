from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter
from .views import InvoiceViewSet, InvoiceDetailViewSet, OrderViewSet, OrderDetailViewSet, CustomerViewSet, CustomerStatisticViewSet, InvoiceStatisticViewSet

# Router cho CRUD (có sẵn các phương thức GET, POST, PUT, DELETE)
router = DefaultRouter()
router.register('invoices', InvoiceViewSet, basename='invoice')
router.register('invoice-details', InvoiceDetailViewSet, basename='invoice-detail')
router.register('orders', OrderViewSet, basename='order')
router.register('order-details', OrderDetailViewSet, basename='order-detail')
router.register('customers', CustomerViewSet, basename='customer')

# Router cho các phương thức thống kê (chỉ có phương thức GET)
statistic_router = SimpleRouter()
statistic_router.register('statistics/customers', CustomerStatisticViewSet, basename='customer-statistic')
statistic_router.register('statistics/invoices', InvoiceStatisticViewSet, basename='invoice-statistic')

# urls: /api/sales/
urlpatterns = [
    path('', include(router.urls)),
    path('', include(statistic_router.urls)),
]