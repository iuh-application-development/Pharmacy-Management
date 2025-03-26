from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Sum, Count, F, DecimalField, Value
from django.db.models.functions import Coalesce, Cast
from .models import Employee, Account, Role
from .serializers import EmployeeSerializer, AccountSerializer, RoleSerializer, LoginSerializer
from .permissions import IsAdminSystem
from sales.models import OrderDetail, PaymentDetail

from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout


def home(request):
    return HttpResponse("Welcome to the Pharmacy Management System.")


# ----------------- Authentication -----------------

# Đăng nhập, đăng xuất, xem thông tin cá nhân
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username, "role": user.role.roleName}, status=status.HTTP_200_OK)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response({"message": "Đăng xuất thành công"}, status=status.HTTP_200_OK)
    
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "role": user.role.roleName,
            "employee": EmployeeSerializer(user.employee).data if user.employee else None
        })
    
class ResetPasswordView(APIView):
    permission_classes = [IsAuthenticated, IsAdminSystem]

    def post(self, request):
        username = request.data.get("username")
        new_password = request.data.get("new_password")

        try:
            user = Account.objects.get(username=username)
            user.set_password(new_password)
            user.save()
            return Response({"message": "Mật khẩu đã được đặt lại"}, status=status.HTTP_200_OK)
        except Account.DoesNotExist:
            return Response({"error": "Tài khoản không tồn tại"}, status=status.HTTP_404_NOT_FOUND)


# ----------------- Employee Management -----------------

# Quản lý nhân viên (CRUD)
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsAdminSystem]

# Quản lý tài khoản nhân viên (CRUD)
class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated, IsAdminSystem]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "Tạo tài khoản thành công", "username": serializer.data['username']}, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()


# Quản lý phân quyền (CRUD)
class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated, IsAdminSystem]

