import os
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

class ChatbotService:
    @staticmethod
    def get_response(user_message, context_data=None):
        headers = {
            "Content-Type": "application/json"
            # "Authorization": f"Bearer {GEMINI_API_KEY}"
        }

        if not context_data:
            context_data = {"error": "Không có dữ liệu hệ thống được cung cấp"}

        prompt = f"Dựa trên dữ liệu hệ thống: {context_data}\nNgười dùng hỏi: {user_message}\nHãy trả lời một cách tự nhiên và hữu ích."

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        }

        try:
            response = requests.post(f"{GEMINI_API_URL}?key={GEMINI_API_KEY}", json=payload, headers=headers)
            response.raise_for_status()
            result = response.json()
            return result["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            return f"Lỗi khi gọi Gemini API: {str(e)}"