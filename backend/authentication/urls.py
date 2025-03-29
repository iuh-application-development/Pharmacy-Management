
from django.urls import path, include
from rest_framework.routers import DefaultRouter, SimpleRouter
from .views import EmployeeViewSet, AccountViewSet, RoleViewSet, LoginView, LogoutView, MeView, ResetPasswordView

# Router cho CRUD (có sẵn các phương thức GET, POST, PUT, DELETE)
router = DefaultRouter()
router.register('employees', EmployeeViewSet, basename='employee')
router.register('accounts', AccountViewSet, basename='account')
router.register('roles', RoleViewSet, basename='role')


# urls: /api/auth/
urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
    path('admin/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
]
