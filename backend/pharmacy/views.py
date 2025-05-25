from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .chatbot_service import ChatbotService
import requests
import json
import logging
import os
from dotenv import load_dotenv

load_dotenv()

INTERNAL_API_TOKEN = os.getenv("INTERNAL_API_TOKEN")
logger = logging.getLogger(__name__)
logger.info(f"INTERNAL_API_TOKEN: {INTERNAL_API_TOKEN}")
# Kiểm tra xem biến môi trường đã được nạp thành công chưa
# print(f"INTERNAL_API_TOKEN: {INTERNAL_API_TOKEN}")

class ChatbotAPIView(APIView):
    permission_classes = [AllowAny]
    # permission_classes = [IsAuthenticated]  # Chỉ cho phép người dùng đã xác thực

    def post(self, request):
        logger.info(f"Request headers: {request.headers}")
        user_message = request.data.get("message")
        if not user_message:
            return Response({"error": "Vui lòng cung cấp tin nhắn"}, status=status.HTTP_400_BAD_REQUEST)

        # Lấy token từ header của request gốc
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            logger.warning("No valid Authorization header found, using INTERNAL_API_TOKEN")
            auth_header = f"Token {INTERNAL_API_TOKEN}"
        else:
            # Chuyển từ "Bearer <token>" thành "Token <token>"
            token = auth_header.split("Bearer ")[1]
            auth_header = f"Token {token}"
        
        headers = {"Authorization": auth_header}
        logger.info(f"Sending request with headers: {headers}")  # Debug header
        try:
            medicines_res = requests.get("http://127.0.0.1:8000/api/medicines/medicines/", headers=headers)
            medicines_res.raise_for_status()
            medicines = medicines_res.json()

            customers_res = requests.get("http://127.0.0.1:8000/api/sales/customers/", headers=headers)
            customers_res.raise_for_status()
            customers = customers_res.json()

            context_data = {
                "medicines": medicines,
                "customers": customers
            }
        except Exception as e:
            logger.error(f"Error fetching backend data: {str(e)}")
            context_data = {
                "medicines": [],
                "customers": [],
                "error": f"Lỗi khi lấy dữ liệu backend: {str(e)}"
            }

        response = ChatbotService.get_response(user_message, json.dumps(context_data))
        return Response({"reply": response}, status=status.HTTP_200_OK)