from rest_framework import permissions


class IsAdminSystem(permissions.BasePermission):
    # Chỉ cho phép admin hệ thống được truy cập
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role.roleName == 'Admin'
    
class IsSales(permissions.BasePermission):
    # Chỉ cho phép nhân viên bán hàng hoặc admin được truy cập
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role.roleName in ['Sales', 'Admin']
    
class IsProductManager(permissions.BasePermission):
    # Chỉ cho phép quản lý sản phẩm hoặc admin được truy cập
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role.roleName in ['Product_manager', 'Admin']