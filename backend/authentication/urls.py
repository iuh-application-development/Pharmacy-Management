from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter
from .views import EmployeeViewSet, AccountViewSet, RoleViewSet, StatisticViewSet, EmployeeStatisticViewSet, LoginView, LogoutView, MeView, RegisterUserView, ResetPasswordView

# Router cho CRUD (có sẵn các phương thức GET, POST, PUT, DELETE)
router = DefaultRouter()
router.register('employees', EmployeeViewSet, basename='employee')
router.register('accounts', AccountViewSet, basename='account')
router.register('roles', RoleViewSet, basename='role')

# Router cho các phương thức thống kê (chỉ có phương thức GET)
statistic_router = SimpleRouter()
statistic_router.register('statistics/finance', StatisticViewSet, basename='finance-statistic')
statistic_router.register('statistics/employee', EmployeeStatisticViewSet, basename='employee-statistic')

# urls: /api/auth/
urlpatterns = [
    path('', include(router.urls)),
    path('', include(statistic_router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
    path('admin/register-user/', RegisterUserView.as_view(), name='register'),
    path('admin/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
]
