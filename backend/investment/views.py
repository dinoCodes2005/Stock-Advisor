# views.py
from django.shortcuts import render
from rest_framework.views import APIView 
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import status
from .serializers import InvestmentSerializer, RecommendationSerializer
from stocks.ml_model import StockRecommender
from stocks.train_model import train_models
from .models import Recommendation
import os
import logging
import google.generativeai as genai
from django.shortcuts import get_object_or_404
from .models import Investment
from dotenv import load_dotenv


# Configure logging
logger = logging.getLogger(__name__)

# ✅ Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)  # Set your API key as an environment variable

# 🔧 Format stock data into readable text for Gemini
def format_stock_data(rec):
    try:
        return (
            f"Symbol: {rec.get('symbol')}\n"
            f"Current Price: ₹{rec.get('current_price', 0):.2f}\n"
            f"Expected Return: {rec.get('expected_return', 0) * 100:.2f}%\n"
            f"Projected Value: ₹{rec.get('projected_value', 0):.2f}\n"
            f"Risk-Adjusted Score: {rec.get('risk_adjusted_score', 0):.4f}\n"
            f"Market Cap Category: {rec.get('market_cap_category')}\n"
            f"Risk Metrics: {rec.get('risk_metrics')}\n"
            f"Technical Indicators: {rec.get('technical_indicators')}\n"
        )
    except Exception as e:
        logger.error(f"Failed to format stock data: {e}")
        return "N/A"

# 📤 Generate suggestion using Gemini
def generate_suggestion(stock_data):
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = (
        "Given the following stock data, explain in 3–5 lines why this stock is a good investment:\n\n"
        f"{stock_data}\n\n"
        "Response:"
    )

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return "Suggestion could not be generated."

# 🚀 Main API view
class CreateInvestment(APIView):
    def post(self, request):
        serializer = InvestmentSerializer(data=request.data)
        if serializer.is_valid():
            investment = serializer.save()

            data = serializer.validated_data
            rts_score = float(data.get("rts_score", 50))
            target_amount = float(data.get("target_amount", 1000000))
            monthly_investment = float(data.get("monthly_investment", 50000))
            investment_duration = int(data.get("investment_duration", 60))

            try:
                logger.info("Training models for all categories...")
                train_models()

                test_params = {
                    'rts_score': rts_score,
                    'target_amount': target_amount,
                    'monthly_investment': monthly_investment,
                    'investment_duration': investment_duration,
                }

                all_recommendations = StockRecommender.get_all_recommendations(**test_params)

                for rec in all_recommendations:
                    stock_info = format_stock_data(rec)
                    # suggestion = generate_suggestion(stock_info)
                    suggestion = "suggestion"

                    Recommendation.objects.create(
                        investment=investment,
                        stock_name=rec['symbol'],
                        weight=float(rec.get('weight', 0)),
                        notes=rec.get('market_cap_category', ''),
                        suggestion=suggestion
                    )

                return Response({
                    "investment_id":investment.id,
                    "investment": serializer.data,
                    "recommendations": all_recommendations
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                logger.error(f"Error generating recommendations: {str(e)}")
                return Response({
                    "investment": serializer.data,
                    "error": "Failed to generate recommendations",
                    "details": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RecommendationsByInvestment(ListAPIView):
    serializer_class = RecommendationSerializer

    def get_queryset(self):
        investment_id = self.kwargs['investment_id']
        return Recommendation.objects.filter(investment__id=investment_id)
    
class GetInvestment(APIView):
    def get(self, request, investment_id):
        # Make sure the investment exists
        investment = get_object_or_404(Investment, id=investment_id)

        # Serialize recommendations
        serializer = InvestmentSerializer(investment, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)