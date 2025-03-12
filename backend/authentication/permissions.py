from rest_framework import permissions


class IsAdminSystem(permissions.BasePermission):
    # Chỉ cho phép admin hệ thống được truy cập
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role.roleName == 'Admin'