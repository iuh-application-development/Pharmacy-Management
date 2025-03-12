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
    
class RegisterUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdminSystem]

    def post(self, request):
        serializer = AccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"message": "Tạo tài khoản thành công", "username": user.username}, status=status.HTTP_201_CREATED)
    
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

# Quản lý phân quyền (CRUD)
class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated, IsAdminSystem]

# Thống kê doanh thu, chi phí, lợi nhuận
class StatisticViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsAdminSystem]

    def list(self, request):
        try:
            total_revenue = OrderDetail.objects.aggregate(
                total=Coalesce(Sum(Cast(F('quantity'), DecimalField()) * F('unitPrice')), Value(0, output_field=DecimalField()))
            )['total'] # Value(0, output_field=DecimalField()) để tránh trường hợp không có dữ liệu thì trả về None

            total_cost = PaymentDetail.objects.aggregate(
                total=Coalesce(Sum(Cast(F('quantity'), DecimalField()) * F('unitPrice')), Value(0, output_field=DecimalField()))
            )['total']

            profit = total_revenue - total_cost

            return Response({
                'total_revenue': total_revenue,
                'total_cost': total_cost,
                'profit': profit
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Thống kê số lượng nhân viên theo từng role
class EmployeeStatisticViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsAdminSystem]

    def list(self, request):
        try:
            employee_count_by_role = (
                Employee.objects.values(role=F('account__role__roleName'))
                .annotate(employee_count=Count('employeeID'))
                .order_by('-employee_count')  # Sắp xếp theo số lượng giảm dần
            )

            return Response({"roles": list(employee_count_by_role)}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
